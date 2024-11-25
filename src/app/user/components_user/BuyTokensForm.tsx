// components/BuyTokensForm.tsx
"use client";

import React, { useState } from "react";

interface BuyTokensFormProps {
  currentBalance: number;
  onSubmit: (amount: number) => void;
}

const BuyTokensForm: React.FC<BuyTokensFormProps> = ({
  currentBalance,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }
    onSubmit(amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Buy Energy Tokens</h2>
      <p className="mb-2">Current Credits: {currentBalance}</p>
      <div className="mb-4">
        <label className="block mb-2">Amount of Tokens to Buy:</label>
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
        Buy Tokens
      </button>
    </form>
  );
};

export default BuyTokensForm;
