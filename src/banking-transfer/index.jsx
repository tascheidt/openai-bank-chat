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
        style={{ maxHeight: maxHeight || "auto" }}
        className={
          "w-full antialiased bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 " +
          (displayMode === "fullscreen"
            ? "rounded-none p-8"
            : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6")
        }
      >
        <div className="max-w-lg mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
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
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            {/* Amount Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-center">
              <p className="text-green-100 text-sm font-medium mb-2">Amount Transferred</p>
              <p className="text-4xl font-bold text-white">
                {formatCurrency(amount)}
              </p>
            </div>
            
            {/* Details Section */}
            <div className="p-6 space-y-6">
              {/* Recipient */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
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
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-4">
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              What happens next?
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
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
              className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-2xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-md"
            >
              Send Another
            </button>
            <button
              onClick={() => {
                // In a real app, this would navigate to transaction history
                console.log("View transaction history");
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
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
        style={{ maxHeight: maxHeight || "auto" }}
        className={
          "w-full antialiased bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 " +
          (displayMode === "fullscreen"
            ? "rounded-none p-8"
            : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6")
        }
      >
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Send className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Review Your Transfer
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please review the details below before confirming
            </p>
          </div>
          
          {/* Transfer Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            {/* Amount Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
              <p className="text-blue-100 text-sm font-medium mb-2">Transfer Amount</p>
              <p className="text-4xl font-bold text-white">
                {formatCurrency(amount)}
              </p>
            </div>
            
            {/* Details Section */}
            <div className="p-6 space-y-6">
              {/* Recipient */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
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
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
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
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Message</p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-gray-900 dark:text-white text-sm">
                        "{message}"
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Transfer Type */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Transfer method</p>
                      <p className="font-medium text-gray-900 dark:text-white">Interac e-Transfer</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Delivery</p>
                      <p className="font-medium text-green-600 dark:text-green-400">Instant</p>
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
              className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-2xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-md"
            >
              ← Edit Details
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl py-4 px-6 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Transfer
            </button>
          </div>
          
          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Secure Transfer
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
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
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-2xl py-4 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Review Transfer
        </button>
        
        {/* Form Validation Messages */}
        {(!amount || !selectedContact) && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please enter an amount and select a recipient to continue
            </p>
          </div>
        )}
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

