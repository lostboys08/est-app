import prisma from "./prisma";
import { getDefaultUser } from "./user";

export async function getSubcategories(): Promise<Record<string, string[]>> {
  const user = await getDefaultUser();
  const items = await prisma.subcategory.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });
  const result: Record<string, string[]> = {};
  for (const item of items) {
    if (!result[item.contactType]) result[item.contactType] = [];
    result[item.contactType].push(item.name);
  }
  return result;
}

export async function getSubcategoryRecords() {
  const user = await getDefaultUser();
  return prisma.subcategory.findMany({
    where: { userId: user.id },
    orderBy: [{ contactType: "asc" }, { sortOrder: "asc" }],
  });
}
