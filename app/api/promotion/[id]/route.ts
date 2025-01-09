import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.promotion.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: "Customer deleted successfully!" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer", details: (error as Error).message }, { status: 400 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const body = await request.json();
        const {    promotionCode,
            description,
            startDate,
            endDate,
            discountPercentage } = body;
            const start = new Date(startDate);
            const end = new Date(endDate)
            const updatedPromotion = await prisma.promotion.update({
                where: { id: parseInt(id) },
                data: {
                    promotionCode,
                    description,
                    startDate: start,
                    endDate: end,
                    discountPercentage
                },
            });
            

        return NextResponse.json({ message: "Promotion updated successfully!", updatedPromotion });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update promotion", details: (error as Error).message },
            { status: 400 }
        );
    }
}