"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import styles from "./AddToCartButton.module.css";

export function AddToCartButton({ product, disabled }: { product: Product; disabled?: boolean }) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const [loading, setLoading] = useState(false);

  const inCart = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = async () => {
    if (inCart) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/cart/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      
      if (!res.ok) {
        alert("Sorry, this item was just reserved by someone else!");
        window.location.reload();
        return;
      }
      
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonClass = () => {
    if (disabled) return `${styles.button} ${styles.buttonDisabled}`;
    if (inCart) return `${styles.button} ${styles.buttonInCart}`;
    return `${styles.button} ${styles.buttonAvailable}`;
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={disabled || loading || inCart}
      className={getButtonClass()}
      whileHover={!disabled && !inCart ? { scale: 1.02 } : {}}
      whileTap={!disabled && !inCart ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <>
          <Loader2 className={styles.spinner} size={20} />
          Reserving...
        </>
      ) : inCart ? (
        "In Cart"
      ) : disabled ? (
        "Unavailable"
      ) : (
        "Add to Cart"
      )}
    </motion.button>
  );
}
