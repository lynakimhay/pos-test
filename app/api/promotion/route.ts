
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

interface PromotionFormData {
  promotionCode: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  discountPercentage: number;
  imageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newData: PromotionFormData = {
      promotionCode: data.promotionCode,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      discountPercentage: parseFloat(data.discountPercentage),
    };

    const promotion = await prisma.promotion.create({ data: newData });
    return NextResponse.json({ success: true, data: promotion });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: 'eroor'});
  }
}


export async function GET(request: NextRequest) {
  try {
    const data = await prisma.promotion.findMany();

    // Convert Decimal to number for each promotion on the server side
    const formattedData = data.map((promotion) => ({
      ...promotion,
      discountPercentage: promotion.discountPercentage.toNumber(), // Convert Decimal to number
    }));

    return NextResponse.json({ message: "Promotions found", data: formattedData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: 'Error fetching promotions' });
  }
}

