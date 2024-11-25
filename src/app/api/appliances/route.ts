// app/api/appliances/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const DEFAULT_APPLIANCES = ["Light", "Fan", "TV"];

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check existing appliances
    const existingAppliances = await prisma.appliance.findMany({
      where: { userId },
      select: { name: true },
    });

    const existingNames = existingAppliances.map((app) => app.name);

    // Initialize missing appliances
    const missingAppliances = DEFAULT_APPLIANCES.filter(
      (name) => !existingNames.includes(name)
    );

    if (missingAppliances.length > 0) {
      // Fetch or create the user's balance
      let balance = await prisma.balance.findUnique({
        where: { userId },
      });

      if (!balance) {
        balance = await prisma.balance.create({
          data: {
            userId,
            creditBalance: 200, // Initial credits as per user instructions
            energyBalance: 100, // Initial energy tokens (adjust as needed)
            appliances: { create: [] },
            isBank: false,
          },
        });
      }

      // Create missing appliances
      const appliancesToCreate = missingAppliances.map((name) => ({
        userId,
        name,
        energyBalance: 0,
        balanceId: balance.id,
      }));

      await prisma.appliance.createMany({
        data: appliancesToCreate,
      });
    }

    const appliances = await prisma.appliance.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        energyBalance: true,
      },
    });

    return NextResponse.json(appliances);
  } catch (error) {
    console.error("Error fetching appliances:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
