// import { NextResponse, NextRequest } from "next/server";
// import prisma from "@/lib/prisma";
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//     const { id } = params;
  
//     const sup = await prisma.supplier.findUnique({
//       where: { id: parseInt(id) },
//     });
  
//     if (!promotion) {
//       return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
//     }
  
//     return NextResponse.json(promotion);
//   }
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//       const data = await request.json();
//       const updatedPromotion = await prisma.promotion.update({ where: { id: parseInt(params.id) }, data });
//       return NextResponse.json({ success: true, data: updatedPromotion });
//     } catch {
//       return NextResponse.json({ success: false, error: "Failed to update promotion" }, { status: 400 });
//     }
//   }
  
  // export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  //   try {
  //     await prisma.supplier.delete({ where: { id: parseInt(params.id) } });
  //     return NextResponse.json({ success: true, message: "supplier deleted" });
  //   } catch {
  //     return NextResponse.json({ success: false, error: "Failed to delete supplier" }, { status: 400 });
  //   }
  // }


  import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request:NextRequest, {params}:{params:{id:string}}) {
    const {id}=params;
    try{
        const supplier = await prisma.supplier.findUnique({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: "get unique supplier success",data: supplier  })

    }catch(error){
        console.log(error)
        return NextResponse.json({ message: "get id failed!"  }, {status: 500})
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const body = await request.json();
        const updatedSupplier = await prisma.supplier.update({
            where: { id: parseInt(id) },
            data: body, // Expecting body to contain supplier fields to update
        });
        return NextResponse.json({ message: "Supplier updated successfully", data: updatedSupplier });
    } catch (error) {
        console.error("Error updating supplier:", error);
        return NextResponse.json({ message: "Update failed!"  }, {status: 500})
    }
}
// Delete promotion by ID (DELETE)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
      const deletedSupplier = await prisma.supplier.delete({
          where: { id: parseInt(id) },
      });

      console.log('====>',deletedSupplier)
      return NextResponse.json({ message: "Supplier deleted successfully"}, {status: 201});
  } catch (error) {
      console.error("Error deleting supplier:", error);
      return NextResponse.json({ message: "delete failed!"  }, {status: 500})
  }
}