// app/api/appliances/toggle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

interface ToggleApplianceBody {
  applianceId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ToggleApplianceBody = await request.json();
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

    // Toggle the energyBalance (0 -> 1, 1 -> 0)
    const newEnergyBalance = appliance.energyBalance > 0 ? 0 : 1;

    const updatedAppliance = await prisma.appliance.update({
      where: { id: applianceId },
      data: { energyBalance: newEnergyBalance },
    });

    return NextResponse.json(updatedAppliance);
  } catch (error) {
    console.error("Error toggling appliance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
