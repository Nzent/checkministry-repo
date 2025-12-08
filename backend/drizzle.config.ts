import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/drizzle/schemas/**.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
