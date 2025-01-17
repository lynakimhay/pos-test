import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, address } = body;

        console.log(firstName, lastName, email, phone, address);
        
        const updatedCustomer = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
            },
        });

        return NextResponse.json({ message: "Customer updated successfully!", updatedCustomer });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update customer", details: (error as Error).message },
            { status: 400 }
        );
    }
}