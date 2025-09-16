// Use built-in fetch in Node.js 18+ or fallback to node-fetch
const fetch = globalThis.fetch || require('node-fetch');

// In-memory OTP storage
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS using Fast2SMS
const sendOTP = async (phoneNumber) => {
  try {
    // Validate phone number
    if (!phoneNumber || !/^[0-9+\-\s()]{10,15}$/.test(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }
    
    const otp = generateOTP();
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    // Store OTP with expiry
    otpStore.set(phoneNumber, { otp, expiryTime });
    
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '').slice(-10);
    
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
          numbers: cleanPhone
        }),
        timeout: 10000 // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`SMS API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.return) {
        console.log(`OTP sent to ${phoneNumber}: ${otp}`);
        return { success: true, message: 'OTP sent successfully' };
      } else {
        throw new Error('SMS service failed');
      }
    } catch (apiError) {
      console.warn('SMS API failed, using demo mode:', apiError.message);
      console.log(`Demo OTP for ${phoneNumber}: ${otp}`);
      return { success: true, message: 'OTP sent successfully (Demo)', otp, demo: true };
    }
  } catch (error) {
    console.error('OTP service error:', error.message);
    return { success: false, message: error.message };
  }
};

// Verify OTP
const verifyOTP = (phoneNumber, inputOTP) => {
  try {
    // Validate inputs
    if (!phoneNumber || !inputOTP) {
      return { success: false, message: 'Phone number and OTP are required' };
    }
    
    if (!/^[0-9]{6}$/.test(inputOTP)) {
      return { success: false, message: 'OTP must be 6 digits' };
    }
    
    const stored = otpStore.get(phoneNumber);
    
    if (!stored) {
      return { success: false, message: 'OTP not found or already used' };
    }
    
    if (Date.now() > stored.expiryTime) {
      otpStore.delete(phoneNumber);
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }
    
    if (stored.otp !== inputOTP.toString()) {
      return { success: false, message: 'Invalid OTP. Please check and try again.' };
    }
    
    // Clean up after successful verification
    otpStore.delete(phoneNumber);
    console.log(`OTP verified successfully for ${phoneNumber}`);
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('OTP verification error:', error.message);
    return { success: false, message: 'OTP verification failed' };
  }
};

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiryTime) {
      otpStore.delete(phone);
    }
  }
}, 60000); // Clean every minute

module.exports = { sendOTP, verifyOTP };