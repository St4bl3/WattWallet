// app/api/admin/users/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_USER_ID = "user_2pJCPbHT8T85lFtUPKIMElAMpu8"; // Admin's User ID

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can fetch user details
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch Clerk user details using REST API with API key
    const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_API_KEY) {
      console.error("Clerk API Key is missing.");
      return NextResponse.json(
        { error: "Clerk API Key is not configured." },
        { status: 500 }
      );
    }

    const clerkResponse = await fetch(
      `https://api.clerk.dev/v1/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CLERK_API_KEY}`,
        },
      }
    );

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json();
      console.error("Clerk API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch user from Clerk." },
        { status: 500 }
      );
    }

    const clerkUser = await clerkResponse.json();

    // Fetch user's balance from the database
    const balance = await prisma.balance.findUnique({
      where: { userId },
      select: { creditBalance: true, energyBalance: true },
    });

    // Fetch user's transactions from the database
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { transactionId: "desc" },
      include: {
        product: true,
      },
    });

    // Define TypeScript interfaces
    interface Transaction {
      id: string;
      transactionId: string;
      senderId: string;
      receiverId: string;
      type: string;
      amount: number;
      product: {
        id: string;
        name: string;
        imageUrl: string;
      } | null;
    }

    interface UserDetails {
      id: string;
      email: string;
      creditBalance: number;
      energyBalance: number;
      transactions: Transaction[];
    }

    // Format user details
    const userDetails: UserDetails = {
      id: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address || "",
      creditBalance: balance?.creditBalance || 0,
      energyBalance: balance?.energyBalance || 0,
      transactions: transactions.map((tx) => ({
        id: tx.id,
        transactionId: tx.transactionId,
        senderId: tx.senderId,
        receiverId: tx.receiverId,
        type: tx.type,
        amount: tx.amount,
        product: tx.product
          ? {
              id: tx.product.id,
              name: tx.product.name,
              imageUrl: tx.product.imageUrl,
            }
          : null,
      })),
    };

    return NextResponse.json(userDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
