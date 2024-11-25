// components/SellTokensForm.tsx
"use client";

import React, { useState } from "react";

interface SellTokensFormProps {
  currentBalance: number;
  onSubmit: (amount: number) => void;
}

const SellTokensForm: React.FC<SellTokensFormProps> = ({
  currentBalance,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount % 10 !== 0) {
      alert("Enter a valid amount (multiple of 10).");
      return;
    }
    onSubmit(amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Sell Energy Tokens</h2>
      <p className="mb-2">Current Tokens: {currentBalance}</p>
      <div className="mb-4">
        <label className="block mb-2">Amount of Tokens to Sell:</label>
        <input
          type="number"
          min="10"
          step="10"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter multiple of 10"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Sell Tokens
      </button>
    </form>
  );
};

export default SellTokensForm;
