import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-[var(--muted-foreground)]">
            Organize your bids and RFQs by project.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first project to start organizing your bids and RFQs."
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        }
      />
    </div>
  );
}
