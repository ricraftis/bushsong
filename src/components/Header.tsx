"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

export default function Header() {
  const cartItems = useCartStore((state) => state.items);
  
  return (
    <motion.header 
      className={styles.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className={styles.container}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoLink}>
            <motion.div 
              className={styles.logoImageContainer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src="/bushsonglogo.png" 
                alt="Bushsong Kookaburra Logo" 
                fill 
                className={styles.logoImage} 
              />
            </motion.div>
            <span className={styles.logoText}>
              Bushsong
            </span>
          </Link>
          
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Gallery</Link>
            <Link href="/cart" className={styles.cartLink}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={24} />
              </motion.div>
              {cartItems.length > 0 && (
                <motion.span 
                  className={styles.cartBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartItems.length} // forces animation on change
                >
                  {cartItems.length}
                </motion.span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
