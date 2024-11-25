// app/api/store/buy-tokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const BANK_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Replace with your actual Bank user ID

interface BuyTokensBody {
  amount: number; // Number of tokens to buy
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BuyTokensBody = await request.json();
    const { amount: tokensToBuy } = body;

    if (!tokensToBuy || tokensToBuy <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const creditsSpent = tokensToBuy / 10;

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

    if (userBalance.creditBalance < creditsSpent) {
      return NextResponse.json(
        { error: "Insufficient credits" },
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

    if (bankBalance.energyBalance < tokensToBuy) {
      return NextResponse.json(
        { error: "Bank has insufficient energy tokens" },
        { status: 400 }
      );
    }

    // Perform the transaction atomically
    await prisma.$transaction([
      // Deduct credits from user
      prisma.balance.update({
        where: { userId },
        data: { creditBalance: { decrement: creditsSpent } },
      }),
      // Add credits to bank
      prisma.balance.update({
        where: { userId: BANK_USER_ID },
        data: { creditBalance: { increment: creditsSpent } },
      }),
      // Deduct tokens from bank
      prisma.balance.update({
        where: { userId: BANK_USER_ID },
        data: { energyBalance: { decrement: tokensToBuy } },
      }),
      // Add tokens to user
      prisma.balance.update({
        where: { userId },
        data: { energyBalance: { increment: tokensToBuy } },
      }),
      // Create transaction
      prisma.transaction.create({
        data: {
          transactionId: crypto.randomUUID(),
          senderId: userId,
          receiverId: BANK_USER_ID,
          type: "BuyTokens",
          amount: creditsSpent, // Amount in credits
          productId: null,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Energy tokens purchased successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error buying tokens:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
