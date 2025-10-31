# Prize Wheel Technical Architecture & Code Understanding
**Date Created**: October 31, 2025 11:15 AM (PDT)  
**Purpose**: Complete technical reference for application logic, data flow, and known issues  
**Status**: Active Development - Wheel Alignment Fix Required

---

## APPLICATION OVERVIEW

### Core Purpose
TAP2LOCK Prize Wheel - A Progressive Web App (PWA) for raffle events that:
1. **Collects vehicle compatibility data** through registration form
2. **Provides engaging prize wheel experience** with visual spinning
3. **Stores all data locally** in browser LocalStorage
4. **Enables admin oversight** with real-time stats and CSV export
5. **Functions 100% offline** (no network required)

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Storage**: Browser LocalStorage (JSON-based)
- **Canvas**: HTML5 Canvas API for wheel rendering
- **PWA**: Service Worker for offline functionality
- **Server**: Python HTTP server for local testing

---

## FILE STRUCTURE & RESPONSIBILITIES

### Core Application Files

#### `index.html` (205 lines)
**Purpose**: Main application structure and DOM elements

**Key Sections**:
1. **Settings Modal** (lines 16-27) - Confirmation dialog before accessing settings
2. **Header** (lines 29-38) - TAP2LOCK branding + Settings button
3. **Registration Section** (lines 42-119) - User data collection form
4. **Wheel Container** (lines 122-126) - Canvas element + Spin button
5. **Winner Display** (lines 129-133) - Post-spin result announcement
6. **Prize Management** (lines 136-145) - Admin prize configuration
7. **Admin Panel** (lines 148-194) - Data viewing and export

**Critical Elements**:
- `#registrationSection` - Visible by default (no `hidden` class)
- `#wheelContainer` - Hidden by default (has `hidden` class on line 122)
- `#wheelCanvas` - 400x400px canvas for wheel rendering
- `#spinButton` - Triggers wheel spin animation

---

#### `app.js` (556 lines)
**Purpose**: All application logic and data management

**Class Structure**:

##### **1. PrizeWheel Class** (lines 3-248)
Main controller for wheel functionality

**Constructor Dependencies**:
```javascript
this.canvas = document.getElementById('wheelCanvas');
this.ctx = this.canvas.getContext('2d');
this.spinButton = document.getElementById('spinButton');
this.prizes = this.loadPrizes(); // From LocalStorage
this.rotation = 0; // Current wheel rotation in radians
this.isSpinning = false;
this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', ...]; // 8 colors
this.dataManager = new DataManager();
this.adminPanel = new AdminPanel(this.dataManager);
this.currentEntryId = null; // Tracks active registration
this.registrationHandler = new RegistrationHandler((formData) => {
    this.handleRegistration(formData);
});
```

**Key Methods**:

**`init()` (lines 26-47)**
- Sets up ALL event listeners
- Renders initial prize list
- Draws wheel on page load

**`drawWheel()` (lines 76-122)**
- **CRITICAL**: This is the SOURCE OF TRUTH for visual rendering
- Divides 360° into equal slices: `sliceAngle = (2 * Math.PI) / this.prizes.length`
- Draws each prize starting from **0° (3 o'clock in canvas coordinates)**
- **Drawing order**: Clockwise from prize[0] at 0°
- Text is drawn at: `textAngle = startAngle + sliceAngle / 2`
- **Canvas coordinate system**: 0° = RIGHT (3 o'clock), 90° = BOTTOM, 180° = LEFT, 270° = TOP

**`spin()` (lines 124-166) - SPIN ANIMATION LOGIC**
```javascript
// Random selection calculation
const randomSpin = Math.random() * 2 * Math.PI; // Random angle
const extraSpins = (3 + Math.random() * 2) * 2 * Math.PI; // 3-5 full rotations
const totalRotation = this.rotation + extraSpins + randomSpin;

// Animation loop
const animate = () => {
    const progress = (Date.now() - startTime) / duration;
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
    this.rotation = startRotation + (totalRotation - startRotation) * easeProgress;
    this.drawWheel();
    
    if (progress < 1) {
        requestAnimationFrame(animate);
    } else {
        this.rotation = totalRotation % (2 * Math.PI); // Normalize to 0-2π
        this.isSpinning = false;
        this.canvas.classList.remove('spinning');
        this.showWinner(); // ⚠️ WINNER CALCULATION HERE
    }
};
```

**`showWinner()` (lines 168-185) - ⚠️ CRITICAL BUG AREA**
```javascript
const sliceAngle = (2 * Math.PI) / this.prizes.length;
const adjustedRotation = (2 * Math.PI - this.rotation) % (2 * Math.PI);
const winningIndex = Math.floor(adjustedRotation / sliceAngle);
const winner = this.prizes[winningIndex];
```

**🔴 KNOWN BUG**: `adjustedRotation` formula is INCORRECT
- **Problem**: Assumes pointer is at 12 o'clock (270° in canvas coords)
- **Reality**: Canvas 0° = 3 o'clock (RIGHT), not 12 o'clock (TOP)
- **Result**: Selected prize doesn't match visual pointer position
- **Impact**: Data recorded in admin panel doesn't match what user sees

**Correct Formula Needed**:
```javascript
// Pointer is at TOP (270° in canvas = -π/2 radians from 0°)
const pointerOffset = -Math.PI / 2; // Adjust for top position
const adjustedRotation = (this.rotation - pointerOffset + 2 * Math.PI) % (2 * Math.PI);
const winningIndex = Math.floor(adjustedRotation / sliceAngle);
```

**`handleRegistration(formData)` (lines 247-260)**
- Saves entry to LocalStorage via DataManager
- Stores `currentEntryId` for later prize association
- Hides registration form
- Shows wheel container
- **🐛 BUG**: Alert message is generic, doesn't use user's name

**Current Code** (line 257):
```javascript
alert(`✅ Registration successful! ${formData.fullName}, you can now spin the wheel!`);
```

**Issue**: Alert shows "localhost:8000 says" instead of custom modal
**Fix Required**: Replace `alert()` with custom modal that displays user's name

---

##### **2. DataManager Class** (lines 263-376)
Handles all LocalStorage operations

**Storage Key**: `'raffleEntries'`

**Data Structure**:
```javascript
{
    id: 1730399999999,           // Timestamp as unique ID
    timestamp: "2025-10-31T18:30:00.000Z",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "702-555-1234",
    vehicleYear: "2025",
    vehicleMake: "Dodge",
    vehicleModel: "Accord",
    prize: "test2"                // Set AFTER spin via updateEntryPrize()
}
```

**Key Methods**:

**`saveEntry(entryData)` (lines 277-289)**
- Creates entry with `prize: null`
- Returns `entry.id` for tracking
- **CRITICAL**: Prize is NOT set here, only after spin

**`updateEntryPrize(entryId, prizeName)` (lines 291-298)**
- **Called from `showWinner()` after spin completes**
- Finds entry by `id`, sets `prize` field
- **⚠️ CRITICAL**: This must match visual result EXACTLY

**`exportToCSV()` (lines 313-354)**
- Exports ALL entries to CSV file
- Filename: `raffle_entries_YYYY-MM-DD.csv`
- **Headers**: ID, Timestamp, Full Name, Email, Phone, Vehicle Year, Vehicle Make, Vehicle Model, Prize Won

---

##### **3. RegistrationHandler Class** (lines 382-452)
Manages form interactions and validation

**Form Fields**:
1. `fullName` - Text input (required)
2. `email` - Email input (required)
3. `phone` - Tel input (required)
4. `vehicleYear` - Number input (1990-2026, required)
5. `vehicleMake` - Dropdown with 20+ options (required)
6. `vehicleMakeOther` - Text input (conditional, shown if "Other" selected)
7. `vehicleModel` - Text input (required)

**Validation Logic** (lines 420-429):
```javascript
// Validates all fields are filled
if (!formData.fullName || !formData.email || !formData.phone || 
    !formData.vehicleYear || !formData.vehicleMake || !formData.vehicleModel) {
    alert('Please fill in all required fields!');
    return;
}
```

**`hide()` method (lines 448-450)**:
- Adds `hidden` class to `#registrationSection`
- Called AFTER successful registration
- Allows wheel to be displayed

---

##### **4. AdminPanel Class** (lines 457-551)
Dashboard for viewing entries and exporting data

**Statistics Displayed**:
- **Total Entries**: Count of all registrations
- **Spins Completed**: Count of entries with `prize !== null`

**Actions Available**:
1. **📥 Export to CSV** - Downloads all data
2. **👁️ View Entries** - Shows table of all registrations
3. **🗑️ Clear All Data** - Deletes everything (double confirmation)

**Entry Table Columns**:
- # (index)
- Timestamp (formatted as locale string)
- Name
- Email
- Phone
- Vehicle (Year + Make + Model combined)
- Prize Won (shows "—" if null)

---

#### `styles.css` (914 lines)
**Purpose**: Complete visual styling with glassmorphism effects

**Key Classes**:

**`.hidden` (line 283-285)**
```css
.hidden {
    display: none !important;
}
```
**Critical**: Used to toggle visibility of sections

**`.wheel-container` (lines 134-140)**
- Contains canvas + spin button + pointer
- `position: relative` for pointer positioning
- Initially has `hidden` class in HTML

**`.wheel-pointer` (lines 142-148)**
```css
.wheel-pointer {
    font-size: 3em;
    color: #ffd93d;
    position: absolute;
    top: -15px; /* ⚠️ POSITIONED AT TOP */
    z-index: 10;
}
```
**CRITICAL**: Pointer is at TOP of wheel, NOT at 3 o'clock

**`.registration-section` (lines 563-573)**
- Contains registration form
- Does NOT have `hidden` class in HTML (visible by default)

---

## APPLICATION DATA FLOW

### Complete User Journey

```
1. Page Load
   ↓
2. DOMContentLoaded event fires
   ↓
3. new PrizeWheel() instantiated
   ↓
4. init() called
   ├─ Event listeners attached
   ├─ Prize list rendered
   └─ Wheel drawn with default prizes
   ↓
5. User sees REGISTRATION FORM (visible)
   Wheel is HIDDEN
   ↓
6. User fills form and clicks "Submit & Spin"
   ↓
7. RegistrationHandler.handleSubmit() validates
   ↓
8. PrizeWheel.handleRegistration(formData)
   ├─ DataManager.saveEntry(formData) → returns entryId
   ├─ this.currentEntryId = entryId (stored for later)
   ├─ RegistrationHandler.hide() → adds 'hidden' to form
   ├─ wheelContainer.classList.remove('hidden') → shows wheel
   └─ alert() with generic message (🐛 BUG HERE)
   ↓
9. User clicks "SPIN!" button
   ↓
10. PrizeWheel.spin() calculates random rotation
    ├─ randomSpin = Math.random() * 2π
    ├─ extraSpins = (3-5) * 2π
    ├─ totalRotation = current + extra + random
    └─ animate() loop starts
   ↓
11. Animation runs for 3 seconds
    ├─ Ease-out cubic easing
    ├─ Rotation updated each frame
    └─ drawWheel() redraws on each frame
   ↓
12. Animation completes
    ├─ this.rotation = totalRotation % (2π)
    └─ showWinner() called ⚠️ CRITICAL POINT
   ↓
13. showWinner() calculates winner
    ├─ adjustedRotation = (2π - rotation) % (2π) ⚠️ BUG HERE
    ├─ winningIndex = floor(adjusted / sliceAngle)
    ├─ winner = prizes[winningIndex]
    ├─ DataManager.updateEntryPrize(currentEntryId, winner)
    └─ Winner display shown
   ↓
14. Data stored in LocalStorage
    Entry now has prize field populated
   ↓
15. Admin can view/export data
    CSV export shows all entries with prizes
```

---

## CRITICAL BUGS & FIXES REQUIRED

### 🔴 BUG #1: Wheel/Prize Misalignment

**Location**: `app.js` lines 170-173 (`showWinner` method)

**Current Code**:
```javascript
const sliceAngle = (2 * Math.PI) / this.prizes.length;
const adjustedRotation = (2 * Math.PI - this.rotation) % (2 * Math.PI);
const winningIndex = Math.floor(adjustedRotation / sliceAngle);
const winner = this.prizes[winningIndex];
```

**Problem Analysis**:
1. **Canvas coordinate system**: 0° = RIGHT (3 o'clock), prizes drawn clockwise
2. **Pointer position**: TOP of wheel (270° in canvas coordinates = -π/2 from 0°)
3. **Current formula**: `(2π - rotation)` attempts to reverse, but doesn't account for pointer offset
4. **Result**: Calculated prize ≠ visual prize under pointer

**Root Cause**:
The formula assumes pointer is at 0° (right side), but CSS positions it at top (270°).

**Correct Fix**:
```javascript
const sliceAngle = (2 * Math.PI) / this.prizes.length;

// Pointer is at TOP (270° = -π/2 in canvas coords)
const pointerOffsetRadians = -Math.PI / 2;

// Calculate rotation relative to pointer
const rotationRelativeToPointer = this.rotation - pointerOffsetRadians;

// Normalize to 0-2π range
const normalizedRotation = ((rotationRelativeToPointer % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

// Reverse direction (prizes drawn clockwise, but we measure counter-clockwise from pointer)
const adjustedRotation = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);

const winningIndex = Math.floor(adjustedRotation / sliceAngle);
const winner = this.prizes[winningIndex];

// ⚠️ CRITICAL: Log for verification
console.log('=== SPIN RESULT DEBUG ===');
console.log('Total Prizes:', this.prizes.length);
console.log('Final Rotation (rad):', this.rotation);
console.log('Final Rotation (deg):', (this.rotation * 180 / Math.PI).toFixed(2));
console.log('Adjusted Rotation (rad):', adjustedRotation);
console.log('Adjusted Rotation (deg):', (adjustedRotation * 180 / Math.PI).toFixed(2));
console.log('Winning Index:', winningIndex);
console.log('Selected Prize:', winner);
console.log('Prize Array:', this.prizes);
console.log('=======================');
```

**Testing Protocol**:
1. Add logging to verify calculations
2. Manually test with known rotations:
   - `rotation = 0` should select prize at top
   - `rotation = sliceAngle` should select next prize clockwise
   - `rotation = π` (180°) should select prize at bottom
3. Visual verification: spin wheel, check if displayed winner matches visual position

---

### 🔴 BUG #2: Generic Alert Message

**Location**: `app.js` line 257 (`handleRegistration` method)

**Current Code**:
```javascript
alert(`✅ Registration successful! ${formData.fullName}, you can now spin the wheel!`);
```

**Problem**:
- Browser shows "localhost:8000 says" in alert header
- Not user-friendly or professional
- User explicitly requested custom modal with user's name

**Fix Required**:
Replace with custom modal that:
1. Shows TAP2LOCK branding
2. Displays personalized message: "✅ Registration successful, [Full Name]!"
3. Shows "You can now spin the wheel!"
4. Has single "Start Spinning" button
5. Automatically closes after 3 seconds OR on button click

**Implementation**:
```javascript
// Add to index.html after line 27 (after settings modal):
<div id="registrationSuccessModal" class="modal hidden">
    <div class="modal-content success-modal">
        <div class="success-icon">✅</div>
        <h2>Registration Successful!</h2>
        <p id="successUserName"></p>
        <p>You can now spin the wheel!</p>
        <button id="startSpinningBtn" class="modal-btn confirm-btn">Start Spinning</button>
    </div>
</div>

// Modify app.js handleRegistration():
handleRegistration(formData) {
    this.currentEntryId = this.dataManager.saveEntry(formData);
    this.registrationHandler.hide();
    
    // Show custom success modal
    document.getElementById('successUserName').textContent = formData.fullName;
    const modal = document.getElementById('registrationSuccessModal');
    modal.classList.remove('hidden');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('wheelContainer').classList.remove('hidden');
    }, 3000);
    
    // Manual close on button click
    document.getElementById('startSpinningBtn').onclick = () => {
        modal.classList.add('hidden');
        document.getElementById('wheelContainer').classList.remove('hidden');
    };
}
```

---

## DETERMINISTIC SELECTION CONTRACT

**GUARANTEE**: The recorded prize SHALL ALWAYS equal the visibly selected segment.

**Requirements**:
1. ✅ Single calculation point (`showWinner()` method only)
2. ✅ Immutable rotation state (normalized before calculation)
3. ✅ Synchronous storage (saved immediately after calculation)
4. ⚠️ **MISSING**: Logging contract for audit trail
5. ⚠️ **MISSING**: Visual-data consistency verification

**Logging Contract to Add**:
```javascript
// In showWinner() after winner calculation:
const selectionLog = {
    timestamp: new Date().toISOString(),
    entryId: this.currentEntryId,
    rotation: this.rotation,
    adjustedRotation: adjustedRotation,
    sliceAngle: sliceAngle,
    winningIndex: winningIndex,
    selectedPrize: winner,
    totalPrizes: this.prizes.length,
    prizeArray: [...this.prizes]
};
console.log('🎯 SELECTION EVENT:', selectionLog);

// Optional: Store in LocalStorage for post-event audit
const auditLog = JSON.parse(localStorage.getItem('spinAuditLog') || '[]');
auditLog.push(selectionLog);
localStorage.setItem('spinAuditLog', JSON.stringify(auditLog));
```

---

## TESTING CHECKLIST

### Pre-Deployment Testing

**1. Wheel Alignment Verification**
- [ ] Fix `showWinner()` calculation
- [ ] Add logging to all spin results
- [ ] Test with 6 prizes (default)
- [ ] Test with 3 prizes (minimum)
- [ ] Test with 12 prizes (maximum)
- [ ] Manually verify 10 spins: visual = recorded

**2. Registration Flow**
- [ ] Replace alert() with custom modal
- [ ] Verify user's full name appears in success message
- [ ] Test auto-close after 3 seconds
- [ ] Test manual close with button
- [ ] Verify wheel appears after modal closes

**3. Data Integrity**
- [ ] Register 5 users, spin all
- [ ] Export CSV, verify all data present
- [ ] Verify prizes match visual results
- [ ] Clear data, verify empty state

**4. Multi-Tablet Simulation**
- [ ] Open 2 browser tabs
- [ ] Register on Tab 1, verify doesn't affect Tab 2
- [ ] Confirm LocalStorage is tab-independent
- [ ] Export from each tab, compare data

**5. Offline Functionality**
- [ ] Disconnect network
- [ ] Complete full registration → spin → export flow
- [ ] Verify service worker caches all assets
- [ ] Test PWA installation on Android

---

## DEPLOYMENT STATUS

**Current State**: ✅ Local Testing Only
- Server running: `http://localhost:8000`
- No Firebase integration (removed/not present)
- Pure LocalStorage implementation
- GitHub repository exists but local changes uncommitted

**Git Status** (as of session):
- Modified: `README.md`, `sw.js`
- Untracked: 8 new files (guides, scripts)
- Core files (app.js, index.html, styles.css) synchronized

**Next Actions**:
1. Fix Bug #1 (wheel alignment)
2. Fix Bug #2 (alert modal)
3. Test deterministic selection
4. Commit changes to Git
5. Deploy to GitHub Pages OR prepare tablets for event

---

## KNOWN LIMITATIONS

1. **No real-time sync between devices** - Each device has isolated LocalStorage
2. **No conflict resolution** - Manual CSV merge required post-event
3. **Browser dependency** - Clearing browser data = data loss
4. **Single-user registration** - No multi-user support per device
5. **No authentication** - Admin panel accessible to anyone

---

## FUTURE ENHANCEMENTS (Post-Fix)

**Priority 1: Data Integrity**
- Add audit logging for all spins
- Visual verification system
- Automated testing suite

**Priority 2: User Experience**
- Confetti animation on win
- Sound effects (spin, win)
- Vibration feedback (mobile)
- Animated prize reveal

**Priority 3: Data Management**
- Export audit logs
- Import prize lists
- Prize probability weighting
- Statistics dashboard

**Priority 4: Multi-Device**
- If needed: Implement PouchDB + CouchDB
- Laptop acts as sync server
- Tablets sync via local WiFi

---

## SESSION NOTES

**Session Date**: October 31, 2025  
**Issue Reported**: "Wheel did not appear after registration"  
**Root Cause**: Expected - registration form was visible, alert appeared, but user expected custom modal  
**Current Status**: 
- ✅ Wheel visibility working correctly
- 🔴 Alert message needs replacement with custom modal
- 🔴 Wheel alignment calculation needs fix
- 🔴 Deterministic selection logging needed

**User Requirements**:
1. Custom modal instead of browser alert
2. Modal should display user's full name from form
3. Wheel prize selection must be 100% accurate
4. Recorded data must match visual result EXACTLY

**Next Session Priorities**:
1. Implement custom success modal with user's name
2. Fix wheel/prize alignment calculation
3. Add comprehensive logging
4. Test deterministic selection
5. Commit to Git

---

**End of Technical Architecture Document**  
**Last Updated**: October 31, 2025 11:15 AM (PDT)  
**Next Review**: After bug fixes applied
