import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useWidgetProps } from "../use-widget-props";
import { useMaxHeight } from "../use-max-height";
import { useDisplayMode } from "../use-display-mode";
import { 
  Receipt, 
  TrendingUp, 
  ShoppingBag, 
  Coffee, 
  Car, 
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Filter
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

function TransactionList() {
  const props = useWidgetProps();
  const maxHeight = useMaxHeight();
  const displayMode = useDisplayMode();
  
  const { transactions = [], accountName = "All Accounts" } = props;
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
      style={{ maxHeight: maxHeight || "auto" }}
      className={
        "w-full antialiased bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 " +
        (displayMode === "fullscreen"
          ? "rounded-none p-8"
          : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6")
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600 rounded-xl">
            <Receipt className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {accountName}
            </p>
          </div>
        </div>
        
        {/* Filter Button */}
        <button className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "income", "expenses"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap " +
              (filter === filterType
                ? "bg-purple-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700")
            }
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {date}
            </h3>
            <div className="space-y-2">
              {txs.map((transaction) => {
                const Icon = categoryIcons[transaction.category] || Receipt;
                const isPositive = transaction.amount > 0;
                
                return (
                  <div
                    key={transaction.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className={
                        "p-2.5 rounded-xl " +
                        (isPositive 
                          ? "bg-green-100 dark:bg-green-900/30" 
                          : "bg-gray-100 dark:bg-gray-700")
                      }>
                        <Icon className={
                          "w-5 h-5 " +
                          (isPositive 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-gray-600 dark:text-gray-400")
                        } />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {transaction.merchant}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.category}
                          </p>
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTransactions.length} transactions
          </span>
          <button className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline">
            View all
          </button>
        </div>
      </div>
    </div>
  );
}

// Initialize the widget
const container = document.getElementById("banking-transactions-root");
if (container) {
  const root = createRoot(container);
  root.render(<TransactionList />);
}

