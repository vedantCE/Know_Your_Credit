import { Button } from "@/components/ui/button";
import { Layers, TrendingUp, AlertCircle } from "lucide-react";

export const DiversifyPortfolioModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            <Layers className="h-5 w-5 text-orange-500" />
            Diversify Your Credit Portfolio
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              The 3 Types of Credit
            </h4>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[
                { type: "Revolving", example: "Credit Cards" },
                { type: "Installment", example: "Car Loans" },
                { type: "Open", example: "Utility Bills" },
              ].map((item) => (
                <div key={item.type} className="bg-white p-3 rounded border">
                  <p className="font-medium text-blue-800">{item.type}</p>
                  <p className="text-xs text-blue-600">{item.example}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-blue-800 mb-3">Safe Diversification Tips</h4>
            <div className="space-y-3 text-sm text-blue-700">
              <p>
                <strong>Start small:</strong> Add 1 new type every 6-12 months
              </p>
              <p>
                <strong>Best next step:</strong> A small personal loan (if you only have credit cards)
              </p>
              <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                Check Pre-Approved Offers
              </Button>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Ideal Mix
            </h4>
            <p className="mt-2 text-sm text-green-700">
              Having <strong>2-3 types</strong> of credit can maximize this scoring factor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};