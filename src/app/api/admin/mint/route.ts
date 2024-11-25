// app/api/admin/mint/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Admin's User ID

interface MintBody {
  credits: number; // Number of credits to mint
  tokens: number; // Number of tokens to mint
}

export async function POST(request: NextRequest) {
  try {
    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can mint
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: MintBody = await request.json();
    const { credits, tokens } = body;

    // Validate input
    if (credits <= 0 || tokens <= 0) {
      return NextResponse.json(
        { error: "Credits and tokens must be positive numbers." },
        { status: 400 }
      );
    }

    // Fetch admin's balance
    const adminBalance = await prisma.balance.findUnique({
      where: { userId: ADMIN_USER_ID },
      select: { creditBalance: true, energyBalance: true },
    });

    if (!adminBalance) {
      return NextResponse.json(
        { error: "Admin balance not found." },
        { status: 404 }
      );
    }

    // Perform the minting transaction
    await prisma.$transaction([
      // Increment credits
      prisma.balance.update({
        where: { userId: ADMIN_USER_ID },
        data: { creditBalance: { increment: credits } },
      }),
      // Increment tokens
      prisma.balance.update({
        where: { userId: ADMIN_USER_ID },
        data: { energyBalance: { increment: tokens } },
      }),
      // Log minting as transactions
      prisma.transaction.create({
        data: {
          transactionId: crypto.randomUUID(),
          senderId: "system", // Represents system minting
          receiverId: ADMIN_USER_ID,
          type: "MintCredits",
          amount: credits, // Amount in credits
          productId: null,
        },
      }),
      prisma.transaction.create({
        data: {
          transactionId: crypto.randomUUID(),
          senderId: "system",
          receiverId: ADMIN_USER_ID,
          type: "MintTokens",
          amount: tokens, // Amount in tokens
          productId: null,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Minting successful." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during minting:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
