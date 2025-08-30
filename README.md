# 🏦 Know Your Credit - Comprehensive Credit Management Platform

A full-stack web application for credit score management, loan applications, and comprehensive financial guidance with AI-powered assistance.

![Know Your Credit](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 📊 Credit Score Management
- **Multi-Bureau Credit Scores**: View scores from CIBIL, Experian, Equifax, and CRIF
- **Animated Speedometer Gauges**: Interactive visual representation of credit scores
- **Credit History Tracking**: 4-week trend analysis with detailed breakdown
- **Personalized Score Generation**: Dynamic scoring based on user profile
- **Score Improvement Tips**: Actionable advice for credit enhancement

### 💰 Loan Management System
- **Recommended Loans**: Personalized loan suggestions based on credit score
- **Multiple Loan Types**: Personal, Home, Car, and Business loans
- **Loan Application Flow**: Complete application process with autofill
- **Application Tracking**: Real-time status updates and notifications
- **Risk Assessment**: AI-powered loan eligibility and risk analysis
- **EMI Calculator**: Built-in calculator for loan planning

### 🤖 AI-Powered Financial Assistant
- **Comprehensive Finance Knowledge**: Covers all financial topics
- **Gemini AI Integration**: Advanced AI responses for complex queries
- **Smart Fallback System**: Detailed responses even without AI
- **Personalized Advice**: Context-aware recommendations
- **24/7 Availability**: Always available financial guidance

### 👤 User Management
- **Complete Profile System**: Personal, employment, and banking details
- **Multi-Bank Support**: Add multiple bank accounts
- **Profile Validation**: Comprehensive form validation
- **Secure Authentication**: JWT-based authentication system
- **Admin Dashboard**: Employee management and user oversight

### 📱 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Modern Components**: Built with Radix UI and Tailwind CSS
- **Smooth Animations**: Framer Motion animations
- **Interactive Charts**: Recharts for data visualization
- **Professional Theme**: Blue-themed professional interface

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Animation library
- **Recharts** - Chart library for data visualization
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.18.0** - MongoDB object modeling
- **Google Generative AI** - AI integration for chatbot
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **Vite** - Build tool and dev server

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/know-your-credit.git
cd know-your-credit
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../Frontend
npm install
```

4. **Environment Setup**

Create `.env` file in `server` directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/know-your-credit
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Create `.env` file in `Frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:3001
```

5. **Start the Application**

Backend:
```bash
cd server
npm run dev
```

Frontend (in new terminal):
```bash
cd Frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📁 Project Structure

```
Know_Your_Credit/
├── Frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Base UI components (Radix UI)
│   │   │   ├── AnimatedSpeedometer.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   └── modals/     # Modal components
│   │   ├── pages/          # Page components
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js backend
│   ├── models/             # MongoDB models
│   │   ├── Employee.js
│   │   ├── LoanApplication.js
│   │   └── Notification.js
│   ├── routes/             # API routes
│   │   ├── chat.js         # AI chatbot endpoints
│   │   ├── employees.js    # Employee management
│   │   ├── bureau.js       # Credit bureau APIs
│   │   └── otp.js          # OTP verification
│   ├── services/           # Business logic services
│   │   ├── bureauService.js
│   │   ├── emailService.js
│   │   └── otpService.js
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-otp` - OTP verification

### User Management
- `GET /users` - Get all users (admin)
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /search-users` - Search users

### Loan Applications
- `POST /loan-applications` - Submit loan application
- `GET /loan-applications/:userId` - Get user's applications
- `DELETE /loan-applications/:id` - Remove application

### AI Chat
- `POST /api/chat` - Send message to AI assistant

### Notifications
- `GET /notifications/:userId` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read

## 🎯 Key Features Explained

### Credit Score System
- **Dynamic Generation**: Scores generated based on user profile (income, occupation, name seed)
- **Multi-Bureau Display**: Shows scores from 4 major credit bureaus
- **Historical Tracking**: 4-week trend with detailed change explanations
- **Visual Representation**: Animated speedometer gauges with color coding

### Loan Application Flow
1. **Profile Completion**: Users must complete profile before applying
2. **Loan Selection**: Choose from recommended loans based on credit score
3. **Auto-fill Application**: Profile data automatically populates forms
4. **Application Preview**: Review before submission
5. **Status Tracking**: Real-time updates and notifications
6. **Receipt Generation**: Printable application receipts

### AI Financial Assistant
- **Comprehensive Knowledge**: Covers credit, loans, investments, insurance, tax planning
- **Indian Financial Context**: Specific to Indian banking and regulations
- **Personalized Responses**: Uses user's credit score and profile
- **Fallback System**: Smart responses even when AI is unavailable
- **Multi-topic Support**: Handles all finance-related queries

### Admin Dashboard
- **User Management**: View, edit, and manage all users
- **Application Oversight**: Monitor all loan applications
- **Search Functionality**: Find users and applications quickly
- **Analytics**: User signup trends and statistics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation
- **Environment Variables**: Sensitive data protection
- **CORS Configuration**: Secure cross-origin requests
- **Data Sanitization**: Protection against injection attacks

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop Enhanced**: Full desktop functionality
- **Cross-Browser**: Compatible with all modern browsers

## 🎨 UI/UX Features

- **Professional Theme**: Blue-based color scheme
- **Smooth Animations**: Framer Motion powered
- **Interactive Elements**: Hover effects and transitions
- **Accessibility**: ARIA compliant components
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend Deployment (Railway/Heroku)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy using platform-specific instructions

### Environment Variables for Production
```env
# Backend
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
GEMINI_API_KEY=your_production_gemini_key
JWT_SECRET=your_strong_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_app_password

# Frontend
VITE_BACKEND_URL=https://your-backend-domain.com
```

## 🧪 Testing

### Frontend Testing
```bash
cd Frontend
npm run lint
```

### Backend Testing
```bash
cd server
npm test
```

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized assets
- **Bundle Analysis**: Vite bundle optimization
- **Caching**: Proper HTTP caching headers
- **Database Indexing**: MongoDB performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: React, UI/UX Design
- **Backend Developer**: Node.js, API Development
- **AI Integration**: Gemini AI Implementation
- **Database Design**: MongoDB Schema Design

## 🔄 Version History

- **v1.0.0** - Initial release with full feature set
- **v0.9.0** - Beta release with core features
- **v0.8.0** - Alpha release with basic functionality

## 🎯 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with more credit bureaus
- [ ] Blockchain-based credit verification
- [ ] Machine learning credit predictions
- [ ] Multi-language support
- [ ] Advanced financial planning tools

---
