"use server";

import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function createRFQ(formData: FormData) {
  const user = await getDefaultUser();

  const subject = formData.get("subject") as string;
  const message = (formData.get("message") as string) || null;
  const projectId = (formData.get("projectId") as string) || null;
  const contactId = (formData.get("contactId") as string) || null;
  const dueDateStr = formData.get("dueDate") as string;
  const dueDate = dueDateStr ? new Date(dueDateStr) : null;

  if (!subject || !subject.trim()) {
    throw new Error("Subject is required");
  }

  await prisma.rFQ.create({
    data: {
      subject: subject.trim(),
      message,
      dueDate,
      projectId,
      contactId,
      userId: user.id,
    },
  });

  redirect("/rfqs");
}
