"use server";

import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function addSubcategory(contactType: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;

  const user = await getDefaultUser();

  const existing = await prisma.subcategory.findFirst({
    where: { userId: user.id, contactType, name: trimmed },
  });
  if (existing) return;

  const last = await prisma.subcategory.findFirst({
    where: { userId: user.id, contactType },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.subcategory.create({
    data: {
      contactType,
      name: trimmed,
      sortOrder: (last?.sortOrder ?? 0) + 1,
      userId: user.id,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/contacts");
  revalidatePath("/contacts/new");
}

export async function deleteSubcategory(id: string) {
  const user = await getDefaultUser();
  await prisma.subcategory.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/settings");
  revalidatePath("/contacts");
  revalidatePath("/contacts/new");
}
