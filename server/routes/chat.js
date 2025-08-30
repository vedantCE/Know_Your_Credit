const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ Gemini AI initialized successfully');
} catch (error) {
  console.log('❌ Gemini AI initialization failed:', error.message);
}

// Smart fallback function
function getSmartFallback(message, userContext) {
  const userName = userContext?.name || 'there';
  const userScore = userContext?.creditScore || 'not available';
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('credit score') || lowerMessage.includes('score')) {
    return `Hi ${userName}! Your current credit score is ${userScore}. To improve it: pay bills on time, keep credit utilization below 30%, and maintain old accounts.`;
  } else if (lowerMessage.includes('loan') || lowerMessage.includes('apply')) {
    return `${userName}, for loan applications: complete your profile first, then check recommended loans in your dashboard. We have personal loans, home loans, and car loans based on your credit score.`;
  } else if (lowerMessage.includes('credit history')) {
    return 'Credit history is a record of your borrowing and repayment activities. It includes payment history, credit utilization, length of credit history, types of credit, and new credit inquiries. This information helps lenders assess your creditworthiness.';
  } else if (lowerMessage.includes('improve credit')) {
    return 'To improve your credit: 1) Pay all bills on time, 2) Keep credit utilization below 30%, 3) Don\'t close old credit accounts, 4) Limit new credit applications, 5) Check credit reports for errors regularly.';
  } else {
    return `Hello ${userName}! I'm your AI assistant for credit and loans. I can answer questions about credit scores, credit history, loan applications, and financial guidance. What would you like to know?`;
  }
}

// Chat endpoint with AI integration
router.post('/', async (req, res) => {
  console.log('Chat request received:', req.body);
  
  const { message, userContext } = req.body;
  const userName = userContext?.name || 'User';
  const userScore = userContext?.creditScore || 'not available';
  
  // Try Gemini AI first
  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const context = `You are a helpful AI assistant for a credit score and loan management platform. 
User Context: Name: ${userName}, Credit Score: ${userScore}
Provide helpful, accurate responses about credit, loans, and finance. Keep responses concise and friendly.

User question: ${message}`;
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(context);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini AI response received');
      
      return res.json({
        success: true,
        response: text,
        source: 'AI',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.log('❌ Gemini AI error:', error.message);
      // Fall through to smart fallback
    }
  }
  
  // Use smart fallback
  const fallbackResponse = getSmartFallback(message, userContext);
  console.log('📝 Using smart fallback response');
  
  res.json({
    success: true,
    response: fallbackResponse,
    source: 'Fallback',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;