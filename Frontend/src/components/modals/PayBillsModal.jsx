import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, Calendar, Bell } from "lucide-react";

export const PayBillsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Pay Credit Card Bills on Time
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Why This Matters
            </h4>
            <p className="mt-2 text-sm text-blue-700">
              Payment history contributes <strong>35%</strong> to your credit score. 
              Just <strong>1 late payment</strong> can drop your score by 50+ points!
            </p>
          </div>

          <div>
            <h4 className="font-medium text-blue-800 mb-3">Action Plan</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">Set Up Reminders</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    Add due dates to your calendar or enable SMS alerts from your bank.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">Enable Autopay</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    Automatically pay at least the minimum amount due every month.
                  </p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Setup Autopay Guide
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pro Tip
            </h4>
            <p className="mt-2 text-sm text-yellow-700">
              Request your bank to <strong>change your due date</strong> to align with your paycheck schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};