import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { getSubcategories } from "@/lib/subcategories";
import { ContactsView } from "./ContactsView";
export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const user = await getDefaultUser();
  const [contacts, subcategories] = await Promise.all([
    prisma.contact.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    getSubcategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-[var(--muted-foreground)]">
            Manage your subcontractors, suppliers, and other contacts.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/contacts/import">
            <Button variant="secondary">Import</Button>
          </Link>
          <Link href="/contacts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </Link>
        </div>
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
        <ContactsView contacts={contacts} subcategories={subcategories} />
      )}
    </div>
  );
}
