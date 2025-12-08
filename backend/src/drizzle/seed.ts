import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schemas/schema';
import 'dotenv/config';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

// sample products
async function main() {
  await db.insert(schema.products).values([
    {
      Id: 1,
      productName: 'HP laptop',
      productDescription: 'This is HP laptop',
    },
    {
      Id: 2,
      productName: 'lenovo laptop',
      productDescription: 'This is lenovo',
    },
    {
      Id: 3,
      productName: 'Car',
      productDescription: 'This is Car',
    },
    {
      Id: 4,
      productName: 'Bike',
      productDescription: 'This is Bike',
    },
  ]);

  console.log('Dataabse seed done');
  process.exit(0);
}

main()
  .then()
  .catch((err) => {
    console.error('Database seed failed ', err);
    process.exit(1);
  });
