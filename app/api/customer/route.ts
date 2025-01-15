import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const data = await prisma.customer.findMany();
    return NextResponse.json({ message: "Hello", data });
}