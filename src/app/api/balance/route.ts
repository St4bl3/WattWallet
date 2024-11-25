// app/api/balance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const balance = await prisma.balance.findUnique({
      where: { userId },
      select: {
        creditBalance: true,
        energyBalance: true,
      },
    });

    if (!balance) {
      return NextResponse.json({ error: "Balance not found" }, { status: 404 });
    }

    return NextResponse.json(balance, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
