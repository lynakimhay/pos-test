import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
export interface ProductRefModel {
  id: number;
  nameEn: string;
  nameKh: string;
  categoryNameEn: string;
  categoryNameKh: string;
  productCode: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameKh, categoryId, sku, createdBy, updatedBy } = body;

    // Fetch the latest productCode
    const latestProduct = await prisma.product.findFirst({
      orderBy: { id: "desc" }, // Get the latest record
      select: { productCode: true },
    });

    // Generate the new productCode
    let newProductCode = "P0001"; // Default if no products exist
    if (latestProduct?.productCode) {
      const currentCodeNumber = parseInt(latestProduct.productCode.substring(1), 10); // Extract the numeric part
      newProductCode = `P${(currentCodeNumber + 1).toString().padStart(4, "0")}`; // Increment and format
    }

    // Save the new product to the database
    const productView = await prisma.product.create({
      data: {
        productCode: newProductCode,
        nameEn,
        nameKh,
        categoryId: categoryId,
        sku,
        createdBy,
        updatedBy,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      productView,
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add product" },
      { status: 500 }
    );
  }
}

export async function GET() {
    const data = await prisma.product.findMany();
    return NextResponse.json({ data });
  }