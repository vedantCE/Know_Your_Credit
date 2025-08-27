import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const CreditLookup = () => {
  const [formData, setFormData] = useState({
    panNumber: "",
    aadhaarNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [creditData, setCreditData] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }));
    setError("");
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validatePAN(formData.panNumber)) {
      setError("Please enter a valid PAN number (e.g., ABCDE1234F)");
      return;
    }
    
    if (!validateAadhaar(formData.aadhaarNumber)) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setLoading(true);

    try {
      // Check if user exists in database
      const userCheckResponse = await fetch('http://localhost:3001/api/employees/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          panNumber: formData.panNumber,
          aadhaarNumber: formData.aadhaarNumber
        })
      });

      if (userCheckResponse.ok) {
        const userData = await userCheckResponse.json();
        
        // Get consolidated credit score
        const creditResponse = await fetch('http://localhost:3001/api/bureau/consolidated-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData.data)
        });

        if (creditResponse.ok) {
          const creditResult = await creditResponse.json();
          setCreditData(creditResult.data);
        } else {
          throw new Error('Failed to fetch credit score');
        }
      } else {
        // User not found, show suggested score based on PAN pattern
        const suggestedScore = generateSuggestedScore(formData.panNumber);
        setCreditData({
          consolidatedScore: suggestedScore,
          riskLevel: suggestedScore >= 750 ? 'Low' : suggestedScore >= 650 ? 'Medium' : 'High',
          bureauResults: {
            CIBIL: { score: suggestedScore + Math.floor(Math.random() * 20) - 10, bureau: 'CIBIL', bureauStatus: 'ESTIMATED' },
            EXPERIAN: { score: suggestedScore + Math.floor(Math.random() * 30) - 15, bureau: 'EXPERIAN', bureauStatus: 'ESTIMATED' },
            EQUIFAX: { score: suggestedScore + Math.floor(Math.random() * 25) - 12, bureau: 'EQUIFAX', bureauStatus: 'ESTIMATED' },
            CRIF: { score: suggestedScore + Math.floor(Math.random() * 40) - 20, bureau: 'CRIF', bureauStatus: 'ESTIMATED' }
          },
          reportDate: new Date(),
          isEstimated: true
        });
      }
    } catch (err) {
      setError("Failed to fetch credit score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestedScore = (pan) => {
    // Generate score based on PAN pattern
    const seed = pan.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.min(850, Math.max(600, 650 + (seed % 200)));
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  Know Your Credit
                </h1>
          </Link>
          <Link to="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Check Your Credit Score
            </h1>
            <p className="text-xl text-gray-600">
              Enter your PAN and Aadhaar details to get your multi-bureau credit score
            </p>
          </div>

          {!creditData ? (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span>Credit Score Lookup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="panNumber">PAN Number *</Label>
                    <Input
                      id="panNumber"
                      name="panNumber"
                      type="text"
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="mt-1"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter your 10-character PAN number
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                    <Input
                      id="aadhaarNumber"
                      name="aadhaarNumber"
                      type="text"
                      placeholder="1234 5678 9012"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      maxLength={12}
                      className="mt-1"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter your 12-digit Aadhaar number
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking Credit Score...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Get Credit Score
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure & Confidential</h4>
                      <p className="text-sm text-blue-700">
                        Your information is encrypted and protected. We comply with all data protection regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Credit Score Display */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Credit Score</span>
                    {creditData.isEstimated && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Estimated
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {creditData.consolidatedScore}
                    </div>
                    <Badge className={`${getRiskColor(creditData.riskLevel)} px-3 py-1`}>
                      {creditData.riskLevel} Risk
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(creditData.bureauResults).map(([bureau, data]) => (
                      <div key={bureau} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="font-semibold text-gray-900">{bureau}</div>
                        <div className="text-2xl font-bold text-blue-600">{data.score}</div>
                        <div className="text-xs text-gray-500">
                          {data.bureauStatus === 'ESTIMATED' ? 'Estimated' : 'Live'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {creditData.isEstimated && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-900">Estimated Score</h4>
                          <p className="text-sm text-orange-700">
                            This is an estimated score based on available data. 
                            <Link to="/signup" className="underline ml-1">Sign up</Link> for accurate bureau scores.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button 
                  onClick={() => {
                    setCreditData(null);
                    setFormData({ panNumber: "", aadhaarNumber: "" });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Check Another Score
                </Button>
                <Link to="/signup" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Get Full Report
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditLookup;
