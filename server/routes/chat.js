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

// Enhanced fallback function with comprehensive finance knowledge
function getSmartFallback(message, userContext) {
  const userName = userContext?.name || 'there';
  const userScore = userContext?.creditScore || 'not available';
  const lowerMessage = message.toLowerCase();
  
  // Credit Score related
  if (lowerMessage.includes('credit score') || lowerMessage.includes('cibil') || lowerMessage.includes('score')) {
    return `Hi ${userName}! Your current credit score is ${userScore}. Credit scores range from 300-850. A good score is 700+. To improve: pay bills on time (35% impact), keep utilization below 30% (30% impact), maintain credit history length (15% impact), diversify credit types (10% impact), and limit new inquiries (10% impact).`;
  }
  
  // Loan related
  else if (lowerMessage.includes('loan') || lowerMessage.includes('apply') || lowerMessage.includes('borrow')) {
    return `${userName}, for loans: Personal loans (10-24% interest), Home loans (8-12% interest), Car loans (9-15% interest), Business loans (12-20% interest). Your eligibility depends on credit score, income, and debt-to-income ratio. Complete your profile first for personalized recommendations.`;
  }
  
  // Credit Cards
  else if (lowerMessage.includes('credit card') || lowerMessage.includes('card')) {
    return 'Credit cards: Choose based on your spending habits. Rewards cards for good credit (700+), secured cards for building credit. Always pay full balance to avoid 24-48% APR. Keep utilization below 30% of limit.';
  }
  
  // Investment & Savings
  else if (lowerMessage.includes('invest') || lowerMessage.includes('mutual fund') || lowerMessage.includes('sip') || lowerMessage.includes('stock')) {
    return 'Investments: Start with emergency fund (6 months expenses). Then consider: SIP in diversified mutual funds (12-15% returns), PPF (7.1% tax-free), ELSS for tax saving, direct stocks for experienced investors. Diversify across asset classes.';
  }
  
  // Insurance
  else if (lowerMessage.includes('insurance') || lowerMessage.includes('policy')) {
    return 'Insurance essentials: Term life insurance (10-15x annual income), health insurance (minimum 5 lakhs), motor insurance (mandatory). Avoid ULIPs and endowment plans - invest and insure separately for better returns.';
  }
  
  // Tax Planning
  else if (lowerMessage.includes('tax') || lowerMessage.includes('80c') || lowerMessage.includes('deduction')) {
    return 'Tax saving: Section 80C (1.5L limit) - EPF, PPF, ELSS, NSC, tax-saver FDs. Section 80D for health insurance premiums. HRA exemption if paying rent. Plan investments early in financial year for better corpus building.';
  }
  
  // EMI & Debt
  else if (lowerMessage.includes('emi') || lowerMessage.includes('debt') || lowerMessage.includes('repay')) {
    return 'EMI management: Keep total EMIs below 40% of income. Pay high-interest debt first (credit cards, personal loans). Consider balance transfer for lower rates. Use EMI calculators to plan affordability before borrowing.';
  }
  
  // Banking
  else if (lowerMessage.includes('bank') || lowerMessage.includes('account') || lowerMessage.includes('fd') || lowerMessage.includes('deposit')) {
    return 'Banking: Maintain minimum balance to avoid charges. FDs give 5-7% returns. High-yield savings accounts offer better rates. Use digital banking for convenience. Keep separate accounts for different goals.';
  }
  
  // Financial Planning
  else if (lowerMessage.includes('financial plan') || lowerMessage.includes('budget') || lowerMessage.includes('money management')) {
    return 'Financial planning: Follow 50-30-20 rule (50% needs, 30% wants, 20% savings). Set SMART financial goals. Build emergency fund first. Automate investments. Review and rebalance portfolio annually.';
  }
  
  // Credit History & Reports
  else if (lowerMessage.includes('credit history') || lowerMessage.includes('credit report') || lowerMessage.includes('cibil report')) {
    return 'Credit history includes: Payment history (35%), credit utilization (30%), credit age (15%), credit mix (10%), new credit (10%). Check free annual reports from CIBIL, Experian, Equifax. Dispute errors immediately.';
  }
  
  // Interest Rates
  else if (lowerMessage.includes('interest') || lowerMessage.includes('rate') || lowerMessage.includes('apr')) {
    return 'Interest rates vary: Savings (3-4%), FDs (5-7%), Personal loans (10-24%), Home loans (8-12%), Credit cards (24-48% APR). Compare rates across lenders. Fixed vs floating rates depend on market outlook.';
  }
  
  // Default comprehensive response
  else {
    return `Hello ${userName}! I'm your comprehensive finance AI assistant. I can help with: Credit scores & reports, Loans (personal, home, car, business), Credit cards, Investments (mutual funds, stocks, SIP), Insurance, Tax planning, EMI calculations, Banking products, Financial planning, and Debt management. What specific topic interests you?`;
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
      const context = `You are an expert financial advisor and AI assistant for a comprehensive credit and finance platform called "Know Your Credit". 

User Context: 
- Name: ${userName}
- Credit Score: ${userScore}
- Platform: Credit score management and loan application system

Your expertise covers ALL financial topics including:
- Credit scores, credit reports, credit history, CIBIL scores
- All types of loans (personal, home, car, business, education)
- Credit cards, debit cards, banking products
- Investments (mutual funds, SIP, stocks, bonds, PPF, ELSS)
- Insurance (term, health, motor, life insurance)
- Tax planning and savings (80C, 80D, HRA, tax deductions)
- EMI calculations, debt management, financial planning
- Banking services, fixed deposits, savings accounts
- Financial literacy, budgeting, money management
- Indian financial regulations, RBI guidelines
- Interest rates, inflation, economic factors

Guidelines:
- Provide accurate, detailed, and actionable financial advice
- Use specific numbers, percentages, and examples when relevant
- Consider Indian financial context (INR, Indian banks, regulations)
- Be helpful for both beginners and experienced users
- If user's credit score is available, provide personalized recommendations
- Keep responses informative but conversational
- Always prioritize user's financial well-being

User question: ${message}`
      
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
