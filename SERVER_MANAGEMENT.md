# Server Management Guide

## 🚀 Starting the Server

**Double-click:** `START_SERVER.bat`

The script will:
- ✅ Check if a server is already running
- ✅ Ask if you want to stop the old one or use it
- ✅ Start a new server if port is free
- ✅ Open your browser automatically
- ✅ Show both local and network URLs

**URLs:**
- Local: `http://localhost:8000`
- Network (tablet): `http://192.168.2.78:8000`

---

## 🛑 Stopping the Server

**Double-click:** `STOP_SERVER.bat`

The script will:
- ✅ Find ALL Python servers on port 8000
- ✅ Stop each one
- ✅ Show confirmation when done

**When to use:**
- Before starting a fresh server
- When you see "port already in use" errors
- To clean up multiple server instances
- Before shutting down your computer

---

## 🔍 Troubleshooting

### "Port 8000 is already in use"
1. Run `STOP_SERVER.bat`
2. Wait 2 seconds
3. Run `START_SERVER.bat` again

### Multiple servers running
- This happens if you click `START_SERVER.bat` multiple times
- Solution: Run `STOP_SERVER.bat` to clean them all up

### Can't access from tablet
1. Make sure tablet is on same WiFi network
2. Check your PC's firewall settings
3. Use the network URL: `http://192.168.2.78:8000`

---

## 📱 For Event Day

### Setup:
1. Run `STOP_SERVER.bat` to clean up old servers
2. Run `START_SERVER.bat` 
3. On tablet, go to: `http://192.168.2.78:8000`
4. Tap menu → "Add to Home Screen"
5. Now it works offline!

### Shutdown:
1. Close browser on tablet
2. On PC, run `STOP_SERVER.bat`
3. Done!

---

## ✅ Quick Reference

| Action | Script |
|--------|--------|
| Start server | `START_SERVER.bat` |
| Stop server | `STOP_SERVER.bat` |
| Stop all servers | `STOP_SERVER.bat` |
| Open app | Browser → `http://localhost:8000` |
| Access from tablet | Browser → `http://192.168.2.78:8000` |

---

## 🎯 Best Practice

**Always use the batch files!**
- Don't manually start Python http.server
- Don't close the command window (use STOP_SERVER.bat instead)
- Before event: Stop → Start → Install on tablet
