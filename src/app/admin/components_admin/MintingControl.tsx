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
    <div className="w-full max-w-4xl mb-8 p-6 border-2 border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Minting Control</h2>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex flex-col">
          <label
            htmlFor="credits"
            className="text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tokens" className="text-sm font-medium text-gray-700">
            Tokens to Mint Every 10 Seconds
          </label>
          <input
            type="number"
            id="tokens"
            name="tokens"
            min="1"
            value={tokens}
            onChange={(e) => setTokens(parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        {!isMinting ? (
          <button
            onClick={handleStartMinting}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Start Minting
          </button>
        ) : (
          <button
            onClick={handleStopMinting}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Stop Minting
          </button>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default MintingControl;
