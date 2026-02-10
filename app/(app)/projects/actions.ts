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
