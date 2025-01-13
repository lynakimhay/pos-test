import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Find the customer by ID
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Customer found", customer });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to find customer", details: (error as Error).message },
            { status: 400 }
        );
    }
}
