"use client";

import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Leaf, Recycle, HeartHandshake } from "lucide-react";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";

interface PageContentProps {
  products: Product[];
  isGalleryMode: boolean;
}

export default function PageContent({ products, isGalleryMode }: PageContentProps) {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroTexture}></div>
          <div className={styles.heroGlow}></div>
          <div className={styles.heroGradient}></div>
        </div>
        
        <div className={styles.heroContent}>
          <motion.span 
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Artisanal Australian Craft
          </motion.span>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Giving Pallets a <span className={styles.heroTitleHighlight}>Second Song</span>
          </motion.h1>
          <motion.p 
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            One-of-a-kind, handcrafted pieces born from reclaimed timber. Every knot tells a story, every grain sings a new tune.
          </motion.p>
        </div>
      </section>

      {/* Recycled Timber Spotlight */}
      <section className={styles.spotlight}>
        <div className={styles.container}>
          <div className={styles.spotlightGrid}>
            <motion.div 
              className={styles.spotlightContent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
                hidden: {}
              }}
            >
              <motion.h2 variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={styles.sectionTitle}>
                The Art of Recycled Timber
              </motion.h2>
              <motion.p variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={styles.spotlightDescription}>
                We believe that true beauty lies in imperfection. By rescuing discarded shipping pallets, we breathe new life into forgotten timber, transforming it into stunning birdhouses, premium charcuterie boards, and rustic furniture.
              </motion.p>
              
              <div className={styles.featuresGrid}>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={styles.feature}>
                  <div className={`${styles.featureIcon} ${styles.featureIconGreen}`}>
                    <Recycle size={24} />
                  </div>
                  <h4 className={styles.featureTitle}>100% Reclaimed</h4>
                  <p className={styles.featureDesc}>Every piece is crafted from salvaged pallet wood.</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={styles.feature}>
                  <div className={`${styles.featureIcon} ${styles.featureIconAmber}`}>
                    <HeartHandshake size={24} />
                  </div>
                  <h4 className={styles.featureTitle}>Handcrafted</h4>
                  <p className={styles.featureDesc}>Carefully shaped, sanded, and finished by hand.</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={styles.feature}>
                  <div className={`${styles.featureIcon} ${styles.featureIconBlue}`}>
                    <Leaf size={24} />
                  </div>
                  <h4 className={styles.featureTitle}>Sustainable</h4>
                  <p className={styles.featureDesc}>Eco-friendly finishes and zero-waste practices.</p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.spotlightImageContainer}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className={styles.spotlightImageOverlay}></div>
              <Image src="/charcuterie.png" alt="Craftsmanship" fill className={styles.spotlightImage} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallery}>
        <div className={styles.container}>
          <motion.div 
            className={styles.galleryHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>The Gallery</h2>
            <p className={styles.galleryDesc}>
              Explore our current collection of unique, ready-to-ship pieces.
              {isGalleryMode && (
                <span className={styles.galleryNotice}>
                  We have reached our monthly crafting capacity. Please enjoy the gallery—purchasing will reopen next month!
                </span>
              )}
            </p>
          </motion.div>

          <div className={styles.productsGrid}>
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                className={styles.productCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.productImageContainer}>
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className={styles.productImage} 
                    />
                  ) : (
                    <div className={styles.productPlaceholder}>
                      <Leaf size={64} />
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  {product.status !== "AVAILABLE" && (
                    <div className={styles.productStatusOverlay}>
                      <span className={styles.productStatusBadge}>
                        {product.status === "COLLECTED" ? "SOLD OUT" : "RESERVED"}
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className={styles.productBadge}>
                    1 of 1
                  </div>
                </div>
                
                <div className={styles.productContent}>
                  <div className={styles.productHeader}>
                    <h3 className={styles.productName}>
                      {product.name}
                    </h3>
                    <span className={styles.productPrice}>
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className={styles.productDesc}>
                    {product.description}
                  </p>
                  
                  <div className={styles.productAction}>
                    <AddToCartButton 
                      product={product} 
                      disabled={product.status !== "AVAILABLE" || isGalleryMode} 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {products.length === 0 && (
              <div className={styles.emptyState}>
                <Leaf size={48} className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>The Workshop is Quiet</h3>
                <p className={styles.emptyDesc}>No pieces currently available. We are busy crafting!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
