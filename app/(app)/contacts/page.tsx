import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { Button, Badge, EmptyState } from "@/components/ui";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { ContactActionsMenu } from "./ContactActionsMenu";
export const dynamic = "force-dynamic";

const contactTypeLabels: Record<string, string> = {
  SUBCONTRACTOR: "Subcontractor",
  SUPPLIER: "Supplier",
  GENERAL_CONTRACTOR: "General Contractor",
  OWNER: "Owner",
  ARCHITECT: "Architect",
  OTHER: "Other",
};

const contactTypeBadgeVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  SUBCONTRACTOR: "default",
  SUPPLIER: "success",
  GENERAL_CONTRACTOR: "warning",
  OWNER: "secondary",
  ARCHITECT: "secondary",
  OTHER: "secondary",
};

export default async function ContactsPage() {
  const user = await getDefaultUser();
  const contacts = await prisma.contact.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-[var(--muted-foreground)]">
            Manage your subcontractors, suppliers, and other contacts.
          </p>
        </div>
        <Link href="/contacts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </Link>
      </div>

      {contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts yet"
          description="Add your first contact to start building your network of subcontractors and suppliers."
          action={
            <Link href="/contacts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-lg border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Sub Category</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-4 py-3 font-medium">{contact.name}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.company || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={contactTypeBadgeVariant[contact.type]}>
                      {contactTypeLabels[contact.type]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.subCategory || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.location || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ContactActionsMenu contact={contact} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
