"use server";

import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createContact(formData: FormData) {
  const user = await getDefaultUser();

  const name = formData.get("name") as string;
  const company = (formData.get("company") as string) || null;
  const email = (formData.get("email") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const type = (formData.get("type") as string) || "OTHER";
  const notes = (formData.get("notes") as string) || null;

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  await prisma.contact.create({
    data: {
      name: name.trim(),
      company,
      email,
      phone,
      type,
      notes,
      userId: user.id,
    },
  });

  redirect("/contacts");
}

export async function updateContact(id: string, formData: FormData) {
  const user = await getDefaultUser();

  const name = formData.get("name") as string;
  const company = (formData.get("company") as string) || null;
  const email = (formData.get("email") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const type = (formData.get("type") as string) || "OTHER";
  const notes = (formData.get("notes") as string) || null;

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  await prisma.contact.update({
    where: { id, userId: user.id },
    data: {
      name: name.trim(),
      company,
      email,
      phone,
      type,
      notes,
    },
  });

  revalidatePath("/contacts");
}

export async function deleteContact(id: string) {
  const user = await getDefaultUser();

  await prisma.contact.delete({
    where: { id, userId: user.id },
  });

  revalidatePath("/contacts");
}
