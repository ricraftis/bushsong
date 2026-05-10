import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia", // Adjust as necessary based on stripe package version
});

export async function POST(req: Request) {
  try {
    const { items, shippingMethod, shippingCost } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (shippingMethod === "freight") {
      // In a real app, this might redirect to a different form or save order as "Awaiting Quote"
      return NextResponse.json({ 
        url: "/checkout/success?type=freight" 
      });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1, // Always 1 for unique items
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "aud",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productIds: JSON.stringify(items.map((i: any) => i.id)),
      },
    });

    return NextResponse.json({ url: session.url });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
