import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Attempt to update the product if it is AVAILABLE
    const product = await prisma.product.update({
      where: { 
        id: productId,
        status: "AVAILABLE",
      },
      data: {
        status: "RESERVED",
        reservedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Reserve Error:", error);
    // If update fails (e.g., RecordNotFound because status isn't AVAILABLE), we return 409 Conflict
    return NextResponse.json({ error: "Item is no longer available" }, { status: 409 });
  }
}
