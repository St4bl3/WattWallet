// components/Appliances.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplianceCard from "./ApplianceCard";

interface Appliance {
  id: string;
  name: string;
  energyBalance: number;
}

const Appliances: React.FC = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch appliances from the API
  const fetchAppliances = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/appliances");
      setAppliances(response.data);
    } catch (error) {
      console.error("Error fetching appliances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle appliance state (on/off)
  const toggleAppliance = async (applianceId: string) => {
    try {
      const response = await axios.post("/api/appliances/toggle", {
        applianceId,
      });
      const updatedAppliance: Appliance = response.data;
      setAppliances((prev) =>
        prev.map((appliance) =>
          appliance.id === updatedAppliance.id ? updatedAppliance : appliance
        )
      );
    } catch (error: unknown) {
      console.error("Error toggling appliance:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Error toggling appliance");
      } else {
        alert("Error toggling appliance");
      }
    }
  };

  // Deduct energy tokens every 5 seconds for active appliances
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axios.post("/api/appliances/deduct-token");
      } catch (error: unknown) {
        console.error("Error deducting energy token:", error);
        // Optionally, notify the user or handle insufficient tokens
      }
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [appliances]);

  // Initial fetch and polling every 5 seconds to keep appliances updated
  useEffect(() => {
    fetchAppliances();

    const polling = setInterval(() => {
      fetchAppliances();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(polling);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4">
      <h1 className="text-5xl font-bold mb-12">Manage Your Appliances</h1>
      <div className="flex space-x-6">
        {appliances.map((appliance) => (
          <ApplianceCard
            key={appliance.id}
            appliance={appliance}
            onToggle={() => toggleAppliance(appliance.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Appliances;
