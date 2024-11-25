// components/ApplianceCard.tsx
"use client";

import React from "react";

interface Appliance {
  id: string;
  name: string;
  energyBalance: number;
}

interface ApplianceCardProps {
  appliance: Appliance;
  onToggle: () => void;
}

const ApplianceCard: React.FC<ApplianceCardProps> = ({
  appliance,
  onToggle,
}) => {
  const isOn = appliance.energyBalance > 0;

  return (
    <div
      className={`w-64 h-40 border-4 border-black rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform transform hover:scale-105 ${
        isOn ? "shadow-lg shadow-green-500/50" : ""
      }`}
      onClick={onToggle}
    >
      <h2 className="text-2xl font-semibold mb-4">{appliance.name}</h2>
      <div
        className={`w-12 h-12 rounded-full ${
          isOn ? "bg-green-500 animate-pulse" : "bg-gray-300"
        }`}
      ></div>
      <p className="mt-2 text-sm">{isOn ? "On" : "Off"}</p>
    </div>
  );
};

export default ApplianceCard;
