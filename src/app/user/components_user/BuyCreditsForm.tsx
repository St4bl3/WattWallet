// components/BuyCreditsForm.tsx
"use client";

import React, { useState } from "react";

interface BuyCreditsFormProps {
  onSubmit: (amount: number) => void;
}

const BuyCreditsForm: React.FC<BuyCreditsFormProps> = ({ onSubmit }) => {
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
      <h2 className="text-2xl font-bold mb-4">Buy Credits</h2>
      <div className="mb-4">
        <label className="block mb-2">Amount of Credits to Buy:</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter number of credits"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Buy Credits
      </button>
    </form>
  );
};

export default BuyCreditsForm;
