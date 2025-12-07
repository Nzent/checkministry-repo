import { db, products } from ".";

async function seed() {
  console.log("🌱 Seeding database...");

  await db.insert(products).values([
    {
      id: 1,
      productName: "HP laptop",
      productDescription: "This is HP laptop",
    },
    {
      id: 2,
      productName: "lenovo laptop",
      productDescription: "This is lenovo",
    },
    {
      id: 3,
      productName: "Car",
      productDescription: "This is Car",
    },
    {
      id: 4,
      productName: "Bike",
      productDescription: "This is Bike",
    },
  ]);

  console.log("✅ Seeding completed!");
}

seed()
  .catch((err) => {
    console.error("❌ Seeding failed");
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
