"use server";

import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const user = await getDefaultUser();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const location = (formData.get("location") as string) || null;

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  await prisma.project.create({
    data: {
      name: name.trim(),
      description,
      location,
      userId: user.id,
    },
  });

  redirect("/projects");
}
