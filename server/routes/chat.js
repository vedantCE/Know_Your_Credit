const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
  console.log(' Gemini AI initialized');
} catch (error) {
  console.log(' Gemini AI failed:', error.message);
}

// Intelligent financial knowledge base
function getFinancialAnswer(message) {
  const lowerMessage = message.toLowerCase();
  
  // CIBIL related
  if (lowerMessage.includes('cibil')) {
    return "CIBIL (Credit Information Bureau India Limited) is India's first credit information company. It maintains credit records of individuals and companies. CIBIL score ranges from 300-900, with 750+ considered excellent. It tracks your credit history, payment behavior, and creditworthiness for banks and lenders.";
  }
  
  // Context-aware credit score responses
  if (lowerMessage.includes('improve') && lowerMessage.includes('credit score')) {
    if (lowerMessage.includes('neighbor') || lowerMessage.includes('someone else') || lowerMessage.includes('other person')) {
      return "You cannot directly improve someone else's credit score as credit reports are personal and confidential. However, you can help by: 1) Educating them about credit basics, 2) Suggesting they check their credit report for errors, 3) Advising them to pay bills on time, 4) Recommending they keep credit utilization low, 5) Suggesting they don't close old credit accounts. Each person must manage their own credit responsibly.";
    }
    return "To improve YOUR credit score: 1) Pay all bills on time (35% impact), 2) Keep credit utilization below 30% (30% impact), 3) Don't close old credit accounts (15% impact), 4) Mix different types of credit (10% impact), 5) Limit new credit inquiries (10% impact). Monitor your CIBIL report regularly and dispute any errors.";
  }
  
  if (lowerMessage.includes('credit score')) {
    return "Credit score is a 3-digit number (300-850) that represents your creditworthiness. Factors: Payment history (35%), Credit utilization (30%), Credit history length (15%), Credit mix (10%), New credit (10%). Higher scores get better loan rates and credit card approvals.";
  }
  
  if (lowerMessage.includes('what is credit')) {
    return "Credit is the ability to borrow money or access goods/services with the promise to pay later. It includes credit cards, loans, mortgages, and lines of credit. Your creditworthiness is measured by your credit score and credit history.";
  }
  
  // Investment related
  if (lowerMessage.includes('sip')) {
    return "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds. Benefits: Rupee cost averaging, disciplined investing, power of compounding. Start with ₹1000-5000 monthly in diversified equity funds for long-term wealth creation.";
  }
  
  if (lowerMessage.includes('mutual fund')) {
    return "Mutual funds pool money from many investors to buy stocks, bonds, or other securities. Types: Equity (high risk, high return), Debt (low risk, stable return), Hybrid (balanced). Professional fund managers handle investments. Great for beginners and diversification.";
  }
  
  // Loan related
  if (lowerMessage.includes('personal loan')) {
    return "Personal loans are unsecured loans for any purpose. Interest rates: 10-24% based on credit score. Tenure: 1-7 years. No collateral needed. Use for emergencies, debt consolidation, or major expenses. Higher credit scores get lower rates.";
  }
  
  if (lowerMessage.includes('home loan')) {
    return "Home loans help buy property. Interest rates: 8-12% (current). Tenure: up to 30 years. Loan amount: up to 80-90% of property value. Tax benefits under Section 80C (principal) and 24(b) (interest). EMI depends on loan amount, rate, and tenure.";
  }
  
  // Insurance related
  if (lowerMessage.includes('insurance')) {
    return "Insurance protects against financial losses. Types: Life insurance (term, whole life), Health insurance (medical expenses), Motor insurance (vehicle protection). Term insurance: 10-15x annual income coverage recommended. Health insurance: minimum ₹5 lakh coverage.";
  }
  
  // Tax related
  if (lowerMessage.includes('tax') || lowerMessage.includes('80c')) {
    return "Tax planning reduces tax liability legally. Section 80C: ₹1.5 lakh deduction (EPF, PPF, ELSS, life insurance). Section 80D: Health insurance premiums. HRA: House rent allowance exemption. Plan early in financial year for maximum benefits.";
  }
  
  // Banking related
  if (lowerMessage.includes('fixed deposit') || lowerMessage.includes('fd')) {
    return "Fixed Deposits (FD) are safe investments with guaranteed returns. Current rates: 5-7% annually. Tenure: 7 days to 10 years. Interest taxable as per income slab. Good for capital protection but returns may not beat inflation. Consider for emergency funds.";
  }
  
  // EMI related
  if (lowerMessage.includes('emi')) {
    return "EMI (Equated Monthly Installment) is fixed monthly payment for loans. Formula: [P x R x (1+R)^N] / [(1+R)^N-1]. Keep total EMIs below 40% of income. Higher down payment reduces EMI. Prepayment reduces total interest burden.";
  }
  
  // General finance
  if (lowerMessage.includes('finance')) {
    return "Finance is the management of money involving activities like investing, borrowing, lending, budgeting, saving, and forecasting. It includes personal finance (individual money management), corporate finance (business funding), and public finance (government revenue/expenditure).";
  }
  
  // Handle non-financial or unclear questions
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your KYC AI Assistant, specialized in financial guidance. I can help you with credit scores, loans, investments, insurance, tax planning, and all financial matters. What financial question can I help you with today?";
  }
  
  // Default response for unclear queries
  return "I'm your financial AI assistant. I can help with specific financial topics like credit scores, loans, investments, insurance, tax planning, and banking. Could you please ask a more specific financial question so I can provide you with detailed and accurate information?";
}

// Chat endpoint
router.post('/', async (req, res) => {
  const { message } = req.body;
  
  console.log('Question received:', message);
  
  // Try Gemini AI first
  if (genAI) {
    try {
      console.log('Trying Gemini AI...');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`You are a financial expert AI assistant. Answer this question accurately and contextually: "${message}". If it's about helping someone else with their finances, explain what's possible and what isn't. Be helpful and specific.`);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini AI success');
      return res.json({
        success: true,
        response: text,
        source: 'KYC AI',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.log('Gemini error:', error.message);
    }
  }
  
  // Use comprehensive knowledge base
  const answer = getFinancialAnswer(message);
  console.log('Using knowledge base');
  
  res.json({
    success: true,
    response: answer,
    source: 'KYC Assistant',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;