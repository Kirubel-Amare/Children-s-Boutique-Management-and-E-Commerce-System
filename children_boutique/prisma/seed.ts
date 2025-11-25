// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password', 12)

  // Upsert admin user
  await prisma.user.upsert({
    where: { email: 'admin@boutique.com' },
    update: {},
    create: {
      email: 'admin@boutique.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      status: 'active',
      isEmailVerified: true,
    },
  })

  // Upsert teller user
  await prisma.user.upsert({
    where: { email: 'teller@boutique.com' },
    update: {},
    create: {
      email: 'teller@boutique.com',
      password: hashedPassword,
      name: 'Teller User',
      role: UserRole.TELLER,
      status: 'active',
      isEmailVerified: true,
    },
  })

await prisma.product.createMany({
  data: [
    {
      name: 'Kids T-Shirt',
      description: 'Comfortable cotton t-shirt for kids',
      originalPrice: 12,
      profitPercent: 33,
      profitAmount: 4,
      price: 16,
      quantity: 20,
      category: 'clothes',
      sizes: ['M'],     // <-- changed to array
      color: 'Blue',
    },
    {
      name: 'Children Sneakers',
      description: 'Durable sneakers for active kids',
      originalPrice: 25,
      profitPercent: 40,
      profitAmount: 10,
      price: 35,
      quantity: 15,
      category: 'shoes',
      sizes: ['28'],    // <-- changed to array
      color: 'White',
    },
    {
      name: 'Baby Romper',
      description: 'Adorable romper for babies',
      originalPrice: 15,
      profitPercent: 53,
      profitAmount: 8,
      price: 23,
      quantity: 8,
      category: 'clothes',
      sizes: ['6M'],    // <-- changed to array
      color: 'Pink',
    },
  ],
  skipDuplicates: true,
})
  

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
