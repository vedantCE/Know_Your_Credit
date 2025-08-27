const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: false
    },
    pan: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: 'Invalid PAN format'
        }
    },
    aadhaar: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{12}$/.test(v);
            },
            message: 'Invalid Aadhaar format'
        }
    },
    creditCardNumber: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{16}$/.test(v.replace(/\s/g, ''));
            },
            message: 'Invalid credit card format'
        }
    },
    address: {
        type: String,
        required: false
    },
    employmentType: {
        type: String,
        required: true
    },
    employerName: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: false
    },
    annualIncome: {
        type: String,
        required: true
    },
    requestedAmount: {
        type: String,
        required: true
    },
    tenureYears: {
        type: String,
        required: true
    },
    interestRate: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: false
    },
    loanType: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    applicationId: {
        type: String,
        unique: true,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees'
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

const LoanApplicationModel = mongoose.model('loanapplications', LoanApplicationSchema);
module.exports = LoanApplicationModel;