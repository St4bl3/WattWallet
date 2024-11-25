// app/user/transactions/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import TransactionList from "./components_transaction/TransactionList";
import Navbaruser from "../components_user/Navbar-user";
import { Footeruser } from "../components_user/footer-user";

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

const TransactionsPage: React.FC = () => {
  const { isSignedIn } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchTransactions = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);
    try {
      const response = await axios.get("/api/transactions");
      setTransactions(response.data);
    } catch (err: unknown) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Poll every 10 seconds to keep transactions updated
    const interval = setInterval(() => {
      fetchTransactions();
    }, 10000);

    return () => clearInterval(interval);
  }, [isSignedIn]);

  return (
    <>
      <Navbaruser />
      <div className="flex flex-col items-center justify-start pt-24 bg-white text-black px-4 min-h-screen">
        <h1 className="text-5xl font-bold mb-12">Your Transactions</h1>
        {isSignedIn ? (
          isLoading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <TransactionList transactions={transactions} />
          )
        ) : (
          <p>Please sign in to view your transactions.</p>
        )}
      </div>
      <Footeruser />
    </>
  );
};

export default TransactionsPage;
