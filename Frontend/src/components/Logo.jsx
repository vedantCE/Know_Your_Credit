import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Logo = ({ showBadge = true, badgeText = "Bank Portal" }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CreditScore Pro
        </h1>
        {showBadge && (
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 mt-1">
            {badgeText}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default Logo;