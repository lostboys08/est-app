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
  const fileUrl = (formData.get("fileUrl") as string) || null;
  const bidDueDateRaw = (formData.get("bidDueDate") as string) || null;
  const rfqDueDateRaw = (formData.get("rfqDueDate") as string) || null;
  const bidDueDate = bidDueDateRaw ? new Date(bidDueDateRaw) : null;
  const rfqDueDate = rfqDueDateRaw ? new Date(rfqDueDateRaw) : null;

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description,
      location,
      fileUrl,
      bidDueDate,
      rfqDueDate,
      userId: user.id,
    },
  });

  redirect("/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getDefaultUser();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const location = (formData.get("location") as string) || null;
  const fileUrl = (formData.get("fileUrl") as string) || null;
  const bidDueDateRaw = (formData.get("bidDueDate") as string) || null;
  const rfqDueDateRaw = (formData.get("rfqDueDate") as string) || null;
  const bidDueDate = bidDueDateRaw ? new Date(bidDueDateRaw) : null;
  const rfqDueDate = rfqDueDateRaw ? new Date(rfqDueDateRaw) : null;

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  await prisma.project.update({
    where: { id, userId: user.id },
    data: {
      name: name.trim(),
      description,
      location,
      fileUrl,
      bidDueDate,
      rfqDueDate,
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
