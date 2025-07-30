// server/src/lib/prisma.ts
import { PrismaClient } from '../../generated/prisma'; // Corrected path

// This is a common pattern to ensure only one PrismaClient instance is created
// in development (to prevent too many database connections from hot-reloads)
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;