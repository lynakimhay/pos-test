import { getSessionData } from "@/app/auth/stateless-session";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";


export interface ProductModel {
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
    const { nameEn, nameKh, categoryId, sku, imageUrl } = body; // Image should be passed as "image" (case-sensitive)

    const session = await getSessionData();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the latest productCode
    const latestProduct = await prisma.product.findFirst({
      orderBy: { id: "desc" }, // Get the latest product
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
        imageUrl: imageUrl, // Save Cloudinary URL
        createdBy: session?.userId,
        updatedBy: session?.userId,
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
