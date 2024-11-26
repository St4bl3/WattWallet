// app/api/admin/products/[id]/actual-sales/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define Admin User ID
const ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Replace with your actual admin user ID

export async function GET(request: NextRequest) {
  try {
    // Extract the product ID from the URL directly
    const { pathname } = new URL(request.url);
    const productId = pathname.split("/")[5]; // [id] should be the 5th segment

    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can access actual sales
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // Count the number of 'Purchase' transactions for the product
    const count = await prisma.transaction.count({
      where: {
        productId: productId,
        type: "Purchase",
      },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching actual sales:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
