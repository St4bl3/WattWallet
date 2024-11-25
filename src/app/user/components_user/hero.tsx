// components/MainPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TypewriterEffectSmooth } from "../../../components/ui/typewriter-effect";

// Define types for devices
interface DeviceStatus {
  light: boolean;
  fan: boolean;
  tv: boolean;
}

export function MainPage() {
  // State for credits and energy tokens
  const [credits, setCredits] = useState<number>(200);
  const [energyTokens, setEnergyTokens] = useState<number>(100);

  // State for device toggles
  const [devices, setDevices] = useState<DeviceStatus>({
    light: false,
    fan: false,
    tv: false,
  });

  // State for Buy Credits modal
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState<boolean>(false);
  const [creditsToAdd, setCreditsToAdd] = useState<number>(0);

  // Handle device toggle
  const handleToggle = (device: keyof DeviceStatus) => {
    setDevices((prev) => ({
      ...prev,
      [device]: !prev[device],
    }));
  };

  // Effect to consume energy tokens every 5 seconds if any device is on
  useEffect(() => {
    const interval = setInterval(() => {
      const activeDevices = Object.values(devices).filter((status) => status);
      if (activeDevices.length > 0) {
        const tokensToConsume = activeDevices.length; // 1 token per device
        setEnergyTokens((prev) => Math.max(prev - tokensToConsume, 0));
      }
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [devices]);

  // Handle Buy Energy Tokens
  const handleBuyTokens = () => {
    const tokensToBuy = Math.floor(credits / 1) * 10; // 10 tokens per 1 credit
    if (tokensToBuy > 0) {
      setEnergyTokens((prev) => prev + tokensToBuy);
      setCredits((prev) => prev - Math.floor(tokensToBuy / 10));
    } else {
      alert("Not enough credits to buy tokens.");
    }
  };

  // Handle Sell Energy Tokens
  const handleSellTokens = () => {
    if (energyTokens >= 10) {
      const creditsToAdd = Math.floor(energyTokens / 10);
      setCredits((prev) => prev + creditsToAdd);
      setEnergyTokens((prev) => prev - creditsToAdd * 10);
    } else {
      alert("Not enough energy tokens to sell.");
    }
  };

  // Handle Buy Credits
  const handleBuyCredits = () => {
    if (creditsToAdd > 0) {
      setCredits((prev) => prev + creditsToAdd);
      setIsBuyCreditsOpen(false);
      setCreditsToAdd(0);
    }
  };

  // Words for the typewriter effect
  const words = [
    { text: "Build" },
    { text: "awesome" },
    { text: "apps" },
    { text: "with" },
    { text: "Aceternity.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base mb-4">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />

      {/* Display Balances */}
      <div className="mt-6 flex space-x-8">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Credits</h3>
          <p className="text-2xl">{credits}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Energy Tokens</h3>
          <p className="text-2xl">{energyTokens}</p>
        </div>
      </div>

      {/* Buy and Sell Buttons */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-6">
        <button
          onClick={handleBuyTokens}
          className="w-40 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm"
        >
          Buy Tokens
        </button>
        <button
          onClick={handleSellTokens}
          className="w-40 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm"
        >
          Sell Tokens
        </button>
        <button
          onClick={() => setIsBuyCreditsOpen(true)}
          className="w-40 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm"
        >
          Buy Credits
        </button>
      </div>

      {/* Device Toggles */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
        {["light", "fan", "tv"].map((device) => (
          <div
            key={device}
            className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-lg shadow"
          >
            <span className="capitalize text-lg">{device}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={devices[device as keyof DeviceStatus]}
                onChange={() => handleToggle(device as keyof DeviceStatus)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Buy Credits Modal */}
      {isBuyCreditsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Buy Credits</h2>
            <input
              type="number"
              min="1"
              value={creditsToAdd}
              onChange={(e) => setCreditsToAdd(Number(e.target.value))}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter amount of credits"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsBuyCreditsOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBuyCredits}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
