"use server";

import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function markRFQSent(rfqId: string) {
  await prisma.rFQ.update({
    where: { id: rfqId },
    data: { status: "SENT" },
  });
  revalidatePath("/rfqs");
}

export async function createRFQs(projectId: string, contactIds: string[]) {
  const user = await getDefaultUser();

  // Skip any contact-project combos that already have an RFQ
  const existing = await prisma.rFQ.findMany({
    where: { userId: user.id, projectId, contactId: { in: contactIds } },
    select: { contactId: true },
  });
  const existingIds = new Set(existing.map((r) => r.contactId));
  const newIds = contactIds.filter((id) => !existingIds.has(id));

  if (newIds.length === 0) return;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    select: { name: true },
  });
  if (!project) return;

  await prisma.rFQ.createMany({
    data: newIds.map((contactId) => ({
      subject: `RFQ: ${project.name}`,
      projectId,
      contactId,
      userId: user.id,
    })),
  });

  revalidatePath("/rfqs");
}
