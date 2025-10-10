import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useWidgetProps } from "../use-widget-props";
import { useMaxHeight } from "../use-max-height";
import { useDisplayMode } from "../use-display-mode";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, Eye, EyeOff, CreditCard, PiggyBank } from "lucide-react";

// Main Balance View Component
function BalanceView() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  const props = useWidgetProps({
    accounts: [
      {
        id: "checking",
        name: "Checking Account",
        accountNumber: "****4521",
        balance: 3245.67,
        currency: "CAD",
        trend: "+2.3%"
      },
      {
        id: "savings",
        name: "Savings Account", 
        accountNumber: "****8892",
        balance: 12890.32,
        currency: "CAD",
        trend: "+5.1%"
      }
    ],
    totalBalance: 16135.99
  });
  const maxHeight = useMaxHeight();
  const displayMode = useDisplayMode();
  
  const accounts = props?.accounts || [];
  const totalBalance = props?.totalBalance || 0;

  const formatCurrency = (amount) => {
    if (!balanceVisible) return "••••••";
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getAccountIcon = (accountName) => {
    if (accountName.toLowerCase().includes('checking')) {
      return <CreditCard className="w-5 h-5" />;
    }
    return <PiggyBank className="w-5 h-5" />;
  };

  return (
    <div
      style={{ 
        maxHeight: maxHeight || "auto",
        minHeight: "420px"
      }}
      className={
        "w-full antialiased bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-indigo-950 " +
        (displayMode === "fullscreen"
          ? "rounded-none p-8"
          : "rounded-2xl sm:rounded-3xl p-6")
      }
    >
      {/* Header with Balance Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <Wallet className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Account Balance
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All your accounts
            </p>
          </div>
        </div>
        <button
          onClick={() => setBalanceVisible(!balanceVisible)}
          className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
          aria-label={balanceVisible ? "Hide balance" : "Show balance"}
        >
          {balanceVisible ? (
            <Eye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Total Balance Card - Hero Style */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl mb-5 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <p className="text-sm text-indigo-100 mb-1">
            Total Balance
          </p>
          <p className="text-4xl font-bold text-white mb-3">
            {formatCurrency(totalBalance)}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 bg-green-500/20 text-green-100 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-medium">+3.7%</span>
            </div>
            <span className="text-indigo-100">this month</span>
          </div>
        </div>
      </div>

      {/* Individual Accounts */}
      <div className="space-y-3">
        {accounts.map((account, index) => (
          <div
            key={account.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg text-indigo-600 dark:text-indigo-400">
                  {getAccountIcon(account.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                    {account.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {account.accountNumber}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(account.balance)}
                </p>
                <div className={
                  "flex items-center justify-end gap-1 text-xs font-medium " +
                  (account.trend.startsWith('+') 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400")
                }>
                  {account.trend.startsWith('+') ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{account.trend}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-5 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-3 px-4 font-medium transition-all shadow-md hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Send Money
          </button>
          <button className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 font-medium transition-all shadow-sm hover:shadow-md hover:scale-[1.02]">
            View Details
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Error Boundary Wrapper
function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (error) {
    return (
      <div style={{ padding: "20px", backgroundColor: "#ff0000", color: "white" }}>
        <h2>Widget Error:</h2>
        <pre>{error.toString()}</pre>
      </div>
    );
  }
}

// Initialize the widget
const container = document.getElementById("banking-root");
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <BalanceView />
    </ErrorBoundary>
  );
} else {
  console.error("Could not find banking-root container!");
}

