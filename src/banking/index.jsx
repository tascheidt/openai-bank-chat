import React from "react";
import { createRoot } from "react-dom/client";
import { useWidgetProps } from "../use-widget-props";
import { useMaxHeight } from "../use-max-height";
import { useDisplayMode } from "../use-display-mode";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

// Main Balance View Component
function BalanceView() {
  const props = useWidgetProps();
  const maxHeight = useMaxHeight();
  const displayMode = useDisplayMode();
  
  const { accounts = [], totalBalance = 0 } = props;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div
      style={{ maxHeight: maxHeight || "auto" }}
      className={
        "w-full antialiased bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 " +
        (displayMode === "fullscreen"
          ? "rounded-none p-8"
          : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6")
      }
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-600 rounded-xl">
          <Wallet className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Balance
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total across all accounts
          </p>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Total Balance
        </p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {formatCurrency(totalBalance)}
        </p>
        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span>+3.7% this month</span>
        </div>
      </div>

      {/* Individual Accounts */}
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {account.name}
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {account.accountNumber}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(account.balance)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={
                  "flex items-center gap-1 text-sm " +
                  (account.trend.startsWith('+') 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400")
                }>
                  {account.trend.startsWith('+') ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span className="font-medium">{account.trend}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Send Money
          </button>
          <button className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// Initialize the widget
const container = document.getElementById("banking-root");
if (container) {
  const root = createRoot(container);
  root.render(<BalanceView />);
}

