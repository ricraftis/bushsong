"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  
  const [postcode, setPostcode] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "pickup" | "freight" | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  // Basic mock calculation for Australia Post based on a base rate + extra per item
  const standardShipping = cartItems.length > 0 ? 25 + (cartItems.length - 1) * 15 : 0;
  
  const isLocal = postcode.startsWith("35"); // Mock local logic for pickup
  
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: cartItems,
          shippingMethod,
          shippingCost: shippingMethod === "standard" ? standardShipping : 0
        }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed: " + data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    // Release reservation in DB
    await fetch("/api/cart/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
    removeItem(id);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-brand-green mb-4">Your Cart is Empty</h1>
        <p className="text-brand-woodDark mb-8">Discover our unique handcrafted pieces.</p>
        <a href="/" className="inline-block bg-brand-green text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-green/90 transition-colors">
          Return to Gallery
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-brand-green mb-8 border-b border-brand-green/20 pb-4">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-sm border border-brand-green/10">
              <div className="w-24 h-24 bg-brand-cream rounded-lg overflow-hidden relative flex-shrink-0">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-brand-green">{item.name}</h3>
                <p className="text-brand-wood font-semibold mt-1">${item.price.toFixed(2)}</p>
                <p className="text-sm text-amber-600 mt-2">Reserved for 10 minutes</p>
              </div>
              <button 
                onClick={() => handleRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                aria-label="Remove item"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-green/10 h-fit">
          <h2 className="text-2xl font-bold text-brand-green mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Postcode</label>
              <input 
                type="text" 
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. 3518"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-brand-green focus:ring focus:ring-brand-green/20 p-2 border"
              />
            </div>

            {postcode.length >= 4 && (
              <div className="space-y-3 pt-4">
                <p className="text-sm font-medium text-gray-700">Shipping Options</p>
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    name="shipping" 
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="text-brand-green focus:ring-brand-green"
                  />
                  <div className="flex-grow">
                    <span className="block font-medium">Australia Post (Heavy/Bulky)</span>
                    <span className="text-sm text-gray-500">2-5 business days</span>
                  </div>
                  <span className="font-semibold">${standardShipping.toFixed(2)}</span>
                </label>

                {isLocal && (
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                      className="text-brand-green focus:ring-brand-green"
                    />
                    <div className="flex-grow">
                      <span className="block font-medium text-brand-green">Local Pickup (Neighbors)</span>
                      <span className="text-sm text-gray-500">Collect from origin</span>
                    </div>
                    <span className="font-semibold text-green-600">Free</span>
                  </label>
                )}

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    name="shipping" 
                    checked={shippingMethod === "freight"}
                    onChange={() => setShippingMethod("freight")}
                    className="text-brand-green focus:ring-brand-green"
                  />
                  <div className="flex-grow">
                    <span className="block font-medium">Custom Freight Quote</span>
                    <span className="text-sm text-gray-500">For oversized items</span>
                  </div>
                  <span className="font-semibold text-gray-600">TBD</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-8 text-lg font-bold">
            <span className="text-brand-green">Total</span>
            <span>
              ${shippingMethod === "standard" 
                ? (subtotal + standardShipping).toFixed(2) 
                : shippingMethod === "pickup" || shippingMethod === "freight"
                ? subtotal.toFixed(2)
                : subtotal.toFixed(2)}
              {shippingMethod === "freight" && " + Freight"}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!shippingMethod || loading}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              !shippingMethod || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-brand-wood text-white hover:bg-brand-wood/90 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Processing..." : shippingMethod === "freight" ? "Request Quote & Reserve" : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
