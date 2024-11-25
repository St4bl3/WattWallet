// components/TransactionList.tsx
"use client";

import React, { useState } from "react";
import TransactionItem from "./TransactionItem";

interface Transaction {
  id: string;
  transactionId: string;
  senderId: string;
  receiverId: string;
  productId: string | null;
  type: string;
  amount: number;
  product?: Product;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: number;
  category: string;
  brand: string;
  ratings: number;
  reviews: number;
  imageUrl: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<string>("All");

  // Define transaction types
  const categories = [
    "All",
    "Purchase",
    "BuyCredits",
    "BuyTokens",
    "SellTokens",
  ];

  const filteredTransactions =
    activeTab === "All"
      ? transactions
      : transactions.filter((tx) => tx.type === activeTab);

  return (
    <div className="w-full max-w-4xl">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`py-2 px-4 -mb-px border-b-2 font-semibold ${
              activeTab === category
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {filteredTransactions.length > 0 ? (
        <ul>
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionList;
