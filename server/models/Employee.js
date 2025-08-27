const mongoose=require('mongoose')
const bureauService = require('../services/bureauService')

const EmployeeSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    panNumber:{
        type:String,
        required:true,
        validate: {
            validator: function(v) {
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: 'Invalid PAN format'
        }
    },
    aadhaarNumber:{
        type:String,
        required:false,
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{12}$/.test(v);
            },
            message: 'Invalid Aadhaar format'
        }
    },
    creditCardNumber:{
        type:String,
        required:false,
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{16}$/.test(v.replace(/\s/g, ''));
            },
            message: 'Invalid credit card format'
        }
    },
    phoneNumber:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    dateOfBirth:{
        type:Date,
        required:false
    },
    occupation:{
        type:String,
        required:false
    },
    annualIncome:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['user','bank','admin']
    },
    creditScore:{
        type:Number,
        default: function() {
            // Generate score based on profile during creation
            let score = 300;
            const income = parseInt(this.annualIncome?.replace(/[^0-9]/g, '') || '0');
            if (income > 1000000) score += 200;
            else if (income > 500000) score += 150;
            else if (income > 300000) score += 100;
            else score += 50;
            
            const occupation = this.occupation?.toLowerCase() || '';
            if (occupation.includes('engineer') || occupation.includes('manager')) score += 150;
            else if (occupation.includes('teacher') || occupation.includes('analyst')) score += 100;
            else score += 70;
            
            const nameSeed = (this.firstName + this.lastName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            score += (nameSeed % 51);
            
            return Math.min(850, Math.max(600, score));
        }
    },
    bureauData:{
        type: Object,
        default: {}
    },
    cachedCreditScore:{
        type: Number,
        default: 0
    },
    lastScoreUpdate:{
        type: Date,
        default: Date.now
    },
    riskLevel:{
        type:String,
        default: function() {
            const score = this.creditScore || 700;
            if (score >= 750) return 'Low';
            if (score >= 650) return 'Medium';
            return 'High';
        }
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','Suspended','Pending']
    },
    suspendedUntil:{
        type:Date,
        default:null
    },
    signupTimestamp:{
        type:Date,
        default:Date.now
    }
}, {
    timestamps: true
})

// Pre-save middleware to generate credit score before saving
EmployeeSchema.pre('save', function(next) {
    if (this.isNew && (!this.creditScore || this.creditScore === 0)) {
        // Generate credit score based on user profile
        let score = 300; // Base score
        
        // Income factor (0-200 points)
        const income = parseInt(this.annualIncome?.replace(/[^0-9]/g, '') || '0');
        if (income > 1500000) score += 200;
        else if (income > 1000000) score += 170;
        else if (income > 700000) score += 140;
        else if (income > 500000) score += 110;
        else if (income > 300000) score += 80;
        else if (income > 200000) score += 50;
        else score += 30;
        
        // Age factor (0-100 points)
        if (this.dateOfBirth) {
            const age = new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
            if (age >= 25 && age <= 45) score += 100;
            else if (age >= 21 && age <= 55) score += 80;
            else if (age >= 18 && age <= 65) score += 60;
            else score += 40;
        } else {
            score += 60;
        }
        
        // Occupation factor (0-150 points)
        const occupation = this.occupation?.toLowerCase() || '';
        if (occupation.includes('engineer') || occupation.includes('doctor') || occupation.includes('manager')) score += 150;
        else if (occupation.includes('teacher') || occupation.includes('analyst') || occupation.includes('consultant')) score += 120;
        else if (occupation.includes('executive') || occupation.includes('officer')) score += 100;
        else if (occupation.includes('business') || occupation.includes('entrepreneur')) score += 80;
        else if (occupation.includes('student') || occupation.includes('intern')) score += 60;
        else score += 70;
        
        // Name-based seed for consistency (0-50 points)
        const nameSeed = (this.firstName + this.lastName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        score += (nameSeed % 51);
        
        // Ensure score is within realistic bounds
        this.creditScore = Math.min(850, Math.max(600, score));
        this.cachedCreditScore = this.creditScore;
        this.lastScoreUpdate = new Date();
    }
    next();
});

// Pre-save middleware to set risk level based on credit score
EmployeeSchema.pre('save', function(next) {
    if (this.creditScore) {
        if (this.creditScore >= 750) {
            this.riskLevel = 'Low';
        } else if (this.creditScore >= 650) {
            this.riskLevel = 'Medium';
        } else {
            this.riskLevel = 'High';
        }
    }
    next();
});

const EmployeeModel=mongoose.model("employees",EmployeeSchema)
module.exports=EmployeeModel
