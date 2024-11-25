// app/api/buy-credits/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BuyCreditsBody {
  userId: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: BuyCreditsBody = await request.json();
    const { userId, amount } = body;

    if (!userId || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Update balance
    const updatedBalance = await prisma.balance.upsert({
      where: { userId },
      update: { creditBalance: { increment: amount } },
      create: {
        userId,
        creditBalance: amount,
        energyBalance: 0,
        appliances: {
          create: [],
        },
      },
    });

    // Create a transaction (assuming sender is user and receiver is system/bank)
    await prisma.transaction.create({
      data: {
        transactionId: crypto.randomUUID(),
        senderId: "system",
        receiverId: userId,
      },
    });

    return NextResponse.json({
      creditBalance: updatedBalance.creditBalance,
      energyBalance: updatedBalance.energyBalance,
    });
  } catch (error) {
    console.error("Error buying credits:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
