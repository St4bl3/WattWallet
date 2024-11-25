// app/api/store/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const BANK_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Bank User ID

interface PurchaseBody {
  productId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: PurchaseBody = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.inStock <= 0) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 400 }
      );
    }

    // Fetch user's balance
    const userBalance = await prisma.balance.findUnique({
      where: { userId },
    });

    if (!userBalance) {
      return NextResponse.json(
        { error: "User balance not found" },
        { status: 404 }
      );
    }

    if (userBalance.creditBalance < product.price) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // Fetch bank's balance
    const bankBalance = await prisma.balance.findUnique({
      where: { userId: BANK_USER_ID },
    });

    if (!bankBalance) {
      return NextResponse.json(
        { error: "Bank balance not found" },
        { status: 404 }
      );
    }

    // Check again to prevent race conditions
    const latestProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!latestProduct || latestProduct.inStock <= 0) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 400 }
      );
    }

    const latestUserBalance = await prisma.balance.findUnique({
      where: { userId },
    });

    if (!latestUserBalance || latestUserBalance.creditBalance < product.price) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // Deduct credits from user
    await prisma.balance.update({
      where: { userId },
      data: { creditBalance: { decrement: product.price } },
    });

    // Add credits to bank
    await prisma.balance.update({
      where: { userId: BANK_USER_ID },
      data: { creditBalance: { increment: product.price } },
    });

    // Decrement product inStock
    await prisma.product.update({
      where: { id: productId },
      data: { inStock: { decrement: 1 } },
    });

    // Record transaction between user and bank
    await prisma.transaction.create({
        data: {
            transactionId: crypto.randomUUID(),
            senderId: userId,
            receiverId: BANK_USER_ID,
            productId: productId,
        },
    });

    return NextResponse.json(
      { message: "Product purchased successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error purchasing product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
