# 🌐 Network & Offline Setup Guide - Prize Wheel

## 📱 How Remote Devices Connect

### Overview
Your Prize Wheel app is designed to work in **two modes**:

1. **Network Mode** - Devices connect to your laptop's server
2. **Offline Mode** - After first load, works without connection

---

## 🎯 Quick Start - 3 Steps

### Step 1: Start Network Server
Run: **`START_NETWORK_SERVER.bat`**

This will:
- Configure Windows Firewall (may need Admin rights)
- Get your laptop's IP address
- Start server accessible on network
- Show connection URLs

### Step 2: Get Network Info
Open in browser: **`http://localhost:8000/network-setup.html`**

This page shows:
- Your network URL
- QR code for easy mobile access
- Complete setup instructions
- Troubleshooting guide

### Step 3: Connect Devices
On your phone/tablet:
- **Option A:** Scan QR code with camera
- **Option B:** Type URL: `http://192.168.2.78:8000`

---

## 🔧 Your Current Network Setup

**Laptop IP Address:** `192.168.2.78`
**Server Port:** `8000`
**Network URL:** `http://192.168.2.78:8000`

### URLs to Use:

```
On Your Laptop:
http://localhost:8000

On Phones/Tablets (Same WiFi):
http://192.168.2.78:8000

Setup Page (with QR code):
http://localhost:8000/network-setup.html
```

---

## 📡 How Network Access Works

### Current Configuration
Your server is already configured for network access:
```bash
python -m http.server 8000 --bind 0.0.0.0
```

The `--bind 0.0.0.0` means:
- ✅ Server listens on ALL network interfaces
- ✅ Accepts connections from other devices
- ✅ Works on local WiFi network

### Requirements
1. **Same WiFi Network** - All devices must be on same network
2. **Firewall Permission** - Windows must allow port 8000
3. **Server Running** - Laptop server must stay on

---

## 💾 Offline Capability Explained

### How It Works

**First Visit (Requires Network):**
1. Device connects to: `http://192.168.2.78:8000`
2. Downloads all files (HTML, CSS, JS, images)
3. Service Worker caches everything locally
4. Stores in browser's Cache Storage

**After First Visit (Offline Mode):**
1. Device can disconnect from WiFi
2. App loads instantly from cache
3. All features work (form, wheel, spin)
4. Data saves to LocalStorage (on device)
5. NO internet or server needed!

### What Gets Cached
```
✅ index.html
✅ app.js
✅ styles.css
✅ manifest.json
✅ icon-192.png
✅ icon-512.png
✅ assets/tap2lock-header.png
```

### What's Stored Locally
```
✅ Prize list (localStorage)
✅ Registration entries (localStorage)
✅ Prize assignments (localStorage)
✅ App settings (localStorage)
```

---

## 🎪 Trade Show / Event Scenario

### Your Use Case
**Setup:** Laptop at booth, phones/tablets for attendees

**Process:**
1. Before event: Set up laptop with Prize Wheel
2. At booth: Run `START_NETWORK_SERVER.bat`
3. Print QR code: `http://localhost:8000/network-setup.html`
4. Place QR code at booth
5. Attendees scan → register → spin

### Network Options

**Option A: WiFi Hotspot (Recommended)**
```
1. Create WiFi hotspot on laptop
2. Devices connect to your hotspot
3. No venue WiFi needed
4. You control the network
```

**Option B: Venue WiFi**
```
1. Connect laptop to venue WiFi
2. Devices connect to same WiFi
3. Get laptop IP address
4. Share IP with devices
```

**Option C: Pre-cache Before Event**
```
1. Load app on all devices before event
2. Service Worker caches everything
3. Devices work offline during event
4. No network needed at booth!
```

---

## 📱 Setup Windows Hotspot

### Create Hotspot on Laptop

**Method 1: Windows Settings**
1. Open **Settings** → **Network & Internet**
2. Click **Mobile hotspot**
3. Turn on **Share my Internet connection**
4. Set hotspot name and password
5. Click **Edit** to customize

**Method 2: Command Line**
```cmd
netsh wlan set hostednetwork mode=allow ssid=PrizeWheel key=Password123
netsh wlan start hostednetwork
```

### Connect Devices
1. On phone/tablet: Open WiFi settings
2. Connect to **PrizeWheel** network
3. Enter password
4. Open browser → `http://192.168.2.78:8000`

---

## 🔒 Firewall Configuration

### Check Firewall Status
```cmd
netsh advfirewall firewall show rule name="Python HTTP Server"
```

### Add Firewall Rule (If Needed)
```cmd
netsh advfirewall firewall add rule name="Python HTTP Server" dir=in action=allow protocol=TCP localport=8000
```

**Note:** You may need to run Command Prompt as Administrator

### Or Use the Script
Run: **`START_NETWORK_SERVER.bat`** (as Administrator)

It automatically creates firewall rule.

---

## 📊 Data Management Across Devices

### How Data Works

**Each device has its own data:**
- Phone A has its own registration entries
- Phone B has its own registration entries
- Laptop has its own registration entries
- Data is NOT shared between devices

### Collecting All Data

**To gather all registrations:**

**Option 1: Export from Each Device**
1. On each device: Open Admin panel
2. Click **Export CSV**
3. Download saves to device
4. Combine CSVs later

**Option 2: Central Collection**
- Use one device as "master"
- All staff use that device
- All data in one place

**Option 3: Cloud Sync (Future Enhancement)**
- Would require backend server
- Real-time sync across devices
- Not currently implemented

---

## 🔄 Updating the App

### When You Update Code

**Problem:** Devices cache old version

**Solution:**
1. Update cache version in `sw.js`:
   ```javascript
   const CACHE_NAME = 'prize-wheel-v4-production'; // Increment version
   ```

2. Push to GitHub
3. Tell device users to clear cache:
   - Press **Ctrl+Shift+R** (hard refresh)
   - Or clear browser cache
   - Or unregister Service Worker

### Force Update Script
Created: **`FORCE_CLEAR_CACHE.bat`**
- Clears Service Worker
- Clears cache
- Forces fresh download

---

## 🎯 Best Practices

### For Trade Shows
✅ Test everything day before
✅ Print QR code on poster
✅ Charge all devices fully
✅ Use WiFi hotspot for reliability
✅ Keep laptop plugged in
✅ Export data periodically

### For Long Events
✅ Monitor server status
✅ Restart server if needed
✅ Have backup device ready
✅ Export data hourly
✅ Test offline mode works

### For Multiple Staff
✅ Train staff on app use
✅ Show how to clear cache
✅ Explain offline capability
✅ Demonstrate export process
✅ Have troubleshooting guide

---

## 🐛 Troubleshooting

### "Can't Connect from Phone"

**Check:**
1. Same WiFi network? ✅
2. Correct IP address? ✅
3. Server running? ✅
4. Firewall allowing port 8000? ✅

**Solutions:**
- Run `START_NETWORK_SERVER.bat` as Admin
- Disable Windows Firewall temporarily (test only)
- Try `ipconfig` to verify IP
- Ping laptop from phone

### "IP Address Changed"

**Cause:** Router restart, DHCP lease renewal

**Solutions:**
- Run `ipconfig` to get new IP
- Update QR code with new IP
- Set static IP in router settings
- Use WiFi hotspot instead

### "Old Version Loading"

**Cause:** Service Worker cache

**Solutions:**
- Hard refresh: **Ctrl+Shift+R**
- Clear browser cache
- Unregister Service Worker (F12 → Application)
- Use Incognito mode to test

### "Data Not Syncing"

**Expected Behavior:** Data doesn't sync between devices

**Each device stores its own data:**
- This is by design
- LocalStorage is per-device
- Export CSV from each device separately

---

## 📂 Files Created

```
START_NETWORK_SERVER.bat      - Start server with firewall config
network-setup.html             - Setup page with QR code
FORCE_CLEAR_CACHE.bat          - Clear cache utility
NETWORK_SETUP_GUIDE.md         - This guide (comprehensive)
```

---

## 🚀 Next Steps

1. **Test Network Access:**
   - Run `START_NETWORK_SERVER.bat`
   - Connect phone to WiFi
   - Open `http://192.168.2.78:8000`
   - Test registration → spin

2. **Test Offline Mode:**
   - Load app on phone
   - Turn off WiFi on phone
   - App should still work
   - Test registration → spin offline

3. **Print QR Code:**
   - Open `http://localhost:8000/network-setup.html`
   - Print page with QR code
   - Post at booth for easy access

4. **Train Staff:**
   - Show how to start server
   - Demonstrate app usage
   - Explain offline capability
   - Practice export process

---

## 💡 Pro Tips

**Battery Life:**
- Keep laptop plugged in
- Devices cache app after first load
- Battery usage minimal in offline mode

**Network Reliability:**
- WiFi hotspot more reliable than venue WiFi
- Test signal strength at booth location
- Have backup devices charged

**Data Collection:**
- Export CSV periodically during event
- Save backups to USB drive
- Email CSV to yourself as backup

**Performance:**
- First load takes a few seconds
- Subsequent loads instant (cached)
- Offline mode same speed as online

---

**Ready to test network access?**

Run: `START_NETWORK_SERVER.bat` and connect your phone! 📱✨
