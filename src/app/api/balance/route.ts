// app/api/balance/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { initializeUserData } from "../../../lib/initializeUserData"; // Adjust the path as necessary

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Attempt to fetch the balance
    let balance = await prisma.balance.findUnique({
      where: { userId },
      select: {
        creditBalance: true,
        energyBalance: true,
      },
    });

    // If balance doesn't exist, initialize user data
    if (!balance) {
      console.log(
        `Balance not found for user: ${userId}. Initializing user data.`
      );
      await initializeUserData(userId);

      // Retry fetching the balance after initialization
      balance = await prisma.balance.findUnique({
        where: { userId },
        select: {
          creditBalance: true,
          energyBalance: true,
        },
      });

      // If balance is still not found, return an error
      if (!balance) {
        return NextResponse.json(
          { error: "Failed to initialize balance." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(balance, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
