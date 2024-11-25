// components/TransactionItem.tsx
"use client";

import React from "react";

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

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <li className="mb-4 p-4 border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">
            Transaction ID: {transaction.transactionId}
          </p>
          {/* As createdAt is removed, omit the date or handle accordingly */}
        </div>
        <p
          className={`font-semibold ${
            transaction.type === "Purchase"
              ? "text-green-500"
              : transaction.type === "BuyCredits"
              ? "text-blue-500"
              : transaction.type === "BuyTokens"
              ? "text-yellow-500"
              : transaction.type === "SellTokens"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {transaction.type}
        </p>
      </div>

      <div className="mt-2">
        {transaction.type === "Purchase" && transaction.product ? (
          <div className="flex items-center">
            <img
              src={transaction.product.imageUrl}
              alt={transaction.product.name}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div>
              <p className="font-semibold">{transaction.product.name}</p>
              <p className="text-sm text-gray-600">
                Price: {transaction.product.price} Credits
              </p>
            </div>
          </div>
        ) : transaction.type === "BuyCredits" ? (
          <div>
            <p className="font-semibold">Bought Credits</p>
            <p className="text-sm text-gray-600">
              Amount: {transaction.amount} Credits
            </p>
          </div>
        ) : transaction.type === "BuyTokens" ? (
          <div>
            <p className="font-semibold">Bought Energy Tokens</p>
            <p className="text-sm text-gray-600">
              Amount: {transaction.amount} Tokens
            </p>
          </div>
        ) : transaction.type === "SellTokens" ? (
          <div>
            <p className="font-semibold">Sold Energy Tokens</p>
            <p className="text-sm text-gray-600">
              Amount: {transaction.amount} Tokens
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex justify-between items-center">
        <p>
          {transaction.amount > 0 ? (
            <span className="text-green-500">
              +{transaction.amount}{" "}
              {transaction.type === "SellTokens" ? "Credits" : "Credits/Tokens"}
            </span>
          ) : (
            <span className="text-red-500">{transaction.amount} Credits</span>
          )}
        </p>
        <p className="text-sm text-gray-600">
          Sender ID: {transaction.senderId}
        </p>
      </div>
    </li>
  );
};

export default TransactionItem;
