const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  
  await prisma.product.create({
    data: {
      name: 'Rustic Pallet Birdhouse',
      description: 'A beautiful handcrafted birdhouse made entirely from reclaimed pallet wood. Features a natural, weather-resistant finish perfect for attracting local wildlife.',
      price: 85.00,
      imageUrl: '/birdhouse.png',
      status: 'AVAILABLE'
    }
  });

  await prisma.product.create({
    data: {
      name: 'Resin & Pallet Charcuterie Board',
      description: 'Stunning premium charcuterie board combining the raw character of recycled pallet timber with deep blue epoxy resin. A truly one-of-a-kind centrepiece.',
      price: 140.00,
      imageUrl: '/charcuterie.png',
      status: 'AVAILABLE'
    }
  });

  console.log('Database seeded with new products.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
