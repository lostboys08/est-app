"use client";

import { useState, useTransition } from "react";
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
import { contactTypes } from "./contact-types";

const selectClass =
  "flex h-10 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2";

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
    subCategory: string | null;
    location: string | null;
    notes: string | null;
  };
  subcategories: Record<string, string[]>;
}

export function EditContactDialog({
  open,
  onOpenChange,
  contact,
  subcategories,
}: EditContactDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState(contact.type);
  const typeSubcategories = subcategories[selectedType] || [];

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
          <div className={typeSubcategories.length > 0 ? "grid gap-4 sm:grid-cols-2" : ""}>
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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={selectClass}
              >
                {contactTypes.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
            </div>
            {typeSubcategories.length > 0 && (
              <div className="space-y-1.5">
                <label
                  htmlFor="edit-subCategory"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Sub Category
                </label>
                <select
                  key={selectedType}
                  id="edit-subCategory"
                  name="subCategory"
                  defaultValue={contact.subCategory ?? ""}
                  className={selectClass}
                >
                  <option value="">— Select —</option>
                  {typeSubcategories.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Input
              label="Location"
              name="location"
              defaultValue={contact.location ?? ""}
              placeholder="City, Province / Region"
            />
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
