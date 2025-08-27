import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sooner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import UserOnboarding from "./pages/UserOnboarding";
import UserDashboard from "./pages/UserDashboard";
import BankDashboard from "./pages/BankDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreditLookup from "./pages/CreditLookup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/user-onboarding" element={<UserOnboarding />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/bank-dashboard" element={<BankDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/credit-lookup" element={<CreditLookup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;