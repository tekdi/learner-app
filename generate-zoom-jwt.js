const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

/**
 * Generate Zoom SDK JWT Token
 * Reads SDK_KEY and SDK_SECRET from .env.dev and .env.uat
 * Updates ZOOM_JWT_TOKEN in both files automatically
 */

// Determine which env file to use (default: dev)
const envFile = process.argv[2] === 'uat' ? '.env.uat' : '.env.dev';
const envPath = path.join(__dirname, envFile);

console.log(`\n📄 Using environment file: ${envFile}`);

// Read current .env file
if (!fs.existsSync(envPath)) {
  console.error(`❌ Error: ${envFile} not found!`);
  console.log(`\nPlease ensure you have ${envFile} in your project root.`);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

// Extract SDK_KEY and SDK_SECRET
const sdkKeyMatch = envContent.match(/ZOOM_SDK_KEY=(.+)/);
const sdkSecretMatch = envContent.match(/ZOOM_SDK_SECRET=(.+)/);

if (!sdkKeyMatch || !sdkSecretMatch) {
  console.error(`❌ Error: ZOOM_SDK_KEY or ZOOM_SDK_SECRET not found in ${envFile}`);
  console.log('\nPlease add these lines to your .env file:');
  console.log('ZOOM_SDK_KEY=your_sdk_key_here');
  console.log('ZOOM_SDK_SECRET=your_sdk_secret_here');
  process.exit(1);
}

const SDK_KEY = sdkKeyMatch[1].trim();
const SDK_SECRET = sdkSecretMatch[1].trim();

console.log(`✅ Found SDK_KEY: ${SDK_KEY.substring(0, 10)}...`);

// Generate JWT token
const now = Math.floor(Date.now() / 1000);
const payload = {
  appKey: SDK_KEY,
  sdkKey: SDK_KEY,
  iat: now,
  exp: now + 60 * 60 * 48, // valid for 48 hours
  tokenExp: now + 60 * 60 * 48
};

const token = jwt.sign(payload, SDK_SECRET, { algorithm: "HS256" });

console.log("\n==============================================");
console.log("✅ Zoom SDK JWT Token Generated Successfully!");
console.log("==============================================\n");
console.log("Token (copy this):\n");
console.log(token);
console.log("\n==============================================");
console.log("Valid for: 48 hours");
console.log("Expires at:", new Date((now + 60 * 60 * 48) * 1000).toLocaleString());
console.log("==============================================\n");

// Update the .env file with new token
const updatedEnvContent = envContent.replace(
  /ZOOM_JWT_TOKEN=.*/,
  `ZOOM_JWT_TOKEN=${token}`
);

fs.writeFileSync(envPath, updatedEnvContent);
console.log(`✅ Updated ${envFile} with new JWT token\n`);

// Also save to text file for reference
fs.writeFileSync("zoom-jwt-token.txt", token);
console.log("✅ Token also saved to: zoom-jwt-token.txt\n");

// Show next steps
console.log("📋 NEXT STEPS:");
console.log("==============");
console.log("1. The token has been automatically updated in your .env file");
console.log(`2. If you're updating production, also update .env.prod (if you have one)`);
console.log("3. Rebuild your app:");
console.log("   npm run android:dev   (for dev build)");
console.log("   npm run android:uat   (for uat build)");
console.log("\n⏰ Remember to regenerate this token in 48 hours!\n");
