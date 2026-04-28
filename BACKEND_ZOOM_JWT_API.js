/**
 * ============================================
 * BACKEND API FOR ZOOM JWT TOKEN GENERATION
 * ============================================
 * 
 * This file should be deployed on YOUR BACKEND SERVER (Node.js/Express)
 * NOT in the React Native app!
 * 
 * Why Backend?
 * - SDK Secret stays secure on server (never exposed to users)
 * - Tokens are generated fresh on-demand (no expiry issues)
 * - Can be updated without rebuilding the app
 */

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// ⚠️ KEEP THESE SECURE - Store in environment variables!
const ZOOM_SDK_KEY = process.env.ZOOM_SDK_KEY || "0LHgCSm3TaqUNd25cQ7Asg";
const ZOOM_SDK_SECRET = process.env.ZOOM_SDK_SECRET || "Xdhiuf5K7d7T1W67IAry5X0re1LiOnEG";

/**
 * API Endpoint: Generate Zoom SDK JWT Token
 * URL: https://your-backend.com/api/zoom/jwt
 */
app.get('/api/zoom/jwt', (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      appKey: ZOOM_SDK_KEY,
      sdkKey: ZOOM_SDK_KEY,
      iat: now,
      exp: now + 60 * 60 * 48, // Valid for 48 hours
      tokenExp: now + 60 * 60 * 48
    };

    const token = jwt.sign(payload, ZOOM_SDK_SECRET, { algorithm: 'HS256' });

    res.json({
      success: true,
      token: token,
      expiresIn: 48 * 60 * 60, // seconds
      domain: "zoom.us"
    });
  } catch (error) {
    console.error('JWT generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate token'
    });
  }
});

/**
 * API Endpoint: Get Current Zoom Meeting Details
 * URL: https://your-backend.com/api/zoom/current-meeting
 * 
 * This endpoint returns the current active meeting link
 * (set by teacher/admin)
 */
app.get('/api/zoom/current-meeting', async (req, res) => {
  try {
    // TODO: Fetch from your database
    // const meeting = await db.query('SELECT * FROM zoom_meetings WHERE active = true');
    
    // For now, return hardcoded example
    const meeting = {
      meetingLink: "https://zoom.us/j/93903519283?pwd=eutjyEQnFzdDaIzcD6PX2Y04MWpbpO.1",
      meetingNumber: "93903519283",
      password: "eutjyEQnFzdDaIzcD6PX2Y04MWpbpO.1",
      topic: "Math Class",
      startTime: "2024-01-15T10:00:00Z"
    };

    // Also generate fresh JWT token
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      appKey: ZOOM_SDK_KEY,
      sdkKey: ZOOM_SDK_KEY,
      iat: now,
      exp: now + 60 * 60 * 48,
      tokenExp: now + 60 * 60 * 48
    };
    const token = jwt.sign(payload, ZOOM_SDK_SECRET, { algorithm: 'HS256' });

    res.json({
      success: true,
      meeting: meeting,
      jwtToken: token,
      domain: "zoom.us"
    });
  } catch (error) {
    console.error('Meeting fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meeting'
    });
  }
});

/**
 * API Endpoint: Teacher sets meeting link
 * URL: POST https://your-backend.com/api/zoom/set-meeting
 * Body: { "meetingLink": "https://zoom.us/j/..." }
 */
app.post('/api/zoom/set-meeting', async (req, res) => {
  try {
    const { meetingLink } = req.body;
    
    // TODO: Validate teacher authentication
    // TODO: Save to database
    // await db.query('UPDATE zoom_meetings SET meeting_link = ?, active = true', [meetingLink]);

    res.json({
      success: true,
      message: 'Meeting link updated successfully'
    });
  } catch (error) {
    console.error('Meeting update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update meeting'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Zoom JWT API running on port ${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/zoom/jwt`);
  console.log(`   GET  http://localhost:${PORT}/api/zoom/current-meeting`);
  console.log(`   POST http://localhost:${PORT}/api/zoom/set-meeting`);
});

/**
 * ============================================
 * DEPLOYMENT INSTRUCTIONS
 * ============================================
 * 
 * 1. Install dependencies:
 *    npm install express jsonwebtoken
 * 
 * 2. Set environment variables:
 *    export ZOOM_SDK_KEY="0LHgCSm3TaqUNd25cQ7Asg"
 *    export ZOOM_SDK_SECRET="Xdhiuf5K7d7T1W67IAry5X0re1LiOnEG"
 * 
 * 3. Run the server:
 *    node BACKEND_ZOOM_JWT_API.js
 * 
 * 4. Deploy to your production server (AWS, Heroku, DigitalOcean, etc.)
 * 
 * 5. Update React Native app to call: https://your-backend.com/api/zoom/jwt
 */

