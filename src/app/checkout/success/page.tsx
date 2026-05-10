"use client";

import { useEffect, Suspense } from "react";
import { useCartStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function SuccessContent() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  
  useEffect(() => {
    // We assume successful checkout/reservation means we can clear the client cart
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <CheckCircle2 size={80} className="text-brand-green mx-auto mb-8" />
      <h1 className="text-5xl font-bold text-brand-green mb-6">
        {type === "freight" ? "Quote Requested!" : "Order Confirmed!"}
      </h1>
      <p className="text-xl text-brand-woodDark mb-10">
        {type === "freight" 
          ? "We have reserved your item and will contact you shortly with a custom freight quote."
          : "Thank you for supporting Australian artisanal craft. Your unique piece is on its way."}
      </p>
      
      <Link href="/" className="inline-block bg-brand-wood text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-wood/90 transition-all">
        Return to Gallery
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
