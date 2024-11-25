// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import axios from "axios";

interface Balance {
  creditBalance: number;
  energyBalance: number;
}

const Navbaruser: React.FC = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch balance from the API
  const fetchBalance = async () => {
    if (isSignedIn) {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/balance");
        setBalance(response.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setBalance(null);
    }
  };

  useEffect(() => {
    fetchBalance(); // Initial fetch

    // Poll every 3 seconds
    const interval = setInterval(() => {
      fetchBalance();
    }, 3000);

    return () => clearInterval(interval);
  }, [isSignedIn]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full backdrop-blur-lg bg-white text-black transition-transform duration-300 ease-in-out border-b border-gray-300 z-50`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-3xl font-bold tracking-wide">WattWallet</span>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-6 text-lg font-medium">
          <li>
            <Link href="/user" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              Back to Landing
            </Link>
          </li>
          <li>
            <Link href="/user/store" className="hover:underline">
              Store
            </Link>
          </li>
          <li>
            <Link href="/user/transactions" className="hover:underline">
              Transactions
            </Link>
          </li>
        </ul>

        {/* Balance and User Controls */}
        <div className="flex items-center space-x-4">
          {isSignedIn && (
            <div className="flex space-x-4 items-center">
              {isLoading ? (
                <div className="text-sm">Loading...</div>
              ) : balance ? (
                <>
                  <div className="text-sm">
                    <span className="font-semibold">Credits:</span>{" "}
                    {balance.creditBalance}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Tokens:</span>{" "}
                    {balance.energyBalance}
                  </div>
                </>
              ) : (
                <div className="text-sm">No Balance Available</div>
              )}
            </div>
          )}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <button
              className="bg-transparent border border-black text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition-all"
              onClick={() => openSignIn()}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbaruser;
