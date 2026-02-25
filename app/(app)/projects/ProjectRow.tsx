"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui";
import { ProjectActionsMenu } from "./ProjectActionsMenu";

interface ProjectRowProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    fileUrl: string | null;
    bidDueDate: Date | null;
    rfqDueDate: Date | null;
    archived: boolean;
    createdAt: Date;
    _count: { rfqs: number };
  };
}

export function ProjectRow({ project }: ProjectRowProps) {
  const router = useRouter();

  return (
    <tr
      className="hover:bg-[var(--muted)]/50 cursor-pointer"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <td className="px-4 py-3 font-medium">{project.name}</td>
      <td className="px-4 py-3 text-[var(--muted-foreground)]">
        {project.location || "—"}
      </td>
      <td className="px-4 py-3">
        <Badge variant="secondary">{project._count.rfqs}</Badge>
      </td>
      <td className="px-4 py-3 text-[var(--muted-foreground)]">
        {new Date(project.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <ProjectActionsMenu project={project} />
      </td>
    </tr>
  );
}
