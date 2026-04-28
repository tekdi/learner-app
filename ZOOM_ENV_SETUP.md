# 🔐 Zoom SDK - Environment Variables Setup

## ✅ Your Current Setup (IDEAL for React Native!)

You're storing Zoom credentials in `.env.dev` and `.env.uat` files using **react-native-config**.

---

## 📦 **What's in Your .env Files:**

### `.env.dev` (Development Environment)
```env
# ... your existing dev configs ...

# Zoom SDK Credentials
ZOOM_SDK_KEY=0LHgCSm3TaqUNd25cQ7Asg
ZOOM_SDK_SECRET=Xdhiuf5K7d7T1W67IAry5X0re1LiOnEG
ZOOM_DOMAIN=zoom.us
ZOOM_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `.env.uat` (UAT Environment)
```env
# ... your existing uat configs ...

# Zoom SDK Credentials (same as dev)
ZOOM_SDK_KEY=0LHgCSm3TaqUNd25cQ7Asg
ZOOM_SDK_SECRET=Xdhiuf5K7d7T1W67IAry5X0re1LiOnEG
ZOOM_DOMAIN=zoom.us
ZOOM_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔄 **How It Works:**

1. **Build Time:**
   - `react-native-config` reads your `.env.dev` or `.env.uat`
   - Injects values into `BuildConfig` (Android) / `Info.plist` (iOS)
   
2. **Runtime:**
   - `ZoomModule.java` reads `BuildConfig.ZOOM_JWT_TOKEN`
   - Initializes Zoom SDK with the token
   - No hardcoded values in source code! ✅

3. **Security:**
   - ✅ `.env` files are in `.gitignore` (never committed)
   - ✅ Different tokens per environment (dev/uat/prod)
   - ✅ Easy to rotate credentials

---

## 🔄 **Updating JWT Token (Every 48 Hours):**

### Option 1: Automatic Update (Recommended)
```bash
# For dev environment
node generate-zoom-jwt.js dev

# For uat environment
node generate-zoom-jwt.js uat

# This will:
# 1. Read SDK_KEY and SDK_SECRET from your .env file
# 2. Generate new JWT token
# 3. Automatically update ZOOM_JWT_TOKEN in the .env file
# 4. Save token to zoom-jwt-token.txt for reference
```

### Option 2: Manual Update
1. Go to https://marketplace.zoom.us/
2. Your app → App Credentials → Generate Token
3. Copy token
4. Paste in `.env.dev` and `.env.uat`:
   ```
   ZOOM_JWT_TOKEN=your_new_token_here
   ```

---

## 🏗️ **Building Your App:**

```bash
# Development build (uses .env.dev)
npm run android:dev

# UAT build (uses .env.uat)
npm run android:uat

# Production build (uses .env.prod if you create one)
npm run android:prod
```

---

## 📋 **Token Expiry Reminders:**

### When Token Expires (48 hours):
You'll see this error in app:
```
Failed to initialize Zoom SDK. Error code: 3
```

### Solution:
1. Run: `node generate-zoom-jwt.js uat`
2. Rebuild app: `npm run android:uat`
3. Reinstall on devices

### For Production:
- Set calendar reminder to regenerate token every 2 days
- Or implement backend JWT generation (optional)

---

## 🔒 **Security Best Practices:**

### ✅ DO:
- Keep `.env` files in `.gitignore`
- Use different tokens for dev/uat/prod
- Rotate tokens regularly
- Share credentials securely (password manager)

### ❌ DON'T:
- Commit `.env` files to git
- Share credentials in Slack/Email
- Hardcode credentials in source code
- Use same token for all environments

---

## 🆘 **If You Need Different Credentials Per Environment:**

You can have separate Zoom apps:
- Dev Zoom App → SDK Key 1 → `.env.dev`
- UAT Zoom App → SDK Key 2 → `.env.uat`
- Prod Zoom App → SDK Key 3 → `.env.prod`

This gives you complete isolation and separate usage tracking.

---

## 📝 **Team Workflow:**

### Developer Setup:
```bash
# 1. Clone repo
git clone your-repo

# 2. Copy .env template (if you create .env.example)
cp .env.example .env.dev
cp .env.example .env.uat

# 3. Ask team lead for Zoom credentials
# Add to .env.dev and .env.uat

# 4. Generate JWT token
node generate-zoom-jwt.js dev
node generate-zoom-jwt.js uat

# 5. Build and run
npm run android:dev
```

### Before Each Release:
```bash
# 1. Generate fresh token
node generate-zoom-jwt.js uat

# 2. Test app
npm run android:uat

# 3. Confirm Zoom working
# 4. Build release APK
cd android && ./gradlew assembleRelease
```

---

## 🎯 **Why This Approach is Perfect for You:**

1. ✅ **No Backend Needed** - Credentials in .env files
2. ✅ **Multi-Environment** - Different configs for dev/uat/prod
3. ✅ **Secure** - .env files never committed to git
4. ✅ **Easy Updates** - Run one command to regenerate token
5. ✅ **Team Friendly** - Everyone can use same process
6. ✅ **React Native Standard** - Using react-native-config (already in your project)

---

## 📞 **Support:**

If JWT token expires and app stops working:
1. Check error: "Failed to initialize Zoom SDK. Error code: 3"
2. Run: `node generate-zoom-jwt.js uat`
3. Rebuild: `npm run android:uat`
4. Problem solved! ✅

---

**Last Updated:** Dec 9, 2024
**Zoom SDK Version:** 6.6.0
**Token Validity:** 48 hours

