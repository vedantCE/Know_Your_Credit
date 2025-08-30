
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { realTimeSync } from "@/lib/realTimeSync";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FileText,
  TrendingUp,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
  X,
  Check,
  Eye,
  Wifi,
  AlertTriangle,
  TrendingDown,
  Filter,
  MoreHorizontal,
  Zap,
  Database,
  RefreshCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import AnimatedSpeedometer from "@/components/AnimatedSpeedometer";
import BureauStatusPanel from "@/components/BureauStatusPanel";

// 🔹 Utility function to generate consistent scores based on application ID
const generateConsistentScores = (id, userCreditScore = null) => {
  const seed = id.toString().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  
  // Use user's actual credit score if available, otherwise generate based on seed
  const baseScore = userCreditScore || (600 + ((seed * 13) % 300));

  // Generate consistent bureau scores based on the base score
  const bureauScores = [
    {
      name: "CIBIL",
      score: baseScore,
      range: "300 – 900",
      peerAverage: 50 + (seed % 40),
      postAverage: 50 + ((seed * 3) % 40),
    },
    {
      name: "Equifax",
      score: Math.max(300, Math.min(900, baseScore - 20 + ((seed * 7) % 40))),
      range: "300 – 900",
      peerAverage: 50 + ((seed * 5) % 40),
      postAverage: 50 + ((seed * 2) % 40),
    },
    {
      name: "Experian",
      score: Math.max(300, Math.min(900, baseScore - 10 + ((seed * 11) % 30))),
      range: "300 – 900",
      peerAverage: 50 + ((seed * 2) % 40),
      postAverage: 50 + ((seed * 7) % 40),
    },
    {
      name: "CRIF",
      score: Math.max(300, Math.min(900, baseScore + 25 + ((seed * 17) % 25))),
      range: "300 – 900",
      peerAverage: 50 + ((seed * 4) % 40),
      postAverage: 50 + ((seed * 6) % 40),
    },
  ];

  // Generate consistent credit score history based on the same base score
  const months = ["Sept 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025"];
  const history = months.map((month, i) => {
    const monthOffset = (i - months.length + 1) * 10;
    return {
      month,
      CIBIL: Math.max(300, Math.min(900, baseScore + monthOffset + ((seed + i * 17) % 20))),
      Experian: Math.max(300, Math.min(900, baseScore - 10 + monthOffset + ((seed + i * 23) % 20))),
      Equifax: Math.max(300, Math.min(900, baseScore - 20 + monthOffset + ((seed + i * 31) % 20))),
      CRIF: Math.max(1, Math.min(999, baseScore + 50 + monthOffset + ((seed + i * 19) % 20))),
    };
  });

  return {
    bureauScores,
    creditScoreHistory: history,
    creditScore: baseScore // This will be the main credit score shown in the table
  };
};

// ================= ReviewForm Component =================
const ReviewForm = ({ application, onClose, onConfirm, bureauStatus = {} }) => {
  if (!application) return null;

  // Try to get user's actual credit score from backend or use generated
  const getUserCreditScore = async (application) => {
    try {
      if (application.userId) {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${application.userId}/credit-score`);
        if (response.ok) {
          const data = await response.json();
          return data.creditScore;
        }
      }
    } catch (error) {
      console.log('Using fallback credit score generation');
    }
    return null;
  };

  const [userCreditScore, setUserCreditScore] = useState(null);
  const [scoresGenerated, setScoresGenerated] = useState(false);
  
  useEffect(() => {
    const fetchUserScore = async () => {
      const score = await getUserCreditScore(application);
      setUserCreditScore(score);
      setScoresGenerated(true);
    };
    if (application && !scoresGenerated) {
      fetchUserScore();
    }
  }, [application, scoresGenerated]);

  const { bureauScores, creditScoreHistory } = generateConsistentScores(application.id, userCreditScore);

  // Ensure last graph values match gauge values
  const adjustedHistory = creditScoreHistory.map((item, index) => {
    if (index === creditScoreHistory.length - 1) {
      // Last entry should match bureau scores
      return {
        ...item,
        CIBIL: bureauScores[0].score,
        Equifax: bureauScores[1].score,
        Experian: bureauScores[2].score,
        CRIF: bureauScores[3].score,
      };
    }
    return item;
  });

  // Generate loan risk assessment
  const generateLoanRiskAssessment = () => {
    const loanAmount = parseInt(application.amount.replace(/[₹,]/g, '')) || 0;
    const annualIncome = parseInt(application.annualIncome.replace(/[₹,]/g, '')) || 0;
    const creditScore = bureauScores[0].score;
    
    let riskLevel = 'Medium';
    let riskColor = 'yellow';
    let recommendation = 'REVIEW';
    
    // Calculate debt-to-income ratio (simplified)
    const monthlyIncome = annualIncome / 12;
    const estimatedEMI = loanAmount * 0.1; // Rough 10% of loan as EMI
    const dtiRatio = monthlyIncome > 0 ? (estimatedEMI / monthlyIncome * 100) : 100;
    
    // Risk assessment logic
    if (creditScore >= 750 && dtiRatio < 30) {
      riskLevel = 'Low';
      riskColor = 'green';
      recommendation = 'APPROVE';
    } else if (creditScore < 650 || dtiRatio > 50) {
      riskLevel = 'High';
      riskColor = 'red';
      recommendation = 'REJECT';
    }
    
    return {
      riskLevel,
      riskColor,
      recommendation,
      creditScore,
      dtiRatio: dtiRatio.toFixed(1),
      estimatedEMI: estimatedEMI.toLocaleString('en-IN')
    };
  };

  // Generate graph analysis points
  const generateGraphAnalysis = () => {
    const latestScores = adjustedHistory[adjustedHistory.length - 1];
    const previousScores = adjustedHistory[adjustedHistory.length - 2];
    
    const analysis = [];
    
    // Trend analysis
    const cibilTrend = latestScores.CIBIL - previousScores.CIBIL;
    const avgScore = (latestScores.CIBIL + latestScores.Equifax + latestScores.Experian + latestScores.CRIF) / 4;
    
    if (cibilTrend > 0) {
      analysis.push(`CIBIL score improved by ${cibilTrend} points from last month, showing positive credit behavior`);
    } else if (cibilTrend < 0) {
      analysis.push(`CIBIL score declined by ${Math.abs(cibilTrend)} points, indicating potential credit stress`);
    } else {
      analysis.push(`CIBIL score remained stable, showing consistent credit management`);
    }
    
    // Score consistency
    const scores = [latestScores.CIBIL, latestScores.Equifax, latestScores.Experian, latestScores.CRIF];
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const variance = maxScore - minScore;
    
    if (variance < 30) {
      analysis.push(`Low bureau score variance (${variance} points) indicates reliable credit profile`);
    } else if (variance < 60) {
      analysis.push(`Moderate bureau score variance (${variance} points) requires additional verification`);
    } else {
      analysis.push(`High bureau score variance (${variance} points) suggests data inconsistencies`);
    }
    
    // Overall trend
    const overallTrend = adjustedHistory.slice(-3).reduce((acc, curr, idx, arr) => {
      if (idx === 0) return 0;
      return acc + (curr.CIBIL - arr[idx - 1].CIBIL);
    }, 0);
    
    if (overallTrend > 10) {
      analysis.push(`Strong upward trend over last 3 months (+${overallTrend} points) shows improving creditworthiness`);
    } else if (overallTrend < -10) {
      analysis.push(`Declining trend over last 3 months (${overallTrend} points) raises concerns about repayment capacity`);
    } else {
      analysis.push(`Stable credit score pattern over recent months indicates consistent financial behavior`);
    }
    
    return analysis;
  };

  const loanRiskAssessment = generateLoanRiskAssessment();
  const graphAnalysis = generateGraphAnalysis();

  const handleReviewConfirm = () => {
    if (onConfirm) {
      onConfirm(application.id, "Reviewed");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-full max-w-6xl h-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Application Review - {application.customerName}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Customer Details Section */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <p className="font-semibold">{application.customerName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">PAN Number:</span>
                <p className="font-semibold">{application.panNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Aadhaar Number:</span>
                <p className="font-semibold">{application.aadhaarNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="font-semibold">{application.customerEmail}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Phone:</span>
                <p className="font-semibold">{application.phoneNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Date of Birth:</span>
                <p className="font-semibold">{new Date(application.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Address:</span>
                <p className="font-semibold">{application.address}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Occupation:</span>
                <p className="font-semibold">{application.occupation}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Annual Income:</span>
                <p className="font-semibold text-green-600">{application.annualIncome}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Loan Amount:</span>
                <p className="font-semibold text-blue-600">{application.amount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Loan Type:</span>
                <p className="font-semibold">{application.loanType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout: Graph + Bureau Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Credit Score History */}
          <Card className="p-3 shadow-md rounded-lg h-full">
            <CardContent className="h-full flex flex-col">
              <h3 className="text-base font-semibold text-gray-800">Credit Score History</h3>
              <div className="flex-grow min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={adjustedHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis domain={[300, 900]} stroke="#6b7280" />
                    <Tooltip />
                    <Legend verticalAlign="top" height={30} />
                    <Line type="monotone" dataKey="CIBIL" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="CRIF" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Equifax" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="Experian" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Graph Analysis Points */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Credit Score Analysis:</h4>
                <div className="space-y-1">
                  {graphAnalysis.map((point, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start gap-1">
                      <span className="text-blue-500">•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bureau Scores */}
          <Card className="p-3 shadow-md rounded-lg h-full">
            <CardContent className="pb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Bureau Scores</h3>
              <div className="grid grid-cols-2 gap-4 justify-items-center" style={{ minHeight: '260px' }}>
                {bureauScores.map((bureau) => {
                  const bureauKey = bureau.name.toUpperCase();
                  const currentStatus = bureauStatus[bureauKey]?.status || 'UP';
                  console.log(`${bureau.name} status:`, currentStatus);
                  return (
                    <div key={bureau.name} className="flex flex-col items-center justify-center w-full">
                      <AnimatedSpeedometer
                        bureauName={bureau.name}
                        score={bureau.score}
                        range={bureau.range}
                        peerAverage={bureau.peerAverage}
                        postAverage={bureau.postAverage}
                        size="small"
                        bureauStatus={currentStatus}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Risk Assessment Result */}
        <Card className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Loan Risk Assessment Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Risk Level:</span>
                  <Badge className={`bg-${loanRiskAssessment.riskColor}-100 text-${loanRiskAssessment.riskColor}-700 border-${loanRiskAssessment.riskColor}-200`}>
                    {loanRiskAssessment.riskLevel} Risk
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Recommendation:</span>
                  <Badge className={`bg-${loanRiskAssessment.riskColor}-100 text-${loanRiskAssessment.riskColor}-700 border-${loanRiskAssessment.riskColor}-200 font-bold`}>
                    {loanRiskAssessment.recommendation}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Credit Score:</span>
                  <span className="text-sm font-bold text-blue-600">{loanRiskAssessment.creditScore}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Loan Amount:</span>
                  <span className="text-sm font-bold text-green-600">{application.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Est. EMI:</span>
                  <span className="text-sm font-bold text-orange-600">₹{loanRiskAssessment.estimatedEMI}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">DTI Ratio:</span>
                  <span className={`text-sm font-bold ${parseFloat(loanRiskAssessment.dtiRatio) > 40 ? 'text-red-600' : 'text-green-600'}`}>
                    {loanRiskAssessment.dtiRatio}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Risk Assessment Summary */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Assessment Summary:</h4>
              <p className="text-xs text-gray-600">
                {loanRiskAssessment.recommendation === 'APPROVE' 
                  ? `Strong credit profile with score of ${loanRiskAssessment.creditScore} and manageable DTI ratio of ${loanRiskAssessment.dtiRatio}%. Recommended for approval with standard terms.`
                  : loanRiskAssessment.recommendation === 'REJECT'
                  ? `High risk profile due to ${loanRiskAssessment.creditScore < 650 ? 'low credit score' : 'high DTI ratio'}. Consider rejection or require additional collateral/guarantor.`
                  : `Moderate risk profile requiring manual review. Credit score of ${loanRiskAssessment.creditScore} with DTI ratio of ${loanRiskAssessment.dtiRatio}% needs careful evaluation.`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Review Confirm Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleReviewConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Mark as Reviewed
          </Button>
        </div>
      </div>
    </div>
  );
};


// Rejection Form Component
const RejectionForm = ({ application, onClose, onConfirm }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const rejectionReasons = [
    "Low credit score / poor credit history",
    "Insufficient income to cover EMI",
    "High existing debt (debt-to-income ratio)",
    "Unstable employment or business",
    "Incomplete or incorrect documents",
    "Poor banking habits (cheque bounces, overdrafts, etc.)",
    "Unverifiable or fake information",
    "Low collateral value (for secured loans)",
    "Age factor (too young / nearing retirement)",
    "High-risk or restricted location",
    "Other (please specify)",
  ];

  const handleReasonSelect = (reason) => {
    setRejectionReason(reason);
    setShowCustomReason(reason === "Other (please specify)");
    setShowDropdown(false);
    if (reason !== "Other (please specify)") {
      setCustomReason("");
    }
  };

  const handleSubmit = () => {
    const finalReason =
      rejectionReason === "Other (please specify)"
        ? customReason
        : rejectionReason;
    if (finalReason.trim()) {
      onConfirm(application.id, finalReason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reject Application</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Application ID:</span>{" "}
            {application.id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Customer:</span>{" "}
            {application.customerName}
          </p>
        </div>

        <div className="space-y-4 mb-4">
          <div className="relative">
            <label className="text-sm font-medium block mb-1">
              Reason for Rejection
            </label>
            <div
              className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span
                className={rejectionReason ? "text-gray-800" : "text-gray-500"}
              >
                {rejectionReason || "Select a reason"}
              </span>
              <svg
                className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {rejectionReasons.map((reason) => (
                  <div
                    key={reason}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleReasonSelect(reason)}
                  >
                    {reason}
                  </div>
                ))}
              </div>
            )}
          </div>

          {showCustomReason && (
            <div>
              <label className="text-sm font-medium block mb-1">
                Specify Reason
              </label>
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please provide the reason for rejection..."
                rows={3}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600"
            disabled={
              !rejectionReason ||
              (rejectionReason === "Other (please specify)" &&
                !customReason.trim())
            }
          >
            Confirm Rejection
          </Button>
        </div>
      </div>
    </div>
  );
};

// Success Animation Component
const SuccessAnimation = ({ message, onClose, isRejection = false }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center max-w-md shadow-xl border border-gray-200">
        <div
          className={`w-16 h-16 ${isRejection ? "bg-red-100" : "bg-green-100"
            } rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {isRejection ? (
            <XCircle className="h-8 w-8 text-red-600" />
          ) : (
            <Check className="h-8 w-8 text-green-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isRejection ? "Rejected!" : "Success!"}
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600">
          Continue
        </Button>
      </div>
    </div>
  );
};

const BankDashboard = () => {
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState("");
  const [panInput, setPanInput] = useState("");
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loanApplications, setLoanApplications] = useState([]);
  const [bureauStatus, setBureauStatus] = useState({});

  // Load users from backend
  const loadUsers = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/users');
      const data = await response.json();
      if (data.status === 'Success') {
        setAllUsers(data.users);
        console.log('Users loaded in Bank Dashboard:', data.users.length);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  // Set up real-time sync for users
  useEffect(() => {
    // Load users initially
    loadUsers();
    
    // Subscribe to real-time updates for users
    const unsubscribeUsers = realTimeSync.subscribe('users', (response) => {
      if (response.status === "Success") {
        setAllUsers(response.users);
        console.log('Dynamic users loaded in Bank Dashboard:', response.users.length);
      }
    }, 20000); // Update every 20 seconds

    // Fetch bureau status
    const fetchBureauStatus = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/bureau/health-status');
        const data = await response.json();
        if (data.status === 'Success') {
          setBureauStatus(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch bureau status:', error);
        // Set default status if API fails
        setBureauStatus({
          CIBIL: { status: 'UP' },
          EXPERIAN: { status: 'UP' },
          EQUIFAX: { status: 'UP' },
          CRIF: { status: 'UP' }
        });
      }
    };
    
    fetchBureauStatus();
    const bureauInterval = setInterval(fetchBureauStatus, 30000);

    // Cleanup subscription on unmount
    return () => {
      unsubscribeUsers();
      clearInterval(bureauInterval);
    };
  }, []);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [loanAmount, setLoanAmount] = useState("50000");
  const [loanTenure, setLoanTenure] = useState("12");
  const [loanPurpose, setLoanPurpose] = useState("home");
  const [monthlyIncome, setMonthlyIncome] = useState("890000");
  const [employmentType, setEmploymentType] = useState("Salaried");
  const [employmentTenure, setEmploymentTenure] = useState("1");
  const [riskAssessment, setRiskAssessment] = useState(null); // New state for dynamic assessment
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReviewCriteria, setShowReviewCriteria] = useState(false);
  const [showFallbackConfig, setShowFallbackConfig] = useState(false);
  const [flaggedApplications, setFlaggedApplications] = useState([]);
  const [filterSettings, setFilterSettings] = useState({
    alertType: 'all',
    severity: 'all',
    timeRange: '24h'
  });
  const [activeFilter, setActiveFilter] = useState('all');



  // Generate applications with consistent data
  const generateApplications = () => {
    const applicationsData = [
      {
        id: "LA2024001",
        customerName: "Rajesh Kumar",
        loanType: "Personal Loan",
        amount: "₹5,00,000",
        riskLevel: "Low",
        status: "Pending",
        appliedDate: "2024-08-08",
        customerEmail: "rajesh@example.com",
        panNumber: "ABCDE1234F",
        aadhaarNumber: "123456789012",
        phoneNumber: "+91 9876543210",
        address: "123 MG Road, Mumbai, Maharashtra 400001",
        dateOfBirth: "1990-05-15",
        occupation: "Software Engineer",
        annualIncome: "₹12,00,000",
        creditScore: 742
      },
      {
        id: "LA2024002",
        customerName: "Priya Sharma",
        loanType: "Home Loan",
        amount: "₹25,00,000",
        riskLevel: "Low",
        status: "Approved",
        appliedDate: "2024-08-07",
        customerEmail: "priya@example.com",
        panNumber: "FGHIJ5678K",
        aadhaarNumber: "234567890123",
        phoneNumber: "+91 9876543211",
        address: "456 Park Street, Delhi, Delhi 110001",
        dateOfBirth: "1988-03-22",
        occupation: "Marketing Manager",
        annualIncome: "₹15,00,000",
        creditScore: 785
      },
      {
        id: "LA2024003",
        customerName: "Amit Patel",
        loanType: "Car Loan",
        amount: "₹8,00,000",
        riskLevel: "Medium",
        status: "Under Review",
        appliedDate: "2024-08-08",
        customerEmail: "amit@example.com",
        panNumber: "KLMNO9012P",
        aadhaarNumber: "345678901234",
        phoneNumber: "+91 9876543212",
        address: "789 Gandhi Nagar, Ahmedabad, Gujarat 380001",
        dateOfBirth: "1992-11-08",
        occupation: "Business Owner",
        annualIncome: "₹10,00,000"
      },
      {
        id: "LA2024004",
        customerName: "Sunita Reddy",
        loanType: "Business Loan",
        amount: "₹12,00,000",
        riskLevel: "Medium",
        status: "Approved",
        appliedDate: "2024-08-06",
        customerEmail: "sunita@example.com",
        panNumber: "QRSTU3456V",
        aadhaarNumber: "456789012345",
        phoneNumber: "+91 9876543213",
        address: "321 Banjara Hills, Hyderabad, Telangana 500034",
        dateOfBirth: "1985-07-12",
        occupation: "Entrepreneur",
        annualIncome: "₹18,00,000"
      },
      {
        id: "LA2024005",
        customerName: "Vikash Singh",
        loanType: "Personal Loan",
        amount: "₹3,00,000",
        riskLevel: "High",
        status: "Rejected",
        appliedDate: "2024-08-05",
        customerEmail: "vikash@example.com",
        panNumber: "WXYZB7890C",
        aadhaarNumber: "567890123456",
        phoneNumber: "+91 9876543214",
        address: "654 Civil Lines, Lucknow, Uttar Pradesh 226001",
        dateOfBirth: "1995-01-30",
        occupation: "Sales Executive",
        annualIncome: "₹6,00,000"
      },
      {
        id: "LA2024006",
        customerName: "Neha Gupta",
        loanType: "Education Loan",
        amount: "₹7,50,000",
        riskLevel: "Low",
        status: "Pending",
        appliedDate: "2024-08-10",
        customerEmail: "neha@example.com",
        panNumber: "DEFGH1234I",
        aadhaarNumber: "678901234567",
        phoneNumber: "+91 9876543215",
        address: "987 Sector 15, Noida, Uttar Pradesh 201301",
        dateOfBirth: "1998-09-18",
        occupation: "Student",
        annualIncome: "₹2,00,000"
      },
      {
        id: "LA2024007",
        customerName: "Rahul Malhotra",
        loanType: "Home Loan",
        amount: "₹35,00,000",
        riskLevel: "Medium",
        status: "Under Review",
        appliedDate: "2024-08-09",
        customerEmail: "rahul@example.com",
        panNumber: "JKLMN5678O",
        aadhaarNumber: "789012345678",
        phoneNumber: "+91 9876543216",
        address: "147 Koramangala, Bangalore, Karnataka 560034",
        dateOfBirth: "1987-04-25",
        occupation: "IT Consultant",
        annualIncome: "₹20,00,000"
      },
      {
        id: "LA2024008",
        customerName: "Sanjay Verma",
        loanType: "Business Loan",
        amount: "₹18,00,000",
        riskLevel: "Medium",
        status: "Pending",
        appliedDate: "2024-08-11",
        customerEmail: "sanjay@example.com",
        panNumber: "PQRST9012U",
        aadhaarNumber: "890123456789",
        phoneNumber: "+91 9876543217",
        address: "258 Andheri West, Mumbai, Maharashtra 400058",
        dateOfBirth: "1983-12-03",
        occupation: "Retail Business",
        annualIncome: "₹14,00,000"
      },
      {
        id: "LA2024009",
        customerName: "Anjali Desai",
        loanType: "Personal Loan",
        amount: "₹4,50,000",
        riskLevel: "High",
        status: "Rejected",
        appliedDate: "2024-08-07",
        customerEmail: "anjali@example.com",
        panNumber: "VWXYZ3456A",
        aadhaarNumber: "901234567890",
        phoneNumber: "+91 9876543218",
        address: "369 Satellite, Ahmedabad, Gujarat 380015",
        dateOfBirth: "1991-06-14",
        occupation: "Freelancer",
        annualIncome: "₹5,00,000"
      },
      {
        id: "LA2024010",
        customerName: "Mohammed Khan",
        loanType: "Car Loan",
        amount: "₹9,00,000",
        riskLevel: "Low",
        status: "Approved",
        appliedDate: "2024-08-12",
        customerEmail: "mohammed@example.com",
        panNumber: "BCDEF7890G",
        aadhaarNumber: "012345678901",
        phoneNumber: "+91 9876543219",
        address: "741 Jubilee Hills, Hyderabad, Telangana 500033",
        dateOfBirth: "1989-10-07",
        occupation: "Bank Manager",
        annualIncome: "₹16,00,000"
      },
    ];

    // Return applications with predefined credit scores
    return applicationsData;
  };

  const [applications, setApplications] = useState([]);

  const loadLoanApplications = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/all-loan-applications');
      const data = await response.json();
      if (data.status === 'Success') {
        const realApps = data.applications.map(app => {
          // Get user credit score from allUsers if available
          const userInfo = allUsers.find(user => user.id === app.userId);
          const creditScore = userInfo?.creditScore || generateConsistentScores(app.applicationId).creditScore;
          
          return {
            id: app.applicationId,
            mongoId: app._id,
            customerName: app.applicantName,
            loanType: app.loanType,
            amount: `₹${Number(app.requestedAmount).toLocaleString('en-IN')}`,
            riskLevel: userInfo?.riskLevel || 'Medium',
            status: app.status,
            appliedDate: new Date(app.submittedAt).toISOString().split('T')[0],
            customerEmail: app.email,
            panNumber: app.pan || 'N/A',
            aadhaarNumber: app.aadhaar,
            phoneNumber: app.phone,
            address: app.address || 'N/A',
            dateOfBirth: app.dob || '1990-01-01',
            occupation: app.employmentType,
            annualIncome: `₹${Number(app.annualIncome).toLocaleString('en-IN')}`,
            creditScore: creditScore,
            userId: app.userId,
            isReal: true
          };
        });
        
        // Create applications for users without loan applications
        const usersWithoutApps = allUsers.filter(user => 
          !realApps.some(app => app.userId === user.id)
        ).map(user => ({
          id: `LA${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
          customerName: user.name,
          loanType: "Personal Loan",
          amount: "₹3,00,000",
          riskLevel: user.riskLevel,
          status: "Pending",
          appliedDate: new Date().toISOString().split('T')[0],
          customerEmail: user.email,
          panNumber: user.pan || 'N/A',
          aadhaarNumber: user.aadhaar,
          phoneNumber: user.phone,
          address: user.city || 'N/A',
          dateOfBirth: '1990-01-01',
          occupation: 'Professional',
          annualIncome: '₹6,00,000',
          creditScore: user.creditScore,
          userId: user.id,
          isGenerated: true
        }));
        
        // Combine with static applications
        const staticApps = generateApplications();
        setApplications([...realApps, ...usersWithoutApps, ...staticApps]);
      } else {
        setApplications(generateApplications());
      }
    } catch (error) {
      console.error('Failed to load loan applications:', error);
      setApplications(generateApplications());
    }
  };

  const updateApplicationStatus = async (applicationId, status, rejectionReason = '') => {
    try {
      const userId = localStorage.getItem("userId");
      
      // Find the application by ID to get the MongoDB _id
      const app = applications.find(a => a.id === applicationId);
      if (!app) {
        console.error('Application not found');
        return;
      }
      
      // For static applications, just update locally
      if (applicationId.startsWith('LA2024')) {
        setApplications(prev => 
          prev.map(a => 
            a.id === applicationId 
              ? { ...a, status: status === 'Approved' ? 'Approved' : 'Rejected' }
              : a
          )
        );
        return;
      }
      
      // For real applications from backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications/${app.mongoId || applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewedBy: userId, rejectionReason })
      });
      const data = await response.json();
      if (data.status === 'Success') {
        loadLoanApplications();
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
      // Fallback to local update
      setApplications(prev => 
        prev.map(a => 
          a.id === applicationId 
            ? { ...a, status: status === 'Approved' ? 'Approved' : 'Rejected' }
            : a
        )
      );
    }
  };

  useEffect(() => {
    loadLoanApplications();
    // Load initial static data
    if (applications.length === 0) {
      setApplications(generateApplications());
    }
  }, [allUsers]); // Reload when users change
  const [rejectingApplication, setRejectingApplication] = useState(null);
  const [reviewingApplication, setReviewingApplication] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isRejectionSuccess, setIsRejectionSuccess] = useState(false);
  const bankEmail = localStorage.getItem("userEmail") || "bank@demo.com";

  const handleLogout = () => {
    navigate("/signin");
  };

  // Mock bank data
  const totalUsers = 15420;
  const totalApplications = 2847;
  const approvalRate = 73.5;

  const riskDistribution = [
    { name: "Low Risk", value: 65, color: "hsl(142 76% 36%)" },
    { name: "Medium Risk", value: 25, color: "hsl(38 92% 50%)" },
    { name: "High Risk", value: 10, color: "hsl(0 84.2% 60.2%)" },
  ];

  // Generate consistent bureau scores for the dashboard using user's actual credit score
  const userCreditScore = parseInt(localStorage.getItem("userCreditScore")) || 761;
  const bureauScores = [
    {
      name: "CIBIL",
      score: userCreditScore,
      range: "300 – 900",
      peerAverage: 77,
      postAverage: 72
    },
    {
      name: "Equifax",
      score: Math.max(300, Math.min(900, userCreditScore - 27)),
      range: "300 – 900",
      peerAverage: 58,
      postAverage: 61
    },
    {
      name: "Experian",
      score: Math.max(300, Math.min(900, userCreditScore - 17)),
      range: "300 – 900",
      peerAverage: 70,
      postAverage: 68
    },
    {
      name: "CRIF",
      score: Math.max(300, Math.min(900, userCreditScore + 3)),
      range: "300 – 900",
      peerAverage: 79,
      postAverage: 82
    },
  ];

  // Generate consistent credit score history for the dashboard
  // Ensure the last data point matches the bureau scores
  const creditScoreHistory = [
    { month: "Sept 2024", cibil: userCreditScore - 41, experian: userCreditScore - 51, equifax: userCreditScore - 71, crif: userCreditScore - 31 },
    { month: "Oct 2024", cibil: userCreditScore - 33, experian: userCreditScore - 44, equifax: userCreditScore - 62, crif: userCreditScore - 24 },
    { month: "Nov 2024", cibil: userCreditScore - 25, experian: userCreditScore - 37, equifax: userCreditScore - 53, crif: userCreditScore - 17 },
    { month: "Dec 2024", cibil: userCreditScore - 17, experian: userCreditScore - 30, equifax: userCreditScore - 44, crif: userCreditScore - 10 },
    { month: "Jan 2025", cibil: userCreditScore - 9, experian: userCreditScore - 23, equifax: userCreditScore - 35, crif: userCreditScore - 3 },
    {
      month: "Feb 2025", cibil: bureauScores[0].score, experian: bureauScores[2].score,
      equifax: bureauScores[1].score, crif: bureauScores[3].score
    },
  ];

  const monthlyData = [
    { month: "Jan", applications: 180, approvals: 132 },
    { month: "Feb", applications: 220, approvals: 165 },
    { month: "Mar", applications: 195, approvals: 145 },
    { month: "Apr", applications: 240, approvals: 180 },
    { month: "May", applications: 285, approvals: 215 },
    { month: "Jun", applications: 310, approvals: 225 },
    { month: "Jul", applications: 275, approvals: 205 },
    { month: "Aug", applications: 290, approvals: 218 },
  ];

  // Enhanced Analytics Data
  const bureauStatusData = [
    { name: "CIBIL", status: "operational", uptime: "99.8%", lastUpdate: "2 min ago", responseTime: "120ms" },
    { name: "CRIF", status: "operational", uptime: "99.5%", lastUpdate: "1 min ago", responseTime: "95ms" },
    { name: "Equifax", status: "warning", uptime: "97.2%", lastUpdate: "15 min ago", responseTime: "340ms" },
    { name: "Experian", status: "operational", uptime: "99.9%", lastUpdate: "30 sec ago", responseTime: "85ms" },
  ];

  const scoreVarianceData = [
    { applicantId: "LA2024001", name: "Rajesh Kumar", cibil: 761, crif: 745, equifax: 720, experian: 755, variance: 41, riskFlag: "medium" },
    { applicantId: "LA2024003", name: "Amit Patel", cibil: 680, crif: 695, equifax: 650, experian: 720, variance: 70, riskFlag: "high" },
    { applicantId: "LA2024007", name: "Rahul Malhotra", cibil: 745, crif: 740, equifax: 735, experian: 750, variance: 15, riskFlag: "low" },
    { applicantId: "LA2024009", name: "Anjali Desai", cibil: 580, crif: 620, equifax: 560, experian: 640, variance: 80, riskFlag: "high" },
  ];

  const decisionMetrics = {
    avgDecisionTime: "4.2 hours",
    approvalRateByRisk: {
      low: 92,
      medium: 68,
      high: 23
    },
    bureauImpact: {
      withAllBureaus: 85,
      withMissingData: 62
    }
  };

  const trendsData = [
    { week: "W1", applications: 245, approvals: 180, avgRisk: 2.3 },
    { week: "W2", applications: 267, approvals: 195, avgRisk: 2.1 },
    { week: "W3", applications: 289, approvals: 210, avgRisk: 2.4 },
    { week: "W4", applications: 312, approvals: 225, avgRisk: 2.2 },
  ];

  const alerts = [
    { id: 1, type: "warning", message: "Equifax response time increased by 180% in last hour", timestamp: "15 min ago", severity: "medium" },
    { id: 2, type: "info", message: "High variance detected in 12 applications today", timestamp: "1 hour ago", severity: "low" },
    { id: 3, type: "success", message: "Decision time improved by 15% this week", timestamp: "2 hours ago", severity: "low" },
  ];

  const recommendations = [
    { id: 1, title: "Increase Moderate Risk Lending", description: "68% approval rate suggests room for growth in medium-risk segment", action: "Review Criteria", priority: "high" },
    { id: 2, title: "Bureau Redundancy Check", description: "4 applications failed due to Equifax timeout - consider backup scoring", action: "Configure Fallback", priority: "medium" },
    { id: 3, title: "Score Variance Investigation", description: "80+ point variance in 4 applications requires manual review", action: "Flag Applications", priority: "high" },
  ];

  const getBureauStatusBadge = (status) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-700 border-green-200"><Wifi className="h-3 w-3 mr-1" />Operational</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>;
      case "down":
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Down</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVarianceRiskBadge = (riskFlag) => {
    switch (riskFlag) {
      case "low":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Low Variance</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium Variance</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-700 border-red-200">High Variance</Badge>;
      default:
        return <Badge variant="outline">{riskFlag}</Badge>;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200">
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">
            Rejected
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200">
            Pending
          </Badge>
        );
      case "Under Review":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
            Under Review
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };


  const getRiskBadge = (risk) => {
    switch (risk) {
      case "Low":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Low
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>
        );
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.customerName.toLowerCase().includes(searchUser.toLowerCase()) ||
      app.customerEmail.toLowerCase().includes(searchUser.toLowerCase()) ||
      app.id.toLowerCase().includes(searchUser.toLowerCase()) ||
      app.panNumber.toLowerCase().includes(searchUser.toLowerCase()) ||
      app.aadhaarNumber.includes(searchUser);

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'high-risk' && app.riskLevel === 'High') ||
      (activeFilter === 'medium-risk' && app.riskLevel === 'Medium') ||
      (activeFilter === 'low-risk' && app.riskLevel === 'Low') ||
      (activeFilter === 'pending' && app.status === 'Pending') ||
      (activeFilter === 'under-review' && app.status === 'Under Review') ||
      (activeFilter === 'approved' && app.status === 'Approved') ||
      (activeFilter === 'rejected' && app.status === 'Rejected');

    return matchesSearch && matchesFilter;
  });

  const handleReview = (applicationId, reviewNotes) => {
    // Update application status to "Under Review" and add review notes
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: "Under Review", reviewNotes }
          : app
      )
    );

    setSuccessMessage("Application has been reviewed successfully");
    setShowSuccess(true);
    setIsRejectionSuccess(false);
  };

  const handleApprove = async (applicationId) => {
    await updateApplicationStatus(applicationId, 'Approved');
    setSuccessMessage("Application approved successfully!");
    setShowSuccess(true);
    setIsRejectionSuccess(false);
  };

  const handleReject = async (applicationId, reason) => {
    await updateApplicationStatus(applicationId, 'Rejected', reason);
    setSuccessMessage("Application rejected successfully");
    setShowSuccess(true);
    setIsRejectionSuccess(true);
  };

  const openRejectionForm = (application) => {
    setRejectingApplication(application);
  };

  const closeRejectionForm = () => {
    setRejectingApplication(null);
  };

  const openReviewForm = (application) => {
    setReviewingApplication(application);
  };

  const closeReviewForm = () => {
    setReviewingApplication(null);
  };

  // Validation functions
  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
  };

  const validateInputs = () => {
    const errors = {};
    const pan = panInput.trim().toUpperCase();
    const aadhaar = aadhaarInput.trim().replace(/\s/g, '');

    if (!pan && !aadhaar) {
      errors.general = "Please enter either PAN or Aadhaar number";
    }

    if (pan && !validatePAN(pan)) {
      errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    if (aadhaar && !validateAadhaar(aadhaar)) {
      errors.aadhaar = "Invalid Aadhaar format (12 digits)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearSearch = () => {
    setPanInput("");
    setAadhaarInput("");
    setShowCustomerInfo(false);
    setSelectedCustomer(null);
    setSearchError("");
    setValidationErrors({});
  };

  const handleSearch = async () => {
    setSearchError("");
    
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Search timeout')), 10000)
    );

    try {
      const searchQuery = (panInput.trim().toUpperCase() || aadhaarInput.trim().replace(/\s/g, ''));
      
      // Race between API call and timeout
      const response = await Promise.race([
        api.searchUsers(searchQuery),
        timeoutPromise
      ]);

      if (response.status === "Success" && response.users.length > 0) {
        const foundUser = response.users[0];
        setSelectedCustomer({
          customerName: foundUser.name,
          panNumber: foundUser.pan,
          aadhaarNumber: foundUser.aadhaar,
          phoneNumber: foundUser.phone,
          customerEmail: foundUser.email,
          address: foundUser.address,
          occupation: foundUser.occupation,
          annualIncome: foundUser.annualIncome,
          creditScore: foundUser.creditScore,
          riskLevel: foundUser.riskLevel,
          status: foundUser.status
        });
        setShowCustomerInfo(true);
        setSearchError("");
      } else {
        setSelectedCustomer(null);
        setShowCustomerInfo(true);
        setSearchError(`No user found with ${panInput ? 'PAN: ' + panInput.toUpperCase() : 'Aadhaar: ' + aadhaarInput}`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSelectedCustomer(null);
      setShowCustomerInfo(false);
      
      if (error.message === 'Search timeout') {
        setSearchError("Search request timed out. Please try again.");
      } else {
        setSearchError("Search failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Sophisticated rule-based function to simulate AI-powered risk assessment
  const generateRiskAssessment = (loanAmount, loanTenure, monthlyIncome, employmentType, employmentTenure, loanPurpose) => {
    const loanAmt = parseInt(loanAmount) || 0;
    const tenure = parseInt(loanTenure) || 12; // Default to 12 months
    const income = parseInt(monthlyIncome) || 0;
    const empTenure = parseInt(employmentTenure) || 0;

    // Calculate monthly EMI (simple approximation: loan / tenure + 10% interest factor)
    const monthlyEMI = Math.round((loanAmt * 1.1) / tenure);
    const emiToIncomeRatio = income > 0 ? ((monthlyEMI / income) * 100).toFixed(1) : 100; // High if no income

    // Base risk score (0-100)
    let riskScore = 0;
    const riskFactors = [];
    let recommendation = "APPROVE";
    let recommendationColor = "green";
    let analysisVariants = []; // For varied language

    // Rule 1: Debt-to-Income (DTI) Ratio (industry standard: <50% ideal, >50% high risk)
    if (emiToIncomeRatio > 50) {
      riskScore += 40;
      riskFactors.push(`High EMI-to-income ratio (${emiToIncomeRatio}%) exceeds the recommended 50% threshold, indicating potential repayment strain.`);
      analysisVariants.push("high EMI burden outweighs the applicant's income stability");
    } else if (emiToIncomeRatio > 30) {
      riskScore += 20;
      riskFactors.push(`Elevated EMI-to-income ratio (${emiToIncomeRatio}%) above comfortable 30% level.`);
      analysisVariants.push("moderate EMI load that could strain monthly finances");
    } else {
      analysisVariants.push("strong repayment capacity with low EMI burden");
    }

    // Rule 2: Employment Stability (industry standard: >2 years preferred for low risk)
    if (empTenure < 2) {
      riskScore += 25;
      riskFactors.push(`Short employment tenure of ${empTenure} year(s) suggests potential job instability.`);
      analysisVariants.push("limited employment history raising concerns about income consistency");
    } else {
      analysisVariants.push("solid employment history providing confidence in ongoing income");
    }

    // Rule 3: Loan Amount vs. Income (industry standard: loan < 5-10x annual income)
    const annualIncome = income * 12;
    if (loanAmt > annualIncome * 5) {
      riskScore += 20;
      riskFactors.push(`Loan amount (₹${loanAmt.toLocaleString()}) is disproportionately high compared to annual income (₹${annualIncome.toLocaleString()}).`);
      analysisVariants.push("oversized loan request relative to earnings");
    }

    // Rule 4: Employment Type Risk (self-employed/freelancer often higher risk due to income variability)
    if (employmentType === "Self-Employed" || employmentType === "Freelancer") {
      riskScore += 15;
      riskFactors.push(`${employmentType} status may lead to irregular income streams.`);
      analysisVariants.push("variable income from self-employment adding uncertainty");
    } else if (employmentType === "Salaried") {
      analysisVariants.push("stable salaried position enhancing repayment reliability");
    }

    // Rule 5: Tenure and Purpose (short tenure increases EMI; certain purposes like "business" add risk)
    if (tenure < 12) {
      riskScore += 10;
      riskFactors.push(`Short tenure of ${tenure} months results in higher monthly payments.`);
      analysisVariants.push("compressed repayment period increasing monthly pressure");
    }
    if (loanPurpose.toLowerCase().includes("business") || loanPurpose.toLowerCase().includes("investment")) {
      riskScore += 10;
      riskFactors.push(`High-risk loan purpose ("${loanPurpose}") may involve volatile returns.`);
      analysisVariants.push("speculative purpose like business expansion");
    }

    // Seeded randomization for demo realism (use loanAmt as seed for consistent variation)
    const seed = loanAmt % 100;
    riskScore = Math.min(100, riskScore + (seed % 10)); // Slight random fluctuation

    // Determine recommendation based on score
    if (riskScore >= 60) {
      recommendation = "REJECT";
      recommendationColor = "red";
    } else if (riskScore >= 30) {
      recommendation = "REVIEW";
      recommendationColor = "yellow";
    }

    // Generate varied, authentic-sounding analysis text (simulate AI by combining variants)
    const analysisText = riskScore >= 60
      ? `This application carries high risk due to ${analysisVariants.slice(0, 2).join(' and ')}. With an EMI of ₹${monthlyEMI.toLocaleString()} against monthly income of ₹${income.toLocaleString()}, repayment could be challenging. Recommend rejection and advise the applicant to improve factors like ${riskFactors[0]?.split(' ')[0].toLowerCase() || 'income stability'}.`
      : riskScore >= 30
        ? `Moderate risk profile with ${analysisVariants.slice(0, 2).join(' but offset by ')}. The ${emiToIncomeRatio}% DTI is manageable, but additional verification on ${employmentType.toLowerCase()} income is advised. Proceed to manual review for potential approval with conditions.`
        : `Low-risk application supported by ${analysisVariants.slice(0, 2).join(' and ')}. Strong indicators like stable ${employmentType.toLowerCase()} employment and low DTI of ${emiToIncomeRatio}% suggest reliable repayment. Approve with standard terms.`;

    return {
      recommendation,
      recommendationColor,
      riskScore,
      riskFactors,
      emiToIncomeRatio,
      monthlyEMI,
      analysisText,
    };
  };

  const handleAssessRisk = () => {
    const assessment = generateRiskAssessment(loanAmount, loanTenure, monthlyIncome, employmentType, employmentTenure, loanPurpose);
    setRiskAssessment(assessment);
    setShowRiskAssessment(true);
  };

  const handleFilterAlerts = () => {
    setShowFilterModal(true);
  };

  const handleReviewCriteria = () => {
    setShowReviewCriteria(true);
  };

  const handleConfigureFallback = () => {
    setShowFallbackConfig(true);
  };

  const handleFlagApplications = () => {
    const highVarianceApps = scoreVarianceData.filter(app => app.variance >= 70);
    setFlaggedApplications(prev => [...prev, ...highVarianceApps.map(app => app.applicantId)]);
    setSuccessMessage(`${highVarianceApps.length} applications flagged for manual review`);
    setShowSuccess(true);
    setIsRejectionSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-lg">
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
                  Know Your Credit
                </h1>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-1">
                  Bank Portal
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-sm font-semibold text-gray-800">
                  {bankEmail}
                </p>
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

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Users
              </CardTitle>
              <Users className="h-6 w-6 text-blue-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">
                {totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-blue-100 mt-2">
                📈 +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">
                Total Applications
              </CardTitle>
              <FileText className="h-6 w-6 text-emerald-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">
                {totalApplications.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-100 mt-2">
                📊 +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Approval Rate
              </CardTitle>
              <TrendingUp className="h-6 w-6 text-purple-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{approvalRate}%</div>
              <p className="text-xs text-purple-100 mt-2">
                ⬆️ +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="applications" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg p-1 rounded-xl">
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="lookup"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Credit Lookup
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="bureau"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Bureau Status
            </TabsTrigger>
          </TabsList>



          <TabsContent value="lookup">
            <div className="space-y-6">
              {/* Customer Lookup Section */}
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Customer Lookup
                  </CardTitle>
                  <CardDescription>
                    Search for customer details using Aadhaar or PAN.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Input
                        placeholder="Enter PAN (e.g., ABCDE1234F)"
                        className={`border-gray-300 focus:border-blue-500 ${validationErrors.pan ? 'border-red-500' : ''}`}
                        value={panInput}
                        onChange={(e) => {
                          setPanInput(e.target.value.toUpperCase());
                          if (validationErrors.pan) {
                            setValidationErrors(prev => ({ ...prev, pan: '' }));
                          }
                        }}
                        maxLength={10}
                      />
                      {validationErrors.pan && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.pan}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Enter Aadhaar (e.g., 123456789012)"
                        className={`border-gray-300 focus:border-blue-500 ${validationErrors.aadhaar ? 'border-red-500' : ''}`}
                        value={aadhaarInput}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setAadhaarInput(value);
                          if (validationErrors.aadhaar) {
                            setValidationErrors(prev => ({ ...prev, aadhaar: '' }));
                          }
                        }}
                        maxLength={12}
                      />
                      {validationErrors.aadhaar && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.aadhaar}</p>
                      )}
                    </div>
                  </div>
                  
                  {validationErrors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{validationErrors.general}</p>
                    </div>
                  )}
                  
                  {searchError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{searchError}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                      onClick={handleSearch}
                      disabled={loading || (!panInput.trim() && !aadhaarInput.trim())}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Searching...
                        </div>
                      ) : (
                        'Search'
                      )}
                    </Button>
                    {(showCustomerInfo || panInput || aadhaarInput) && (
                      <Button
                        variant="outline"
                        onClick={clearSearch}
                        className="px-4"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              {showCustomerInfo && (
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedCustomer ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-semibold text-gray-800">{selectedCustomer.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PAN Number</p>
                          <p className="font-semibold text-gray-800">{selectedCustomer.panNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Aadhaar Number</p>
                          <p className="font-semibold text-gray-800">
                            {selectedCustomer.aadhaarNumber && selectedCustomer.aadhaarNumber !== 'N/A' ? 
                              `XXXX-XXXX-${selectedCustomer.aadhaarNumber.slice(-4)}` : 
                              'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <p className="font-semibold text-gray-800">{selectedCustomer.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-semibold text-gray-800">{selectedCustomer.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Occupation</p>
                          <p className="font-semibold text-gray-800">{selectedCustomer.occupation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Annual Income</p>
                          <p className="font-semibold text-gray-800">{selectedCustomer.annualIncome}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Inquiries (Last 12 months)</p>
                          <p className="font-semibold text-gray-800">0</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center justify-center mb-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                            <p className="text-yellow-800 font-medium">User Not Found</p>
                          </div>
                          <p className="text-yellow-600 text-sm">
                            {searchError || `No user found with the provided ${panInput ? 'PAN' : 'Aadhaar'} number`}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSearch}
                            className="mt-3 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                          >
                            Try Another Search
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Unified Customer Info Grid (50/50 Layout) */}
              {showCustomerInfo && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-full">

                  {/* LEFT COLUMN (Credit Score full height) */}
                  <div className="flex flex-col h-full">
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden h-full flex flex-col">
                      {/* Credit Score Header */}
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                        <CardTitle className="flex items-center justify-between">
                          Credit Score
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 flex-1 flex flex-col justify-between">
                        {/* --- Credit Score Content --- */}
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <p className="text-sm text-blue-700">
                            ℹ️ The displayed score is normalized using Min-max scaling. To get a specialized unified score for your needs, please select a loan type below.
                          </p>
                        </div>
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-700 block mb-2">Loan Type</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Select loan type</option>
                            <option>Personal Loan</option>
                            <option>Home Loan</option>
                            <option>Car Loan</option>
                            <option>Business Loan</option>
                          </select>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Normalized Credit Score</p>
                          <div className="relative">
                            <AnimatedSpeedometer
                              bureauName="Normalized"
                              score={selectedCustomer?.creditScore || 0}
                              range="300-900"
                              peerAverage={78}
                              postAverage={78}
                              size="large"
                            />
                          </div>
                          <div className="flex items-center justify-center mt-4">
                            {selectedCustomer && (
                              <div
                                className={`flex items-center px-3 py-1 rounded-full ${
                                  selectedCustomer.creditScore >= 750
                                    ? "bg-green-100"
                                    : selectedCustomer.creditScore >= 650
                                      ? "bg-yellow-100"
                                      : "bg-red-100"
                                }`}
                              >
                                <CheckCircle
                                  className={`h-4 w-4 mr-1 ${
                                    selectedCustomer.creditScore >= 750
                                      ? "text-green-600"
                                      : selectedCustomer.creditScore >= 650
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-medium ${
                                    selectedCustomer.creditScore >= 750
                                      ? "text-green-700"
                                      : selectedCustomer.creditScore >= 650
                                        ? "text-yellow-700"
                                        : "text-red-700"
                                  }`}
                                >
                                  {selectedCustomer.creditScore >= 750
                                    ? "Low Risk"
                                    : selectedCustomer.creditScore >= 650
                                      ? "Medium Risk"
                                      : "High Risk"}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Last updated on Feb 2025
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* RIGHT COLUMN (Cards shrink to content) */}
                  <div className="flex flex-col h-full space-y-6">

                    {/* Active Loans */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                        <CardTitle className="flex items-center justify-between">
                          Active Loans
                          <FileText className="h-5 w-5 text-blue-600" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{selectedCustomer ? 1 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 3) : 1}</span>
                            <p className="text-sm text-gray-600">
                              Total outstanding ₹{selectedCustomer ? (25000 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 200000)).toLocaleString('en-IN') : '54,726'}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800">Active Loans</h4>
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-gray-800">{selectedCustomer ? ['Auto Loan', 'Home Loan', 'Personal Loan', 'Credit Card'][selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4] : 'Auto Loan'}</p>
                                  <p className="text-sm text-gray-600">{selectedCustomer ? ['CitiBank', 'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'][selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 5] : 'CitiBank'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-800">₹{selectedCustomer ? (25000 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 200000)).toLocaleString('en-IN') : '54,726'}</p>
                                  <p className="text-sm text-gray-600">EMI: ₹{selectedCustomer ? Math.round((25000 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 200000)) * 0.02).toLocaleString('en-IN') : '1,244'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Credit Account Age */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                        <CardTitle>Credit Account Age</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <span className="text-3xl font-bold text-gray-800">{selectedCustomer ? 6 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 48) : 14}</span>
                            <span className="text-lg text-gray-600 ml-2">months</span>
                          </div>
                          <p className="text-sm text-gray-600">Oldest account: {selectedCustomer ? ['Mortgage', 'Credit Card', 'Auto Loan', 'Personal Loan'][selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4] : 'Mortgage'}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment History */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                        <CardTitle>Payment History</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-3xl font-bold text-green-600">{selectedCustomer ? 30 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 50) : 57}</span>
                              <p className="text-sm text-gray-600">On-time payments</p>
                            </div>
                            <div>
                              <span className="text-3xl font-bold text-red-600">{selectedCustomer ? selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4 : 1}</span>
                              <p className="text-sm text-gray-600">
                                Missed installments across all loans
                              </p>
                            </div>
                          </div>

                          {/* Payment History Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Payment History</span>
                              <span className="text-sm font-semibold">{selectedCustomer ? (() => { const onTime = 30 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 50); const missed = selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4; return Math.round((onTime / (onTime + missed)) * 100); })() : 98}% On-time</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedCustomer ? (() => { const onTime = 30 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 50); const missed = selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4; return Math.round((onTime / (onTime + missed)) * 100); })() : 98}%` }}></div>
                            </div>
                          </div>

                          {/* Credit Utilization Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Credit Utilization</span>
                              <span className="text-sm font-semibold">{selectedCustomer ? 10 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 40) : 15}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedCustomer ? 10 + (selectedCustomer.customerName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 40) : 15}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}



              {/* Loan Risk Assessment */}
              {showCustomerInfo && (
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                    <CardTitle>Loan Risk Assessment</CardTitle>
                    <CardDescription>
                      Enter loan request details to get an risk assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Loan Amount (₹)</label>
                        <Input
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Loan Tenure (months)</label>
                        <Input
                          value={loanTenure}
                          onChange={(e) => setLoanTenure(e.target.value)}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 block mb-2">Loan Purpose</label>
                      <Textarea
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        className="border-gray-300 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Monthly Income (₹)</label>
                        <Input
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Employment Type</label>
                        <select
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500"
                        >
                          <option>Salaried</option>
                          <option>Self-Employed</option>
                          <option>Business Owner</option>
                          <option>Freelancer</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 block mb-2">Employment Tenure (years)</label>
                      <Input
                        value={employmentTenure}
                        onChange={(e) => setEmploymentTenure(e.target.value)}
                        className="border-gray-300 focus:border-blue-500 w-full md:w-1/2"
                      />
                    </div>
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
                      onClick={handleAssessRisk}
                    >
                      Assess Risk →
                    </Button>
                  </CardContent>
                </Card>
              )}
              {/* Risk Assessment Result */}
              {showRiskAssessment && riskAssessment && (
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-red-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <CardTitle>Risk Assessment Result</CardTitle>
                      </div>
                      <Badge className={`bg-${riskAssessment.recommendationColor}-100 text-${riskAssessment.recommendationColor}-700 border-${riskAssessment.recommendationColor}-200`}>
                        {riskAssessment.recommendation}
                      </Badge>
                    </div>
                    <CardDescription>
                      AI-powered analysis of the loan application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Analysis Summary */}
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-800">Analysis Summary</h3>
                        </div>
                        <p className="text-sm text-blue-700">{riskAssessment.analysisText}</p>
                      </div>

                      {/* Risk Factors */}
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <h3 className="font-semibold text-red-800">Risk Factors</h3>
                        </div>
                        <div className="space-y-2">
                          {riskAssessment.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              <p className="text-sm text-red-700">{factor}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Disclaimer */}
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-blue-600">
                          This assessment is based on the provided information and credit history. Final lending decisions may require additional verification.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="applications">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Loan Applications
                    </CardTitle>
                    <CardDescription>
                      Manage and review loan applications
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="pl-10 w-64 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 px-6 pb-4">
                  <Button
                    size="sm"
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('all')}
                    className={activeFilter === 'all' ? 'bg-blue-500 text-white' : 'text-gray-600'}
                  >
                    All ({applications.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFilter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('pending')}
                    className={activeFilter === 'pending' ? 'bg-amber-500 text-white' : 'text-amber-600 border-amber-200'}
                  >
                    Pending ({applications.filter(app => app.status === 'Pending').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFilter === 'under-review' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('under-review')}
                    className={activeFilter === 'under-review' ? 'bg-blue-500 text-white' : 'text-blue-600 border-blue-200'}
                  >
                    Under Review ({applications.filter(app => app.status === 'Under Review').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFilter === 'approved' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('approved')}
                    className={activeFilter === 'approved' ? 'bg-green-500 text-white' : 'text-green-600 border-green-200'}
                  >
                    Approved ({applications.filter(app => app.status === 'Approved').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFilter === 'rejected' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('rejected')}
                    className={activeFilter === 'rejected' ? 'bg-red-500 text-white' : 'text-red-600 border-red-200'}
                  >
                    Rejected ({applications.filter(app => app.status === 'Rejected').length})
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <Button
                    size="sm"
                    variant={activeFilter === 'high-risk' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('high-risk')}
                    className={activeFilter === 'high-risk' ? 'bg-red-500 text-white' : 'text-red-600 border-red-200'}
                  >
                    High Risk ({applications.filter(app => app.riskLevel === 'High').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFilter === 'medium-risk' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('medium-risk')}
                    className={activeFilter === 'medium-risk' ? 'bg-yellow-500 text-white' : 'text-yellow-600 border-yellow-200'}
                  >
                    Medium Risk ({applications.filter(app => app.riskLevel === 'Medium').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFilter === 'low-risk' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('low-risk')}
                    className={activeFilter === 'low-risk' ? 'bg-green-500 text-white' : 'text-green-600 border-green-200'}
                  >
                    Low Risk ({applications.filter(app => app.riskLevel === 'Low').length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-700">
                          Application ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Customer
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Loan Type
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Amount
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Credit Score
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Risk
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Applied On
                        </TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <TableRow
                          key={app.id}
                          className="hover:bg-blue-50/50 transition-colors duration-200"
                        >
                          <TableCell className="font-medium text-blue-600">
                            {app.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {app.customerName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {app.customerName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {app.customerEmail}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {app.loanType}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {app.amount}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${(app.creditScore || generateConsistentScores(app.id).creditScore) >= 750
                                ? "bg-green-100 text-green-700"
                                : (app.creditScore || generateConsistentScores(app.id).creditScore) >= 650
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                                } font-bold`}
                            >
                              {app.creditScore || generateConsistentScores(app.id).creditScore}
                            </Badge>
                          </TableCell>
                          <TableCell>{getRiskBadge(app.riskLevel)}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                                onClick={() => openReviewForm(app)}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Review
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleApprove(app.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() => openRejectionForm(app)}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="space-y-6">

              {/* Score Consistency Checker & Decision Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Variance */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      Score Consistency Checker
                    </CardTitle>
                    <CardDescription>Applications with highest bureau score variance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scoreVarianceData.map((item) => (
                        <div key={item.applicantId} className={`rounded-lg p-3 border ${flaggedApplications.includes(item.applicantId)
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-100'
                          }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-800">{item.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({item.applicantId})</span>
                            </div>
                            {getVarianceRiskBadge(item.riskFlag)}
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-medium text-blue-600">{item.cibil}</div>
                              <div className="text-gray-500">CIBIL</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-purple-600">{item.crif}</div>
                              <div className="text-gray-500">CRIF</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-orange-600">{item.equifax}</div>
                              <div className="text-gray-500">Equifax</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-green-600">{item.experian}</div>
                              <div className="text-gray-500">Experian</div>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <span className="text-sm font-medium text-red-600">Variance: {item.variance} points</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Decision Metrics */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Clock className="h-5 w-5 text-green-600" />
                      Decision & Turnaround Metrics
                    </CardTitle>
                    <CardDescription>Key performance indicators for lending decisions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{decisionMetrics.avgDecisionTime}</div>
                          <div className="text-sm text-blue-700">Average Decision Time</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800">Approval Rate by Risk Band</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Low Risk</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${decisionMetrics.approvalRateByRisk.low}%` }}></div>
                              </div>
                              <span className="text-sm font-medium">{decisionMetrics.approvalRateByRisk.low}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Medium Risk</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${decisionMetrics.approvalRateByRisk.medium}%` }}></div>
                              </div>
                              <span className="text-sm font-medium">{decisionMetrics.approvalRateByRisk.medium}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">High Risk</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${decisionMetrics.approvalRateByRisk.high}%` }}></div>
                              </div>
                              <span className="text-sm font-medium">{decisionMetrics.approvalRateByRisk.high}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <h4 className="font-medium text-gray-800 mb-2">Bureau Data Impact</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">With All Bureaus:</span>
                          <span className="font-medium text-green-600">{decisionMetrics.bureauImpact.withAllBureaus}% approval</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Missing Data:</span>
                          <span className="font-medium text-red-600">{decisionMetrics.bureauImpact.withMissingData}% approval</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trends & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trends */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Weekly Trends
                    </CardTitle>
                    <CardDescription>Application volume and risk profile trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="week" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip />
                          <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Applications" />
                          <Line type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={2} name="Approvals" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Actionable Recommendations */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Zap className="h-5 w-5 text-purple-600" />
                      Actionable Insights
                    </CardTitle>
                    <CardDescription>Data-driven recommendations for optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className={`rounded-lg p-3 border ${rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                          rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                          }`}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{rec.title}</h4>
                            <Badge className={`${rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              if (rec.action === 'Review Criteria') handleReviewCriteria();
                              else if (rec.action === 'Configure Fallback') handleConfigureFallback();
                              else if (rec.action === 'Flag Applications') handleFlagApplications();
                            }}
                          >
                            {rec.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="bureau">
            <div className="space-y-6">
              {/* Alerts Banner */}
              {alerts.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Active Alerts
                    </h3>
                    <Button variant="outline" size="sm" className="text-blue-700 border-blue-300" onClick={handleFilterAlerts}>
                      <Filter className="h-4 w-4 mr-1" />Filter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {alerts.slice(0, 2).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between bg-white rounded-md p-3 border border-blue-100">
                        <div className="flex items-center gap-3">
                          {getAlertIcon(alert.type)}
                          <span className="text-sm font-medium text-gray-800">{alert.message}</span>
                          <span className="text-xs text-gray-500">{alert.timestamp}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full">
                <BureauStatusPanel />
              </div>
            </div>
          </TabsContent>


        </Tabs>
      </div>

      {/* Rejection Form Modal */}
      {rejectingApplication && (
        <RejectionForm
          application={rejectingApplication}
          onClose={closeRejectionForm}
          onConfirm={handleReject}
        />
      )}

      {/* Review Form Modal */}
      {reviewingApplication && (
        <ReviewForm
          application={reviewingApplication}
          onClose={closeReviewForm}
          onConfirm={handleReview}
          bureauStatus={bureauStatus}
        />
      )}

      {/* Success Animation Modal */}
      {showSuccess && (
        <SuccessAnimation
          message={successMessage}
          onClose={() => setShowSuccess(false)}
          isRejection={isRejectionSuccess}
        />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Alerts</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilterModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Alert Type</label>
                <select
                  value={filterSettings.alertType}
                  onChange={(e) => setFilterSettings(prev => ({ ...prev, alertType: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Severity</label>
                <select
                  value={filterSettings.severity}
                  onChange={(e) => setFilterSettings(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Time Range</label>
                <select
                  value={filterSettings.timeRange}
                  onChange={(e) => setFilterSettings(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowFilterModal(false)}>Cancel</Button>
              <Button onClick={() => setShowFilterModal(false)} className="bg-blue-500 hover:bg-blue-600">Apply Filters</Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Criteria Modal */}
      {showReviewCriteria && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Review Lending Criteria</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowReviewCriteria(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Current Criteria - Medium Risk Segment</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Credit Score Range:</span>
                    <p className="font-medium">650 - 749</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Current Approval Rate:</span>
                    <p className="font-medium">68%</p>
                  </div>
                  <div>
                    <span className="text-blue-600">DTI Ratio Limit:</span>
                    <p className="font-medium">≤ 40%</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Min Employment Tenure:</span>
                    <p className="font-medium">12 months</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Recommended Adjustments</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Increase DTI ratio limit to 45% for applicants with credit score `{'>'}` 700</li>
                  <li>• Reduce minimum employment tenure to 9 months for salaried employees</li>
                  <li>• Consider bureau score averaging for high-variance cases</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowReviewCriteria(false)}>Close</Button>
              <Button className="bg-green-500 hover:bg-green-600">Update Criteria</Button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Fallback Modal */}
      {showFallbackConfig && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Configure Bureau Fallback</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFallbackConfig(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Current Issue</h4>
                <p className="text-sm text-yellow-700">Equifax timeout affecting 4 applications in the last hour</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Fallback Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Primary Bureau Priority</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>CIBIL (Current)</option>
                      <option>CRIF</option>
                      <option>Experian</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Fallback Strategy</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Use Available Bureaus</option>
                      <option>Wait for Primary</option>
                      <option>Manual Review</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Timeout Threshold (seconds)</label>
                  <Input defaultValue="30" className="w-32" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <label className="text-sm">Auto-retry failed bureau requests</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <label className="text-sm">Send alerts for bureau downtimes `{'>'}` 5 minutes</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowFallbackConfig(false)}>Cancel</Button>
              <Button className="bg-blue-500 hover:bg-blue-600">Save Configuration</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BankDashboard;

