import { Button } from "@/components/ui/button";
import { History, Shield, AlertCircle } from "lucide-react";

export const MaintainAccountsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            <History className="h-5 w-5 text-purple-500" />
            Maintain Older Credit Accounts
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Why Age Matters
            </h4>
            <p className="mt-2 text-sm text-blue-700">
              Accounts older than <strong>2 years</strong> contribute significantly to your "credit age" (15% of your score).
            </p>
          </div>

          <div>
            <h4 className="font-medium text-blue-800 mb-3">Action Plan</h4>
            <ul className="space-y-3 list-disc pl-5 text-sm text-blue-700">
              <li>
                <strong>Don't close</strong> your oldest credit card (even if unused)
              </li>
              <li>
                Make <strong>1 small purchase every 6 months</strong> to keep accounts active
              </li>
              <li>
                <strong>Convert</strong> unused cards to no-fee versions instead of closing
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Warning
            </h4>
            <p className="mt-2 text-sm text-red-700">
              Closing your oldest account could <strong>drop your score by 10-20 points</strong> immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};