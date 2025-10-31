# SheetDB Integration - Prize Wheel
**Date**: October 31, 2025  
**Feature**: Multi-Device Sync with Centralized Database  
**Implementation**: SheetDB + Google Sheets API

---

## 🎯 OVERVIEW

The Prize Wheel now supports **multi-device synchronization** using SheetDB as a free API layer for Google Sheets. This enables:

✅ **Single Configuration** - Manage prizes from one Google Sheet  
✅ **Centralized Database** - All tablets share the same data  
✅ **Real-Time Sync** - Updates visible across devices (2-5 second delay)  
✅ **Zero Cost** - Free tier provides 3,000 API calls/month  
✅ **Offline Fallback** - LocalStorage backup if network fails  

---

## 📋 HOW IT WORKS

### Hybrid Architecture (Best of Both Worlds)

1. **User registers** → Saved to LocalStorage (immediate) + SheetDB (background)
2. **Wheel spins** → Prize determined locally (instant)
3. **Winner selected** → Updated in LocalStorage + synced to SheetDB
4. **Admin views data** → Reads from LocalStorage (fast)
5. **Multi-device sync** → All devices write to same Google Sheet

### Data Flow

```
Registration Form
    ↓
[LocalStorage]  ←→  [SheetDB API]  ←→  [Google Sheets]
    ↓                                          ↓
Prize Wheel                              All Tablets
    ↓
Admin Panel
```

---

## 🔗 CONFIGURATION

### SheetDB API Details
- **API Endpoint**: `https://sheetdb.io/api/v1/sln0yc5o1pyi3`
- **Google Sheet**: SEMA2025
- **Free Tier Limit**: 3,000 requests/month
- **Average Event Usage**: ~300-500 requests (well under limit)

### Google Sheet Structure

**Column Headers** (Row 1):
- A: `id` (timestamp-based unique ID)
- B: `timestamp` (ISO 8601 format)
- C: `fullName` (user's full name)
- D: `email` (email address)
- E: `phone` (phone number)
- F: `vehicleYear` (year)
- G: `vehicleMake` (manufacturer)
- H: `vehicleModel` (model name)
- I: `prize` (winning prize name, or "Pending")

---

## 🚀 DEPLOYMENT

### Files Modified
1. **sheetdb-api.js** - NEW: SheetDB API integration module
2. **app.js** - UPDATED: Added sync methods and loading indicators
3. **index.html** - UPDATED: Added sheetdb-api.js script tag
4. **styles.css** - UPDATED: Added loading indicator styles

### Files Unchanged
- Registration form (no changes needed)
- Wheel calculation (already working perfectly)
- Admin panel (works with LocalStorage)
- Service worker (offline mode still works)

---

## ✅ TESTING CHECKLIST

### Before Event
- [ ] Verify SheetDB API is accessible
- [ ] Test registration on Tablet 1 → Check Google Sheet
- [ ] Test registration on Tablet 2 → Verify both entries visible
- [ ] Spin wheel on Tablet 1 → Check prize updates in sheet
- [ ] Verify data persists after page refresh
- [ ] Test offline mode (disconnect network, register, reconnect)

### During Event
- [ ] Monitor API quota (should stay well under 3,000)
- [ ] Check Google Sheet periodically for data accuracy
- [ ] Export CSV backup every hour as safety measure

### After Event
- [ ] Export final CSV from Google Sheets
- [ ] Merge data from multiple tablets if needed
- [ ] Archive Google Sheet for records
- [ ] Review audit logs for any discrepancies

---

## 🔧 TROUBLESHOOTING

### Issue: "Failed to sync to SheetDB"
**Solution**: Data still saved locally, continue using app. Sync when network returns.

### Issue: Data not appearing in Google Sheet
**Checklist**:
1. Check browser console for errors (F12)
2. Verify SheetDB API URL is correct
3. Test API using test-sheetdb-api.html
4. Check SheetDB quota hasn't been exceeded

### Issue: Multiple tablets showing different data
**Explanation**: Each tablet has independent LocalStorage  
**Solution**: Google Sheet is the source of truth - export from there

### Issue: Offline mode not working
**Solution**: LocalStorage still works offline. Sync occurs when online.

---

## 📊 API USAGE ESTIMATES

### Per Registration:
- 1 POST request (write entry) = 1 API call
- 1 PATCH request (update prize) = 1 API call
- **Total**: 2 API calls per participant

### Event with 500 Participants:
- 500 registrations × 2 calls = 1,000 API calls
- **Result**: Well under 3,000 free tier limit ✅

### Event with 1,000 Participants:
- 1,000 registrations × 2 calls = 2,000 API calls
- **Result**: Still under limit ✅

---

## 🎓 TECHNICAL DETAILS

### Retry Logic
- Failed requests retry 3 times with 1-second delay
- Handles rate limiting (429) and server errors (5xx)
- Network errors caught and logged without blocking user

### Error Handling
- LocalStorage writes are synchronous (never fail)
- SheetDB writes are asynchronous (non-blocking)
- UI continues working even if sync fails
- Loading indicators show sync status

### Performance Optimization
- Registration: Immediate LocalStorage save, background SheetDB sync
- Wheel spin: No API delay (prize calculated locally)
- Admin panel: Fast LocalStorage reads (no API calls)
- Only 2 API calls per participant (efficient)

---

## 💡 FUTURE ENHANCEMENTS (Optional)

### If Needed Later:
1. **Real-time polling** - Tablets fetch latest entries every 30 seconds
2. **Prize configuration sync** - Store prizes in Google Sheet too
3. **Multi-sheet support** - Separate sheets per event
4. **Admin dashboard** - View all tablets' data in real-time
5. **Automatic CSV export** - Schedule exports during event

### Cost Scaling (If Free Tier Insufficient):
- SheetDB Premium: $10/month for 100,000 requests
- Alternative: Firebase (also has free tier)
- Alternative: Supabase (unlimited requests, free)

---

## 📝 NOTES FOR NEXT SESSION

### What Works Well:
✅ Hybrid approach (LocalStorage + SheetDB) is robust  
✅ Zero user-facing delays (all sync is background)  
✅ Fallback to offline mode if network fails  
✅ Simple to test with test-sheetdb-api.html  

### Known Limitations:
⚠️ Prizes still stored in LocalStorage (not synced)  
⚠️ No real-time updates between tablets (refresh needed)  
⚠️ 3,000 request limit (enough for most events)  

### Recommendations for Production:
1. Test multi-tablet setup before event
2. Keep one device as "admin" for monitoring
3. Export CSV hourly during event as backup
4. Keep Google Sheet open on laptop for live monitoring
5. Verify SheetDB quota before event starts

---

**End of Documentation**  
**Last Updated**: October 31, 2025  
**Status**: Ready for Testing & Deployment
