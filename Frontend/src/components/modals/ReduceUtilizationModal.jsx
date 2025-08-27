import { Button } from "@/components/ui/button";
import { CreditCard, PieChart, Calculator, AlertCircle } from "lucide-react";

export const ReduceUtilizationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock utilization data
  const currentUtilization = 45;
  const targetUtilization = 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-500" />
            Reduce Credit Utilization
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Your Current Status
            </h4>
            <div className="mt-3 flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">{currentUtilization}%</p>
                <p className="text-xs text-blue-700">Current Utilization</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{targetUtilization}%</p>
                <p className="text-xs text-blue-700">Target Goal</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-blue-800 mb-3">How to Improve</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">Pay Early</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    Make payments <strong>before</strong> your statement closes to lower reported utilization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calculator className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">Calculate Your Payment</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    You need to pay <strong>₹12,500</strong> to reach 30% utilization.
                  </p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Utilization Calculator
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};