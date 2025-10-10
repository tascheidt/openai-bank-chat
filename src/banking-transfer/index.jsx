import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useWidgetProps } from "../use-widget-props";
import { useMaxHeight } from "../use-max-height";
import { useDisplayMode } from "../use-display-mode";
import { Send, CheckCircle2, User, Mail } from "lucide-react";

// Modern banking transfer form with fallback data handling
function TransferForm() {
  const props = useWidgetProps({
    contacts: [],
    accounts: [
      {
        id: "checking",
        name: "Checking Account",
        accountNumber: "****4521",
        balance: 3245.67,
        currency: "CAD"
      }
    ],
    preselectedContact: null,
    preselectedAmount: null
  });
  const maxHeight = useMaxHeight();
  const displayMode = useDisplayMode();
  
  const { 
    contacts = [], 
    accounts = [],
    preselectedContact = null,
    preselectedAmount = null
  } = props || {};

  const [selectedContact, setSelectedContact] = useState(preselectedContact);
  const [amount, setAmount] = useState(preselectedAmount || "");
  const [message, setMessage] = useState("");
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || "");
  const [step, setStep] = useState("form"); // form, confirm, success

  const formatCurrency = (value) => {
    if (!value) return "";
    const formatted = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(value);
    return formatted;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleSubmit = () => {
    if (!amount || !selectedContact || !fromAccount) {
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    // Here you would call the actual API
    setStep("success");
  };

  const handleBackToForm = () => {
    setStep("form");
  };

  if (step === "success") {
    return (
      <div
        style={{ maxHeight: maxHeight || "auto", minHeight: "500px" }}
        className={
          "w-full antialiased bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 " +
          (displayMode === "fullscreen"
            ? "rounded-none p-8"
            : "rounded-2xl sm:rounded-3xl p-6")
        }
      >
        <div className="max-w-lg mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-6 shadow-lg animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Transfer Successful!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your money has been sent securely
            </p>
          </div>

          {/* Transfer Summary Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            {/* Amount Section */}
            <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 px-6 py-8 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-green-100 text-sm font-medium mb-2">Amount Transferred</p>
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(amount)}
                </p>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="p-6 space-y-6">
              {/* Recipient */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {selectedContact?.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sent to</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {selectedContact?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedContact?.email}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 space-y-4">
                {/* Transfer Details */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Transfer method</span>
                  <span className="font-medium text-gray-900 dark:text-white">Interac e-Transfer</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Time</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-indigo-100 dark:border-indigo-800">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              What happens next?
            </h3>
            <div className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
              <p>• {selectedContact?.name} will receive an email notification</p>
              <p>• They can deposit the funds using their online banking</p>
              <p>• You'll receive a confirmation email shortly</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep("form");
                setAmount("");
                setMessage("");
                setSelectedContact(null);
              }}
              className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              Send Another
            </button>
            <button
              onClick={() => {
                // In a real app, this would navigate to transaction history
                console.log("View transaction history");
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] shadow-md"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    const selectedAcc = accounts.find(a => a.id === fromAccount);
    
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
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4 shadow-lg">
              <Send className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Review Your Transfer
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please review the details below before confirming
            </p>
          </div>
          
          {/* Transfer Details Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            {/* Amount Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-8 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-indigo-100 text-sm font-medium mb-2">Transfer Amount</p>
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(amount)}
                </p>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="p-6 space-y-6">
              {/* Recipient */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {selectedContact?.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sending to</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {selectedContact?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedContact?.email}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                {/* From Account */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From account</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedAcc?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedAcc?.accountNumber}
                    </p>
                  </div>
                </div>
                
                {/* Message */}
                {message && (
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Message</p>
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-gray-900 dark:text-white text-sm">
                        "{message}"
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Transfer Type */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Transfer method</p>
                      <p className="font-medium text-gray-900 dark:text-white">Interac e-Transfer</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Delivery</p>
                      <p className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1 justify-end">
                        <span className="inline-block w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
                        Instant
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBackToForm}
              className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              ← Edit Details
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-5 h-5" />
              Send Transfer
            </button>
          </div>
          
          {/* Security Notice */}
          <div className="mt-6 p-4 bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm rounded-xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                  Secure Transfer
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Your transfer is protected by bank-level security. The recipient will receive an email with instructions to deposit the funds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
          <Send className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Send Money
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quick & secure Interac e-Transfer
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Amount Input - Featured */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-white mr-2">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-4xl font-bold text-white placeholder-white/50 focus:outline-none border-none p-0"
                  style={{ caretColor: 'white' }}
                />
              </div>
              <p className="text-indigo-100 text-sm mt-2">CAD</p>
            </div>
          </div>
        </div>

        {/* From Account */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            From Account
          </label>
          <div className="relative">
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full px-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contact Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Send to
          </label>
          <div className="grid grid-cols-2 gap-3">
            {contacts.map((contact, index) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={
                  "p-4 rounded-xl border-2 transition-all text-left hover:scale-105 " +
                  (selectedContact?.id === contact.id
                    ? "border-purple-600 bg-white/90 dark:bg-gray-800/90 shadow-lg scale-105"
                    : "border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-300 dark:hover:border-purple-700 shadow-sm")
                }
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
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
                  {selectedContact?.id === contact.id && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Message <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note for the recipient..."
            rows={3}
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none shadow-sm hover:shadow-md transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !selectedContact}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl py-4 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md"
        >
          <Send className="w-5 h-5" />
          Review Transfer
        </button>
        
        {/* Form Validation Messages */}
        {(!amount || !selectedContact) && (
          <div className="p-4 bg-amber-50/80 dark:bg-amber-900/30 backdrop-blur-sm rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please enter an amount and select a recipient to continue
            </p>
          </div>
        )}
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

// Initialize the widget
const container = document.getElementById("banking-transfer-root");
if (container) {
  const root = createRoot(container);
  root.render(<TransferForm />);
}

