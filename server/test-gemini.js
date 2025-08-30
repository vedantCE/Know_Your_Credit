// Test Gemini API from server directory
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("What is credit history?");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Gemini API is working');
    console.log('Response:', text);
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

testGemini();