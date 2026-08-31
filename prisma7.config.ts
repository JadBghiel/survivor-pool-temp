import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// `vercel env pull` writes .env.local, a plain local setup writes .env.
// load both, first one wins (dotenv never overwrites an already set var).
loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // only the prisma CLI reads this file (migrate, studio, db seed). the running
    // app never does - it builds its own adapter in src/lib/db.ts from DATABASE_URL.
    //
    // migrations cannot run over a transaction pooler, so prefer an unpooled url:
    //   DIRECT_URL              ours, set by hand
    //   DATABASE_URL_UNPOOLED   injected by the neon integration on vercel
    //   POSTGRES_URL_NON_POOLING  its older name
    //   DATABASE_URL            last resort, correct for a plain local postgres
    url:
      process.env["DIRECT_URL"] ??
      process.env["DATABASE_URL_UNPOOLED"] ??
      process.env["POSTGRES_URL_NON_POOLING"] ??
      process.env["DATABASE_URL"],
  },
});
