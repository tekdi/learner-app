# 🎉 Zoom JWT - Automatic Token Generation

## ✅ **IT'S NOW AUTOMATIC!**

Your build scripts now **automatically generate** fresh Zoom JWT tokens before every build!

---

## 🚀 **How It Works:**

```bash
npm run android:uat
    ↓
1. Generates JWT token from .env.uat credentials
    ↓
2. Updates ZOOM_JWT_TOKEN in .env.uat
    ↓
3. Builds app with fresh token
    ↓
4. Installs and launches app
    ↓
✅ Zoom working with fresh token!
```

---

## 📝 **Updated Scripts:**

### **Development Builds:**
```bash
npm run android:dev       # Auto-generates token for dev
npm run android:uat       # Auto-generates token for uat
npm run android:prod      # Auto-generates token for prod
```

### **Debug APK:**
```bash
npm run android:dev_debug_apk   # Auto-generates token
npm run android:uat_debug_apk   # Auto-generates token
npm run android:prod_debug_apk  # Auto-generates token
```

### **Release APK:**
```bash
npm run android:dev_release_apk   # Auto-generates token
npm run android:uat_release_apk   # Auto-generates token
npm run android:prod_release_apk  # Auto-generates token
```

### **Signed Bundle (AAB):**
```bash
npm run android:dev_signed_bundle_aab   # Auto-generates token
npm run android:uat_signed_bundle_aab   # Auto-generates token
npm run android:prod_signed_bundle_aab  # Auto-generates token
```

---

## 🔑 **What's Stored in .env Files:**

### `.env.dev` and `.env.uat`:
```env
# Your organization's Zoom credentials
ZOOM_SDK_KEY=0LHgCSm3TaqUNd25cQ7Asg
ZOOM_SDK_SECRET=Xdhiuf5K7d7T1W67IAry5X0re1LiOnEG
ZOOM_DOMAIN=zoom.us

# Auto-generated JWT token (updated before each build)
ZOOM_JWT_TOKEN=<automatically updated>
```

---

## 💡 **Benefits:**

✅ **Zero manual work** - Token always fresh  
✅ **No expired tokens** - Generated before every build  
✅ **Multi-environment** - Different tokens for dev/uat/prod  
✅ **Secure** - SDK_SECRET never exposed in app  
✅ **Team friendly** - Everyone uses same workflow  

---

## 🔄 **What Happens Behind the Scenes:**

Every time you run a build command:

1. **Script runs:** `node generate-zoom-jwt.js <env>`
2. **Reads credentials:** From `.env.dev` or `.env.uat`
3. **Generates JWT:** Using SDK_KEY and SDK_SECRET
4. **Updates .env:** Writes new token to `ZOOM_JWT_TOKEN`
5. **Builds app:** Gradle injects token via BuildConfig
6. **Result:** App has fresh token valid for 48 hours

---

## 📋 **Your Workflow (Super Simple!):**

### **Option 1: Regular Development**
```bash
npm run android:uat
# That's it! Token auto-generated, app built and installed
```

### **Option 2: Release Build**
```bash
npm run android:uat_release_apk
# Token auto-generated, release APK created
```

### **Option 3: Play Store Bundle**
```bash
npm run android:uat_signed_bundle_aab
# Token auto-generated, signed AAB created for Play Store
```

---

## 🎯 **No More Manual Steps!**

### ❌ **Before (Manual):**
```bash
node generate-zoom-jwt.js uat  # Step 1
npm run android:uat            # Step 2
```

### ✅ **Now (Automatic):**
```bash
npm run android:uat  # Done! One command!
```

---

## 🔒 **Security Notes:**

1. **SDK_SECRET** → Safe in `.env` files (not committed to git)
2. **JWT_TOKEN** → Auto-generated, never manually edited
3. **BuildConfig** → Tokens injected at build time (not in source code)
4. **Multi-environment** → Separate credentials per environment

---

## 📦 **Files You Need:**

✅ `.env.dev` - Development credentials  
✅ `.env.uat` - UAT credentials  
✅ `.env.prod` - Production credentials (optional)  
✅ `generate-zoom-jwt.js` - Token generator script  
✅ `package.json` - Updated with automatic scripts  
✅ `.gitignore` - Must include `.env*` files  

---

## 🆘 **Troubleshooting:**

### **If token generation fails:**
```bash
# Check if .env file exists
ls -la .env.uat

# Verify ZOOM_SDK_KEY and ZOOM_SDK_SECRET are set
cat .env.uat | grep ZOOM
```

### **If build fails:**
```bash
# Clean and rebuild
cd android && ./gradlew clean && cd ..
npm run android:uat
```

### **Token still expired?**
- Check if `generate-zoom-jwt.js` ran successfully
- Look for console output: "✅ Zoom SDK JWT Token Generated Successfully!"
- Verify `ZOOM_JWT_TOKEN` was updated in your .env file

---

## 🎉 **Summary:**

**You never need to manually generate tokens again!**

Just run:
- `npm run android:dev` for development
- `npm run android:uat` for UAT
- `npm run android:prod` for production

Fresh tokens are **automatically generated** every time! 🚀

---

**Last Updated:** Dec 9, 2024
**Automatic Token Generation:** ✅ ENABLED

