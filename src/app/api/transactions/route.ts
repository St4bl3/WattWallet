// app/api/transactions/route.ts
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

    // Fetch transactions where the user is the sender
    const transactions = await prisma.transaction.findMany({
      where: {
        senderId: userId,
      },
      orderBy: {
        // Since 'createdAt' was removed, use 'transactionId' or another field if necessary
        transactionId: "desc",
      },
      include: {
        product: true,
        appliance: true,
      },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
