// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Admin's User ID

export async function GET(request: NextRequest) {
  try {
    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can fetch users
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch Clerk users using REST API with API key
    const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_API_KEY) {
      console.error("Clerk API Key is missing.");
      return NextResponse.json(
        { error: "Clerk API Key is not configured." },
        { status: 500 }
      );
    }

    const clerkResponse = await fetch("https://api.clerk.dev/v1/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLERK_API_KEY}`,
      },
    });

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json();
      console.error("Clerk API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch users from Clerk." },
        { status: 500 }
      );
    }

    const clerkUsers = await clerkResponse.json();

    // Define TypeScript interfaces
    interface ClerkUser {
      id: string;
      email_addresses: { email_address: string }[];
    }

    interface Balance {
      creditBalance: number;
      energyBalance: number;
    }

    interface UserWithBalance {
      id: string;
      email: string;
      creditBalance: number;
      energyBalance: number;
    }

    // Map Clerk users to include balance information
    const userList: UserWithBalance[] = await Promise.all(
      clerkUsers.map(async (user: ClerkUser): Promise<UserWithBalance> => {
        const balance: Balance | null = await prisma.balance.findUnique({
          where: { userId: user.id },
          select: { creditBalance: true, energyBalance: true },
        });

        return {
          id: user.id,
          email: user.email_addresses[0]?.email_address || "",
          creditBalance: balance?.creditBalance || 0,
          energyBalance: balance?.energyBalance || 0,
        };
      })
    );

    return NextResponse.json(userList, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
