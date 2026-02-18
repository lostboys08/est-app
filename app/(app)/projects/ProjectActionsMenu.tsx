"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui";
import { archiveProject, unarchiveProject } from "./actions";
import { EditProjectDialog } from "./EditProjectDialog";
import { DeleteProjectDialog } from "./DeleteProjectDialog";

interface ProjectActionsMenuProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    archived: boolean;
  };
}

export function ProjectActionsMenu({ project }: ProjectActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleArchiveToggle() {
    startTransition(async () => {
      if (project.archived) {
        await unarchiveProject(project.id);
      } else {
        await archiveProject(project.id);
      }
    });
  }

  return (
    <>
      <DropdownMenu
        trigger={<MoreHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />}
      >
        <DropdownMenuItem onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleArchiveToggle}>
          {project.archived ? (
            <>
              <ArchiveRestore className="h-4 w-4" />
              {isPending ? "Unarchiving..." : "Unarchive"}
            </>
          ) : (
            <>
              <Archive className="h-4 w-4" />
              {isPending ? "Archiving..." : "Archive"}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenu>

      <EditProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
      />
      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        project={project}
      />
    </>
  );
}
