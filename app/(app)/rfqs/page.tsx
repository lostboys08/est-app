import Link from "next/link";
import { Send, Plus } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

export default function RFQsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFQs</h1>
          <p className="text-[var(--muted-foreground)]">
            Send and track requests for quotes from your contacts.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New RFQ
        </Button>
      </div>

      <EmptyState
        icon={Send}
        title="No RFQs yet"
        description="Create your first request for quote to start getting pricing from your subcontractors and suppliers."
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create RFQ
          </Button>
        }
      />
    </div>
  );
}
