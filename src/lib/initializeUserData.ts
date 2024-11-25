// lib/initializeUserData.ts

import { PrismaClient, Appliance } from "@prisma/client";

const prisma = new PrismaClient();

// Export the User interface for future use
export interface User {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  // Add other fields if necessary
}

export const initializeUserData = async (userId: string) => {
  // Check if Balance exists
  const existingBalance = await prisma.balance.findUnique({
    where: { userId },
  });

  if (existingBalance) {
    console.log(`Balance already exists for user: ${userId}`);
    return;
  }

  // Create Balance
  const newBalance = await prisma.balance.create({
    data: {
      userId,
      creditBalance: 200, // Initialize with 200 credits as per your requirement
      energyBalance: 0,
      isBank: false,
    },
  });

  console.log(`Created Balance for user: ${userId}`);

  // Create Appliances
  const appliancesData: Omit<Appliance, "id" | "balanceId">[] = [
    {
      userId,
      name: "Light",
      energyBalance: 0,
      isOn: false,
    },
    {
      userId,
      name: "Fan",
      energyBalance: 0,
      isOn: false,
    },
    {
      userId,
      name: "TV",
      energyBalance: 0,
      isOn: false,
    },
  ];

  for (const appliance of appliancesData) {
    await prisma.appliance.create({
      data: {
        ...appliance,
        balanceId: newBalance.id,
      },
    });
    console.log(`Created Appliance '${appliance.name}' for user: ${userId}`);
  }
};
