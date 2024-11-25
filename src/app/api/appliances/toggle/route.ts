// app/api/appliances/toggle/route.ts
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
    const { applianceId } = body;

    if (!applianceId) {
      return NextResponse.json(
        { error: "Appliance ID is required" },
        { status: 400 }
      );
    }

    // Fetch the appliance to ensure it belongs to the user
    const appliance = await prisma.appliance.findUnique({
      where: { id: applianceId },
    });

    if (!appliance || appliance.userId !== userId) {
      return NextResponse.json(
        { error: "Appliance not found" },
        { status: 404 }
      );
    }

    const isCurrentlyOn = appliance.energyBalance > 0;
    let updatedAppliance;

    if (!isCurrentlyOn) {
      // Turning appliance on
      // Check if user has at least 1 energy token
      const userBalance = await prisma.balance.findUnique({
        where: { userId },
      });

      if (!userBalance) {
        return NextResponse.json(
          { error: "User balance not found" },
          { status: 404 }
        );
      }

      if (userBalance.energyBalance < 1) {
        return NextResponse.json(
          { error: "Insufficient energy tokens to turn on appliance" },
          { status: 400 }
        );
      }

      // Deduct 1 energy token from user
      await prisma.balance.update({
        where: { userId },
        data: { energyBalance: { decrement: 1 } },
      });

      // Add 1 energy token to appliance
      await prisma.appliance.update({
        where: { id: applianceId },
        data: { energyBalance: { increment: 1 } },
      });

      // Record transaction from user to appliance
      await prisma.transaction.create({
        data: {
          transactionId: crypto.randomUUID(),
          senderId: userId,
          receiverId: applianceId, // Assuming applianceId can be a receiver
          applianceId: applianceId,
          createdAt: new Date(),
        },
      });

      // Update appliance state
      updatedAppliance = await prisma.appliance.findUnique({
        where: { id: applianceId },
        select: { id: true, name: true, energyBalance: true },
      });
    } else {
      // Turning appliance off
      // Deduct 1 energy token from appliance
      await prisma.appliance.update({
        where: { id: applianceId },
        data: { energyBalance: { decrement: 1 } },
      });

      // No tokens are added back to the user or the bank in this scenario
      // Optionally, handle token refund or other logic

      // Record transaction if necessary

      // Update appliance state
      updatedAppliance = await prisma.appliance.findUnique({
        where: { id: applianceId },
        select: { id: true, name: true, energyBalance: true },
      });
    }

    return NextResponse.json(
      {
        message: "Appliance toggled successfully",
        appliance: updatedAppliance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling appliance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
