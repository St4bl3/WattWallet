// app/api/store/buy-credits/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const BANK_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Replace with your actual Bank user ID

interface BuyCreditsBody {
  amount: number; // Amount of credits to buy
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BuyCreditsBody = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Fetch user's balance
    const userBalance = await prisma.balance.findUnique({
      where: { userId },
    });

    if (!userBalance) {
      return NextResponse.json(
        { error: "User balance not found" },
        { status: 404 }
      );
    }

    // Fetch bank's balance
    const bankBalance = await prisma.balance.findUnique({
      where: { userId: BANK_USER_ID },
    });

    if (!bankBalance) {
      return NextResponse.json(
        { error: "Bank balance not found" },
        { status: 404 }
      );
    }

    if (bankBalance.creditBalance < amount) {
      return NextResponse.json(
        { error: "Bank has insufficient credits" },
        { status: 400 }
      );
    }

    // Perform the transaction atomically
    await prisma.$transaction([
      // Deduct credits from bank
      prisma.balance.update({
        where: { userId: BANK_USER_ID },
        data: { creditBalance: { decrement: amount } },
      }),
      // Add credits to user
      prisma.balance.update({
        where: { userId },
        data: { creditBalance: { increment: amount } },
      }),
      // Create transaction
      prisma.transaction.create({
        data: {
          transactionId: crypto.randomUUID(),
          senderId: BANK_USER_ID,
          receiverId: userId,
          type: "BuyCredits",
          amount: amount, // Amount in credits
          productId: null, // No product associated
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Credits purchased successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error buying credits:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
