// app/api/admin/products/statistics/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define Admin User ID
const ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Replace with your actual admin user ID

export async function GET(request: NextRequest) {
  try {
    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can access statistics
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all products
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    });

    // Fetch transactions of type 'Purchase' and group by productId
    const salesData = await prisma.transaction.groupBy({
      by: ["productId"],
      where: { type: "Purchase", productId: { not: null } },
      _count: { productId: true },
    });

    // Map sales count to products
    const statistics = products.map((product) => {
      const saleRecord = salesData.find(
        (sale) => sale.productId === product.id
      );
      return {
        productId: product.id,
        productName: product.name,
        salesCount: saleRecord?._count.productId || 0,
      };
    });

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error("Error fetching sales statistics:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
