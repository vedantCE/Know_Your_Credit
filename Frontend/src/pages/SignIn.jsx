import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.login({
        email: email,
        password: password
      });

      if (data.status === "Success") {
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem("userPAN", data.user.panNumber || '');
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userCreditScore", data.user.creditScore || 0);
        localStorage.setItem("userFirstName", data.user.firstName);
        localStorage.setItem("userLastName", data.user.lastName);
        localStorage.setItem("userPhone", data.user.phoneNumber || '');
        localStorage.setItem("userAddress", data.user.address || '');
        localStorage.setItem("userOccupation", data.user.occupation || '');
        localStorage.setItem("userAnnualIncome", data.user.annualIncome || '');
        localStorage.setItem("userDateOfBirth", data.user.dateOfBirth || '');
        localStorage.setItem("userAadhaar", data.user.aadhaarNumber || '');
        localStorage.setItem("profileComplete", "false");

        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });

        // Redirect based on user role from backend
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "bank") {
          navigate("/bank-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white-50 via-blue-50 to-blue-50 flex items-center justify-center p-6"
      style={{ backdropFilter: "#ffffff" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-700 hover:text-blue-500 transition-colors"
          >
            {/* <Shield className="bg-white-500 text-blue-700 border-blue-200 mt-1"/> */}
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  CreditScore
                </h1>
              </div>
            </div>
          </Link>
        </div>

        <Card className="bg-white border border-blue-200 shadow-lg rounded-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-semibold text-blue-600">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-blue-500 mt-1">
              Sign in to access your credit dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-blue-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-300"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-blue-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link to="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 focus-visible:ring-blue-800 text-white-600 "
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>



            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
