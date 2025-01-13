import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const data = await prisma.promotion.findMany();
  // console.log("...........",data);
  
  return NextResponse.json({ message: "data", data });

}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      promotionCode,
      description,
      startDate,
      endDate,
      discountPercentage
    } = body;

    // console.log(startDate, typeof startDate);

    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(end, typeof end);
    console.log(start, typeof start);

    const newPromotion = await prisma.promotion.create({
      data: {
        promotionCode,
        description,
        startDate: start,
        endDate: end,
        discountPercentage,
      },
    });

    return NextResponse.json({
      message: "Promotion created successfully!",
      newPromotion,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create Promotion",
        details: (error as Error).message,
      },
      { status: 400 }
    );
  }
}



