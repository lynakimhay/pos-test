import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


//Get Product

export async function GET() {
  try {
    const data = await prisma.productCategory.findMany();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}