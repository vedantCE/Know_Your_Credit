import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CreditCard, MapPin, Calendar, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Bank Details
    primaryBank: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    
    // Additional Banks
    secondaryBank: "",
    secondaryAccountNumber: "",
    thirdBank: "",
    thirdAccountNumber: "",
    
    // Employment
    employmentType: "",
    monthlyIncome: "",
    companyName: "",
    workExperience: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call to save user data
    setTimeout(() => {
      localStorage.setItem("userOnboarded", "true");
      localStorage.setItem("userProfile", JSON.stringify(formData));
      
      toast({
        title: "Profile completed!",
        description: "Your account setup is complete. Welcome to CreditScore Pro!",
      });
      
      navigate("/user-dashboard");
      setIsLoading(false);
    }, 1500);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Personal Information</h3>
        <p className="text-muted-foreground">Help us verify your identity</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name (as per PAN)</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="+91 9876543210"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Main Street, Apartment 4B"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Mumbai"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maharashtra">Maharashtra</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="karnataka">Karnataka</SelectItem>
              <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
              <SelectItem value="gujarat">Gujarat</SelectItem>
              <SelectItem value="rajasthan">Rajasthan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            placeholder="400001"
            value={formData.pincode}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
            maxLength={6}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Banking Information</h3>
        <p className="text-muted-foreground">Connect your bank accounts for credit analysis</p>
      </div>
      
      <div className="border rounded-lg p-4 bg-blue-50">
        <h4 className="font-medium text-blue-900 mb-3">Primary Bank Account</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryBank">Bank Name</Label>
            <Select value={formData.primaryBank} onValueChange={(value) => handleInputChange("primaryBank", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sbi">State Bank of India</SelectItem>
                <SelectItem value="hdfc">HDFC Bank</SelectItem>
                <SelectItem value="icici">ICICI Bank</SelectItem>
                <SelectItem value="axis">Axis Bank</SelectItem>
                <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                <SelectItem value="pnb">Punjab National Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="1234 5678 9012"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              placeholder="HDFC0001234"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange("ifscCode", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select value={formData.accountType} onValueChange={(value) => handleInputChange("accountType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-3">Additional Bank Accounts</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="secondaryBank">Second Bank</Label>
            <Input
              id="secondaryBank"
              placeholder="Optional"
              value={formData.secondaryBank}
              onChange={(e) => handleInputChange("secondaryBank", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryAccountNumber">Second Account Number</Label>
            <Input
              id="secondaryAccountNumber"
              placeholder="Optional"
              value={formData.secondaryAccountNumber}
              onChange={(e) => handleInputChange("secondaryAccountNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thirdBank">Third Bank</Label>
            <Input
              id="thirdBank"
              placeholder="Optional"
              value={formData.thirdBank}
              onChange={(e) => handleInputChange("thirdBank", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thirdAccountNumber">Third Account Number</Label>
            <Input
              id="thirdAccountNumber"
              placeholder="Optional"
              value={formData.thirdAccountNumber}
              onChange={(e) => handleInputChange("thirdAccountNumber", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Employment Information</h3>
        <p className="text-muted-foreground">This helps us predict your credit health</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select value={formData.employmentType} onValueChange={(value) => handleInputChange("employmentType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income</Label>
          <Input
            id="monthlyIncome"
            placeholder="e.g. 50,000"
            value={formData.monthlyIncome}
            onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Your organization"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workExperience">Work Experience</Label>
          <Input
            id="workExperience"
            placeholder="e.g. 3 years"
            value={formData.workExperience}
            onChange={(e) => handleInputChange("workExperience", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>Help us personalize your experience and verify your identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep >= 1 ? 'bg-primary' : 'bg-muted'}`}>1</div>
                    <span className="text-sm">Personal</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`} />
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}>2</div>
                    <span className="text-sm">Bank</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${currentStep > 2 ? 'bg-primary' : 'bg-muted'}`} />
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`}>3</div>
                    <span className="text-sm">Work</span>
                  </div>
                </div>
              </div>

              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1 || isLoading}
                >
                  Back
                </Button>
                <Button onClick={handleNext} disabled={isLoading}>
                  {currentStep < 3 ? "Next" : isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account? <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;