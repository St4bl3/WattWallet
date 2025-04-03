// app/api/admin/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

// Define Admin User ID
const ADMIN_USER_ID = "user_2pJCPbHT8T85lFtUPKIMElAMpu8"; // Replace with your actual admin user ID

// Type for POST request body
interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  inStock: number;
  category: string;
  brand: string;
  imageUrl: string;
}

export async function GET(request: NextRequest) {
  try {
    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can fetch products
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all products from the database
    const products: Product[] = await prisma.product.findMany();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can add products
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateProductBody = await request.json();

    // Validate input
    if (
      !body.name ||
      !body.description ||
      isNaN(body.price) ||
      isNaN(body.inStock) ||
      !body.category ||
      !body.brand ||
      !body.imageUrl
    ) {
      return NextResponse.json(
        { error: "Invalid input data." },
        { status: 400 }
      );
    }

    // Create a new product
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        inStock: body.inStock,
        category: body.category,
        brand: body.brand,
        imageUrl: body.imageUrl,
        ratings: 0, // Default value
        reviews: 0, // Default value
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
