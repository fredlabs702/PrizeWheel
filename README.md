# Prize Wheel - Offline PWA

A fully offline prize wheel app that works on iOS, Android, and desktop browsers!

## Features

✅ **100% Offline** - Works without internet after first load
✅ **Cross-Platform** - iOS, Android, Windows, Mac, Linux
✅ **No App Store Required** - Install directly from browser
✅ **Customizable Prizes** - Add up to 12 prizes
✅ **Smooth Animations** - Beautiful spinning wheel effect
✅ **Data Persistence** - Your prizes are saved locally
✅ **Zero Cost** - No hosting or app store fees

## How to Use

### Option 1: Quick Test (Local File)
1. Open `index.html` in your web browser
2. The app works immediately!

### Option 2: Install as PWA (Recommended)

#### For Testing Locally:
1. Install a simple web server:
   ```
   npm install -g http-server
   ```
   OR use Python:
   ```
   python -m http.server 8000
   ```

2. Run the server in the C:\PrizeWheel folder:
   ```
   http-server
   ```
   OR
   ```
   python -m http.server 8000
   ```

3. Open browser to: http://localhost:8000

4. **Install the app:**
   - **Chrome/Edge**: Click install icon in address bar
   - **Safari iOS**: Tap Share → Add to Home Screen
   - **Android**: Tap menu → Add to Home Screen

#### For Public Deployment (Free Hosting):

**Option A: GitHub Pages (Recommended)**
1. Create a GitHub account (free)
2. Create a new repository
3. Upload all files from C:\PrizeWheel
4. Go to Settings → Pages
5. Enable GitHub Pages
6. Your app will be at: `https://yourusername.github.io/repo-name`

**Option B: Netlify**
1. Sign up at netlify.com (free)
2. Drag and drop the C:\PrizeWheel folder
3. Get instant URL like: `https://your-app.netlify.app`

**Option C: Vercel**
1. Sign up at vercel.com (free)
2. Import the folder
3. Deploy with one click

### Once Deployed:
- Share the URL with anyone
- They can install it as an app on their device
- Works 100% offline after first visit

## Using the App

1. **Spin the Wheel**: Click the big SPIN button in center
2. **Add Prizes**: Type prize name and click "Add Prize"
3. **Delete Prizes**: Click delete button next to any prize
4. **Minimum**: Must have at least 2 prizes
5. **Maximum**: Can have up to 12 prizes

## Files Included

- `index.html` - Main app page
- `styles.css` - All styling (responsive design)
- `app.js` - Wheel logic and animations
- `sw.js` - Service worker (enables offline mode)
- `manifest.json` - PWA configuration
- `icon-192.png` - App icon (small)
- `icon-512.png` - App icon (large)

## Technical Details

- **No Backend Required** - Pure frontend application
- **Storage**: LocalStorage (works offline)
- **Frameworks**: Vanilla JavaScript (no dependencies)
- **Size**: < 50KB total
- **Browser Support**: All modern browsers
- **PWA Standard**: Full Progressive Web App compliance

## Customization

Want to customize? Edit these files:

- **Colors**: Change colors array in `app.js` (line 12)
- **Max Prizes**: Change limit in `app.js` (line 87)
- **Spin Duration**: Change duration in `app.js` (line 109)
- **Theme**: Edit colors in `styles.css`

## Troubleshooting

**App won't install?**
- Must use HTTPS or localhost
- Try Chrome/Edge instead of Safari
- Clear browser cache and reload

**Prizes not saving?**
- Check browser allows localStorage
- Don't use private/incognito mode

**Wheel not spinning?**
- Make sure you have at least 2 prizes
- Check browser console for errors

## Zero Cost Deployment Checklist

✅ No hosting fees (use GitHub Pages/Netlify/Vercel)
✅ No app store fees (PWA installs from browser)
✅ No backend costs (runs entirely in browser)
✅ No database costs (uses localStorage)
✅ No domain required (free subdomain provided)

## License

Free to use, modify, and distribute!

Built with ❤️ for Lock Labs Inc.
"# PrizeWheel" 
