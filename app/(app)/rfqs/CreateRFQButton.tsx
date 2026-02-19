"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@/components/ui";
import { createRFQs } from "./actions";

const contactTypeLabels: Record<string, string> = {
  SUBCONTRACTOR: "Subcontractors",
  SUPPLIER: "Suppliers",
  GENERAL_CONTRACTOR: "General Contractors",
  OWNER: "Owners",
  ARCHITECT: "Architects",
  OTHER: "Other",
};

const contactTypeOrder = [
  "SUBCONTRACTOR",
  "SUPPLIER",
  "GENERAL_CONTRACTOR",
  "OWNER",
  "ARCHITECT",
  "OTHER",
];

interface CreateRFQButtonProps {
  projects: { id: string; name: string }[];
  contacts: { id: string; name: string; email: string | null; type: string }[];
}

export function CreateRFQButton({ projects, contacts }: CreateRFQButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string) {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleClose() {
    setOpen(false);
    setSelectedProject("");
    setSelectedContacts([]);
  }

  function handleSubmit() {
    if (!selectedProject || selectedContacts.length === 0) return;
    startTransition(async () => {
      await createRFQs(selectedProject, selectedContacts);
      handleClose();
    });
  }

  const grouped: Record<string, typeof contacts> = {};
  for (const contact of contacts) {
    const type = contact.type || "OTHER";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(contact);
  }
  const sortedTypes = contactTypeOrder.filter((t) => grouped[t]?.length);

  const submitLabel = selectedContacts.length > 0
    ? `Create ${selectedContacts.length} RFQ${selectedContacts.length !== 1 ? "s" : ""}`
    : "Create RFQs";

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New RFQ
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create RFQ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Project
              </label>
              {projects.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No projects yet. Create a project first.
                </p>
              ) : (
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="flex w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                >
                  <option value="">Select a project...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Contacts
              </label>
              {contacts.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No contacts yet. Add contacts first.
                </p>
              ) : (
                <div className="rounded-lg border border-[var(--border)] max-h-64 overflow-y-auto divide-y divide-[var(--border)]">
                  {sortedTypes.map((type) => (
                    <div key={type}>
                      <div className="px-3 py-1.5 bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                        {contactTypeLabels[type]}
                      </div>
                      {grouped[type].map((contact) => (
                        <label
                          key={contact.id}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--muted)]/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleToggle(contact.id)}
                            className="h-4 w-4 rounded border-[var(--input)]"
                          />
                          <span className="text-sm">
                            {contact.name}
                            {contact.email && (
                              <span className="text-[var(--muted-foreground)] ml-2">
                                {contact.email}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedProject || selectedContacts.length === 0 || isPending}
            >
              {isPending ? "Creating..." : submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
