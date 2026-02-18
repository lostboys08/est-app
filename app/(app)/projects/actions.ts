"use server";

import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const user = await getDefaultUser();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const location = (formData.get("location") as string) || null;

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description,
      location,
      userId: user.id,
    },
  });

  // Auto-create RFQs for every contact the user has
  const contacts = await prisma.contact.findMany({
    where: { userId: user.id },
  });

  if (contacts.length > 0) {
    await prisma.rFQ.createMany({
      data: contacts.map((contact) => ({
        subject: `RFQ: ${name.trim()}`,
        projectId: project.id,
        contactId: contact.id,
        userId: user.id,
      })),
    });
  }

  redirect("/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getDefaultUser();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const location = (formData.get("location") as string) || null;

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  await prisma.project.update({
    where: { id, userId: user.id },
    data: {
      name: name.trim(),
      description,
      location,
    },
  });

  revalidatePath("/projects");
}

export async function deleteProject(id: string) {
  const user = await getDefaultUser();

  await prisma.project.delete({
    where: { id, userId: user.id },
  });

  revalidatePath("/projects");
}

export async function archiveProject(id: string) {
  const user = await getDefaultUser();

  await prisma.project.update({
    where: { id, userId: user.id },
    data: { archived: true },
  });

  revalidatePath("/projects");
}

export async function unarchiveProject(id: string) {
  const user = await getDefaultUser();

  await prisma.project.update({
    where: { id, userId: user.id },
    data: { archived: false },
  });

  revalidatePath("/projects");
}
