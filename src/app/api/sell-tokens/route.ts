// app/api/store/sell-tokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const BANK_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Replace with your actual Bank user ID

interface SellTokensBody {
  amount: number; // Number of tokens to sell
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SellTokensBody = await request.json();
    const { amount: tokensToSell } = body;

    if (!tokensToSell || tokensToSell <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const creditsReceived = tokensToSell / 10;

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

    if (userBalance.energyBalance < tokensToSell) {
      return NextResponse.json(
        { error: "Insufficient energy tokens" },
        { status: 400 }
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

    if (bankBalance.creditBalance < creditsReceived) {
      return NextResponse.json(
        { error: "Bank has insufficient credits" },
        { status: 400 }
      );
    }

    // Perform the transaction atomically
    await prisma.$transaction([
      // Deduct tokens from user
      prisma.balance.update({
        where: { userId },
        data: { energyBalance: { decrement: tokensToSell } },
      }),
      // Add tokens to bank
      prisma.balance.update({
        where: { userId: BANK_USER_ID },
        data: { energyBalance: { increment: tokensToSell } },
      }),
      // Deduct credits from bank
      prisma.balance.update({
        where: { userId: BANK_USER_ID },
        data: { creditBalance: { decrement: creditsReceived } },
      }),
      // Add credits to user
      prisma.balance.update({
        where: { userId },
        data: { creditBalance: { increment: creditsReceived } },
      }),
      // Create transaction
      prisma.transaction.create({
        data: {
          transactionId: crypto.randomUUID(),
          senderId: userId,
          receiverId: BANK_USER_ID,
          type: "SellTokens",
          amount: creditsReceived, // Amount in credits
          productId: null,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Energy tokens sold successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error selling tokens:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
