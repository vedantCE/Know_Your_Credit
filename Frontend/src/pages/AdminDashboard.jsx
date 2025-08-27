import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { realTimeSync } from "@/lib/realTimeSync";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { X, Save, Edit, Phone, Mail, MapPin, CreditCard, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  CheckCircle,
  Eye,
  Shield,
  Search,
  TrendingUp,
  Activity,
  Database,
  Server,
  Globe,
  BarChart3
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import AnimatedSpeedometer from "@/components/AnimatedSpeedometer";
import BureauStatusPanel from "@/components/BureauStatusPanel";

// ================= Customer Detail Modal =================
const CustomerDetailModal = ({ customer, isOpen, onClose, onSave, isEditing, onEdit }) => {
  const [editedCustomer, setEditedCustomer] = useState(customer);
  
  useEffect(() => {
    setEditedCustomer(customer);
  }, [customer]);
  
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setEditedCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedCustomer);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Updated background with blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? "Edit Customer" : "Customer Details"}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Name</label>
            {isEditing ? (
              <Input value={editedCustomer.name} onChange={(e) => handleChange('name', e.target.value)} />
            ) : (
              <div className="text-slate-900">{customer.name}</div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
            {isEditing ? (
              <Input value={editedCustomer.email} onChange={(e) => handleChange('email', e.target.value)} />
            ) : (
              <div className="flex items-center text-slate-900">
                <Mail className="h-4 w-4 mr-2" /> {customer.email}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Phone</label>
            {isEditing ? (
              <Input value={editedCustomer.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            ) : (
              <div className="flex items-center text-slate-900">
                <Phone className="h-4 w-4 mr-2" /> {customer.phone}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">City</label>
            {isEditing ? (
              <Input value={editedCustomer.city} onChange={(e) => handleChange('city', e.target.value)} />
            ) : (
              <div className="flex items-center text-slate-900">
                <MapPin className="h-4 w-4 mr-2" /> {customer.city}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= Bank Detail Modal =================
const BankDetailModal = ({ bank, isOpen, onClose, onSave, isEditing, onEdit }) => {
  const [editedBank, setEditedBank] = useState(bank);

  useEffect(() => {
    setEditedBank(bank);
  }, [bank]);

  if (!isOpen || !bank) return null;

  const handleChange = (field, value) => {
    setEditedBank(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedBank);
    onClose();
  };

  const statusBadge = (status) => {
    if (status === "Active")
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
    if (status === "Suspended")
      return <Badge className="bg-red-100 text-red-700 border-red-200">Suspended</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Updated background with blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? "Manage Bank" : "Bank Details"}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID (read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bank ID</label>
            <div className="text-slate-900 font-medium">{bank.id}</div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
            {isEditing ? (
              <Input value={editedBank.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
            ) : (<div className="text-slate-900">{bank.name}</div>)}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            {isEditing ? (
              <Input value={editedBank.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
            ) : (<div className="text-slate-900">{bank.email}</div>)}
          </div>

          {/* Totals */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Customers</label>
            {isEditing ? (
              <Input
                type="number"
                value={editedBank.totalCustomers ?? ""}
                onChange={(e) => handleChange("totalCustomers", Number(e.target.value))}
              />
            ) : (<div className="text-slate-900">{bank.totalCustomers?.toLocaleString?.() ?? bank.totalCustomers}</div>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Applications</label>
            {isEditing ? (
              <Input
                type="number"
                value={editedBank.totalApplications ?? ""}
                onChange={(e) => handleChange("totalApplications", Number(e.target.value))}
              />
            ) : (<div className="text-slate-900">{bank.totalApplications?.toLocaleString?.() ?? bank.totalApplications}</div>)}
          </div>

          {/* Approval rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Approval Rate (%)</label>
            {isEditing ? (
              <Input
                type="number"
                value={editedBank.approvalRate ?? ""}
                onChange={(e) => handleChange("approvalRate", Number(e.target.value))}
              />
            ) : (<div className="text-slate-900">{bank.approvalRate}%</div>)}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            {isEditing ? (
              <Select value={editedBank.status || ""} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            ) : (<div>{statusBadge(bank.status)}</div>)}
          </div>

          {/* API Calls & Last Active (read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Calls</label>
            <div className="text-slate-900">{bank.apiCalls?.toLocaleString?.() ?? bank.apiCalls}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Active</label>
            <div className="text-slate-900">{bank.lastActive}</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [searchUser, setSearchUser] = useState("");
  const [searchScore, setSearchScore] = useState("");
  const adminEmail = localStorage.getItem("userEmail") || "admin@demo.com";
  const [bureauStatus, setBureauStatus] = useState({});

  // strict lookup states (add near searchUser/searchScore)
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupSubmitted, setLookupSubmitted] = useState(false);

  // Customer modal state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [removingUser, setRemovingUser] = useState(null);
  const [suspendingUser, setSuspendingUser] = useState(null);

  // Bank modal state
  const [selectedBank, setSelectedBank] = useState(null);
  const [isBankDetailModalOpen, setIsBankDetailModalOpen] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);

  // navigation hook
  const navigate = useNavigate();

  // Mock admin data
  const mockCustomers = [
    {
      id: "USR001",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      creditScore: 742,
      riskLevel: "Low",
      joinDate: "2024-01-15",
      status: "Active",
      totalLoans: 2,
      city: "Mumbai"
    },
    {
      id: "USR002",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 87654 32109",
      creditScore: 789,
      riskLevel: "Low",
      joinDate: "2024-02-20",
      status: "Active",
      totalLoans: 1,
      city: "Delhi"
    },
    {
      id: "USR003",
      name: "Amit Patel",
      email: "amit@example.com",
      phone: "+91 76543 21098",
      creditScore: 658,
      riskLevel: "Medium",
      joinDate: "2024-03-10",
      status: "Active",
      totalLoans: 3,
      city: "Ahmedabad"
    },
    {
      id: "USR004",
      name: "Sunita Reddy",
      email: "sunita@example.com",
      phone: "+91 65432 10987",
      creditScore: 695,
      riskLevel: "Medium",
      joinDate: "2024-01-28",
      status: "Active",
      totalLoans: 1,
      city: "Hyderabad"
    },
    {
      id: "USR005",
      name: "Vikash Singh",
      email: "vikash@example.com",
      phone: "+91 54321 09876",
      creditScore: 591,
      riskLevel: "High",
      joinDate: "2024-04-05",
      status: "Suspended",
      totalLoans: 0,
      city: "Patna"
    },
    {
      id: "USR006",
      name: "Anita Gupta",
      email: "anita@example.com",
      phone: "+91 43210 98765",
      creditScore: 823,
      riskLevel: "Low",
      joinDate: "2024-02-14",
      status: "Active",
      totalLoans: 4,
      city: "Pune"
    }
  ];

  const [customers, setCustomers] = useState(mockCustomers);
  const [signupLogs, setSignupLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add real users to mock data
  useEffect(() => {
    setLoading(true);
    
    const unsubscribeUsers = realTimeSync.subscribe('users', (response) => {
      if (response.status === "Success") {
        // Format dynamic users with proper Customer ID
        const formattedDynamicUsers = response.users.map((user, index) => ({
          ...user,
          id: user.id.toString().startsWith('USR') ? user.id : `USR${String(index + 100).padStart(3, '0')}`,
          totalLoans: user.totalLoans || 0
        }));
        setCustomers([...mockCustomers, ...formattedDynamicUsers]);
        setLoading(false);
      }
    }, 15000);
    
    const unsubscribeLogs = realTimeSync.subscribe('signupLogs', (response) => {
      if (response.status === "Success") {
        setSignupLogs(response.logs);
      }
    }, 10000);

    // Fetch bureau status
    const fetchBureauStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/bureau/health-status');
        const data = await response.json();
        if (data.status === 'Success') {
          setBureauStatus(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch bureau status:', error);
      }
    };
    
    fetchBureauStatus();
    const bureauInterval = setInterval(fetchBureauStatus, 30000);
    
    return () => {
      unsubscribeUsers();
      unsubscribeLogs();
      clearInterval(bureauInterval);
    };
  }, []);

  const [banks, setBanks] = useState([
    {
      id: "BNK001",
      name: "HDFC Bank",
      email: "hdfc@bank.com",
      totalCustomers: 12450,
      totalApplications: 2847,
      approvalRate: 73.5,
      status: "Active",
      apiCalls: 15420,
      lastActive: "2 min ago"
    },
    {
      id: "BNK002",
      name: "State Bank of India",
      email: "sbi@bank.com",
      totalCustomers: 18920,
      totalApplications: 4235,
      approvalRate: 68.2,
      status: "Active",
      apiCalls: 22890,
      lastActive: "1 min ago"
    },
    {
      id: "BNK003",
      name: "ICICI Bank",
      email: "icici@bank.com",
      totalCustomers: 9870,
      totalApplications: 1892,
      approvalRate: 75.8,
      status: "Active",
      apiCalls: 11240,
      lastActive: "5 min ago"
    },
    {
      id: "BNK004",
      name: "Axis Bank",
      email: "axis@bank.com",
      totalCustomers: 7650,
      totalApplications: 1456,
      approvalRate: 71.3,
      status: "Active",
      apiCalls: 8970,
      lastActive: "3 min ago"
    }
  ]);

  // Update customer in the customers array
  const updateCustomer = (updatedCustomer) => {
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  // customer
  const handleViewCustomer = (c) => {
    setSelectedCustomer(c);
    setIsDetailModalOpen(true);
    setIsEditingCustomer(false);
  };
  
  const handleEditCustomer = (c) => {
    setSelectedCustomer(c);
    setIsDetailModalOpen(true);
    setIsEditingCustomer(true);
  };

  const handleSaveCustomer = (updatedCustomer) => {
    updateCustomer(updatedCustomer);
    setSelectedCustomer(updatedCustomer);
    setIsEditingCustomer(false);
  };

  // Remove user completely
  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.status === 'Success') {
        // Remove from local state
        setCustomers(prev => prev.filter(customer => customer.id !== userId));
        alert('User removed completely from system');
      } else {
        alert('Failed to remove user: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to remove user:', error);
      alert('Failed to remove user');
    }
    setRemovingUser(null);
  };

  // Suspend user for 24 hours
  const handleSuspendUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/suspend`, {
        method: 'PUT'
      });
      const data = await response.json();
      
      if (data.status === 'Success') {
        // Update local state
        setCustomers(prev => prev.map(customer => 
          customer.id === userId 
            ? { ...customer, status: 'Suspended' }
            : customer
        ));
        alert('User suspended for 24 hours');
      } else {
        alert('Failed to suspend user: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to suspend user:', error);
      alert('Failed to suspend user');
    }
    setSuspendingUser(null);
  };

  // bank
  const handleViewBank = (b) => {
    setSelectedBank(b);
    setIsBankDetailModalOpen(true);
    setIsEditingBank(false);
  };
  
  const handleManageBank = (b) => {
    setSelectedBank(b);
    setIsBankDetailModalOpen(true);
    setIsEditingBank(true);
  };

  const totalCustomers = 45267 + customers.length - mockCustomers.length;
  const totalLoansApproved = 8934;
  const websiteVisits = 127543;
  const totalApplications = customers.length;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const websiteAnalytics = [
    { date: '2024-08-01', visits: 4200, newUsers: 320, bounceRate: 42 },
    { date: '2024-08-02', visits: 4800, newUsers: 380, bounceRate: 38 },
    { date: '2024-08-03', visits: 4100, newUsers: 290, bounceRate: 45 },
    { date: '2024-08-04', visits: 5200, newUsers: 420, bounceRate: 35 },
    { date: '2024-08-05', visits: 5800, newUsers: 480, bounceRate: 32 },
    { date: '2024-08-06', visits: 6200, newUsers: 520, bounceRate: 28 },
    { date: '2024-08-07', visits: 5900, newUsers: 450, bounceRate: 30 },
    { date: '2024-08-08', visits: 6400, newUsers: 580, bounceRate: 26 }
  ];

  const systemMetrics = [
    { metric: "Server Uptime", value: "99.95%", status: "success" },
    { metric: "API Response Time", value: "180ms", status: "success" },
    { metric: "Database Health", value: "Optimal", status: "success" },
    { metric: "Error Rate", value: "0.02%", status: "success" },
    { metric: "Memory Usage", value: "67%", status: "warning" },
    { metric: "CPU Usage", value: "45%", status: "success" }
  ];

  // Add this data after the existing mock data
  const bankRecoveryData = [
    {
      bank: "SBI",
      recovered2020: 1245,
      recovered2021: 1356,
      recovered2022: 1520,
      recovered2023: 1680,
      recovered2024: 920
    },
    {
      bank: "HDFC",
      recovered2020: 980,
      recovered2021: 1120,
      recovered2022: 1250,
      recovered2023: 1420,
      recovered2024: 780
    },
    {
      bank: "ICICI",
      recovered2020: 845,
      recovered2021: 920,
      recovered2022: 1080,
      recovered2023: 1210,
      recovered2024: 650
    },
    {
      bank: "Axis",
      recovered2020: 720,
      recovered2021: 810,
      recovered2022: 890,
      recovered2023: 950,
      recovered2024: 520
    },
    {
      bank: "BoB",
      recovered2020: 620,
      recovered2021: 680,
      recovered2022: 750,
      recovered2023: 820,
      recovered2024: 450
    }
  ];

  const bankRankings = [
    {
      id: "1",
      name: "State Bank of India",
      totalRecovered: 6721,
      npaRatio: 4.5,
      recoveryRate: 82.4,
      primarySource: "Corporate Loans"
    },
    {
      id: "2",
      name: "HDFC Bank",
      totalRecovered: 5550,
      npaRatio: 3.2,
      recoveryRate: 85.7,
      primarySource: "Retail Loans"
    },
    {
      id: "3",
      name: "ICICI Bank",
      totalRecovered: 4705,
      npaRatio: 4.8,
      recoveryRate: 79.6,
      primarySource: "Business Loans"
    },
    {
      id: "4",
      name: "Axis Bank",
      totalRecovered: 3890,
      npaRatio: 5.2,
      recoveryRate: 76.8,
      primarySource: "Personal Loans"
    },
    {
      id: "5",
      name: "Bank of Baroda",
      totalRecovered: 3320,
      npaRatio: 6.1,
      recoveryRate: 72.3,
      primarySource: "Agriculture Loans"
    },
    {
      id: "6",
      name: "Kotak Mahindra",
      totalRecovered: 2850,
      npaRatio: 4.2,
      recoveryRate: 81.5,
      primarySource: "MSME Loans"
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchUser.toLowerCase()) ||
    customer.phone.includes(searchUser)
  );

  const filteredByScore = searchScore ?
    filteredCustomers.filter(customer =>
      customer.creditScore.toString().includes(searchScore)
    ) : filteredCustomers;

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "Low":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"> Low Risk</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"> Medium Risk</Badge>;
      case "High":
        return <Badge className="bg-red-100 text-red-700 border-red-200"> High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"> Active</Badge>;
      case "Suspended":
        return <Badge className="bg-red-100 text-red-700 border-red-200"> Suspended</Badge>;
      case "Pending":
        return <Badge className="bg-sky-100 text-sky-700 border-sky-200"> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMetricBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"> Healthy</Badge>;
      case "warning":
        return <Badge className="bg-sky-100 text-sky-700 border-sky-200"> Warning</Badge>;
      case "error":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200"> Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  CreditScore
                </h1>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-1">Admin Portal</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Super Admin</p>
                <p className="text-sm font-semibold text-slate-800">{adminEmail}</p>
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Customers</CardTitle>
              <Users className="h-6 w-6 text-blue-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalCustomers.toLocaleString()}</div>
              <p className="text-xs text-blue-100 mt-2">
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Loans Approved</CardTitle>
              <CheckCircle className="h-6 w-6 text-emerald-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalApplications.toLocaleString()}</div>
              <p className="text-xs text-emerald-100 mt-2">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-sky-700 text-white border-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-sky-100">Website Visits</CardTitle>
              <Eye className="h-6 w-6 text-sky-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{websiteVisits.toLocaleString()}</div>
              <p className="text-xs text-sky-100 mt-2">
                +31% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="customers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl p-1 rounded-xl">
            <TabsTrigger value="customers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Customer Management</TabsTrigger>
            <TabsTrigger value="banks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Bank Performance</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Fund Analytics</TabsTrigger>
            <TabsTrigger value="lookup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Credit Lookup</TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Signup Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      Customer Management
                    </CardTitle>
                    <CardDescription>Search and manage all platform users</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder=" 🔍Search customers..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="pl-10 w-64 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">Customer ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Name & Contact</TableHead>
                      <TableHead className="font-semibold text-slate-700">Credit Score</TableHead>
                      <TableHead className="font-semibold text-slate-700">Risk Level</TableHead>
                      <TableHead className="font-semibold text-slate-700">Total Loans</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Join Date</TableHead>
                      <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredByScore.map((customer) => (
                      <TableRow key={customer.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <TableCell className="font-medium text-blue-700">{customer.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{customer.name}</div>
                              <div className="text-sm text-slate-500"> {customer.email}</div>
                              <div className="text-sm text-slate-500"> {customer.phone}</div>
                              <div className="text-sm text-blue-600"> {customer.city}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`font-bold ${customer.creditScore >= 750 ? 'bg-emerald-100 text-emerald-700' :
                            customer.creditScore >= 650 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {customer.creditScore}
                          </Badge>
                        </TableCell>
                        <TableCell>{getRiskBadge(customer.riskLevel)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-semibold border-blue-200 text-blue-700">
                            {customer.totalLoans}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell className="text-slate-600"> {customer.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewCustomer(customer)}
                              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                            >
                              View
                            </Button>

                            <Button variant="outline" size="sm" className="bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" onClick={() => handleEditCustomer(customer)}>
                              Edit
                            </Button>

                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100" 
                              onClick={() => setSuspendingUser(customer)}
                              disabled={customer.status === 'Suspended'}
                            >
                              {customer.status === 'Suspended' ? 'Suspended' : 'Suspend'}
                            </Button>

                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100" 
                              onClick={() => setRemovingUser(customer)}
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banks">
            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  Bank Performance Overview
                </CardTitle>
                <CardDescription>Monitor partner bank performance and statistics</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">Bank ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Bank Details</TableHead>
                      <TableHead className="font-semibold text-slate-700">Customers</TableHead>
                      <TableHead className="font-semibold text-slate-700">Applications</TableHead>
                      <TableHead className="font-semibold text-slate-700">Approval Rate</TableHead>
                      <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banks.map((bank) => (
                      <TableRow key={bank.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <TableCell className="font-medium text-blue-700">{bank.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {bank.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800"> {bank.name}</div>
                              <div className="text-sm text-slate-500"> {bank.email}</div>
                              <div className="text-sm text-emerald-600"> Last active: {bank.lastActive}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700 font-semibold">
                            {bank.totalCustomers.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-sky-100 text-sky-700 font-semibold">
                            {bank.totalApplications.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`font-bold ${bank.approvalRate >= 70 ? 'bg-emerald-100 text-emerald-700' :
                            bank.approvalRate >= 60 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {bank.approvalRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewBank(bank)}
                              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:bg-blue-100"
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    Bank Fund Recovery Analysis
                  </CardTitle>
                  <CardDescription>Bank recovery performance and NPA management in India (2020-2024)</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bankRecoveryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bank" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value} Cr`, 'Amount Recovered']} />
                        <Legend />
                        <Bar
                          dataKey="recovered2020"
                          name="2020 Recovery"
                          fill="hsl(214 95% 65%)"
                        />
                        <Bar
                          dataKey="recovered2021"
                          name="2021 Recovery"
                          fill="hsl(214 95% 55%)"
                        />
                        <Bar
                          dataKey="recovered2022"
                          name="2022 Recovery"
                          fill="hsl(214 95% 45%)"
                        />
                        <Bar
                          dataKey="recovered2023"
                          name="2023 Recovery"
                          fill="hsl(214 95% 35%)"
                        />
                        <Bar
                          dataKey="recovered2024"
                          name="2024 Recovery (YTD)"
                          fill="hsl(214 95% 25%)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    Bank Recovery Performance Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-700">Rank</TableHead>
                        <TableHead className="font-semibold text-slate-700">Bank Name</TableHead>
                        <TableHead className="font-semibold text-slate-700">Total Recovered (₹ Cr)</TableHead>
                        <TableHead className="font-semibold text-slate-700">NPA Ratio</TableHead>
                        <TableHead className="font-semibold text-slate-700">Recovery Rate</TableHead>
                        <TableHead className="font-semibold text-slate-700">Primary Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bankRankings.map((bank, index) => (
                        <TableRow key={bank.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <TableCell>
                            <Badge className={`
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                index === 1 ? 'bg-blue-100 text-blue-700' :
                                  index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}
                  `}>
                              #{index + 1}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-800"> {bank.name}</TableCell>
                          <TableCell className="font-semibold text-blue-700">₹{bank.totalRecovered} Cr</TableCell>
                          <TableCell>
                            <Badge className={
                              bank.npaRatio < 5 ? 'bg-emerald-100 text-emerald-700' :
                                bank.npaRatio < 8 ? 'bg-blue-100 text-blue-700' :
                                  bank.npaRatio < 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }>
                              {bank.npaRatio}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              bank.recoveryRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                bank.recoveryRate >= 70 ? 'bg-blue-100 text-blue-700' :
                                  bank.recoveryRate >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }>
                              {bank.recoveryRate}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{bank.primarySource}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lookup">
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <BureauStatusPanel />
                </div>
                <div className="lg:col-span-3">
                    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    Credit Score Lookup
                  </CardTitle>
                  <CardDescription>Search and verify user credit scores</CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex space-x-4 mb-6">
                    <Input
                      placeholder="Enter full User ID, Name or Email"
                      value={searchUser}
                      onChange={(e) => {
                        setSearchUser(e.target.value);
                        setLookupSubmitted(false);       // typing clears last submitted result
                        setLookupResult(null);
                      }}
                      className="w-full bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 transition-all duration-200"
                    />
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      onClick={() => {
                        const q = (searchUser || "").trim().toLowerCase();
                        if (!q) {
                          setLookupSubmitted(true);
                          setLookupResult(null);
                          return;
                        }

                        // exact match only (case-insensitive). Phone ignores spaces.
                        const match = customers.find((c) => {
                          const name = (c.name || "").trim().toLowerCase();
                          const email = (c.email || "").trim().toLowerCase();
                          const id = String(c.id || "").trim().toLowerCase();
                          const phone = String(c.phone || "").replace(/\s+/g, "").toLowerCase();
                          const qPhone = q.replace(/\s+/g, "");
                          return name === q || email === q || id === q || phone === qPhone;
                        });

                        setLookupSubmitted(true);
                        setLookupResult(match || null);
                      }}
                    >
                      🔍 Search
                    </Button>
                  </div>

                  {/* Results (only after pressing Search) */}
                  {lookupSubmitted && lookupResult && (
                    <div className="space-y-8">
                      {/* Name + meta */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800">
                          Customer: {lookupResult.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          User ID: {lookupResult.id} | Email: {lookupResult.email}
                        </p>
                      </div>

                      {/* Credit Score History Chart */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Credit Score History</h3>
                        <p className="text-sm text-slate-600 mb-4">
                          Track how your credit scores have changed across all bureaus
                        </p>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { month: 'Jan', cibil: lookupResult.creditScore - 50, experian: lookupResult.creditScore - 34, equifax: lookupResult.creditScore - 25, crif: lookupResult.creditScore + 5 },
                                { month: 'Feb', cibil: lookupResult.creditScore - 30, experian: lookupResult.creditScore - 24, equifax: lookupResult.creditScore - 18, crif: lookupResult.creditScore + 12 },
                                { month: 'Mar', cibil: lookupResult.creditScore - 20, experian: lookupResult.creditScore - 19, equifax: lookupResult.creditScore - 12, crif: lookupResult.creditScore + 18 },
                                { month: 'Apr', cibil: lookupResult.creditScore - 10, experian: lookupResult.creditScore - 18, equifax: lookupResult.creditScore - 9, crif: lookupResult.creditScore + 20 },
                                { month: 'May', cibil: lookupResult.creditScore - 5, experian: lookupResult.creditScore - 17, equifax: lookupResult.creditScore - 8, crif: lookupResult.creditScore + 21 },
                                { month: 'Jun', cibil: lookupResult.creditScore, experian: lookupResult.creditScore - 17, equifax: lookupResult.creditScore - 8, crif: lookupResult.creditScore + 22 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis domain={[300, 900]} />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="cibil" stroke="#3b82f6" name="CIBIL" strokeWidth={2} />
                              <Line type="monotone" dataKey="experian" stroke="#10b981" name="Experian" strokeWidth={2} />
                              <Line type="monotone" dataKey="equifax" stroke="#f59e0b" name="Equifax" strokeWidth={2} />
                              <Line type="monotone" dataKey="crif" stroke="#8b5cf6" name="CRIF" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Bureau Scores */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Bureau Scores</h3>
                        <p className="text-sm text-slate-600 mb-4">Current credit scores from all reporting bureaus</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <AnimatedSpeedometer bureauName="CIBIL" score={lookupResult.creditScore} range="300-900" peerAverage={75} postAverage={82} bureauStatus={bureauStatus.CIBIL?.status || 'UP'} />
                          <AnimatedSpeedometer bureauName="Experian" score={lookupResult.creditScore - 17} range="300-900" peerAverage={72} postAverage={78} bureauStatus={bureauStatus.EXPERIAN?.status || 'UP'} />
                          <AnimatedSpeedometer bureauName="Equifax" score={lookupResult.creditScore - 8} range="300-900" peerAverage={68} postAverage={74} bureauStatus={bureauStatus.EQUIFAX?.status || 'UP'} />
                          <AnimatedSpeedometer bureauName="CRIF" score={lookupResult.creditScore + 22} range="300-900" peerAverage={79} postAverage={85} bureauStatus={bureauStatus.CRIF?.status || 'UP'} />
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                            <span className="font-medium">Average Score:</span>
                            <span className="ml-2 font-bold text-blue-700">
                              {Math.round(
                                (lookupResult.creditScore +
                                  (lookupResult.creditScore - 17) +
                                  (lookupResult.creditScore - 8) +
                                  (lookupResult.creditScore + 22)) / 4
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">
                            This matches the customer's main credit score of {lookupResult.creditScore}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {lookupSubmitted && !lookupResult && (
                    <div className="text-center py-8">
                      <div className="text-slate-400 mb-2">No user found with that exact value</div>
                      <div className="text-sm text-slate-500">Search requires full name, full email, exact ID, or exact phone</div>
                    </div>
                  )}

                  {!lookupSubmitted && (
                    <div className="text-center py-8">
                      <div className="text-slate-400 mb-2">Enter a search term to look up credit information</div>
                      <div className="text-sm text-slate-500">Exact match only (case-insensitive)</div>
                    </div>
                  )}
                </CardContent>
              </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  Signup Logs
                </CardTitle>
                <CardDescription>Recent user registrations and system activity</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-700">User ID</TableHead>
                        <TableHead className="font-semibold text-slate-700">Name</TableHead>
                        <TableHead className="font-semibold text-slate-700">Email</TableHead>
                        <TableHead className="font-semibold text-slate-700">Role</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700">Signup Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {signupLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <TableCell className="font-medium text-blue-700">{log.id}</TableCell>
                          <TableCell className="font-medium text-slate-800">{log.name}</TableCell>
                          <TableCell className="text-slate-600">{log.email}</TableCell>
                          <TableCell>
                            <Badge className={`${
                              log.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              log.role === 'bank' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {log.role.charAt(0).toUpperCase() + log.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onSave={handleSaveCustomer}
          isEditing={isEditingCustomer}
          onEdit={() => setIsEditingCustomer(true)}
        />
      )}

      {selectedBank && (
        <BankDetailModal
          bank={selectedBank}
          isOpen={isBankDetailModalOpen}
          onClose={() => setIsBankDetailModalOpen(false)}
          onSave={(updated) =>
            setBanks(prev => prev.map(b => b.id === updated.id ? updated : b))
          }
          isEditing={isEditingBank}
          onEdit={() => setIsEditingBank(true)}
        />
      )}

      {/* Remove User Confirmation Modal */}
      {removingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-800">
                Remove User
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setRemovingUser(null)}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to <strong>permanently remove</strong> this user?
              </p>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action will:
                </p>
                <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
                  <li>Delete the user account permanently</li>
                  <li>Remove all loan applications</li>
                  <li>Delete all notifications</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>User:</strong> {removingUser.name}</p>
                <p><strong>Email:</strong> {removingUser.email}</p>
                <p><strong>ID:</strong> {removingUser.id}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 p-4 border-t">
              <Button variant="outline" onClick={() => setRemovingUser(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleRemoveUser(removingUser.id)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Remove Permanently
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Confirmation Modal */}
      {suspendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-yellow-800">
                Suspend User
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setSuspendingUser(null)}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to <strong>suspend</strong> this user for 24 hours?
              </p>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Suspension Details:</strong>
                </p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>User will be unable to login for 24 hours</li>
                  <li>User will see suspension message with time remaining</li>
                  <li>Account will automatically reactivate after 24 hours</li>
                  <li>User will receive a notification about suspension</li>
                </ul>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>User:</strong> {suspendingUser.name}</p>
                <p><strong>Email:</strong> {suspendingUser.email}</p>
                <p><strong>ID:</strong> {suspendingUser.id}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 p-4 border-t">
              <Button variant="outline" onClick={() => setSuspendingUser(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleSuspendUser(suspendingUser.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Suspend for 24 Hours
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
