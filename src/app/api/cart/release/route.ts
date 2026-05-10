import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        status: "AVAILABLE",
        reservedAt: null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Release Error:", error);
    return NextResponse.json({ error: "Failed to release item" }, { status: 500 });
  }
}
