import { PrismaClient } from "@prisma/client";

const globalDlaPrismy = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalDlaPrismy.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalDlaPrismy.prisma = prisma;
