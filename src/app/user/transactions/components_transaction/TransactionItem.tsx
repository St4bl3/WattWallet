// components/TransactionItem.tsx
"use client";

import React from "react";

interface Transaction {
  id: string;
  transactionId: string;
  senderId: string;
  receiverId: string;
  applianceId: string | null;
  productId: string | null;
  type: string;
  amount?: number;
  createdAt?: string;
  product?: Product;
  appliance?: Appliance;
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

interface Appliance {
  id: string;
  userId: string;
  name: string;
  isOn: boolean;
  energyBalance: number;
  balanceId: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const formattedDate = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleString()
    : "N/A";

  return (
    <li className="mb-4 p-4 border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">
            Transaction ID: {transaction.transactionId}
          </p>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>
        <p
          className={`font-semibold ${
            transaction.type === "Purchase"
              ? "text-green-500"
              : transaction.type === "ApplianceToggle"
              ? "text-blue-500"
              : "text-yellow-500"
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
        ) : transaction.type === "ApplianceToggle" && transaction.appliance ? (
          <div>
            <p className="font-semibold">
              Appliance: {transaction.appliance.name}
            </p>
            <p className="text-sm text-gray-600">
              {transaction.appliance.isOn ? "Turned On" : "Turned Off"}
            </p>
          </div>
        ) : transaction.type === "EnergyToken" ? (
          <div>
            <p className="font-semibold">Energy Tokens: {transaction.amount}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex justify-between items-center">
        <p>
          {transaction.amount !== undefined ? (
            transaction.amount > 0 ? (
              <span className="text-green-500">
                +{transaction.amount} Credits
              </span>
            ) : (
              <span className="text-red-500">{transaction.amount} Credits</span>
            )
          ) : null}
        </p>
        <p className="text-sm text-gray-600">
          Sender ID: {transaction.senderId}
        </p>
      </div>
    </li>
  );
};

export default TransactionItem;
