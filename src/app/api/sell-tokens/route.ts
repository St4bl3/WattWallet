// app/api/sell-tokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SellTokensBody {
  userId: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SellTokensBody = await request.json();
    const { userId, amount } = body;

    if (!userId || amount <= 0 || amount % 10 !== 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const tokensToSell = amount;
    const creditsToAdd = tokensToSell / 10;

    // Fetch user's balance
    const balance = await prisma.balance.findUnique({
      where: { userId },
    });

    if (!balance) {
      return NextResponse.json({ error: "Balance not found" }, { status: 404 });
    }

    if (balance.energyBalance < tokensToSell) {
      return NextResponse.json(
        { error: "Insufficient tokens" },
        { status: 400 }
      );
    }

    // Update balance
    const updatedBalance = await prisma.balance.update({
      where: { userId },
      data: {
        creditBalance: { increment: creditsToAdd },
        energyBalance: { decrement: tokensToSell },
      },
    });

    // Create a transaction (assuming sender is user and receiver is system/bank)
    await prisma.transaction.create({
      data: {
        transactionId: crypto.randomUUID(),
        senderId: userId,
        receiverId: "system",
      },
    });

    return NextResponse.json({
      creditBalance: updatedBalance.creditBalance,
      energyBalance: updatedBalance.energyBalance,
    });
  } catch (error) {
    console.error("Error selling tokens:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
