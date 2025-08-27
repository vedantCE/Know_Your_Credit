import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, User, Mail, Phone, CreditCard, MapPin, Briefcase, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoanApplicationModal = ({ isOpen, onClose, loanDetails, onSubmit }) => {
  const { toast } = useToast();
  
  // Auto-fill from localStorage with real user data
  const [formData, setFormData] = useState({
    applicantName: localStorage.getItem("userName") || `${localStorage.getItem("userFirstName") || ""} ${localStorage.getItem("userLastName") || ""}`.trim(),
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("userPhone") || "",
    dateOfBirth: localStorage.getItem("userDateOfBirth") || "",
    pan: localStorage.getItem("userPAN") || "",
    aadhaar: "",
    address: localStorage.getItem("userAddress") || "",
    employmentType: "Salaried",
    employerName: "",
    designation: localStorage.getItem("userOccupation") || "",
    annualIncome: localStorage.getItem("userAnnualIncome")?.replace(/[^0-9]/g, '') || "",
    requestedAmount: loanDetails?.amount?.replace(/[^0-9]/g, '') || "",
    tenure: "5",
    interestRate: loanDetails?.interestRate || "10.5",
    purpose: `Loan for ${loanDetails?.type || 'personal use'}`,
    loanType: loanDetails?.type || "Personal Loan"
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && loanDetails) {
      setFormData(prev => ({
        ...prev,
        requestedAmount: loanDetails.amount?.replace(/[^0-9]/g, '') || "",
        interestRate: loanDetails.interestRate || "10.5",
        purpose: `Loan for ${loanDetails.type || 'personal use'}`,
        loanType: loanDetails.type || "Personal Loan"
      }));
    }
  }, [isOpen, loanDetails]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const applicationData = {
        ...formData,
        userId: localStorage.getItem("userId"),
        submittedAt: new Date().toISOString(),
        status: "Pending"
      };

      // Submit to backend
      const response = await fetch('http://localhost:3001/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      const data = await response.json();

      if (data.status === 'Success') {
        toast({
          title: "Application Submitted!",
          description: `Your ${formData.loanType} application has been submitted successfully.`,
        });
        
        onSubmit(applicationData);
        onClose();
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit loan application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Apply for {loanDetails?.bank} - {loanDetails?.type}
          </h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Your information has been prefilled automatically. Please review and edit as needed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input
                    id="applicantName"
                    value={formData.applicantName}
                    onChange={(e) => handleInputChange("applicantName", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pan">PAN</Label>
                  <Input
                    id="pan"
                    value={formData.pan}
                    onChange={(e) => handleInputChange("pan", e.target.value.toUpperCase())}
                    className="mt-1 uppercase"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="aadhaar">Aadhaar</Label>
                  <Input
                    id="aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange("aadhaar", e.target.value)}
                    className="mt-1"
                    maxLength={12}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-1"
                  rows={2}
                  required
                />
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Employment Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => handleInputChange("employmentType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaried">Salaried</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Business Owner">Business Owner</SelectItem>
                      <SelectItem value="Freelancer">Freelancer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employerName">Employer / Business Name</Label>
                  <Input
                    id="employerName"
                    value={formData.employerName}
                    onChange={(e) => handleInputChange("employerName", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="annualIncome">Annual Income (in ₹)</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={formData.annualIncome.replace(/[^0-9]/g, '')}
                    onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Loan Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="requestedAmount">Requested Amount (in ₹)</Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) => handleInputChange("requestedAmount", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tenure">Tenure (years)</Label>
                  <Select value={formData.tenure} onValueChange={(value) => handleInputChange("tenure", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="2">2 years</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="7">7 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange("interestRate", e.target.value)}
                    className="mt-1"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  className="mt-1"
                  rows={2}
                  required
                />
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="consent"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="consent" className="text-sm">
                I consent to the bank checking my credit information and processing this application.
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationModal;