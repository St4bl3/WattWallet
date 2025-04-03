// app/api/admin/products/actual-sales/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define Admin User ID
const ADMIN_USER_ID = "user_2pJCPbHT8T85lFtUPKIMElAMpu8"; // Replace with your actual admin user ID

export async function GET(request: NextRequest) {
  try {
    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can access actual sales
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Aggregate sales from the last 500 'Purchase' transactions
    const actualSales = await prisma.transaction.groupBy({
      by: ["productId"],
      where: { type: "Purchase", productId: { not: null } },
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 500,
    });

    // Fetch product names
    const productIds = actualSales.map((sale) => sale.productId).filter((id): id is string => id !== null);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const productNames = products.reduce<Record<string, string>>(
      (acc, product) => {
        acc[product.id] = product.name;
        return acc;
      },
      {}
    );

    // Prepare response
    const response = actualSales.map((sale) => ({
      productId: sale.productId,
      productName: sale.productId ? productNames[sale.productId] || "Unknown Product" : "Unknown Product",
      salesCount: sale._count.productId,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching actual sales:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
