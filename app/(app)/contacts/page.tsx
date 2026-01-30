import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

export default function ContactsPage() {
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
    </div>
  );
}
