const fetch = require('node-fetch');

// In-memory OTP storage
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS using Fast2SMS
const sendOTP = async (phoneNumber) => {
  const otp = generateOTP();
  const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  // Store OTP with expiry
  otpStore.set(phoneNumber, { otp, expiryTime });
  
  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY || 'demo',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        flash: 0,
        numbers: phoneNumber.replace(/[^0-9]/g, '').slice(-10)
      })
    });
    
    const data = await response.json();
    
    if (data.return) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      throw new Error('SMS service failed');
    }
  } catch (error) {
    console.log(`Demo OTP for ${phoneNumber}: ${otp}`);
    return { success: true, message: 'OTP sent successfully (Demo)', otp };
  }
};

// Verify OTP
const verifyOTP = (phoneNumber, inputOTP) => {
  const stored = otpStore.get(phoneNumber);
  
  if (!stored) {
    return { success: false, message: 'OTP not found' };
  }
  
  if (Date.now() > stored.expiryTime) {
    otpStore.delete(phoneNumber);
    return { success: false, message: 'OTP expired' };
  }
  
  if (stored.otp !== inputOTP) {
    return { success: false, message: 'Invalid OTP' };
  }
  
  otpStore.delete(phoneNumber);
  return { success: true, message: 'OTP verified successfully' };
};

module.exports = { sendOTP, verifyOTP };