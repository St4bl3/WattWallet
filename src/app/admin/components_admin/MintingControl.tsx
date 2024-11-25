// components/admin/MintingControl.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MintingControl: React.FC = () => {
  const [credits, setCredits] = useState<number>(10);
  const [tokens, setTokens] = useState<number>(10);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartMinting = async () => {
    if (isMinting) return;

    setIsMinting(true);
    setError("");
    setSuccess("");

    // Immediately perform the first mint
    try {
      const response = await axios.post("/api/admin/mint", { credits, tokens });
      setSuccess(response.data.message);
    } catch (err: unknown) {
      console.error("Error during initial minting:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Minting failed.");
      } else {
        setError("Minting failed.");
      }
      setIsMinting(false);
      return;
    }

    // Set up interval for subsequent minting every 10 seconds
    intervalRef.current = setInterval(async () => {
      try {
        const response = await axios.post("/api/admin/mint", {
          credits,
          tokens,
        });
        setSuccess(response.data.message);
      } catch (err: unknown) {
        console.error("Error during minting:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.error || "Minting failed.");
        } else {
          setError("Minting failed.");
        }
        setIsMinting(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 10000); // 10,000 ms = 10 seconds
  };

  const handleStopMinting = () => {
    if (!isMinting) return;

    setIsMinting(false);
    setSuccess("Minting stopped.");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mb-12 p-8 border-2 border-gray-300 rounded-lg shadow-lg bg-white transition-transform duration-500 ease-in-out transform hover:scale-105">
      <h2 className="text-3xl font-bold mb-6 text-center animate-fadeIn">
        Minting Control
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="credits"
            className="mb-2 text-lg font-medium text-gray-700"
          >
            Credits to Mint Every 10 Seconds
          </label>
          <input
            type="number"
            id="credits"
            name="credits"
            min="1"
            value={credits}
            onChange={(e) => setCredits(parseInt(e.target.value))}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-shadow duration-300"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="tokens"
            className="mb-2 text-lg font-medium text-gray-700"
          >
            Tokens to Mint Every 10 Seconds
          </label>
          <input
            type="number"
            id="tokens"
            name="tokens"
            min="1"
            value={tokens}
            onChange={(e) => setTokens(parseInt(e.target.value))}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-shadow duration-300"
          />
        </div>
      </div>
      <div className="flex justify-center space-x-6">
        {!isMinting ? (
          <button
            onClick={handleStartMinting}
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300 transform hover:scale-105"
          >
            Start Minting
          </button>
        ) : (
          <button
            onClick={handleStopMinting}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-300 transform hover:scale-105"
          >
            Stop Minting
          </button>
        )}
      </div>
      {error && (
        <p className="mt-6 text-center text-red-500 animate-pulse">{error}</p>
      )}
      {success && (
        <p className="mt-6 text-center text-green-500 animate-pulse">
          {success}
        </p>
      )}
    </div>
  );
};

export default MintingControl;
