import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import styles from "./layout.module.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bushsong | Handcrafted Australian Furniture",
  description: "Premium, rustic, artisanal, and quintessentially Australian handcrafted items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <div className={styles.container}>
          <Header />
          <main className={styles.main}>
            {children}
          </main>
          <footer className={`wood-texture ${styles.footer}`}>
            <p className={styles.footerText}>© {new Date().getFullYear()} Bushsong. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
