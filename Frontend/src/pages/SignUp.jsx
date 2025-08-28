import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Eye, EyeOff, CheckCircle, XCircle, Lock, User, Mail, Phone, MapPin, Briefcase, CreditCard, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    occupation: "",
    annualIncome: "",
    panNumber: "",
    aadhaarNumber: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password strength validation
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  // OTP Timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phoneNumber':
        if (!/^[+]?[0-9\s-()]{10,15}$/.test(value)) {
          errors.phoneNumber = 'Please enter a valid phone number';
        } else {
          delete errors.phoneNumber;
        }
        break;
      case 'panNumber':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          errors.panNumber = 'PAN format: ABCDE1234F';
        } else {
          delete errors.panNumber;
        }
        break;
      case 'aadhaarNumber':
        const cleanAadhaar = value.replace(/\s/g, '');
        if (!/^[0-9]{12}$/.test(cleanAadhaar)) {
          errors.aadhaarNumber = 'Aadhaar must be 12 digits';
        } else {
          delete errors.aadhaarNumber;
        }
        break;
      case 'password':
        if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
      default:
        if (!value.trim()) {
          errors[name] = 'This field is required';
        } else {
          delete errors[name];
        }
    }
    
    setValidationErrors(errors);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = async () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtpTimer(30);
    setCanResendOtp(false);
    
    try {
      const response = await fetch('http://localhost:3001/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          otp: newOtp
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "OTP Sent",
          description: data.demo ? `Demo Mode: OTP is ${data.otp}` : `Verification code sent to ${formData.phoneNumber}`,
          className: "bg-green-500 text-white border-green-500"
        });
        if (data.demo) {
          console.log(`Demo OTP for ${formData.phoneNumber}: ${data.otp}`);
        }
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast({
        title: "SMS Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
      console.error('SMS Error:', error);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setShowOtpModal(false);
      proceedWithRegistration();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct verification code",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    const requiredFields = ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'dateOfBirth', 'address', 'occupation', 'annualIncome', 'panNumber', 'aadhaarNumber', 'password'];
    const errors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    // Show OTP modal instead of direct registration
    setShowOtpModal(true);
    sendOtp();
  };

  const proceedWithRegistration = async () => {
    setIsLoading(true);

    try {
      const data = await api.register({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        panNumber: formData.panNumber.toUpperCase(),
        aadhaarNumber: formData.aadhaarNumber.replace(/\s/g, ''), // Remove spaces
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        occupation: formData.occupation,
        annualIncome: formData.annualIncome,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (data.status === "Success") {
        // Store user data in localStorage
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem("userPAN", data.user.panNumber);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userCreditScore", data.user.creditScore || 0);
        localStorage.setItem("userFirstName", data.user.firstName);
        localStorage.setItem("userLastName", data.user.lastName);
        localStorage.setItem("userPhone", data.user.phoneNumber || formData.phoneNumber);
        localStorage.setItem("userAddress", data.user.address || formData.address);
        localStorage.setItem("userOccupation", data.user.occupation || formData.occupation);
        localStorage.setItem("userAnnualIncome", data.user.annualIncome || formData.annualIncome);
        localStorage.setItem("userDateOfBirth", data.user.dateOfBirth || formData.dateOfBirth);
        localStorage.setItem("userPAN", data.user.panNumber || formData.panNumber);
        localStorage.setItem("userAadhaar", data.user.aadhaarNumber || formData.aadhaarNumber);
        
        // Store additional profile data for dashboard use
        localStorage.setItem("userProfile", JSON.stringify({
          dateOfBirth: data.user.dateOfBirth || formData.dateOfBirth,
          aadhaarNumber: data.user.aadhaarNumber || formData.aadhaarNumber,
          address: data.user.address || formData.address,
          occupation: data.user.occupation || formData.occupation,
          annualIncome: data.user.annualIncome || formData.annualIncome,
          phoneNumber: data.user.phoneNumber || formData.phoneNumber
        }));
        localStorage.setItem("profileComplete", "false");

        toast({
          title: "Account Created Successfully!",
          description: "Welcome to CreditScore. Your profile is being processed.",
        });

        // Redirect based on role
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "bank") {
          navigate("/bank-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-yellow-500";
    if (passwordStrength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                CreditScore
              </h1>
              <p className="text-sm text-gray-600 font-medium">Secure Banking Portal</p>
            </div>
          </Link>
        </div>

        {/* Main Form Card */}
        <Card className="bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <CardTitle className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Lock className="h-6 w-6" />
                <span className="text-2xl font-bold">Create Account</span>
              </div>
              <p className="text-blue-100 text-sm font-normal">
                Join thousands who trust us with their financial decisions
              </p>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`mt-1 ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                      required
                    />
                    {validationErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`mt-1 ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                      required
                    />
                    {validationErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className={`mt-1 ${validationErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                      required
                    />
                    {validationErrors.dateOfBirth && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="panNumber" className="text-gray-700 font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      PAN Number *
                    </Label>
                    <Input
                      id="panNumber"
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                      className={`mt-1 uppercase ${validationErrors.panNumber ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                      maxLength={10}
                      required
                    />
                    {validationErrors.panNumber && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.panNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`mt-1 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                      required
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-gray-700 font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+91 9876543210"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className={`mt-1 ${validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                      required
                    />
                    {validationErrors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-700 font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={`mt-1 ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                    required
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                  )}
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="occupation" className="text-gray-700 font-medium">Occupation *</Label>
                    <Select value={formData.occupation} onValueChange={(value) => handleInputChange("occupation", value)}>
                      <SelectTrigger className={`mt-1 ${validationErrors.occupation ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}>
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black">
                    
                        <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                        <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                        <SelectItem value="Product Manager">Product Manager</SelectItem>
                        <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                        <SelectItem value="Consultant">Consultant</SelectItem>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Lawyer">Lawyer</SelectItem>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                        <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                        <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                        <SelectItem value="Business Owner">Business Owner</SelectItem>
                        <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.occupation && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.occupation}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="annualIncome" className="text-gray-700 font-medium">Annual Income *</Label>
                    <Select value={formData.annualIncome} onValueChange={(value) => handleInputChange("annualIncome", value)}>
                      <SelectTrigger className={`mt-1 ${validationErrors.annualIncome ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black">
                        <SelectItem value="₹2,00,000 - ₹3,00,000">₹2,00,000 - ₹3,00,000</SelectItem>
                        <SelectItem value="₹3,00,000 - ₹5,00,000">₹3,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="₹5,00,000 - ₹7,00,000">₹5,00,000 - ₹7,00,000</SelectItem>
                        <SelectItem value="₹7,00,000 - ₹10,00,000">₹7,00,000 - ₹10,00,000</SelectItem>
                        <SelectItem value="₹10,00,000 - ₹15,00,000">₹10,00,000 - ₹15,00,000</SelectItem>
                        <SelectItem value="₹15,00,000 - ₹25,00,000">₹15,00,000 - ₹25,00,000</SelectItem>
                        <SelectItem value="₹25,00,000+">₹25,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.annualIncome && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.annualIncome}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Setup Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-blue-600" />
                  Account Setup
                </h3>

                <div>
                  <Label htmlFor="username" className="text-gray-700 font-medium">Username *</Label>
                  <Input
                    id="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`mt-1 ${validationErrors.username ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                    required
                  />
                  {validationErrors.username && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pr-10 ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Password strength:</span>
                          <span className={`text-xs font-medium ${passwordStrength <= 1 ? 'text-red-500' : passwordStrength <= 2 ? 'text-yellow-500' : passwordStrength <= 3 ? 'text-blue-500' : 'text-green-500'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {validationErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pr-10 ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <div className="flex items-center mt-1">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-xs text-red-500">Passwords do not match</span>
                      </div>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <div className="flex items-center mt-1">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">Passwords match</span>
                      </div>
                    )}
                    {validationErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="aadhaarNumber" className="text-gray-700 font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Aadhaar Number *
                  </Label>
                  <Input
                    id="aadhaarNumber"
                    placeholder="1234 5678 9012"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange("aadhaarNumber", e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                    className={`mt-1 ${validationErrors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                    maxLength={14}
                    required
                  />
                  {validationErrors.aadhaarNumber && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.aadhaarNumber}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
                disabled={isLoading || Object.keys(validationErrors).length > 0}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Your Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Create Secure Account
                  </div>
                )}
              </Button>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Your data is secure</p>
                    <p className="text-xs text-blue-600 mt-1">
                      We use bank-grade encryption to protect your personal and financial information. 
                      Your credit score will be calculated based on your profile information.
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* OTP Verification Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="text-center text-xl font-bold text-gray-800">
                  Verify Phone Number
                </CardTitle>
                <p className="text-center text-sm text-gray-600">
                  Enter the 6-digit code sent to {formData.phoneNumber}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="text-gray-700 font-medium">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="mt-1 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (canResendOtp) {
                        sendOtp();
                      }
                    }}
                    disabled={!canResendOtp}
                    className="text-sm"
                  >
                    {canResendOtp ? 'Resend OTP' : `Resend in ${otpTimer}s`}
                  </Button>
                  
                  <div className="text-xs text-gray-500">
                    Code expires in 5 minutes
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowOtpModal(false);
                      setOtp("");
                      setOtpTimer(0);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otp.length !== 6}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
