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
import { updateContact } from "./actions";

const contactTypes = [
  { value: "SUBCONTRACTOR", label: "Subcontractor" },
  { value: "SUPPLIER", label: "Supplier" },
  { value: "GENERAL_CONTRACTOR", label: "General Contractor" },
  { value: "OWNER", label: "Owner" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "OTHER", label: "Other" },
];

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function EditContactDialog({
  open,
  onOpenChange,
  contact,
}: EditContactDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateContact(contact.id, formData);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              name="name"
              defaultValue={contact.name}
              placeholder="Full name"
              required
            />
            <Input
              label="Company"
              name="company"
              defaultValue={contact.company ?? ""}
              placeholder="Company name"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              name="email"
              type="email"
              defaultValue={contact.email ?? ""}
              placeholder="email@example.com"
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              defaultValue={contact.phone ?? ""}
              placeholder="(555) 555-5555"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="edit-type"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Contact Type
            </label>
            <select
              id="edit-type"
              name="type"
              defaultValue={contact.type}
              className="flex h-10 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            >
              {contactTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="edit-notes"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Notes
            </label>
            <textarea
              id="edit-notes"
              name="notes"
              rows={3}
              defaultValue={contact.notes ?? ""}
              placeholder="Any additional notes..."
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
