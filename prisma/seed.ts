// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { clerkClient } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";
import { initializeUserData } from "../src/lib/initializeUserData"; // Adjust the path as necessary

dotenv.config();

const prisma = new PrismaClient();

// Initialize Clerk
const clerk = clerkClient;

interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  // Add other fields if necessary
}

const main = async () => {
  try {
    // Fetch all users from Clerk
    const response = await clerk.users.getUserList({
      limit: 1000, // Adjust as needed
    });
    const users: ClerkUser[] = response.data;

    console.log(`Fetched ${users.length} users from Clerk.`);

    for (const user of users) {
      await initializeUserData(user.id);
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
