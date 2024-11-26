// app/api/admin/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define Admin User ID
const ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Replace with your actual admin user ID

// Type for PUT request body
interface UpdateProductBody {
  name?: string;
  description?: string;
  price?: number;
  inStock?: number;
  category?: string;
  brand?: string;
  imageUrl?: string;
}

// The route handler for the PUT request
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Accessing params directly
    const { userId: authenticatedUserId } = getAuth(request);

    // Authorization: Only admin can update products
    if (authenticatedUserId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateProductBody = await request.json();

    // Validate input
    if (
      (body.price !== undefined && isNaN(body.price)) ||
      (body.inStock !== undefined && isNaN(body.inStock))
    ) {
      return NextResponse.json(
        { error: "Invalid input data." },
        { status: 400 }
      );
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id }, // 'id' is passed from the route
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        inStock: body.inStock,
        category: body.category,
        brand: body.brand,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    if ((error as { code?: string }).code === "P2025") {
      // Prisma error for not found
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
