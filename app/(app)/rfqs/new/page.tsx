import { NewRFQForm } from "./form";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
export const dynamic = "force-dynamic";

export default async function NewRFQPage() {
  const user = await getDefaultUser();
  const [projects, contacts] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.contact.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return <NewRFQForm projects={projects} contacts={contacts} />;
}
