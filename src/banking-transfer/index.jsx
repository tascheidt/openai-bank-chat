import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useWidgetProps } from "../use-widget-props";
import { useMaxHeight } from "../use-max-height";
import { useDisplayMode } from "../use-display-mode";
import { Send, CheckCircle2, User, Mail } from "lucide-react";

function TransferForm() {
  const props = useWidgetProps();
  const maxHeight = useMaxHeight();
  const displayMode = useDisplayMode();
  
  const { 
    contacts = [], 
    accounts = [],
    preselectedContact = null,
    preselectedAmount = null
  } = props;

  const [selectedContact, setSelectedContact] = useState(preselectedContact);
  const [amount, setAmount] = useState(preselectedAmount || "");
  const [message, setMessage] = useState("");
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || "");
  const [step, setStep] = useState("form"); // form, confirm, success

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleSubmit = () => {
    setStep("confirm");
  };

  const handleConfirm = () => {
    // Here you would call the actual API
    setStep("success");
  };

  if (step === "success") {
    return (
      <div
        style={{ maxHeight: maxHeight || "auto" }}
        className={
          "w-full antialiased bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center " +
          (displayMode === "fullscreen"
            ? "rounded-none p-8 min-h-[400px]"
            : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 min-h-[400px]")
        }
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Transfer Sent!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            {formatCurrency(amount)} sent to {selectedContact?.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            via Interac e-Transfer
          </p>
          <button
            onClick={() => {
              setStep("form");
              setAmount("");
              setMessage("");
              setSelectedContact(null);
            }}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 px-6 font-medium transition-colors"
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    const selectedAcc = accounts.find(a => a.id === fromAccount);
    
    return (
      <div
        style={{ maxHeight: maxHeight || "auto" }}
        className={
          "w-full antialiased bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 " +
          (displayMode === "fullscreen"
            ? "rounded-none p-8"
            : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6")
        }
      >
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Confirm Transfer
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4 mb-6">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(amount)}
              </span>
            </div>
            
            <div className="flex justify-between items-start pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">To</span>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedContact?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedContact?.email}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-start pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">From</span>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedAcc?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAcc?.accountNumber}
                </p>
              </div>
            </div>
            
            {message && (
              <div className="flex justify-between items-start pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Message</span>
                <p className="text-right text-sm text-gray-900 dark:text-white max-w-[200px]">
                  {message}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 px-4 font-medium transition-colors"
            >
              Confirm & Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ maxHeight: maxHeight || "auto" }}
      className={
        "w-full antialiased bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 " +
        (displayMode === "fullscreen"
          ? "rounded-none p-8"
          : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6")
      }
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-orange-600 rounded-xl">
          <Send className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Send Interac e-Transfer
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quick and secure money transfer
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
              $
            </span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
        </div>

        {/* From Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Account
          </label>
          <select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} - {formatCurrency(account.balance)}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Send to
          </label>
          <div className="grid grid-cols-2 gap-3">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={
                  "p-4 rounded-xl border-2 transition-all text-left " +
                  (selectedContact?.id === contact.id
                    ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600")
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's this for?"
            rows={3}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !selectedContact}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-4 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Review Transfer
        </button>
      </div>
    </div>
  );
}

// Initialize the widget
const container = document.getElementById("banking-transfer-root");
if (container) {
  const root = createRoot(container);
  root.render(<TransferForm />);
}

