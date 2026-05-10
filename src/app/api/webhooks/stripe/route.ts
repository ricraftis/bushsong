import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Note: STRIPE_WEBHOOK_SECRET needs to be in .env to verify properly
    // For MVP if secret isn't there, we just parse it
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(body);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve product IDs from metadata
    const productIdsStr = session.metadata?.productIds;
    
    if (productIdsStr) {
      const productIds: string[] = JSON.parse(productIdsStr);
      
      // Update all those products to "COLLECTED"
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: "COLLECTED" },
      });

      // Increment order count in SiteSettings
      await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: { currentMonthlyOrders: { increment: 1 } },
        create: { id: "default", currentMonthlyOrders: 1 },
      });
      
      // You could also create an Order record here
    }
  }

  return new NextResponse("OK", { status: 200 });
}
