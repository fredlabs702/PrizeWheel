# 📦 Prize Wheel - Laptop Installation Instructions

## 🎯 Quick Installation (5 Minutes)

### Step 1: Copy Files to Laptop
Copy the entire **`Prizewheel`** folder to your laptop.

**Recommended location:**
```
C:\Prizewheel
```

### Step 2: Install Python (If Not Installed)

**Check if Python is installed:**
1. Open Command Prompt
2. Type: `python --version`
3. If you see version number → Python is installed ✅
4. If "not recognized" → Install Python ⬇️

**Install Python:**
1. Download: https://www.python.org/downloads/
2. Run installer
3. ✅ **CHECK** "Add Python to PATH" (IMPORTANT!)
4. Click "Install Now"
5. Restart laptop

### Step 3: Test the Server
1. Navigate to `C:\Prizewheel`
2. Double-click: **`START_NETWORK_SERVER.bat`**
3. Should open browser to: http://localhost:8000
4. If it works → You're done! ✅

---

## 🔧 What's Included

### Core App Files
```
index.html              - Main Prize Wheel app
app.js                  - JavaScript (clean production)
styles.css              - Styling
sw.js                   - Service Worker (offline mode)
manifest.json           - PWA configuration
icon-192.png           - App icon (small)
icon-512.png           - App icon (large)
assets/
  └─ tap2lock-header.png - Header logo
```

### Utility Scripts
```
START_NETWORK_SERVER.bat    - Start server (with firewall config)
START_SERVER.bat            - Start basic server
STOP_SERVER.bat             - Stop server
FORCE_CLEAR_CACHE.bat       - Clear browser cache
PUSH_UPDATES.bat            - Push to GitHub (if using Git)
CLEANUP_FILES.bat           - Clean up old files
```

### Documentation
```
README.md                   - Project overview
NETWORK_SETUP_GUIDE.md      - Complete network setup
GITHUB_PUSH_GUIDE.md        - How to update on GitHub
SESSION_COMPLETE.md         - Session summary
SERVER_MANAGEMENT.md        - Server management
```

### Special Pages
```
network-setup.html          - Network setup page with QR code
```

---

## 📱 Using at Trade Shows

### Pre-Event Setup (Do This at Office/Home)

1. **Install on Laptop**
   - Copy Prizewheel folder to laptop
   - Install Python (if needed)
   - Test server: Run `START_NETWORK_SERVER.bat`
   - Verify app works at http://localhost:8000

2. **Configure Prizes**
   - Click ⚙️ Settings
   - Click "Open Settings"
   - Add/edit prizes for your event
   - Test spinning wheel

3. **Print QR Code**
   - Run: `START_NETWORK_SERVER.bat`
   - Open: http://localhost:8000/network-setup.html
   - Print page with QR code
   - Bring printout to event

### At the Event

**Option A: Use Venue WiFi**
1. Connect laptop to venue WiFi
2. Run: `START_NETWORK_SERVER.bat`
3. Check laptop IP address (shown in terminal)
4. Update QR code if IP changed
5. Share URL with attendees

**Option B: Create WiFi Hotspot (RECOMMENDED)**
1. Create hotspot on laptop:
   - Settings → Network → Mobile Hotspot
   - Turn ON
   - Set name: "PrizeWheel"
   - Set password: "SpinToWin2025"
2. Run: `START_NETWORK_SERVER.bat`
3. Attendees connect to "PrizeWheel" WiFi
4. Scan QR code or type: http://192.168.137.1:8000
   *(Hotspot IP is usually 192.168.137.1)*

**Option C: Pre-Load on Tablets**
1. Before event: Load app on all tablets
2. Service Worker caches everything
3. At event: Tablets work 100% offline
4. No WiFi or laptop needed!

---

## 🚀 Quick Start Commands

### Start Server for Network Access
```cmd
START_NETWORK_SERVER.bat
```

### Stop Server
```cmd
STOP_SERVER.bat
```
Or press **Ctrl+C** in server window

### Clear Cache (If Updates Not Showing)
```cmd
FORCE_CLEAR_CACHE.bat
```

### View Network Setup Page
```
http://localhost:8000/network-setup.html
```

---

## 💾 System Requirements

### Laptop Requirements
- **OS:** Windows 10/11 (64-bit recommended)
- **RAM:** 4GB minimum (8GB recommended)
- **Storage:** 100MB for app
- **Python:** Version 3.7 or higher
- **Network:** WiFi capability (for hotspot or venue WiFi)

### Mobile Device Requirements (Phones/Tablets)
- **OS:** iOS 12+, Android 8+
- **Browser:** Safari (iOS), Chrome (Android)
- **Storage:** ~2MB per device (cached app)

---

## 🔧 Troubleshooting on New Laptop

### "Python is not recognized"

**Cause:** Python not installed or not in PATH

**Solution:**
1. Install Python from: https://www.python.org/downloads/
2. During install: ✅ CHECK "Add Python to PATH"
3. Restart Command Prompt
4. Test: `python --version`

### "Port 8000 is already in use"

**Cause:** Another app using port 8000

**Solution:**
```cmd
# Run STOP_SERVER.bat
# Or manually kill Python:
taskkill /F /IM python.exe
```

### "Can't connect from phone"

**Cause:** Firewall blocking connections

**Solution:**
1. Run `START_NETWORK_SERVER.bat` as Administrator
2. Click "Yes" when Windows asks about firewall
3. Or manually allow port 8000:
   - Windows Defender Firewall → Advanced Settings
   - Inbound Rules → New Rule
   - Port → TCP 8000 → Allow

### "Wrong IP address in QR code"

**Cause:** IP address changed

**Solution:**
1. Check current IP:
   ```cmd
   ipconfig
   ```
2. Look for "IPv4 Address"
3. Update URL in browser
4. Generate new QR code

---

## 📊 Data Collection at Events

### During Event
- Data saves to browser LocalStorage (on each device)
- Each device has its own registrations
- Export CSV periodically for backup

### After Event
1. **Export from Admin Panel:**
   - Click ⚙️ Settings → Admin
   - Click "Export CSV"
   - Save to USB drive

2. **Combine Data (if multiple devices):**
   - Export CSV from each device
   - Combine in Excel/Google Sheets
   - Remove duplicate headers

---

## 🔒 Security Notes

### Local Network Only
- App only accessible on local network
- Not exposed to internet
- No external connections required

### Data Privacy
- All data stored locally
- No cloud uploads
- No external services

### Admin Access
- Settings button visible to everyone
- Requires confirmation to access
- Consider hiding settings in production
- Or add password protection (future enhancement)

---

## 📋 Pre-Event Checklist

**1 Week Before:**
- ☐ Copy app to laptop
- ☐ Install Python
- ☐ Test server starts
- ☐ Configure prizes
- ☐ Test on phone
- ☐ Test offline mode

**1 Day Before:**
- ☐ Charge laptop fully
- ☐ Test WiFi hotspot
- ☐ Print QR code
- ☐ Export data (backup empty state)
- ☐ Test registration → spin flow

**At Event:**
- ☐ Start server
- ☐ Post QR code
- ☐ Test with one device
- ☐ Monitor server status
- ☐ Export data periodically

**After Event:**
- ☐ Export final CSV
- ☐ Save to multiple locations
- ☐ Stop server
- ☐ Review entries

---

## 🎁 Bonus: Make Desktop Shortcut

**For Easy Server Start:**

1. Right-click on `START_NETWORK_SERVER.bat`
2. Select "Create shortcut"
3. Move shortcut to Desktop
4. Rename to "Prize Wheel Server"
5. Right-click shortcut → Properties
6. Click "Change Icon" → Choose icon
7. Double-click desktop icon to start!

---

## 📞 Support Files Included

- **NETWORK_SETUP_GUIDE.md** - Complete 400-line network guide
- **GITHUB_PUSH_GUIDE.md** - How to update app
- **SESSION_COMPLETE.md** - Overview of all features
- **README.md** - Quick start guide

---

## ✅ Installation Complete!

Your Prize Wheel is ready for laptop deployment!

**Quick Test:**
1. Double-click `START_NETWORK_SERVER.bat`
2. Browser opens to http://localhost:8000
3. Fill out form → Submit → Spin
4. If it works → Ready for events! 🎉

**Network Test:**
1. Start server on laptop
2. Connect phone to same WiFi
3. Get laptop IP: `ipconfig`
4. On phone: http://[LAPTOP-IP]:8000
5. Register and spin from phone

---

**Need help?** Check `NETWORK_SETUP_GUIDE.md` for detailed troubleshooting!
