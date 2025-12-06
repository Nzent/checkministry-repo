import { PrismaClient } from "../generated/prisma/client";

//@ts-ignore
const prisma = new PrismaClient();
async function main() {
  // Clear existing data
  await prisma.orderProductMap.deleteMany();
  await prisma.oRDERS.deleteMany();
  await prisma.pRODUCTS.deleteMany();
  // seed the products
  const products = [
    {
      id: 1,
      product_name: "HP laptop",
      product_description: "This is HP laptop",
    },
    {
      id: 2,
      product_name: "lenovo laptop",
      product_description: "This is lenovo",
    },
    { id: 3, product_name: "Car", product_description: "This is Car" },
    { id: 4, product_name: "Bike", product_description: "This is Bike" },
  ];

  for (const product of products) {
    await prisma.pRODUCTS.create({ data: product });
  }

  console.log("Database seeded successfully!");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
