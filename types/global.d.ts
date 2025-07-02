import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;

  interface Window {
    ethereum?: any;
  }
}
