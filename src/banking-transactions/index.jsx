import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useWidgetProps } from "../use-widget-props";
import { useMaxHeight } from "../use-max-height";
import { useDisplayMode } from "../use-display-mode";
import { 
  Receipt, 
  TrendingUp,
  TrendingDown,
  ShoppingBag, 
  Coffee, 
  Car, 
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Calendar,
  DollarSign
} from "lucide-react";

const categoryIcons = {
  "Food & Dining": Coffee,
  "Income": TrendingUp,
  "Groceries": ShoppingBag,
  "Transportation": Car,
  "Shopping": ShoppingBag,
  "Housing": Home,
  "Transfer": ArrowUpRight,
};

const categoryColors = {
  "Food & Dining": "from-orange-500 to-red-500",
  "Income": "from-green-500 to-emerald-500",
  "Groceries": "from-blue-500 to-cyan-500",
  "Transportation": "from-purple-500 to-pink-500",
  "Shopping": "from-indigo-500 to-blue-500",
  "Housing": "from-amber-500 to-orange-500",
  "Transfer": "from-violet-500 to-purple-500",
};

// Modern transaction list with fallback data handling
function TransactionList() {
  const props = useWidgetProps({
    transactions: [],
    accountName: "All Accounts"
  });
  const maxHeight = useMaxHeight();
  const displayMode = useDisplayMode();
  
  const { transactions = [], accountName = "All Accounts" } = props || {};
  const [filter, setFilter] = useState("all");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    if (filter === "income") return tx.amount > 0;
    if (filter === "expenses") return tx.amount < 0;
    return true;
  });

  // Calculate summary stats
  const income = filteredTransactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = filteredTransactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const date = formatDate(tx.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
    return groups;
  }, {});

  return (
    <div
      style={{ maxHeight: maxHeight || "auto", minHeight: "500px" }}
      className={
        "w-full antialiased bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-indigo-950 " +
        (displayMode === "fullscreen"
          ? "rounded-none p-8"
          : "rounded-2xl sm:rounded-3xl p-6")
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
            <Receipt className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transactions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {accountName}
            </p>
          </div>
        </div>
        
        <button className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
          <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium opacity-90">Income</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(income)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-medium opacity-90">Expenses</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
        {["all", "income", "expenses"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={
              "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap " +
              (filter === filterType
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md scale-105"
                : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-105 shadow-sm")
            }
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {Object.entries(groupedTransactions).map(([date, txs], groupIndex) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gradient-to-br from-indigo-50/90 via-purple-50/90 to-pink-50/90 dark:from-gray-900/90 dark:to-indigo-950/90 backdrop-blur-sm py-2 -mx-1 px-1 rounded-lg z-10">
              <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wide">
                {date}
              </h3>
            </div>
            <div className="space-y-2">
              {txs.map((transaction, index) => {
                const Icon = categoryIcons[transaction.category] || Receipt;
                const isPositive = transaction.amount > 0;
                const gradientColor = categoryColors[transaction.category] || "from-gray-500 to-gray-600";
                
                return (
                  <div
                    key={transaction.id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
                    style={{
                      animation: `slideIn 0.3s ease-out ${(groupIndex * 0.1) + (index * 0.05)}s both`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientColor} shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {transaction.merchant}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.category}
                          </span>
                          {transaction.type && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              • {transaction.type}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={
                          "text-lg font-bold " +
                          (isPositive 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-gray-900 dark:text-white")
                        }>
                          {isPositive ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </p>
                        {isPositive && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Credit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-5 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredTransactions.length} transactions
            </span>
          </div>
          <button className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:underline">
            View all →
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Initialize the widget
const container = document.getElementById("banking-transactions-root");
if (container) {
  const root = createRoot(container);
  root.render(<TransactionList />);
}

