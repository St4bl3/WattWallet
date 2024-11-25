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
            // Create missing appliances without updating the balance table
            const appliancesToCreate = missingAppliances.map((name) => ({
                userId,
                name,
                energyBalance: 0,
                balanceId: "default-balance-id", // Replace with appropriate balanceId
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
