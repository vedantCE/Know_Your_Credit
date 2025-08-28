import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const BureauStatusPanel = () => {
  const [bureauStatus, setBureauStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBureauStatus();
    const interval = setInterval(fetchBureauStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBureauStatus = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/bureau/health-status');
      const data = await response.json();
      if (data.status === 'Success') {
        setBureauStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bureau status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'UP':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DOWN':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'SLOW':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      UP: 'bg-green-100 text-green-700 border-green-200',
      DOWN: 'bg-red-100 text-red-700 border-red-200',
      SLOW: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return variants[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">Bureau Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Bureau Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(bureauStatus).map(([bureau, status]) => (
          <div key={bureau} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.status)}
              <span className="text-sm font-medium">{bureau}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={`text-xs ${getStatusBadge(status.status)} w-fit`}>
                {status.status}
              </Badge>
              <div className="text-xs text-gray-500">
                {Math.round(status.responseTime || 0)}ms | {(status.uptime || 0).toFixed(1)}% uptime
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BureauStatusPanel;