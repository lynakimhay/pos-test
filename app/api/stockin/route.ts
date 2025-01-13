import { NextRequest, NextResponse } from "next/server";

let purchaseData = [
  {
    id: 1,
    supplierId: 101,
    referenceNumber: "REF12345",
    stockInDate: "2025-01-08",
    supplierName: "Supplier A",
    numberOfItems: 50,
    purchaseAmount: 1500.75,
  },
  {
    id: 2,
    supplierId: 102,
    referenceNumber: "REF67890",
    stockInDate: "2025-01-09",
    supplierName: "Supplier B",
    numberOfItems: 20,
    purchaseAmount: 800.5,
  },
];

const findPurchaseById = (id: number) => purchaseData.find((item) => item.id === id);

export async function GET() {
  return NextResponse.json({ success: true, data: purchaseData });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, supplierId, referenceNumber, stockInDate, supplierName, numberOfItems, purchaseAmount } = body;
    if (!id || !supplierId || !referenceNumber || !stockInDate || !supplierName || !numberOfItems || !purchaseAmount) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }
    purchaseData.push(body);

    return NextResponse.json({ success: true, message: "Purchase created successfully.", data: body });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred while creating the purchase." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required to update the purchase." }, { status: 400 });
    }
    const purchase = findPurchaseById(id);
    if (!purchase) {
      return NextResponse.json({ success: false, message: "Purchase not found." }, { status: 404 });
    }

    Object.assign(purchase, updateFields);

    return NextResponse.json({ success: true, message: "Purchase updated successfully.", data: purchase });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred while updating the purchase." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required to delete the purchase." }, { status: 400 });
    }

    const index = purchaseData.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Purchase not found." }, { status: 404 });
    }

    purchaseData.splice(index, 1);

    return NextResponse.json({ success: true, message: "Purchase deleted successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred while deleting the purchase." }, { status: 500 });
  }
}
