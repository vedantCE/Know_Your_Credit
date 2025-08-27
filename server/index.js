const express=require("express");
const mongoose=require('mongoose');
const cors=require("cors");
const EmployeeModel=require('./models/Employee');
const LoanApplicationModel=require('./models/LoanApplication');
const NotificationModel=require('./models/Notification');
const bureauRoutes=require('./routes/bureau');
const mockBureauAPIs=require('./services/mockBureauAPIs');
const employeeRoutes=require('./routes/employees');

const MONGO_URI="mongodb+srv://vedantbhattce28:3yhEkDTd5S8fKFAs@cluster1.dbi1j2u.mongodb.net/kycDB?retryWrites=true&w=majority"

const app=express();
app.use(express.json());
app.use(cors());
app.use('/api/bureau', bureauRoutes);
app.use('/api/mock-bureau', require('./routes/mockBureau'));
app.use('/api/employees', employeeRoutes);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Atlas Connected Successfully'))
  .catch(err => console.error('Connection Error:', err.message));

  
app.post('/register',(req,res)=>{
   // Clean and validate data
   const userData = {
      ...req.body,
      panNumber: req.body.panNumber?.toUpperCase(),
      creditCardNumber: req.body.creditCardNumber?.replace(/\s/g, '')
   };
   
   EmployeeModel.create(userData)
   .then(user=>res.json({
      status: "Success",
      message: "User registered successfully",
      user: {
         id: user._id,
         email: user.email,
         username: user.username,
         firstName: user.firstName,
         lastName: user.lastName,
         panNumber: user.panNumber,
         aadhaarNumber: user.aadhaarNumber,
         phoneNumber: user.phoneNumber,
         address: user.address,
         dateOfBirth: user.dateOfBirth,
         occupation: user.occupation,
         annualIncome: user.annualIncome,
         creditCardNumber: user.creditCardNumber ? `****-****-****-${user.creditCardNumber.slice(-4)}` : null,
         creditScore: user.creditScore,
         riskLevel: user.riskLevel,
         role: user.role,
         status: user.status,
         signupTimestamp: user.signupTimestamp
      }
   }))
   .catch(err=>{
      if(err.code === 11000) {
         res.json({status: "Error", message: "Email already exists"})
      } else if(err.name === 'ValidationError') {
         res.json({status: "Error", message: err.message})
      } else {
         res.json({status: "Error", message: "Registration failed"})
      }
   })
})

app.post('/login',(req,res)=>{
   const {email, password} = req.body;
   EmployeeModel.findOne({email: email})
   .then(user => {
      if(user) {
         // Check if user is suspended
         if(user.status === 'Suspended' && user.suspendedUntil) {
            const now = new Date();
            const suspendedUntil = new Date(user.suspendedUntil);
            
            if(now < suspendedUntil) {
               const timeLeft = suspendedUntil - now;
               const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
               const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
               
               return res.json({
                  status: "Error", 
                  message: `Your account is suspended. You can login again in ${hoursLeft} hours and ${minutesLeft} minutes.`
               });
            } else {
               // Suspension expired, reactivate user
               user.status = 'Active';
               user.suspendedUntil = null;
               user.save();
            }
         }
         
         if(user.password === password) {
            res.json({
               status: "Success",
               user: {
                  id: user._id,
                  email: user.email,
                  username: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  panNumber: user.panNumber,
                  aadhaarNumber: user.aadhaarNumber,
                  phoneNumber: user.phoneNumber,
                  address: user.address,
                  dateOfBirth: user.dateOfBirth,
                  occupation: user.occupation,
                  annualIncome: user.annualIncome,
                  creditScore: user.creditScore,
                  riskLevel: user.riskLevel,
                  role: user.role,
                  status: user.status
               }
            })
         } else {
            res.json({status: "Error", message: "Password is incorrect"})
         }
      } else {
         res.json({status: "Error", message: "No record existed"})
      }
   })
   .catch(err => res.json({status: "Error", message: "Server error"}))
})

// Get all users (Admin only)
app.get('/users', async (req, res) => {
   try {
      const users = await EmployeeModel.find({}, '-password');
      
      // Get loan counts for each user
      const usersWithLoanCounts = await Promise.all(users.map(async (user) => {
         const loanCount = await LoanApplicationModel.countDocuments({ userId: user._id });
         
         return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phoneNumber || 'N/A',
            aadhaar: user.aadhaarNumber ? `XXXX-XXXX-${user.aadhaarNumber.slice(-4)}` : 'N/A',
            pan: user.panNumber ? `${user.panNumber.slice(0,5)}XXXX${user.panNumber.slice(-1)}` : 'N/A',
            creditCard: user.creditCardNumber ? `****-****-****-${user.creditCardNumber.slice(-4)}` : 'N/A',
            creditScore: user.creditScore,
            riskLevel: user.riskLevel,
            joinDate: user.signupTimestamp,
            status: user.status,
            role: user.role,
            city: user.address ? user.address.split(',').pop().trim() : 'N/A',
            totalLoans: loanCount
         };
      }));
      
      res.json({status: "Success", users: usersWithLoanCounts});
   } catch (err) {
      res.json({status: "Error", message: "Failed to fetch users"});
   }
})

// Search users by name, aadhaar, PAN, or credit card (Bank access)
app.post('/search-users', (req, res) => {
   const { query } = req.body;
   const searchRegex = new RegExp(query, 'i');
   const cleanQuery = query.replace(/\s/g, '');
   
   // Static data for demo
   const staticUsers = [
      {
         id: 'static1',
         name: 'Rajesh Kumar',
         email: 'rajesh@example.com',
         phone: '+91 9876543210',
         aadhaar: '123456789012',
         pan: 'ABCDE1234F',
         creditScore: 742,
         riskLevel: 'Low',
         status: 'Active',
         role: 'user',
         address: '123 MG Road, Mumbai, Maharashtra 400001',
         occupation: 'Software Engineer',
         annualIncome: '₹12,00,000'
      },
      {
         id: 'static2',
         name: 'Priya Sharma',
         email: 'priya@example.com',
         phone: '+91 9876543211',
         aadhaar: '234567890123',
         pan: 'FGHIJ5678K',
         creditScore: 785,
         riskLevel: 'Low',
         status: 'Active',
         role: 'user',
         address: '456 Park Street, Delhi, Delhi 110001',
         occupation: 'Marketing Manager',
         annualIncome: '₹15,00,000'
      }
   ];
   
   // Search in static data
   const staticMatches = staticUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.aadhaar === cleanQuery ||
      user.pan === query.toUpperCase()
   );
   
   // Search in database
   EmployeeModel.find({
      $or: [
         { firstName: searchRegex },
         { lastName: searchRegex },
         { aadhaarNumber: cleanQuery },
         { panNumber: query.toUpperCase() },
         { creditCardNumber: cleanQuery }
      ]
   }, '-password')
   .then(users => {
      const formattedUsers = users.map(user => ({
         id: user._id,
         name: `${user.firstName} ${user.lastName}`,
         email: user.email,
         phone: user.phoneNumber || 'N/A',
         aadhaar: user.aadhaarNumber || 'N/A',
         pan: user.panNumber || 'N/A',
         creditScore: user.creditScore,
         riskLevel: user.riskLevel,
         status: user.status,
         role: user.role,
         address: user.address || 'N/A',
         occupation: user.occupation || 'N/A',
         annualIncome: user.annualIncome || 'N/A'
      }));
      
      // Combine static and dynamic results
      const allUsers = [...staticMatches, ...formattedUsers];
      res.json({status: "Success", users: allUsers})
   })
   .catch(err => res.json({status: "Error", message: "Search failed"}))
})

// Update user (Admin only)
app.put('/users/:id', (req, res) => {
   const { id } = req.params;
   const updateData = req.body;
   
   EmployeeModel.findByIdAndUpdate(id, updateData, { new: true })
   .then(user => {
      if (user) {
         res.json({
            status: "Success",
            message: "User updated successfully",
            user: {
               id: user._id,
               name: `${user.firstName} ${user.lastName}`,
               email: user.email,
               phone: user.phoneNumber,
               creditScore: user.creditScore,
               riskLevel: user.riskLevel,
               status: user.status
            }
         })
      } else {
         res.json({status: "Error", message: "User not found"})
      }
   })
   .catch(err => res.json({status: "Error", message: "Update failed"}))
})

// Delete user (Admin only)
app.delete('/users/:id', (req, res) => {
   const { id } = req.params;
   
   EmployeeModel.findByIdAndDelete(id)
   .then(user => {
      if (user) {
         res.json({status: "Success", message: "User deleted successfully"})
      } else {
         res.json({status: "Error", message: "User not found"})
      }
   })
   .catch(err => res.json({status: "Error", message: "Delete failed"}))
})

// Get signup logs (Admin only)
app.get('/signup-logs', (req, res) => {
   EmployeeModel.find({}, 'firstName lastName email role status signupTimestamp')
   .sort({ signupTimestamp: -1 })
   .limit(50)
   .then(logs => {
      const formattedLogs = logs.map(log => ({
         id: log._id,
         name: `${log.firstName} ${log.lastName}`,
         email: log.email,
         role: log.role,
         status: log.status,
         timestamp: log.signupTimestamp
      }));
      res.json({status: "Success", logs: formattedLogs})
   })
   .catch(err => res.json({status: "Error", message: "Failed to fetch logs"}))
})

// Submit loan application
app.post('/loan-applications', async (req, res) => {
   try {
      const applicationData = {
         ...req.body,
         pan: req.body.pan?.toUpperCase(),
         creditCardNumber: req.body.creditCardNumber?.replace(/\s/g, '')
      };
      const applicationId = 'LA' + Math.floor(Math.random() * 900000 + 100000);
      
      const loanApplication = new LoanApplicationModel({
         ...applicationData,
         applicationId
      });
      
      const savedApplication = await loanApplication.save();
      
      // Create notification
      await NotificationModel.create({
         userId: applicationData.userId,
         title: 'Loan Application Submitted',
         message: `Your loan application for ₹${Number(applicationData.requestedAmount).toLocaleString('en-IN')} has been submitted and is pending review.`,
         type: 'application',
         applicationId
      });
      
      res.json({
         status: 'Success',
         message: 'Loan application submitted successfully',
         application: savedApplication
      });
   } catch (error) {
      if(error.name === 'ValidationError') {
         res.json({status: 'Error', message: error.message});
      } else {
         res.json({status: 'Error', message: 'Failed to submit application'});
      }
   }
});

// Get user's loan applications
app.get('/loan-applications/:userId', async (req, res) => {
   try {
      const { userId } = req.params;
      const applications = await LoanApplicationModel.find({ userId }).sort({ submittedAt: -1 });
      res.json({status: 'Success', applications});
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to fetch applications'});
   }
});

// Get all loan applications (Bank view)
app.get('/all-loan-applications', async (req, res) => {
   try {
      const applications = await LoanApplicationModel.find().populate('userId', 'firstName lastName email').sort({ submittedAt: -1 });
      res.json({status: 'Success', applications});
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to fetch applications'});
   }
});

// Update loan application status (Bank action)
app.put('/loan-applications/:id/status', async (req, res) => {
   try {
      const { id } = req.params;
      const { status, reviewedBy, rejectionReason } = req.body;
      
      const application = await LoanApplicationModel.findByIdAndUpdate(
         id,
         {
            status,
            reviewedAt: new Date(),
            reviewedBy,
            ...(rejectionReason && { rejectionReason })
         },
         { new: true }
      );
      
      if (application) {
         // Create notification
         const notificationData = {
            userId: application.userId,
            applicationId: application.applicationId,
            type: status === 'Approved' ? 'approval' : 'rejection'
         };
         
         if (status === 'Approved') {
            notificationData.title = 'Loan Application Approved';
            notificationData.message = `Congratulations! Your loan application for ₹${Number(application.requestedAmount).toLocaleString('en-IN')} has been approved.`;
         } else {
            notificationData.title = 'Loan Application Rejected';
            notificationData.message = `We're sorry, your loan application for ₹${Number(application.requestedAmount).toLocaleString('en-IN')} has been rejected.${rejectionReason ? ' Reason: ' + rejectionReason : ''}`;
         }
         
         await NotificationModel.create(notificationData);
         
         res.json({status: 'Success', message: 'Application status updated', application});
      } else {
         res.json({status: 'Error', message: 'Application not found'});
      }
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to update application'});
   }
});

// Get user notifications
app.get('/notifications/:userId', async (req, res) => {
   try {
      const { userId } = req.params;
      const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
      res.json({status: 'Success', notifications});
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to fetch notifications'});
   }
});

// Mark notification as read
app.put('/notifications/:id/read', async (req, res) => {
   try {
      const { id } = req.params;
      await NotificationModel.findByIdAndUpdate(id, { read: true });
      res.json({status: 'Success', message: 'Notification marked as read'});
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to update notification'});
   }
});

// Mark all notifications as read
app.put('/notifications/:userId/read-all', async (req, res) => {
   try {
      const { userId } = req.params;
      await NotificationModel.updateMany({ userId }, { read: true });
      res.json({status: 'Success', message: 'All notifications marked as read'});
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to update notifications'});
   }
});

// Get user credit score
app.get('/users/:userId/credit-score', async (req, res) => {
   try {
      const { userId } = req.params;
      const user = await EmployeeModel.findById(userId, 'creditScore');
      if (user) {
         res.json({status: 'Success', creditScore: user.creditScore});
      } else {
         res.json({status: 'Error', message: 'User not found'});
      }
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to fetch credit score'});
   }
});

// Delete loan application
app.delete('/loan-applications/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const application = await LoanApplicationModel.findByIdAndDelete(id);
      if (application) {
         // Create notification about removal
         await NotificationModel.create({
            userId: application.userId,
            title: 'Loan Application Removed',
            message: `Your loan application for ₹${Number(application.requestedAmount).toLocaleString('en-IN')} has been removed. Reason: ${reason}`,
            type: 'removal',
            applicationId: application.applicationId
         });
         
         res.json({status: 'Success', message: 'Application removed successfully'});
      } else {
         res.json({status: 'Error', message: 'Application not found'});
      }
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to remove application'});
   }
});

// Remove user completely
app.delete('/users/:id', async (req, res) => {
   try {
      const { id } = req.params;
      
      // Delete user's loan applications
      await LoanApplicationModel.deleteMany({ userId: id });
      
      // Delete user's notifications
      await NotificationModel.deleteMany({ userId: id });
      
      // Delete user
      const user = await EmployeeModel.findByIdAndDelete(id);
      
      if (user) {
         res.json({status: 'Success', message: 'User removed completely'});
      } else {
         res.json({status: 'Error', message: 'User not found'});
      }
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to remove user'});
   }
});

// Suspend user for 24 hours
app.put('/users/:id/suspend', async (req, res) => {
   try {
      const { id } = req.params;
      const suspendUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      
      const user = await EmployeeModel.findByIdAndUpdate(id, {
         status: 'Suspended',
         suspendedUntil: suspendUntil
      }, { new: true });
      
      if (user) {
         // Create notification
         await NotificationModel.create({
            userId: id,
            title: 'Account Suspended',
            message: `Your account has been suspended for 24 hours. You can login again after ${suspendUntil.toLocaleString()}.`,
            type: 'suspension'
         });
         
         res.json({status: 'Success', message: 'User suspended for 24 hours', suspendUntil});
      } else {
         res.json({status: 'Error', message: 'User not found'});
      }
   } catch (error) {
      res.json({status: 'Error', message: 'Failed to suspend user'});
   }
});

// Send OTP via SMS
app.post('/send-otp', async (req, res) => {
   try {
      const { phoneNumber, otp } = req.body;
      
      // Using Fast2SMS API (works for Indian numbers)
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
         method: 'POST',
         headers: {
            'authorization': 'YOUR_FAST2SMS_API_KEY',
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
         console.log(`OTP ${otp} sent to ${phoneNumber}`);
         res.json({
            success: true,
            message: 'OTP sent successfully'
         });
      } else {
         throw new Error('SMS service failed');
      }
   } catch (error) {
      console.log(`Demo Mode: OTP ${req.body.otp} for ${req.body.phoneNumber}`);
      res.json({
         success: true,
         message: 'OTP sent successfully (Demo Mode)',
         demo: true,
         otp: req.body.otp
      });
   }
});

app.listen(3001,()=>{
    console.log("server is running")
})
