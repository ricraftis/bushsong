import prisma from "@/lib/prisma";
import PageContent from "@/components/PageContent";

export const revalidate = 0; 

async function releaseExpiredReservations() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  await prisma.product.updateMany({
    where: { status: "RESERVED", reservedAt: { lt: tenMinutesAgo } },
    data: { status: "AVAILABLE", reservedAt: null },
  });
}

export default async function Home() {
  await releaseExpiredReservations();

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const isGalleryMode = settings?.monthlyOrderLimitActive && (settings.currentMonthlyOrders >= 5);
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <PageContent products={products} isGalleryMode={isGalleryMode ?? false} />
  );
}
