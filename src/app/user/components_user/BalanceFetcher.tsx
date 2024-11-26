// components/BalanceFetcher.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Balance {
  creditBalance: number;
  energyBalance: number;
}

export const BalanceFetcher = () => {
  const [balance, setBalance] = useState<Balance | null>(null);

  const fetchBalance = async () => {
    try {
      const response = await axios.get("/api/balance");
      setBalance(response.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance(); // Initial fetch

    const interval = setInterval(() => {
      fetchBalance();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return balance ? (
    <div className="flex space-x-4 items-center">
      <div className="text-sm">
        <span className="font-semibold">Credits:</span> {balance.creditBalance}
      </div>
      <div className="text-sm">
        <span className="font-semibold">Tokens:</span> {balance.energyBalance}
      </div>
    </div>
  ) : (
    // Render an empty space or a placeholder, but no "Loading..." text
    <div className="flex space-x-4 items-center">
      <div className="text-sm">Credits: --</div>
      <div className="text-sm">Tokens: --</div>
    </div>
  );
};
