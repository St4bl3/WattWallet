// app/api/products/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userId } = body;

    if (!productId || !userId) {
      return NextResponse.json(
        { error: "Missing productId or userId" },
        { status: 400 }
      );
    }

    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.inStock <= 0) {
      return NextResponse.json(
        { error: "Product out of stock or not found" },
        { status: 404 }
      );
    }

    // Update stock and record transaction (dummy logic for balance changes)
    await prisma.product.update({
      where: { id: productId },
      data: { inStock: product.inStock - 1 },
    });

    return NextResponse.json(
      { message: "Product purchased successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing purchase:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
