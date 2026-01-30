import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

export default function BidsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bids</h1>
          <p className="text-[var(--muted-foreground)]">
            Manage your bid proposals and track their status.
          </p>
        </div>
        <Link href="/bids/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Bid
          </Button>
        </Link>
      </div>

      <EmptyState
        icon={FileText}
        title="No bids yet"
        description="Create your first bid to start tracking your proposals and submissions."
        action={
          <Link href="/bids/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Bid
            </Button>
          </Link>
        }
      />
    </div>
  );
}
