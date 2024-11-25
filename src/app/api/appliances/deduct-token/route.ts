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

        // Fetch the user's balance
        const balance = await prisma.balance.findUnique({
            where: { userId },
        });

        if (!balance) {
            return NextResponse.json({ error: "Balance not found" }, { status: 404 });
        }

        if (balance.energyBalance < 1) {
            return NextResponse.json(
                { error: "Insufficient energy tokens" },
                { status: 400 }
            );
        }

        // Deduct one energy token
        const updatedBalance = await prisma.balance.update({
            where: { userId },
            data: { energyBalance: { decrement: 1 } },
        });

        return NextResponse.json({ energyBalance: updatedBalance.energyBalance });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
