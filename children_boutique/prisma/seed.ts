// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password', 12)

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@boutique.com' },
    update: {},
    create: {
      email: 'admin@boutique.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,   // ✅ Use enum
      status: 'active',       // ✅ Add status
    },
  })

  // Create teller user
  await prisma.user.upsert({
    where: { email: 'teller@boutique.com' },
    update: {},
    create: {
      email: 'teller@boutique.com',
      password: hashedPassword,
      name: 'Teller User',
      role: UserRole.TELLER,  // ✅ Use enum
      status: 'active',       // ✅ Add status
    },
  })

  // Sample products
  await prisma.product.createMany({
    data: [
      {
        name: 'Kids T-Shirt',
        description: 'Comfortable cotton t-shirt for kids',
        price: 15.99,
        quantity: 20,
        category: 'clothes',
        size: 'M',
        color: 'Blue',
      },
      {
        name: 'Children Sneakers',
        description: 'Durable sneakers for active kids',
        price: 35.99,
        quantity: 15,
        category: 'shoes',
        size: '28',
        color: 'White',
      },
      {
        name: 'Baby Romper',
        description: 'Adorable romper for babies',
        price: 22.99,
        quantity: 8,
        category: 'clothes',
        size: '6M',
        color: 'Pink',
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
