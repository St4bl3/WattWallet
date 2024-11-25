// components/MainPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Modal from "./components_user/Modal";
import BuyTokensForm from "./components_user/BuyTokensForm";
import SellTokensForm from "./components_user/SellTokensForm";
import BuyCreditsForm from "./components_user/BuyCreditsForm";
import Appliances from "./components_user/Appliances";
import Navbaruser from "./components_user/Navbar-user";

interface Balance {
  creditBalance: number;
  energyBalance: number;
}

const MainPage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isBuyTokensOpen, setIsBuyTokensOpen] = useState<boolean>(false);
  const [isSellTokensOpen, setIsSellTokensOpen] = useState<boolean>(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState<boolean>(false);

  const fetchBalance = async () => {
    if (isSignedIn && user?.id) {
      try {
        const response = await axios.get("/api/balance", {
          params: { userId: user.id },
        });
        setBalance(response.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [isSignedIn, user]);

  const handleBuyTokens = async (amount: number) => {
    try {
      const response = await axios.post("/api/buy-tokens", {
        userId: user?.id,
        amount,
      });
      setBalance(response.data);
    } catch (error: unknown) {
      console.error("Error buying tokens:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Error buying tokens");
      } else {
        alert("Error buying tokens");
      }
    }
  };

  const handleSellTokens = async (amount: number) => {
    try {
      const response = await axios.post("/api/sell-tokens", {
        userId: user?.id,
        amount,
      });
      setBalance(response.data);
    } catch (error: unknown) {
      console.error("Error selling tokens:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Error selling tokens");
      } else {
        alert("Error selling tokens");
      }
    }
  };

  const handleBuyCredits = async (amount: number) => {
    try {
      const response = await axios.post("/api/buy-credits", {
        userId: user?.id,
        amount,
      });
      setBalance(response.data);
    } catch (error: unknown) {
      console.error("Error buying credits:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Error buying credits");
      } else {
        alert("Error buying credits");
      }
    }
  };

  return (
    <>
      <Navbaruser />
      <div className="flex flex-col items-center justify-center min-h-screen pt-24 bg-white text-black px-4">
        <h1 className="text-5xl font-bold mb-8">Welcome to WattWallet</h1>
        <div className="flex space-x-6">
          <button
            className="w-48 h-20 bg-black text-white text-xl rounded-lg hover:bg-gray-800 transition"
            onClick={() => setIsBuyTokensOpen(true)}
          >
            Buy Tokens
          </button>
          <button
            className="w-48 h-20 bg-black text-white text-xl rounded-lg hover:bg-gray-800 transition"
            onClick={() => setIsSellTokensOpen(true)}
          >
            Sell Tokens
          </button>
          <button
            className="w-48 h-20 bg-black text-white text-xl rounded-lg hover:bg-gray-800 transition"
            onClick={() => setIsBuyCreditsOpen(true)}
          >
            Buy Credits
          </button>
        </div>

        {/* Buy Tokens Modal */}
        {isBuyTokensOpen && (
          <Modal onClose={() => setIsBuyTokensOpen(false)}>
            <BuyTokensForm
              currentBalance={balance?.creditBalance || 0}
              onSubmit={(amount) => {
                handleBuyTokens(amount);
                setIsBuyTokensOpen(false);
              }}
            />
          </Modal>
        )}

        {/* Sell Tokens Modal */}
        {isSellTokensOpen && (
          <Modal onClose={() => setIsSellTokensOpen(false)}>
            <SellTokensForm
              currentBalance={balance?.energyBalance || 0}
              onSubmit={(amount) => {
                handleSellTokens(amount);
                setIsSellTokensOpen(false);
              }}
            />
          </Modal>
        )}

        {/* Buy Credits Modal */}
        {isBuyCreditsOpen && (
          <Modal onClose={() => setIsBuyCreditsOpen(false)}>
            <BuyCreditsForm
              onSubmit={(amount) => {
                handleBuyCredits(amount);
                setIsBuyCreditsOpen(false);
              }}
            />
          </Modal>
        )}
      </div>
      <Appliances />
    </>
  );
};

export default MainPage;
