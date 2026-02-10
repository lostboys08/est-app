"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markRFQSent(rfqId: string) {
  await prisma.rFQ.update({
    where: { id: rfqId },
    data: { status: "SENT" },
  });
  revalidatePath("/rfqs");
}
