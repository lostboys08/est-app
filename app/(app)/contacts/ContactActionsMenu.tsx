"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui";
import { EditContactDialog } from "./EditContactDialog";
import { DeleteContactDialog } from "./DeleteContactDialog";

interface ContactActionsMenuProps {
  contact: {
    id: string;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    type: string;
    notes: string | null;
  };
}

export function ContactActionsMenu({ contact }: ContactActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        trigger={<MoreHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />}
      >
        <DropdownMenuItem onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenu>

      <EditContactDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        contact={contact}
      />
      <DeleteContactDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        contact={contact}
      />
    </>
  );
}
