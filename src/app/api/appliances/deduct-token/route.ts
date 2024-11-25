// app/api/appliances/deduct-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { count } = body;

    if (!count || count < 1) {
      return NextResponse.json({ error: "Invalid count" }, { status: 400 });
    }

    // Fetch the user's balance
    const userBalance = await prisma.balance.findUnique({
      where: { userId },
    });

    if (!userBalance) {
      return NextResponse.json(
        { error: "User balance not found" },
        { status: 404 }
      );
    }

    if (userBalance.energyBalance < count) {
      return NextResponse.json(
        { error: "Insufficient energy tokens" },
        { status: 400 }
      );
    }

    // Deduct tokens from user
    await prisma.balance.update({
      where: { userId },
      data: { energyBalance: { decrement: count } },
    });

    // Fetch all active appliances
    const activeAppliances = await prisma.appliance.findMany({
      where: { userId, energyBalance: { gt: 0 } },
    });

    if (activeAppliances.length < count) {
      return NextResponse.json(
        { error: "Mismatch in active appliances and token count" },
        { status: 400 }
      );
    }

    // Deduct one energy token from each active appliance
    for (let i = 0; i < count; i++) {
      const appliance = activeAppliances[i];
      await prisma.appliance.update({
        where: { id: appliance.id },
        data: { energyBalance: { decrement: 1 } },
      });

      // Record transaction from user to appliance
      await prisma.transaction.create({
        data: {
          transactionId: crypto.randomUUID(),
          senderId: userId,
          receiverId: appliance.id,
          applianceId: appliance.id,
          createdAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      { message: "Energy tokens deducted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deducting energy tokens:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
