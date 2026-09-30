/**
 * PRISMA ADAPTER GUIDE
 * 
 * To switch from the default in-memory persistent store to Prisma:
 * 1. Install Prisma:
 *    npm install @prisma/client
 *    npm install -D prisma
 * 
 * 2. Initialize Prisma schema:
 *    npx prisma init
 * 
 * 3. Define models matching src/types/index.ts:
 *    model Product {
 *      id          String   @id @default(cuid())
 *      name        String
 *      slug        String   @unique
 *      brand       String
 *      category    String
 *      gender      String   @default("Unisex")
 *      price       Float
 *      sale_price  Float?
 *      on_sale     Boolean  @default(false)
 *      stock       Int      @default(0)
 *      rating      Float    @default(5.0)
 *      images      String[]
 *      sizes       Float[]
 *      colors      Json[]
 *      description String?
 *      details     String[]
 *      created_date DateTime @default(now())
 *    }
 * 
 * 4. Replace the repository implementation in src/lib/db/index.js with:
 * 
 * import { PrismaClient } from '@prisma/client';
 * const prisma = new PrismaClient();
 * 
 * export const productsRepo = {
 *   list: (sort = 'desc', limit = 100) => prisma.product.findMany({ take: limit, orderBy: { created_date: 'desc' } }),
 *   filter: (where) => prisma.product.findMany({ where }),
 *   get: (idOrSlug) => prisma.product.findFirst({ where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } }),
 *   create: (data) => prisma.product.create({ data }),
 *   update: (id, data) => prisma.product.update({ where: { id }, data }),
 *   delete: (id) => prisma.product.delete({ where: { id } }),
 * };
 */
export const PRISMA_READY = true;
