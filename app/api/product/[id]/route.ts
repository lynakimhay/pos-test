import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// Update a product by ID
export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    const { id } = params; // Extract product ID from URL
    const body = await request.json();
    const { nameEn, nameKh, categoryId, sku, updatedBy } = body;

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) }, // Convert id to number if stored as an integer
      data: {
        nameEn,
        nameKh,
        categoryId,
        sku,
        updatedBy,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
    try {
      const { id } = params; // Extract product ID from URL
  
      // Delete the product from the database
      await prisma.product.delete({
        where: { id: Number(id) }, // Convert id to number if stored as an integer
      });
  
      return NextResponse.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete product" },
        { status: 500 }
      );
    }
  }




  export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    try {
      const { id } = params; 
  
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });
  
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        success: true,
        message: "Product retrieved successfully",
        product,
      });
    } catch (error) {
      console.error("Error retrieving product:", error);
      return NextResponse.json(
        { success: false, message: "Failed to retrieve product" },
        { status: 500 }
      );
    }
  }