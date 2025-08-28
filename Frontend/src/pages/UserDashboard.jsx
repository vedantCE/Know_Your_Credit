import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  Shield,
  CreditCard,
  AlertCircle,
  FileText,
  HelpCircle,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  FileCheck,
  Bell,
  BellOff,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Search,
  User,
  X
} from "lucide-react";
import { PayBillsModal } from "@/components/modals/PayBillsModal";
import { ReduceUtilizationModal } from "@/components/modals/ReduceUtilizationModal";
import { MaintainAccountsModal } from "@/components/modals/MaintainAccountsModal";
import { DiversifyPortfolioModal } from "@/components/modals/DiversifyPortfolioModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AnimatedSpeedometer from "@/components/AnimatedSpeedometer";

/*
  This file extends the original UserDashboard by adding a full loan application flow.
  - Clicking "Apply Now" on a recommended loan opens a Loan Application Modal.
  - The modal allows Autofill (from localStorage/mock profile + selected loan) or Manual Fill.
  - After filling, user can Preview the application and Print a receipt.
  - The rest of the original dashboard code is preserved as-is.

  NOTE: This is a single-file React component that uses the same UI components as the
  original project (Card, Button, Badge, etc.). It is written to be drop-in replaceable
  for the original UserDashboard file.
*/

// Small utility: format INR
const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Credit Calculator (unchanged logic, small refactor)
const CreditCalculator = ({}) => {
  const [calcLoanAmount, setCalcLoanAmount] = useState("");
  const [calcCreditScore, setCalcCreditScore] = useState("");
  const [calcIncome, setCalcIncome] = useState("");

  const parseNum = (v) => {
    const n = Number((v || "").toString().replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const getMultiplier = (score) => {
    if (score < 300) return 0;
    const s = Math.max(300, Math.min(850, score));
    const base = 0.1;
    const max = 0.6;
    if (s < 600) return base;
    const scaled = (s - 600) / (850 - 600);
    return base + Math.max(0, Math.min(1, scaled)) * (max - base);
  };

  const estimateApproved = () => {
    const loan = parseNum(calcLoanAmount);
    const score = parseNum(calcCreditScore);
    const income = parseNum(calcIncome);
    const cap = income * getMultiplier(score);
    return Math.max(0, Math.min(loan || 0, Math.floor(cap)));
  };

  const approvedAmount = estimateApproved();

  return (
    <div className="max-w-md mx-auto space-y-4 p-6 bg-white rounded-lg border border-blue-200">
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800">
          Loan Amount:
        </label>
        <Input
          type="text"
          value={calcLoanAmount}
          onChange={(e) => setCalcLoanAmount(e.target.value)}
          placeholder="Enter desired loan"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800">
          Credit Score:
        </label>
        <Input
          type="text"
          value={calcCreditScore}
          onChange={(e) => setCalcCreditScore(e.target.value)}
          placeholder="Enter credit score"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800">
          Yearly Income:
        </label>
        <Input
          type="text"
          value={calcIncome}
          onChange={(e) => setCalcIncome(e.target.value)}
          placeholder="Enter annual income"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="pt-4 border-t border-blue-300">
        <h3 className="text-lg font-semibold text-center text-blue-800 bg-white py-3 px-4 rounded-lg shadow-sm border border-blue-200">
          Estimated Approval: {formatINR(approvedAmount)}
        </h3>
      </div>
    </div>
  );
};

// Loan Details Modal Component
const LoanDetailsModal = ({ isOpen, onClose, loan }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden max-h-[90vh]">
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: "black" }}
        >
          <h3 className="text-lg font-semibold text-black">
            {loan.bank} - {loan.type}
          </h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-800">
            Here are the detailed terms and conditions for this loan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900">
            <div>
              <p className="text-xs text-gray-700 font-medium">Loan Amount</p>
              <p className="text-lg font-semibold">{loan.amount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Interest Rate</p>
              <p className="text-lg font-semibold">{loan.interest}</p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Tenure</p>
              <p className="text-lg font-semibold">{loan.tenure}</p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Eligibility</p>
              <p className="text-lg font-semibold">{loan.eligibility}</p>
            </div>
          </div>
          <div
            className="space-y-2 pt-4 border-t"
            style={{ borderColor: "black" }}
          >
            <h4 className="font-semibold text-black">Key Features</h4>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              <li>No hidden charges or prepayment penalties.</li>
              <li>Quick and hassle-free online application process.</li>
              <li>Flexible repayment options with varying tenures.</li>
              <li>Competitive interest rates for high credit scores.</li>
            </ul>
          </div>
          <div
            className="space-y-2 pt-4 border-t"
            style={{ borderColor: "black" }}
          >
            <h4 className="font-semibold text-black">Required Documents</h4>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              <li>PAN Card & Aadhaar Card</li>
              <li>Proof of Income (Salary slips/Bank statements)</li>
              <li>Address Proof (Utility bill/Passport)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loan Application Details Modal Component
const LoanApplicationDetailsModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: "black" }}
        >
          <h3 className="text-lg font-semibold text-black">
            Application Details
          </h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-700 font-medium">
                Application ID
              </p>
              <p className="text-lg font-semibold text-black">
                {application.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Status</p>
              <p className="text-lg font-semibold text-black">
                {application.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Applied Date</p>
              <p className="text-lg font-semibold text-black">
                {application.appliedDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Bank & Type</p>
              <p className="text-lg font-semibold text-black">
                {application.bank} - {application.type}
              </p>
            </div>
          </div>

          <div
            className="space-y-4 pt-4 border-t"
            style={{ borderColor: "black" }}
          >
            <h4 className="font-semibold text-black">Applicant Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-700 font-medium">Full Name</p>
                <p className="text-sm text-black">
                  {application.applicant.applicantName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-700 font-medium">Email</p>
                <p className="text-sm text-black">
                  {application.applicant.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-700 font-medium">Phone</p>
                <p className="text-sm text-black">
                  {application.applicant.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-700 font-medium">
                  Annual Income
                </p>
                <p className="text-sm text-black">
                  ₹
                  {Number(
                    application.applicant.annualIncome || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-700 font-medium">PAN</p>
                <p className="text-sm text-black">
                  {application.applicant.pan || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-700 font-medium">Aadhaar</p>
                <p className="text-sm text-black">
                  {application.applicant.aadhaar || "-"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Address</p>
              <p className="text-sm text-black">
                {application.applicant.address || "-"}
                </p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">Purpose</p>
              <p className="text-sm text-black">
                {application.applicant.purpose || "-"}
              </p>
            </div>
          </div>

          <div
            className="space-y-4 pt-4 border-t"
            style={{ borderColor: "black" }}
          >
            <h4 className="font-semibold text-black">Loan Request Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-700 font-medium">
                  Requested Amount
                </p>
                <p className="text-sm text-black">
                  ₹
                  {Number(
                    application.applicant.requestedAmount || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-700 font-medium">Loan Tenure</p>
                <p className="text-sm text-black">
                  {application.applicant.tenureYears} years
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-700 font-medium">
                  Interest Rate
                </p>
                <p className="text-sm text-black">
                  {application.applicant.interestRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loan Application Modal + Form + Preview
const LoanApplicationModal = ({
  isOpen,
  onClose,
  selectedLoan,
  onSubmitApplication,
  userEmail,
}) => {
  const initialForm = {
    applicantName: "",
    email: userEmail || "",
    phone: "",
    dob: "",
    pan: "",
    aadhaar: "",
    address: "",
    employmentType: "Salaried",
    employerName: "",
    designation: "",
    annualIncome: "",
    requestedAmount: "",
    tenureYears: "",
    interestRate: "",
    purpose: "",
    consent: false,
  };

  const [form, setForm] = useState(() => {
    // Get actual user data from localStorage
    const userName = localStorage.getItem("userName") || "";
    const userFirstName = localStorage.getItem("userFirstName") || "";
    const userLastName = localStorage.getItem("userLastName") || "";
    const userPhone = localStorage.getItem("userPhone") || "";
    const userAddress = localStorage.getItem("userAddress") || "";
    const userOccupation = localStorage.getItem("userOccupation") || "";
    const userAnnualIncome = localStorage.getItem("userAnnualIncome") || "";
    const userDateOfBirth = localStorage.getItem("userDateOfBirth") || "";
    const userPAN = localStorage.getItem("userPAN") || "";
    
    const userData = {
      applicantName: userName || `${userFirstName} ${userLastName}`.trim(),
      email: userEmail || "",
      phone: userPhone,
      dob: userDateOfBirth,
      pan: userPAN,
      aadhaar: "",
      address: userAddress,
      employmentType: "Salaried",
      employerName: "",
      designation: userOccupation,
      annualIncome: userAnnualIncome.replace(/[^0-9]/g, '') || "0",
      purpose: "Loan for personal use",
      consent: true,
    };

    // Get loan amount, tenure, and interest from selected loan
    const loanAmount = selectedLoan
      ? selectedLoan.amount.replace(/[^0-9]/g, "")
      : "500000";
    const loanTenure = selectedLoan
      ? selectedLoan.tenure.replace(/[^0-9]/g, "")
      : "5";
    const loanInterest = selectedLoan
      ? selectedLoan.interest.replace(/[^0-9.]/g, "")
      : "10.5";

    return {
      ...initialForm,
      ...userData,
      requestedAmount: loanAmount,
      tenureYears: loanTenure,
      interestRate: loanInterest,
    };
  });
  const [mode, setMode] = useState("autofill"); // Default to autofill

  const [previewOpen, setPreviewOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedLoan && isOpen) {
      // Update only the loan-specific fields when selectedLoan changes
      setForm((prev) => ({
        ...prev,
        requestedAmount: selectedLoan.amount.replace(/[^0-9]/g, ""),
        tenureYears: selectedLoan.tenure.replace(/[^0-9]/g, ""),
        interestRate: selectedLoan.interest.replace(/[^0-9.]/g, ""),
      }));
    }
  }, [selectedLoan, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.applicantName) e.applicantName = "Required";
    if (!form.email) e.email = "Required";
    if (!form.phone || form.phone.toString().length < 10)
      e.phone = "Enter valid phone";
    if (!form.requestedAmount || Number(form.requestedAmount) <= 0)
      e.requestedAmount = "Enter amount";
    if (!form.annualIncome || Number(form.annualIncome) <= 0)
      e.annualIncome = "Enter annual income";
    if (!form.consent) e.consent = "You must agree to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((err) => ({ ...err, [k]: undefined }));
  };

  const handlePreview = () => {
    if (!validate()) return;
    setPreviewOpen(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // Construct application object
    const application = {
      id: "LA" + Math.floor(Math.random() * 900000 + 100000),
      bank: selectedLoan ? selectedLoan.bank : "Custom",
      type: selectedLoan ? selectedLoan.type : "Loan",
      amount: "₹" + Number(form.requestedAmount).toLocaleString("en-IN"),
      status: "Submitted",
      appliedDate: new Date().toISOString().split("T")[0],
      applicant: { ...form },
    };

    // call parent handler
    onSubmitApplication(application);
    setPreviewOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Apply for{" "}
            {selectedLoan
              ? `${selectedLoan.bank} - ${selectedLoan.type}`
              : "Loan"}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setPreviewOpen(false);
                onClose();
              }}
            >
              Close
            </Button>
          </div>
        </div>
        <div className="px-4 pt-2">
          <div className="text-sm bg-blue-50 text-blue-700 p-2 rounded-md">
            <strong>Note:</strong> Your information has been prefilled
            automatically. Please review and edit as needed.
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Applicant Name
              </label>
              <Input
                value={form.applicantName}
                onChange={(e) => handleChange("applicantName", e.target.value)}
                placeholder="Full name"
              />
              {errors.applicantName && (
                <p className="text-xs text-destructive">
                  {errors.applicantName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Email</label>
              <Input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="10 digit mobile"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Date of Birth
              </label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">PAN</label>
              <Input
                value={form.pan}
                onChange={(e) =>
                  handleChange("pan", e.target.value.toUpperCase())
                }
                placeholder="ABCDE1234F"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Aadhaar
              </label>
              <Input
                value={form.aadhaar}
                onChange={(e) => handleChange("aadhaar", e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Address
              </label>
              <Input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Residential address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Employment Type
              </label>
              <select
                value={form.employmentType}
                onChange={(e) => handleChange("employmentType", e.target.value)}
                className="w-full rounded border p-2"
              >
                <option>Salaried</option>
                <option>Self-Employed</option>
                <option>Student</option>
                <option>Retired</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Employer / Business Name
              </label>
              <Input
                value={form.employerName}
                onChange={(e) => handleChange("employerName", e.target.value)}
                placeholder="Employer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Designation
              </label>
              <Input
                value={form.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                placeholder="Designation"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Annual Income (in ₹)
              </label>
              <Input
                value={form.annualIncome}
                onChange={(e) =>
                  handleChange("annualIncome", e.target.value.replace(/,/g, ""))
                }
                placeholder="480000"
              />
              {errors.annualIncome && (
                <p className="text-xs text-destructive">
                  {errors.annualIncome}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Requested Amount (in ₹)
              </label>
              <Input
                value={form.requestedAmount}
                onChange={(e) =>
                  handleChange(
                    "requestedAmount",
                    e.target.value.replace(/,/g, "")
                  )
                }
                placeholder="300000"
              />
              {errors.requestedAmount && (
                <p className="text-xs text-destructive">
                  {errors.requestedAmount}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Tenure (years)
              </label>
              <Input
                value={form.tenureYears}
                onChange={(e) => handleChange("tenureYears", e.target.value)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Interest Rate (%)
              </label>
              <Input
                value={form.interestRate}
                onChange={(e) => handleChange("interestRate", e.target.value)}
                placeholder="10.5"
                 />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-medium text-blue-800">
                Purpose
              </label>
              <Input
                value={form.purpose}
                onChange={(e) => handleChange("purpose", e.target.value)}
                placeholder="Loan purpose (eg: Home renovation)"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => handleChange("consent", e.target.checked)}
              />
              <label className="text-sm text-blue-700">
                I consent to the bank checking my credit information and
                processing this application.
              </label>
            </div>
            {errors.consent && (
              <p className="text-xs text-destructive">{errors.consent}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button size="sm" className="bg-blue-600" onClick={handleSubmit}>
              Submit Application
            </Button>
          </div>

          {/* Preview pane */}
          {previewOpen && (
            <div className="mt-4 bg-gray-50 border p-4 rounded">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Application Preview
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Review the details below before submitting
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewOpen(false)}
                  >
                    Close Preview
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-blue-600">Applicant</p>
                  <h5 className="font-medium text-blue-800">
                    {form.applicantName}
                  </h5>
                  <p className="text-sm text-blue-600">
                    {form.email} • {form.phone}
                  </p>
                  <p className="text-sm text-blue-600">
                    PAN: {form.pan} • Aadhaar: {form.aadhaar}
                  </p>
                  <p className="text-sm text-blue-600">
                    Address: {form.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Loan Details</p>
                  <h5 className="font-medium text-blue-800">
                    {selectedLoan
                      ? `${selectedLoan.bank} - ${selectedLoan.type}`
                      : "Custom Loan"}
                  </h5>
                  <p className="text-sm text-blue-600">
                    Amount: ₹
                    {Number(form.requestedAmount || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-blue-600">
                    Tenure: {form.tenureYears} years • Interest:{" "}
                    {form.interestRate}%
                  </p>
                  <p className="text-sm text-blue-600">
                    Purpose: {form.purpose}
                  </p>
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Employment</p>
                    <p className="text-sm text-blue-800">
                      {form.employmentType} • {form.employerName} •{" "}
                      {form.designation}
                    </p>
                    <p className="text-sm text-blue-600">
                      Annual Income: ₹
                      {Number(form.annualIncome || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="text-sm text-blue-600">
                      Application ID (preview)
                    </p>
                    <p className="font-semibold">
                      Preview-{new Date().getTime().toString().slice(-6)}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-4 w-4 mr-1" /> Print Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        className="bg-blue-600"
                      >
                        Confirm & Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "user@demo.com";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [applications, setApplications] = useState([]);
  const [removingApplication, setRemovingApplication] = useState(null);
  const [removeReason, setRemoveReason] = useState("");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // Tracks which improvement modal is open
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("loans");
  const [showProfileNotification, setShowProfileNotification] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [bankCount, setBankCount] = useState(1);
  
  // Initialize bank count on mount
  useEffect(() => {
    const count = parseInt(localStorage.getItem("bankCount") || "1");
    setBankCount(count);
  }, []);
  const [profileData, setProfileData] = useState(() => ({
    userPhone: localStorage.getItem("userPhone") || "",
    userDateOfBirth: localStorage.getItem("userDateOfBirth") || "",
    userPAN: localStorage.getItem("userPAN") || "",
    userAadhaar: localStorage.getItem("userAadhaar") || "",
    userAddress: localStorage.getItem("userAddress") || "",
    userOccupation: localStorage.getItem("userOccupation") || "",
    userAnnualIncome: localStorage.getItem("userAnnualIncome") || "",
    userEmploymentType: localStorage.getItem("userEmploymentType") || "",
    userEmployer: localStorage.getItem("userEmployer") || ""
  }));
  const [bankData, setBankData] = useState({});
  
  // Initialize bank data on mount
  useEffect(() => {
    const data = {};
    const count = parseInt(localStorage.getItem("bankCount") || "1");
    for (let i = 1; i <= count; i++) {
      data[`bankName${i}`] = localStorage.getItem(`bankName${i}`) || "";
      data[`accountNumber${i}`] = localStorage.getItem(`accountNumber${i}`) || "";
      data[`ifscCode${i}`] = localStorage.getItem(`ifscCode${i}`) || "";
      data[`accountType${i}`] = localStorage.getItem(`accountType${i}`) || "";
      data[`branchName${i}`] = localStorage.getItem(`branchName${i}`) || "";
    }
    setBankData(data);
  }, []);
  
  // Update bankData when bankCount changes
  React.useEffect(() => {
    setBankData(prevData => {
      const newBankData = { ...prevData };
      for (let i = 1; i <= bankCount; i++) {
        if (!newBankData[`bankName${i}`]) {
          newBankData[`bankName${i}`] = localStorage.getItem(`bankName${i}`) || "";
          newBankData[`accountNumber${i}`] = localStorage.getItem(`accountNumber${i}`) || "";
          newBankData[`ifscCode${i}`] = localStorage.getItem(`ifscCode${i}`) || "";
          newBankData[`accountType${i}`] = localStorage.getItem(`accountType${i}`) || "";
          newBankData[`branchName${i}`] = localStorage.getItem(`branchName${i}`) || "";
        }
      }
      return newBankData;
    });
  }, [bankCount]);
  const { toast } = useToast();
  
  const updateProfileData = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value);
  };
  
  const updateBankData = (key, value) => {
    console.log(`Updating ${key} to:`, value);
    setBankData(prev => {
      const newData = { ...prev, [key]: value };
      console.log('New bank data:', newData);
      return newData;
    });
    localStorage.setItem(key, value);
  };
  
  // Check profile completion on mount
  useEffect(() => {
    const profileComplete = localStorage.getItem("profileComplete") === "true";
    if (!profileComplete) {
      setTimeout(() => setShowProfileNotification(true), 2000);
    }
  }, []);
  
  const checkProfileComplete = () => {
    const requiredFields = ['userPhone', 'userDateOfBirth', 'userPAN', 'userAadhaar', 'userAddress', 'userOccupation', 'userAnnualIncome', 'userEmploymentType'];
    const bankFields = [];
    for (let i = 1; i <= bankCount; i++) {
      bankFields.push(`bankName${i}`, `accountNumber${i}`, `ifscCode${i}`, `accountType${i}`);
    }
    const allFields = [...requiredFields, ...bankFields];
    return allFields.every(field => {
      if (field.startsWith('bank')) {
        return bankData[field]?.trim();
      }
      return profileData[field]?.trim();
    });
  };
  
  const handleLoanApply = (loan) => {
    // Check profile completion using current state
    const requiredFields = ['userPhone', 'userDateOfBirth', 'userPAN', 'userAadhaar', 'userAddress', 'userOccupation', 'userAnnualIncome', 'userEmploymentType'];
    const bankFields = [];
    for (let i = 1; i <= bankCount; i++) {
      bankFields.push(`bankName${i}`, `accountNumber${i}`, `ifscCode${i}`, `accountType${i}`);
    }
    const allFields = [...requiredFields, ...bankFields];
    
    const isComplete = allFields.every(field => {
      if (field.startsWith('bank')) {
        return bankData[field]?.trim();
      }
      return profileData[field]?.trim();
    });
    
    if (!isComplete) {
      setShowProfileModal(true);
      return;
    }
    openApplicationModal(loan);
  };
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Loan Application Submitted",
      message:
        "Your application for HDFC Personal Loan (₹5,00,000) has been submitted successfully.",
      date: "2024-08-10 14:30",
      read: false,
      type: "application",
    },
    {
      id: 2,
      title: "Credit Score Update",
      message:
        "Your credit score has increased by 15 points to 742. Keep it up!",
      date: "2024-08-08 09:15",
      read: false,
      type: "score",
    },
    {
      id: 3,
      title: "Payment Due Reminder",
      message:
        "Your HDFC Credit Card payment of ₹8,500 is due in 3 days (Aug 13).",
      date: "2024-08-10 08:45",
      read: false,
      type: "payment",
    },
    {
      id: 4,
      title: "Loan Application Approved",
      message:
        "Congratulations! Your SBI Home Loan application has been approved.",
      date: "2024-08-05 16:20",
      read: true,
      type: "approval",
    },
    {
      id: 5,
      title: "New Loan Offer",
      message:
        "You're pre-approved for ICICI Personal Loan at 10.25% interest. Limited time offer!",
      date: "2024-08-09 11:30",
      read: false,
      type: "offer",
    },
  ]);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLoanForDetails, setSelectedLoanForDetails] = useState(null);
  const [newSelectedLoan, setNewSelectedLoan] = useState(null);

  // NEW: State for Loan Application Details Modal
  const [showApplicationDetailsModal, setShowApplicationDetailsModal] =
    useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const loadApplications = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await fetch(`http://localhost:3001/loan-applications/${userId}`);
        const data = await response.json();
        if (data.status === 'Success') {
          const formattedApps = data.applications.map(app => ({
            id: app.applicationId,
            bank: app.bankName,
            type: app.loanType,
            amount: `₹${Number(app.requestedAmount).toLocaleString('en-IN')}`,
            status: app.status,
            appliedDate: new Date(app.submittedAt).toISOString().split('T')[0],
            applicant: app
          }));
          setApplications(formattedApps);
        }
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Keep existing applications if API fails
    }
  };

  const loadNotifications = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await fetch(`http://localhost:3001/notifications/${userId}`);
        const data = await response.json();
        if (data.status === 'Success') {
          const formattedNotifications = data.notifications.map(notif => ({
            id: notif._id,
            title: notif.title,
            message: notif.message,
            date: new Date(notif.createdAt).toLocaleString(),
            read: notif.read,
            type: notif.type
          }));
          setNotifications(formattedNotifications);
        }
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Keep existing notifications if API fails
    }
  };

  useEffect(() => {
    document.title = "User Dashboard | CreditScore Pro";
    loadApplications();
    loadNotifications();
  }, []);

  useEffect(() => {
    // persist applications
    localStorage.setItem("loanApplicationsSaved", JSON.stringify(applications));
  }, [applications]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    localStorage.removeItem("isLoggedIn");
    navigate("/signin");
  };

  // Notification functions
  const markAsRead = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        await fetch(`http://localhost:3001/notifications/${id}/read`, { method: 'PUT' });
      }
      setNotifications((nots) =>
        nots.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Still update locally
      setNotifications((nots) =>
        nots.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        await fetch(`http://localhost:3001/notifications/${userId}/read-all`, { method: 'PUT' });
      }
      setNotifications((nots) => nots.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Still update locally
      setNotifications((nots) => nots.map((n) => ({ ...n, read: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Get user data from localStorage with dynamic generation
  const storedCreditScore = localStorage.getItem("userCreditScore");
  const userName = localStorage.getItem("userName") || "User";
  const userFirstName = localStorage.getItem("userFirstName") || "";
  const userLastName = localStorage.getItem("userLastName") || "";
  const userOccupation = localStorage.getItem("userOccupation") || "";
  const userAnnualIncome = localStorage.getItem("userAnnualIncome") || "";
  const userId = localStorage.getItem("userId");
  
  // Generate user-specific credit score if not available
  const generateUserCreditScore = () => {
    if (storedCreditScore) return parseInt(storedCreditScore);
    
    let score = 300; // Base score
    const income = parseInt(userAnnualIncome?.replace(/[^0-9]/g, '') || '0');
    
    // Income factor
    if (income > 1500000) score += 200;
    else if (income > 1000000) score += 170;
    else if (income > 700000) score += 140;
    else if (income > 500000) score += 110;
    else if (income > 300000) score += 80;
    else if (income > 200000) score += 50;
    
    // Occupation factor
    const occupation = userOccupation?.toLowerCase() || '';
    if (occupation.includes('engineer') || occupation.includes('doctor') || occupation.includes('manager')) score += 150;
    else if (occupation.includes('teacher') || occupation.includes('analyst') || occupation.includes('consultant')) score += 120;
    else if (occupation.includes('executive') || occupation.includes('officer')) score += 100;
    else if (occupation.includes('business') || occupation.includes('entrepreneur')) score += 80;
    else score += 50;
    
    // Name-based seed for consistency
    const nameSeed = (userFirstName + userLastName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    score += (nameSeed % 51);
    
    const finalScore = Math.min(850, Math.max(300, score));
    localStorage.setItem("userCreditScore", finalScore.toString());
    return finalScore;
  };
  
  const creditScore = generateUserCreditScore();
  const riskLevel = creditScore >= 750 ? "Low" : creditScore >= 650 ? "Medium" : "High";
  const lastUpdated = new Date().toISOString().split('T')[0];
  
  // Generate unique credit history based on user's actual score and profile
  const generateUserCreditHistory = (userScore, userName) => {
    const userSeed = userId ? userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : (userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const variation1 = (userSeed % 20) - 10; // -10 to +9
    const variation2 = ((userSeed * 2) % 15) - 7; // -7 to +7
    const variation3 = ((userSeed * 3) % 12) - 6; // -6 to +5
    const variation4 = ((userSeed * 4) % 18) - 9; // -9 to +8
    
    return [
      {
        event: "Week 4 - Credit Score Update",
        date: "2025-01-13",
        status: `${variation1 > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(variation1)} points`,
        impact: variation1 > 0 ? "+" : "-",
        details: variation1 > 0 ? "✅ Regularly paying EMIs/credit card bills. ✅ Keeping utilization < 30%." : "❌ High utilization or late payment detected.",
        score: userScore,
        change: variation1 > 0 ? `+${variation1}` : `${variation1}`,
      },
      {
        event: "Week 3 - Credit Score Update",
        date: "2025-01-06",
        status: `${variation2 > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(variation2)} points`,
        impact: variation2 > 0 ? "+" : "-",
        details: variation2 > 0 ? "✅ Improved payment history and credit utilization." : "❌ High utilization (using 80–100% of card limit).",
        score: userScore - variation1,
        change: variation2 > 0 ? `+${variation2}` : `${variation2}`,
      },
      {
        event: "Week 2 - Credit Score Update",
        date: "2024-12-30",
        status: `${variation3 > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(variation3)} points`,
        impact: variation3 > 0 ? "+" : "-",
        details: variation3 > 0 ? "✅ Regularly paying EMIs/credit card bills." : "❌ Missed payment or high credit inquiry.",
        score: userScore - variation1 - variation2,
        change: variation3 > 0 ? `+${variation3}` : `${variation3}`,
      },
      {
        event: "Week 1 - Credit Score Update",
        date: "2024-12-23",
        status: `${variation4 > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(variation4)} points`,
        impact: variation4 > 0 ? "+" : "-",
        details: variation4 > 0 ? "✅ Good credit behavior and timely payments." : "❌ Too many new loan/credit applications in short span.",
        score: userScore - variation1 - variation2 - variation3,
        change: variation4 > 0 ? `+${variation4}` : `${variation4}`,
      },
      {
        event: "Initial Credit Score",
        date: "2024-12-16",
        status: "Starting Score",
        impact: "Neutral",
        details: `Initial credit score generated for ${userName} based on profile analysis`,
        score: userScore - variation1 - variation2 - variation3 - variation4,
        change: "0",
      },
    ];
  };
  // const pendingLoans = 2;
  // const approvedLoans = 1;
  // const rejectedLoans = 0;

  const recommendedLoans = [
    {
      bank: "HDFC Bank",
      type: "Personal Loan",
      amount: "₹5,00,000",
      interest: "10.5%",
      tenure: "5 years",
      eligibility: "High",
    },
    {
      bank: "SBI",
      type: "Home Loan",
      amount: "₹25,00,000",
      interest: "8.75%",
      tenure: "20 years",
      eligibility: "High",
    },
    {
      bank: "ICICI Bank",
      type: "Car Loan",
      amount: "₹8,00,000",
      interest: "9.25%",
      tenure: "7 years",
      eligibility: "Medium",
    },
    {
      bank: "Axis Bank",
      type: "Business Loan",
      amount: "₹10,00,000",
      interest: "12.5%",
      tenure: "5 years",
      eligibility: "Medium",
    },
  ];

  // const loanApplicationsInitial = [
  //   {
  //     id: "LA001",
  //     bank: "HDFC Bank",
  //     type: "Personal Loan",
  //     amount: "₹3,00,000",
  //     status: "Pending",
  //     appliedDate: "2024-08-05",
  //     expectedDecision: "2024-08-12",
  //   },
  //   {
  //     id: "LA002",
  //     bank: "SBI",
  //     type: "Credit Card",
  //     amount: "₹2,00,000",
  //     status: "Approved",
  //     appliedDate: "2024-07-28",
  //     approvedDate: "2024-08-02",
  //   },
  // ];

  // userName is already defined above
  
  // Generate unique credit history for this user
  const creditHistory = generateUserCreditHistory(creditScore, userName);

  // Data for the credit score trend graph - unique per user based on credit history
  const creditScoreHistory = creditHistory.slice(0, 4).reverse().map((history, index) => ({
    month: `Week ${index + 1}`,
    score: history.score
  }));

  const [faqs, setFaqs] = useState([
  {
    question: "Why did my credit score decrease?",
    answer: "Credit scores can decrease due to late payments, high credit utilization, new credit inquiries, or account closures.",
    additionalInfo: [
      "Late payments can stay on your report for up to 7 years",
      "Each credit application can cause a small, temporary drop",
      "Closing old accounts can shorten your credit history length"
    ]
  },
  {
    question: "How often is my credit score updated?",
    answer: "Credit scores are typically updated monthly when lenders report payment information to credit bureaus.",
    additionalInfo: [
      "Most lenders report to bureaus once a month",
      "Updates may occur at different times for different bureaus",
      "It can take 30-45 days for changes to reflect on your report"
    ]
  },
  {
    question: "What is a good credit utilization ratio?",
    answer: "A credit utilization ratio below 30% is considered good, but below 10% is excellent for your credit score.",
    additionalInfo: [
      "Calculate utilization by dividing balance by credit limit",
      "Both overall and per-card utilization matter",
      "Pay down balances before statement closing dates for best results"
    ]
  },
  {
    question: "How long do negative marks stay on my credit report?",
    answer: "Most negative marks stay on your credit report for 7 years, while bankruptcy can stay for up to 10 years.",
    additionalInfo: [
      "Late payments: 7 years from the delinquency date",
      "Chapter 7 bankruptcy: 10 years from filing date",
      "Chapter 13 bankruptcy: 7 years from filing date",
      "Collections: 7 years from the original delinquency date"
    ]
  },
  {
    question: "How can I quickly improve my credit score?",
    answer: "The fastest ways to improve your score include paying down balances, becoming an authorized user, and disputing errors.",
    additionalInfo: [
      "Pay down cards with highest utilization first",
      "Ask for credit limit increases (without spending more)",
      "Use credit-builder loans or secured cards if you have thin credit"
    ]
  },
  {
    question: "Does checking my credit score lower it?",
    answer: "Checking your own credit score results in a soft inquiry, which does not affect your score. Only hard inquiries from lenders can cause a small temporary drop.",
    additionalInfo: [
      "Soft inquiries: checking your own score, pre-approved offers",
      "Hard inquiries: loan applications, credit card applications",
      "Multiple inquiries for the same type of loan within 14-45 days count as one"
    ]
  },
  {
    question: "What's the difference between FICO and VantageScore?",
    answer: "FICO and VantageScore are different scoring models. FICO is more widely used by lenders, while VantageScore is often used by free credit monitoring services.",
    additionalInfo: [
      "FICO: Used in 90% of lending decisions, scores range 300-850",
      "VantageScore: Joint venture by three bureaus, scores range 300-850",
      "Both consider similar factors but weight them differently"
    ]
  }
]);

// Store original FAQs for search functionality
const [originalFaqs] = useState([...faqs]);
const [openFaqIndex, setOpenFaqIndex] = useState(0);

const toggleFaq = (index) => {
  setOpenFaqIndex(openFaqIndex === index ? null : index);
};

  const getScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "Low":
        return (
          <Badge
            variant="secondary"
            className="bg-white text-blue-600 border border-gray-200"
          >
            Low Risk
          </Badge>
        );
      case "Medium":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Medium Risk
          </Badge>
        );
      case "High":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            High Risk
          </Badge>
        );
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "Rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "Pending":
    case "Submitted": // Add this line
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

  const openApplicationModal = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const openLoanDetailsModal = (loan) => {
    setSelectedLoanForDetails(loan);
    setShowDetailsModal(true);
  };

  // NEW: Function to open the Loan Application Details modal
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowApplicationDetailsModal(true);
  };

  // Check for duplicate loan types
  const checkDuplicateLoanType = (loanType) => {
    return applications.some(app => 
      app.type === loanType && 
      (app.status === 'Pending' || app.status === 'Submitted' || app.status === 'Approved')
    );
  };

  const handleNewApplication = async (application) => {
    // Check for duplicate loan type
    if (checkDuplicateLoanType(application.type)) {
      alert(`You already have a ${application.type} application that is pending or approved. You cannot apply for the same loan type again.`);
      return;
    }
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await fetch('http://localhost:3001/loan-applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...application.applicant, 
            userId, 
            loanType: application.type, 
            bankName: application.bank 
          })
        });
        const data = await response.json();
        if (data.status === 'Success') {
          setApplications((prev) => [{
            id: data.application.applicationId,
            bank: application.bank,
            type: application.type,
            amount: application.amount,
            status: 'Pending',
            appliedDate: new Date().toISOString().split('T')[0],
            applicant: application.applicant
          }, ...prev]);
          loadNotifications();
        }
      } else {
        // Fallback for users without userId (demo mode)
        setApplications((prev) => [{
          id: "LA" + Math.floor(Math.random() * 900000 + 100000),
          bank: application.bank,
          type: application.type,
          amount: application.amount,
          status: 'Pending',
          appliedDate: new Date().toISOString().split('T')[0],
          applicant: application.applicant
        }, ...prev]);
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      // Fallback to local storage
      setApplications((prev) => [{
        id: "LA" + Math.floor(Math.random() * 900000 + 100000),
        bank: application.bank,
        type: application.type,
        amount: application.amount,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        applicant: application.applicant
      }, ...prev]);
    }
  };

  // Remove application with reason
  const handleRemoveApplication = async (applicationId) => {
    if (!removeReason.trim()) {
      alert('Please provide a reason for removing this application.');
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        // For real applications, call backend to delete
        const app = applications.find(a => a.id === applicationId);
        if (app && app.mongoId) {
          const response = await fetch(`http://localhost:3001/loan-applications/${app.mongoId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: removeReason })
          });
          if (response.ok) {
            loadApplications();
          }
        }
      }
      
      // Remove from local state
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      setRemovingApplication(null);
      setRemoveReason("");
      alert('Application removed successfully.');
    } catch (error) {
      console.error('Failed to remove application:', error);
      // Still remove locally if backend fails
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      setRemovingApplication(null);
      setRemoveReason("");
      alert('Application removed successfully.');
    }
  };

  const handlePrintReceipt = (application) => {
    // Create a printable window content using application data
    const html = `
      <html>
        <head>
          <title>Loan Receipt - ${application.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 24px; color: #0f172a }
            .card { border: 1px solid #e6eef8; padding: 18px; border-radius: 8px }
            h1 { color: #0b5ed7 }
            table { width: 100%; border-collapse: collapse; margin-top: 12px }
            td, th { padding: 8px; border: 1px solid #e6eef8; text-align: left }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Loan Application Receipt</h1>
            <p>Application ID: <strong>${application.id}</strong></p>
            <p>Bank: <strong>${application.bank}</strong></p>
            <p>Type: <strong>${application.type}</strong></p>
            <p>Amount: <strong>${application.amount}</strong></p>
            <p>Status: <strong>${application.status}</strong></p>
            <p>Applied on: <strong>${application.appliedDate}</strong></p>
            <hr />
            <h3>Applicant Details</h3>
            <table>
              <tr><th>Name</th><td>${
                application.applicant.applicantName
              }</td></tr>
              <tr><th>Email</th><td>${application.applicant.email}</td></tr>
              <tr><th>Phone</th><td>${application.applicant.phone}</td></tr>
              <tr><th>PAN</th><td>${application.applicant.pan || "-"}</td></tr>
              <tr><th>Aadhaar</th><td>${
                application.applicant.aadhaar || "-"
              }</td></tr>
              <tr><th>Address</th><td>${
                application.applicant.address || "-"
              }</td></tr>
              <tr><th>Annual Income</th><td>₹${Number(
                application.applicant.annualIncome || 0
              ).toLocaleString("en-IN")}</td></tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow popups for printing");
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="bg-white border-b shadow-sm"
        style={{ backgroundColor: "white" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  CreditScore
                </h1>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-1">
                  User Portal
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* User ID/Email Display */}
              <span className="text-sm font-medium text-blue-800">
                {userEmail}
              </span>
              {/* Notification Button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-blue-50"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  {unreadCount > 0 ? (
                    <>
                      <Bell className="h-5 w-5 text-blue-600" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    </>
                  ) : (
                    <BellOff className="h-5 w-5 text-blue-600" />
                  )}
                </Button>

                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    <div className="p-3 border-b bg-blue-50 flex justify-between items-center">
                      <h3 className="font-medium text-blue-800">
                        Notifications
                      </h3>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600 h-6"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 hover:bg-blue-50 cursor-pointer ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between">
                              <h4
                                className={`text-sm font-medium ${
                                  !notification.read
                                    ? "text-blue-800"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.date}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t bg-gray-50 text-center">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View All Notifications
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* sjdhg */}
      <div className="container mx-auto px-4 py-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300 cursor-pointer" onClick={() => setActiveTab("scores")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Credit Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(creditScore)}`}>
                {creditScore}
              </div>
              <p className="text-xs text-blue-600">Excellent (750-850)</p>
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      creditScore >= 750 ? 'bg-green-500' : 
                      creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${
                        creditScore >= 750 ? '90%' : 
                        creditScore >= 650 ? '70%' : '25%'
                      }` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-blue-600 bg-white hover:bg-blue-50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Risk Assessment
              </CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {riskLevel}
              </div>
              <div className="mt-2">{getRiskBadge(riskLevel)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-blue-600 bg-white hover:bg-blue-50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Loan Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-blue-600">Pending</span>
                <span className="text-sm font-medium text-blue-800">
                  {applications.filter((a) => a.status === "Pending" || a.status === "Submitted").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-600">Approved</span>
                <span className="text-sm font-medium text-green-600">
                  {applications.filter((a) => a.status === "Approved").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-600">Rejected</span>
                <span className="text-sm font-medium text-red-600">
                  {applications.filter((a) => a.status === "Rejected").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
          <Card className="shadow-card border-l-4 border-l-blue-600 bg-white hover:bg-blue-50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Last Updated
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {lastUpdated}
              </div>
              <p className="text-xs text-blue-600">Next update in 25 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 rounded-full bg-white p-1 border border-blue-200">
            <TabsTrigger
              value="profile"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              Recommended Loans
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              Loan Status
            </TabsTrigger>
            <TabsTrigger
              value="scores"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              Credit Scores
            </TabsTrigger>
            <TabsTrigger
              value="improve"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              Credit History
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              Credit Calculator
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              FAQ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Loans</CardTitle>
                <CardDescription>
                  Based on your credit score of {creditScore}, here are the best
                  loan options for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedLoans.map((loan, index) => (
                    <Card
                      key={index}
                      className="border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-blue-800">
                              {loan.bank}
                            </CardTitle>
                            <CardDescription className="text-blue-600">
                              {loan.type}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              loan.eligibility === "High"
                                ? "default"
                                : "secondary"
                            }
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            {loan.eligibility}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-600">
                              Amount
                            </span>
                            <span className="font-medium text-blue-800">
                              {loan.amount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-600">
                              Interest Rate
                            </span>
                            <span className="font-medium text-blue-800">
                              {loan.interest}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-600">
                              Tenure
                            </span>
                            <span className="font-medium text-blue-800">
                              {loan.tenure}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                            size="sm"
                            onClick={() => handleLoanApply({
                              bank: loan.bank,
                              type: loan.type,
                              amount: loan.amount,
                              interestRate: loan.interest
                            })}
                          >
                            Apply Now
                          </Button>
                          <Button
                            className="w-full border border-blue-200"
                            size="sm"
                            onClick={() => openLoanDetailsModal(loan)}
                          >
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Complete your profile to apply for loans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input value={userName} className="mt-1 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={userEmail} className="mt-1 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <Label>Phone Number *</Label>
                        <Input 
                          value={profileData.userPhone} 
                          onChange={(e) => updateProfileData("userPhone", e.target.value)}
                          className="mt-1" 
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label>Date of Birth *</Label>
                        <Input 
                          type="date"
                          value={profileData.userDateOfBirth} 
                          onChange={(e) => updateProfileData("userDateOfBirth", e.target.value)}
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <Label>PAN Number *</Label>
                        <Input 
                          value={profileData.userPAN} 
                          onChange={(e) => updateProfileData("userPAN", e.target.value.toUpperCase())}
                          className="mt-1" 
                          maxLength={10}
                          placeholder="ABCDE1234F"
                        />
                      </div>
                      <div>
                        <Label>Aadhaar Number *</Label>
                        <Input 
                          value={profileData.userAadhaar} 
                          onChange={(e) => updateProfileData("userAadhaar", e.target.value)}
                          className="mt-1" 
                          maxLength={12}
                          placeholder="XXXX-XXXX-XXXX"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address *</Label>
                        <Input 
                          value={profileData.userAddress} 
                          onChange={(e) => updateProfileData("userAddress", e.target.value)}
                          className="mt-1" 
                          placeholder="Enter your complete address"
                        />
                      </div>
                      <div>
                        <Label>Occupation *</Label>
                        <Input 
                          value={profileData.userOccupation} 
                          onChange={(e) => updateProfileData("userOccupation", e.target.value)}
                          className="mt-1" 
                          placeholder="Enter your occupation"
                        />
                      </div>
                      <div>
                        <Label>Annual Income *</Label>
                        <Input 
                          value={profileData.userAnnualIncome} 
                          onChange={(e) => updateProfileData("userAnnualIncome", e.target.value)}
                          className="mt-1" 
                          placeholder="Enter annual income in ₹"
                        />
                      </div>
                      <div>
                        <Label>Employment Type *</Label>
                        <select 
                          value={profileData.userEmploymentType} 
                          onChange={(e) => updateProfileData("userEmploymentType", e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Employment Type</option>
                          <option value="Salaried">Salaried</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Business Owner">Business Owner</option>
                          <option value="Freelancer">Freelancer</option>
                          <option value="Student">Student</option>
                          <option value="Retired">Retired</option>
                        </select>
                      </div>
                      <div>
                        <Label>Company/Employer Name</Label>
                        <Input 
                          value={profileData.userEmployer} 
                          onChange={(e) => updateProfileData("userEmployer", e.target.value)}
                          className="mt-1" 
                          placeholder="Enter company/employer name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Section */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-blue-800">Bank Details</h3>
                      <Button 
                        onClick={() => {
                          const newCount = bankCount + 1;
                          setBankCount(newCount);
                          localStorage.setItem("bankCount", newCount.toString());
                          // Initialize new bank fields in state
                          setBankData(prev => ({
                            ...prev,
                            [`bankName${newCount}`]: "",
                            [`accountNumber${newCount}`]: "",
                            [`ifscCode${newCount}`]: "",
                            [`accountType${newCount}`]: "",
                            [`branchName${newCount}`]: ""
                          }));
                        }}
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Add Bank
                      </Button>
                    </div>
                    
                    {(() => {
                      const banks = [];
                      for (let i = 1; i <= bankCount; i++) {
                        banks.push(
                          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-gray-800">Bank {i}</h4>
                              {i > 1 && (
                                <Button 
                                  onClick={() => {
                                    // Remove bank details from localStorage
                                    localStorage.removeItem(`bankName${i}`);
                                    localStorage.removeItem(`accountNumber${i}`);
                                    localStorage.removeItem(`ifscCode${i}`);
                                    localStorage.removeItem(`accountType${i}`);
                                    localStorage.removeItem(`branchName${i}`);
                                    // Update bank count
                                    const newCount = bankCount - 1;
                                    setBankCount(newCount);
                                    localStorage.setItem("bankCount", newCount.toString());
                                    // Reorganize remaining banks
                                    for (let j = i + 1; j <= bankCount; j++) {
                                      const bankName = localStorage.getItem(`bankName${j}`);
                                      const accountNumber = localStorage.getItem(`accountNumber${j}`);
                                      const ifscCode = localStorage.getItem(`ifscCode${j}`);
                                      const accountType = localStorage.getItem(`accountType${j}`);
                                      const branchName = localStorage.getItem(`branchName${j}`);
                                      
                                      if (bankName) localStorage.setItem(`bankName${j-1}`, bankName);
                                      if (accountNumber) localStorage.setItem(`accountNumber${j-1}`, accountNumber);
                                      if (ifscCode) localStorage.setItem(`ifscCode${j-1}`, ifscCode);
                                      if (accountType) localStorage.setItem(`accountType${j-1}`, accountType);
                                      if (branchName) localStorage.setItem(`branchName${j-1}`, branchName);
                                      
                                      localStorage.removeItem(`bankName${j}`);
                                      localStorage.removeItem(`accountNumber${j}`);
                                      localStorage.removeItem(`ifscCode${j}`);
                                      localStorage.removeItem(`accountType${j}`);
                                      localStorage.removeItem(`branchName${j}`);
                                    }
                                  }}
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Bank Name *</Label>
                                <Input 
                                  value={bankData[`bankName${i}`] || ""} 
                                  onChange={(e) => updateBankData(`bankName${i}`, e.target.value)}
                                  className="mt-1" 
                                  placeholder="Enter bank name"
                                />
                              </div>
                              <div>
                                <Label>Account Number *</Label>
                                <Input 
                                  value={bankData[`accountNumber${i}`] || ""} 
                                  onChange={(e) => updateBankData(`accountNumber${i}`, e.target.value)}
                                  className="mt-1" 
                                  placeholder="Enter account number"
                                />
                              </div>
                              <div>
                                <Label>IFSC Code *</Label>
                                <Input 
                                  value={bankData[`ifscCode${i}`] || ""} 
                                  onChange={(e) => updateBankData(`ifscCode${i}`, e.target.value.toUpperCase())}
                                  className="mt-1" 
                                  placeholder="Enter IFSC code"
                                />
                              </div>
                              <div>
                                <Label>Account Type *</Label>
                                <select 
                                  value={bankData[`accountType${i}`] || ""} 
                                  onChange={(e) => updateBankData(`accountType${i}`, e.target.value)}
                                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                >
                                  <option value="">Select Account Type</option>
                                  <option value="Savings">Savings</option>
                                  <option value="Current">Current</option>
                                  <option value="Salary">Salary</option>
                                  <option value="Fixed Deposit">Fixed Deposit</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <Label>Branch Name</Label>
                                <Input 
                                  value={bankData[`branchName${i}`] || ""} 
                                  onChange={(e) => updateBankData(`branchName${i}`, e.target.value)}
                                  className="mt-1" 
                                  placeholder="Enter branch name"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return banks;
                    })()}
                  </div>

                  <Button 
                    onClick={() => {
                      // Validate required fields
                      const requiredFields = [
                        { key: 'userPhone', name: 'Phone Number', pattern: /^[+]?[0-9\s-()]{10,15}$/ },
                        { key: 'userDateOfBirth', name: 'Date of Birth' },
                        { key: 'userPAN', name: 'PAN Number', pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ },
                        { key: 'userAadhaar', name: 'Aadhaar Number' }, // Will handle validation separately
                        { key: 'userAddress', name: 'Address' },
                        { key: 'userOccupation', name: 'Occupation' },
                        { key: 'userAnnualIncome', name: 'Annual Income', pattern: /^[0-9]+$/ },
                        { key: 'userEmploymentType', name: 'Employment Type' }
                      ];
                      
                      // Check bank details - only for banks that have data entered
                      const bankFields = [];
                      for (let i = 1; i <= bankCount; i++) {
                        // Only validate if bank name is provided (indicating user wants to add this bank)
                        const bankName = (bankData[`bankName${i}`] || "").trim();
                        if (bankName) {
                          bankFields.push(
                            { key: `bankName${i}`, name: `Bank ${i} Name` },
                            { key: `accountNumber${i}`, name: `Bank ${i} Account Number`, pattern: /^[0-9]{8,20}$/ },
                            { key: `ifscCode${i}`, name: `Bank ${i} IFSC Code`, pattern: /^[A-Z]{4}[0-9A-Z]{7}$/ },
                            { key: `accountType${i}`, name: `Bank ${i} Account Type` }
                          );
                        }
                      }
                      
                      const allFields = [...requiredFields, ...bankFields];
                      const errors = [];
                      
                      // Ensure at least one bank is configured
                      if (bankFields.length === 0) {
                        errors.push('At least one bank account is required');
                      }
                      
                      // Debug: Log current state
                      console.log('Profile Data:', profileData);
                      console.log('Bank Data:', bankData);
                      console.log('Bank Count:', bankCount);
                      
                      allFields.forEach(field => {
                        let value;
                        if (field.key.startsWith('bank')) {
                          value = bankData[field.key];
                        } else {
                          value = profileData[field.key];
                        }
                        
                        console.log(`Checking ${field.key}:`, value);
                        
                        if (!value || value.toString().trim() === '') {
                          errors.push(`${field.name} is required`);
                        } else if (field.pattern && !field.pattern.test(value.toString().trim())) {
                          if (field.key === 'userPhone') errors.push('Please enter a valid phone number');
                          else if (field.key === 'userPAN') errors.push('PAN format: ABCDE1234F');
                          else if (field.key === 'userAadhaar') {
                            // Special validation for Aadhaar - check if it's 12 digits after removing spaces
                            const cleanAadhaar = value.toString().replace(/\s/g, '');
                            if (!/^[0-9]{12}$/.test(cleanAadhaar)) {
                              errors.push('Aadhaar must be 12 digits (spaces allowed)');
                            }
                          }
                          else if (field.key === 'userAnnualIncome') errors.push('Annual income must be numeric');
                          else if (field.key.includes('accountNumber')) errors.push(`${field.name} must be 8-20 digits`);
                          else if (field.key.includes('ifscCode')) errors.push(`${field.name} format: ABCD0123456 (4 letters + 7 alphanumeric)`);
                        }
                      });
                      
                      console.log('Validation errors:', errors);
                      
                      if (errors.length > 0) {
                        // Show red notification popup
                        const notification = document.createElement('div');
                        notification.className = 'fixed bottom-4 right-4 z-50 bg-red-500 text-white rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right-full';
                        notification.innerHTML = `
                          <div class="flex items-start space-x-3">
                            <div class="bg-red-600 p-2 rounded-full">
                              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                              </svg>
                            </div>
                            <div class="flex-1">
                              <h4 class="font-medium text-white">Validation Errors</h4>
                              <div class="text-sm text-red-100 mt-1 max-h-32 overflow-y-auto">
                                ${errors.map(error => `<div>• ${error}</div>`).join('')}
                              </div>
                              <button onclick="this.parentElement.parentElement.parentElement.remove()" class="mt-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white">
                                Close
                              </button>
                            </div>
                          </div>
                        `;
                        document.body.appendChild(notification);
                        
                        // Auto remove after 15 seconds
                        setTimeout(() => {
                          if (notification.parentElement) {
                            notification.remove();
                          }
                        }, 15000);
                        return;
                      }
                      
                      localStorage.setItem("profileComplete", "true");
                      toast({ 
                        title: "Profile Completed!", 
                        description: "Redirecting to recommended loans...",
                        className: "bg-green-500 text-white border-green-500"
                      });
                      
                      // Redirect to loans tab after 1 second
                      setTimeout(() => {
                        setActiveTab("loans");
                      }, 1000);
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Loan Status Tracker</CardTitle>
              <CardDescription>
                Track the progress of your loan applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <Card className="p-4 border border-blue-100 text-blue-700">
                    You have not submitted any loan applications yet.
                  </Card>
                ) : (
                  applications.map((application) => (
                    <Card
                      key={application.id}
                      className="border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-blue-800">
                                {application.bank}
                              </h3>
                              <Badge
                                variant="outline"
                                className="border-blue-300 text-blue-700 bg-blue-50"
                              >
                                {application.id}
                              </Badge>
                            </div>
                            <p className="text-sm text-blue-600">
                              {application.type}
                            </p>
                            <p className="font-medium text-blue-800">
                              {application.amount}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(application.status)}
                              <span className="text-sm font-medium text-blue-800">
                                {application.status}
                              </span>
                            </div>
                            <p className="text-xs text-blue-600">
                              Applied: {application.appliedDate}
                            </p>
                            {application.status === "Pending" &&
                              application.expectedDecision && (
                                <p className="text-xs text-blue-600">
                                  Decision by: {application.expectedDecision}
                                </p>
                              )}
                            {application.status === "Approved" &&
                              application.approvedDate && (
                                <p className="text-xs text-green-600">
                                  Approved: {application.approvedDate}
                                </p>
                              )}

                            <div className="flex items-center justify-end space-x-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePrintReceipt(application)}
                              >
                                Print Receipt
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewApplicationDetails(application)}
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                onClick={() => setRemovingApplication(application)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          <TabsContent value="scores">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Credit Scores</CardTitle>
                  <CardDescription>
                    Current credit scores from all major bureaus with animated gauges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* CIBIL Score */}
                    <AnimatedSpeedometer 
                      bureauName="CIBIL" 
                      score={creditScore} 
                      range="300-900" 
                      peerAverage={75} 
                      postAverage={82} 
                    />
                    
                    {/* Experian Score */}
                    <AnimatedSpeedometer 
                      bureauName="Experian" 
                      score={creditScore - 15} 
                      range="300-900" 
                      peerAverage={72} 
                      postAverage={78} 
                    />
                    
                    {/* Equifax Score */}
                    <AnimatedSpeedometer 
                      bureauName="Equifax" 
                      score={creditScore - 8} 
                      range="300-900" 
                      peerAverage={68} 
                      postAverage={74} 
                    />
                    
                    {/* CRIF Score */}
                    <AnimatedSpeedometer 
                      bureauName="CRIF" 
                      score={creditScore + 25} 
                      range="300-900" 
                      peerAverage={79} 
                      postAverage={85} 
                    />
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      <span className="font-medium">Your Credit Score:</span>
                      <span className="ml-2 font-bold text-blue-700">
                        {creditScore}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Your score is updated monthly. Keep making timely payments to improve it!
                    </p>
                    </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="improve">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Score Trend - {userName}</CardTitle>
                  <CardDescription>
                    Track your credit score progress over the last 4 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={creditScoreHistory}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6eef8" />
                      <XAxis dataKey="month" interval={0} stroke="#3b82f6" />
                      <YAxis domain={[700, 750]} stroke="#3b82f6" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          borderColor: "#3b82f6",
                          borderRadius: "8px"
                        }} 
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#3b82f6" }}
                        activeDot={{ r: 8, fill: "#1d4ed8" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Credit Score History - {userName}</CardTitle>
                  <CardDescription>
                    Detailed breakdown of your credit score changes over the last 4 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditHistory.map((history, index) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg text-blue-800">
                                  {history.event}
                                </h3>
                                {history.change !== "0" && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      history.impact === "+"
                                        ? "bg-green-100 text-green-800 border-green-200 text-sm"
                                        : history.impact === "-"
                                        ? "bg-red-100 text-red-800 border-red-200 text-sm"
                                        : "bg-gray-100 text-gray-800 border-gray-200 text-sm"
                                    }
                                  >
                                    {history.change}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-blue-600">
                                {history.date}
                              </p>
                              <p className="text-base font-medium text-blue-800">
                                {history.status}
                              </p>
                              <p className="text-sm text-blue-600">
                                {history.details}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="flex items-center justify-end space-x-1">
                                {history.impact === "+" && (
                                  <ArrowUp className="h-5 w-5 text-green-600" />
                                )}
                                {history.impact === "-" && (
                                  <ArrowDown className="h-5 w-5 text-red-600" />
                                )}
                                <span className={`text-xl font-bold ${getScoreColor(history.score)}`}>
                                  {history.score}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Credit Eligibility Calculator</CardTitle>
                <CardDescription>
                  Estimate your loan eligibility based on your credit profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreditCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FAQ Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions about credit scores and payment history
                </CardDescription>
                <div className="pt-4">
                  <Input
                    placeholder="Search FAQs..."
                    className="max-w-sm"
                    onChange={(e) => {
                      const searchTerm = e.target.value.toLowerCase();
                      const filtered = originalFaqs.filter(
                        (faq) =>
                          faq.question.toLowerCase().includes(searchTerm) ||
                          faq.answer.toLowerCase().includes(searchTerm)
                      );
                      setFaqs(filtered);
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card
                      key={index}
                      className="bg-white transition-all duration-300 border border-blue-200 overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-blue-50"
                          onClick={() => toggleFaq(index)}
                        >
                          <div className="flex items-start space-x-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-sm font-medium text-blue-700">
                                {index + 1}
                              </span>
                            </div>
                            <h3 className="font-semibold text-blue-800">
                              {faq.question}
                            </h3>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-blue-600 transition-transform ${
                              openFaqIndex === index ? "transform rotate-180" : ""
                            }`}
                          />
                        </div>
                        {openFaqIndex === index && (
                          <div className="px-4 pb-4 pt-2 border-t border-blue-100">
                            <p className="text-sm text-blue-600 pl-7">{faq.answer}</p>
                            {faq.additionalInfo && (
                              <div className="mt-3 pl-7">
                                <p className="text-sm font-medium text-blue-800 mb-1">
                                  Additional Information:
                                </p>
                                <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
                                  {faq.additionalInfo.map((info, i) => (
                                    <li key={i}>{info}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improve Your Score Section */}
            <Card className="bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Improve Your Score</CardTitle>
                <CardDescription>
                  Tips to boost your credit score effectively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Pay Bills on Time
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Payment history is the most important factor. Set up automatic payments to never miss a due date.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Keep Utilization Low
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Try to use less than 30% of your available credit limit on each card.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Check Reports Regularly
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Review your credit reports for errors and dispute any inaccuracies promptly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                      <Shield className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Maintain Old Accounts
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Longer credit history improves your score. Keep old accounts open even if you don't use them frequently.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Limit New Applications
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Too many hard inquiries in a short period can lower your score. Space out credit applications.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        </Tabs>
      </div>
      {/* Loan Application Modal */}
      <LoanApplicationModal
        isOpen={showLoanModal}
        onClose={() => setShowLoanModal(false)}
        loanDetails={newSelectedLoan}
        onSubmit={(applicationData) => {
          const newApp = {
            id: `LA${Date.now()}`,
            type: applicationData.loanType,
            amount: `₹${Number(applicationData.requestedAmount).toLocaleString('en-IN')}`,
            status: "Pending",
            appliedDate: new Date().toISOString().split('T')[0],
            bank: newSelectedLoan?.bank || "Bank"
          };
          setApplications(prev => [newApp, ...prev]);
        }}
      />

      {/* Loan Details Modal */}
      <LoanDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        loan={selectedLoanForDetails}
      />

      {/* Loan Application Details Modal */}
      <LoanApplicationDetailsModal
        isOpen={showApplicationDetailsModal}
        onClose={() => setShowApplicationDetailsModal(false)}
        application={selectedApplication}
      />

      {/* Remove Application Modal */}
      {removingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-800">
                Remove Application
              </h3>
              <Button size="sm" variant="ghost" onClick={() => {
                setRemovingApplication(null);
                setRemoveReason("");
              }}>
                Close
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Application ID:</span> {removingApplication.id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Loan Type:</span> {removingApplication.type}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Reason for Removal *
                </label>
                <textarea
                  value={removeReason}
                  onChange={(e) => setRemoveReason(e.target.value)}
                  placeholder="Please provide a reason for removing this application..."
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 p-4 border-t">
              <Button variant="outline" onClick={() => {
                setRemovingApplication(null);
                setRemoveReason("");
              }}>
                Cancel
              </Button>
              <Button
                onClick={() => handleRemoveApplication(removingApplication.id)}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!removeReason.trim()}
              >
                Remove Application
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Profile Completion Notification */}
      {showProfileNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="bg-green-600 p-2 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white">Complete Your Profile</h4>
              <p className="text-sm text-green-100 mt-1">Please complete your profile to apply for loans</p>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" className="bg-white text-green-600 hover:bg-gray-100" onClick={() => { setActiveTab("profile"); setShowProfileNotification(false); }}>
                  Complete Now
                </Button>
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => setShowProfileNotification(false)}>
                  Later
                </Button>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-white hover:bg-green-600" onClick={() => setShowProfileNotification(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Profile Incomplete</h3>
              <Button size="sm" variant="ghost" onClick={() => setShowProfileModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Complete your profile first</p>
                  <p className="text-sm text-gray-600">You need to complete your profile before applying for loans</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowProfileModal(false)}>Cancel</Button>
              <Button onClick={() => { setActiveTab("profile"); setShowProfileModal(false); }}>Go to Profile</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
