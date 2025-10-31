# 🎡 Prize Wheel - Portable Installation Package

## 📦 Quick Installation (3 Steps)

### Step 1: Extract ZIP File
Extract this ZIP to: **`C:\Prizewheel`**

### Step 2: Run Setup
Right-click **`SETUP.bat`** → **Run as administrator**

### Step 3: Done!
Double-click the desktop shortcut: **"Prize Wheel Server"**

---

## ✅ What the Setup Does

The **SETUP.bat** script automatically:

1. ✅ Checks if Python is installed
2. ✅ Downloads and installs Python (if needed)
3. ✅ Configures Windows Firewall (port 8000)
4. ✅ Tests the server
5. ✅ Creates desktop shortcuts
6. ✅ Gets your laptop's IP address
7. ✅ Ready to use!

**Total time:** 2-5 minutes (depending on Python download)

---

## 🚀 After Setup - How to Use

### Start the Server
Double-click desktop shortcut: **"Prize Wheel Server"**

This will:
- Start the server
- Open browser to Prize Wheel
- Show network URL for mobile devices

### Connect Mobile Devices
1. Connect phone/tablet to same WiFi
2. Double-click desktop shortcut: **"Prize Wheel - QR Code"**
3. Scan QR code with phone camera
4. Or manually type: `http://[YOUR-IP]:8000`

---

## 📁 Files Included

```
SETUP.bat                       ⭐ RUN THIS FIRST!
START_NETWORK_SERVER.bat        - Start server
START_SERVER.bat                - Basic server
STOP_SERVER.bat                 - Stop server
FORCE_CLEAR_CACHE.bat           - Clear cache

index.html                      - Main app
app.js                          - JavaScript
styles.css                      - Styling
sw.js                           - Service Worker
manifest.json                   - PWA config

network-setup.html              - QR code generator
LAPTOP_INSTALLATION.md          - Installation guide
NETWORK_SETUP_GUIDE.md          - Complete network guide
README.md                       - This file

assets/
  └─ tap2lock-header.png        - Logo
```

---

## 💡 Important Notes

### Python Installation
- Setup automatically installs Python if needed
- Downloads Python 3.11 from python.org
- Adds Python to PATH automatically
- If auto-install fails, download manually: https://www.python.org/downloads/

### Administrator Rights
- Required for: Installing Python + Configuring Firewall
- Right-click SETUP.bat → "Run as administrator"

### Firewall
- Setup creates rule for port 8000
- Allows network connections from mobile devices
- Required for phones/tablets to connect

---

## 🎪 Trade Show Usage

### Quick Start at Event
1. Double-click: "Prize Wheel Server"
2. Print QR code page
3. Post at booth
4. Attendees scan and spin!

### WiFi Options

**Option A: Laptop Hotspot (Best)**
- Settings → Mobile Hotspot → Turn ON
- No venue WiFi needed
- You control the network

**Option B: Venue WiFi**
- Connect laptop to venue WiFi
- Devices connect to same WiFi
- Share laptop IP address

---

## 💾 Offline Mode

**How it works:**
1. Phone connects to laptop (first time)
2. App downloads and caches
3. After that: Works 100% offline!
4. No WiFi or laptop needed

**Perfect for:**
- Pre-loading tablets before event
- Backup when WiFi fails
- Multi-day events

---

## 🔧 Troubleshooting

### "Setup failed"
- Right-click SETUP.bat → Run as administrator
- Check internet connection (for Python download)
- See LAPTOP_INSTALLATION.md for manual setup

### "Can't connect from phone"
- Same WiFi network?
- Check laptop IP: Open Command Prompt → `ipconfig`
- Firewall enabled? Re-run SETUP.bat as admin

### "Python not found"
- Restart Command Prompt after setup
- Or restart laptop
- Or manually install: https://www.python.org/downloads/

### "Old version showing"
- Press Ctrl+Shift+R (hard refresh)
- Or run: FORCE_CLEAR_CACHE.bat

---

## 📋 What You Get

### Features
✅ Registration form (Name, Email, Phone, Vehicle)
✅ Spinning prize wheel
✅ Winner display
✅ Admin panel with data export
✅ CSV export of all entries
✅ Offline PWA capability
✅ Mobile-responsive design
✅ Network accessible from tablets/phones

### System Requirements
- Windows 10/11 (64-bit)
- 4GB RAM minimum
- 100MB disk space
- WiFi capability
- Python 3.7+ (auto-installed by setup)

---

## 📚 Documentation

- **LAPTOP_INSTALLATION.md** - Complete installation guide
- **NETWORK_SETUP_GUIDE.md** - 400-line network guide
- **SESSION_COMPLETE.md** - Feature overview
- **GITHUB_PUSH_GUIDE.md** - How to update

---

## 🎯 Quick Reference

| Task | Action |
|------|--------|
| Install | Right-click SETUP.bat → Run as admin |
| Start Server | Double-click desktop shortcut |
| Get QR Code | Double-click "Prize Wheel - QR Code" |
| Stop Server | Run STOP_SERVER.bat or press Ctrl+C |
| Clear Cache | Run FORCE_CLEAR_CACHE.bat |
| Configure Prizes | Click ⚙️ Settings in app |
| Export Data | Settings → Admin → Export CSV |

---

## ✅ Installation Checklist

- ☐ Extract ZIP to C:\Prizewheel
- ☐ Right-click SETUP.bat → Run as administrator
- ☐ Wait for setup to complete (2-5 minutes)
- ☐ Double-click "Prize Wheel Server" on desktop
- ☐ Test registration and spinning
- ☐ Configure your prizes (Settings)
- ☐ Print QR code page
- ☐ Test on mobile device

---

## 🎉 Ready to Install?

1. Extract this ZIP to: **C:\Prizewheel**
2. Right-click **SETUP.bat** → **Run as administrator**
3. Follow the prompts
4. Done! 🚀

---

**Need Help?** Check LAPTOP_INSTALLATION.md for detailed instructions!
