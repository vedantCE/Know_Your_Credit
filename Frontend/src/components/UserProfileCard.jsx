import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, CreditCard, Shield, Eye, Edit, Trash2 } from "lucide-react";
import AnimatedSpeedometer from "./AnimatedSpeedometer";

const UserProfileCard = ({ user, onView, onEdit, onDelete, showActions = true }) => {
  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Low Risk</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium Risk</Badge>;
      case "High":
        return <Badge className="bg-red-100 text-red-700 border-red-200">High Risk</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
      case "Suspended":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Suspended</Badge>;
      case "Pending":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const maskSensitiveData = (data, type) => {
    if (!data || data === 'N/A') return 'N/A';
    
    if (type === 'aadhaar') {
      return `XXXX-XXXX-${data.slice(-4)}`;
    }
    if (type === 'pan') {
      return `${data.slice(0, 5)}XXXX${data.slice(-1)}`;
    }
    return data;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">{user.name}</CardTitle>
              <p className="text-sm text-gray-600">ID: {user.id}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {getRiskBadge(user.riskLevel)}
            {getStatusBadge(user.status)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Personal Information
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-800">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm font-medium text-gray-800">{user.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Aadhaar:</span>
                <span className="text-sm font-medium text-gray-800">{maskSensitiveData(user.aadhaar, 'aadhaar')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">PAN:</span>
                <span className="text-sm font-medium text-gray-800">{maskSensitiveData(user.pan, 'pan')}</span>
              </div>
            </div>
          </div>

          {/* Credit Score */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              Credit Information
            </h4>
            
            <div className="flex justify-center">
              <AnimatedSpeedometer 
                bureauName="Unified" 
                score={user.creditScore} 
                range="300-900" 
                peerAverage={75} 
                postAverage={78} 
                size="small"
              />
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                Location: {user.city}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView && onView(user)}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit && onEdit(user)}
              className="bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete && onDelete(user.id)}
              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
