"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
} from "@/components/ui";
import { updateProject } from "./actions";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    fileUrl: string | null;
    dueDate: Date | null;
  };
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
}: EditProjectDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProject(project.id, formData);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            defaultValue={project.name}
            placeholder="Project name"
            required
          />
          <Input
            label="Location"
            name="location"
            defaultValue={project.location ?? ""}
            placeholder="City, State"
          />
          <Input
            label="Project Files Link"
            name="fileUrl"
            defaultValue={project.fileUrl ?? ""}
            placeholder="https://..."
          />
          <Input
            label="Bid Due Date"
            name="dueDate"
            type="date"
            defaultValue={project.dueDate ? new Date(project.dueDate).toISOString().split("T")[0] : ""}
          />
          <div className="space-y-1.5">
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows={3}
              defaultValue={project.description ?? ""}
              placeholder="Project description..."
              className="flex w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
