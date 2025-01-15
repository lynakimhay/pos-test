// import { NextResponse, NextRequest } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(request: NextRequest) {
//   try {
//     const data = await request.json();
//     const supplier = await prisma.supplier.create({ data });
//     return NextResponse.json({ success: true, data: supplier});
//   } catch (error) {
//     return NextResponse.json({ success: false, error: 'eroor'});
//   }
// }



// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = request.nextUrl;
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

//     const suppliers = await prisma.supplier.findMany({
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ success: true, data: suppliers });
//   } catch (error) {
//     return NextResponse.json({ success: false, error:'error.message' });
//   }
// }



import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Fetch all suppliers
export async function GET(request: NextRequest) {
  const data = await prisma.supplier.findMany();
  return NextResponse.json({ message: "success", data });
}

// Create a new supplier
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const newSupplier = await prisma.supplier.create({
    data: body, // Ensure request body matches your supplier model structure
  });

  return NextResponse.json({ message: "Supplier created", data: newSupplier });
}

