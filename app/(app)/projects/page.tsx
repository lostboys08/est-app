import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { ProjectRow } from "./ProjectRow";
export const dynamic = "force-dynamic";

interface ProjectsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { tab } = await searchParams;
  const showArchived = tab === "archived";
  const user = await getDefaultUser();
  const projects = await prisma.project.findMany({
    where: { userId: user.id, archived: showArchived },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bids: true, rfqs: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-[var(--muted-foreground)]">
            Organize your bids and RFQs by project.
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        <Link
          href="/projects"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            !showArchived
              ? "border-[var(--primary)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Active
        </Link>
        <Link
          href="/projects?tab=archived"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            showArchived
              ? "border-[var(--primary)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Archived
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={showArchived ? "No archived projects" : "No projects yet"}
          description={
            showArchived
              ? "Projects you archive will appear here."
              : "Create your first project to start organizing your bids and RFQs."
          }
          action={
            !showArchived ? (
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-lg border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Bids</th>
                <th className="text-left px-4 py-3 font-medium">RFQs</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {projects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
