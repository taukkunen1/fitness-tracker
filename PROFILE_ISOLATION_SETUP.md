# Profile Isolation and Firebase Integration - Setup Guide

## 📋 Overview
This implementation adds profile isolation and Firebase Firestore integration to the fitness tracker application, ensuring:
- Each account only sees profiles linked to it
- Pedro and Valentina accounts only see their respective profiles
- All profile data is stored in Firebase Firestore
- IndexedDB serves as a local cache and fallback

## 🔐 Account Credentials

### Pedro (Admin)
- **Username:** `Pedro`
- **Password:** `123456`
- **Email:** pedro@fitness-tracker.com
- **Linked Profile:** pedro only

### Valentina (Admin)
- **Username:** `Valentina`
- **Password:** `123456`
- **Email:** valentina@fitness-tracker.com
- **Linked Profile:** valentina only

## 🚀 Firebase Setup Instructions

### 1. Deploy Firestore Rules
```bash
cd /home/runner/work/fitness-tracker/fitness-tracker
firebase deploy --only firestore:rules
```

### 2. Verify Firebase Configuration
The application is already configured with:
- Project ID: `fitness-tracker-9c801`
- API Key: Configured in code
- Firestore enabled

### 3. Test Firebase Connection
1. Open the application in a browser
2. Open browser Developer Console (F12)
3. Look for: `✅ Firebase Firestore initialized successfully`
4. If you see errors, check:
   - Firebase project is active
   - Firestore database is created
   - Security rules are deployed

## 📱 Usage Instructions

### Login as Pedro
1. Open the application
2. You should auto-login as Pedro (or login manually)
3. You'll only see the "Pedro" profile in the header
4. All data operations are saved to Firestore

### Login as Valentina
1. Click "🚪 Sair" to logout
2. Login with:
   - Username: `Valentina`
   - Password: `123456`
3. You'll only see the "Valentina" profile
4. Cannot see Pedro's data

### Create New Profiles
1. While logged in, click "➕ Novo Perfil"
2. Enter profile details
3. New profile is automatically linked to your account
4. Only you can see this profile

## 🏗️ Technical Architecture

### Data Storage Hierarchy
1. **Primary Storage:** Firebase Firestore
   - All user profiles stored in `users` collection
   - All accounts stored in `accounts` collection
   - Real-time sync enabled

2. **Cache Layer:** IndexedDB
   - Local cache for faster access
   - Automatic sync with Firestore
   - Used when offline

3. **Fallback:** localStorage
   - Legacy support
   - Emergency backup

### Profile Visibility Logic
```javascript
function getVisibleProfiles() {
  // Returns only profiles linked to current account
  const linkedProfiles = authState.currentAccount.linkedProfiles || [];
  const visibleProfiles = {};
  
  Object.keys(state.users).forEach(userId => {
    if (linkedProfiles.includes(userId)) {
      visibleProfiles[userId] = state.users[userId];
    }
  });
  
  return visibleProfiles;
}
```

### Data Flow
```
User Action → Application State → Firebase Firestore
                                ↓
                          IndexedDB (cache)
                                ↓
                          localStorage (fallback)
```

## 🔧 Configuration Files

### firebase.json
- Contains hosting and Firestore configuration
- Points to firestore.rules for security

### firestore.rules
- Security rules for Firestore access
- Currently allows authenticated access
- Should be refined for production

### firestore.indexes.json
- Firestore database indexes
- Empty initially, add as needed

## 🧪 Testing

### Test Profile Isolation
1. Login as Pedro → See only pedro profile ✓
2. Login as Valentina → See only valentina profile ✓
3. Create new profile → Auto-linked to account ✓

### Test Firebase Persistence
1. Add body metrics → Check Firestore console
2. Add workout logs → Verify in Firestore
3. Refresh page → Data persists ✓

### Test Fallback
1. Disconnect internet
2. App still works with IndexedDB
3. Reconnect → Syncs to Firestore

## 🐛 Troubleshooting

### Firebase Not Initializing
- Check browser console for errors
- Verify Firebase project is active
- Check API key and configuration

### Profiles Not Isolated
- Verify `linkedProfiles` array in account data
- Check `getVisibleProfiles()` function
- Clear browser cache and retry

### Data Not Persisting
- Check Firestore security rules
- Verify network connection
- Check browser console for errors

### Auto-Login Issues
- Clear browser data
- Check session storage
- Verify account creation in IndexedDB

## 📚 Additional Resources

### Firebase Console
- https://console.firebase.google.com/
- Project: fitness-tracker-9c801

### Firestore Database
- Navigate to Firestore Database in Firebase Console
- Collections: `users`, `accounts`
- View and manage data

### Security Rules
- Edit in Firebase Console or firestore.rules
- Deploy with: `firebase deploy --only firestore:rules`

## 🎯 Future Enhancements

### Profile Linking by ID/Email
- Add UI for searching profiles
- Send/accept link requests
- Share profiles between accounts

### Enhanced Security
- Row-level security in Firestore rules
- Verify linkedProfiles on server side
- Add audit logging

### Offline Support
- Enhanced IndexedDB caching
- Conflict resolution
- Sync queue management

## ✅ Verification Checklist

After deployment, verify:
- [ ] Pedro account auto-created with password 123456
- [ ] Valentina account created with password 123456
- [ ] Pedro only sees pedro profile
- [ ] Valentina only sees valentina profile
- [ ] New profiles auto-link to creator
- [ ] Firebase initialization succeeds
- [ ] Profile data saves to Firestore
- [ ] Account data saves to Firestore
- [ ] IndexedDB fallback works
- [ ] No cross-account visibility

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase project configuration
3. Review this documentation
4. Check Firestore security rules
5. Test with different browsers

---

**Note:** This implementation maintains backward compatibility with existing data while adding new security and persistence features.
