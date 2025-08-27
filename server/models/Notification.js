const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['application', 'approval', 'rejection', 'score', 'payment', 'offer'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    applicationId: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const NotificationModel = mongoose.model('notifications', NotificationSchema);
module.exports = NotificationModel;