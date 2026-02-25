"use client";

import { useState, useTransition } from "react";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
} from "@/components/ui";
import { createRFQs } from "@/app/(app)/rfqs/actions";

interface AddRFQsButtonProps {
  projectId: string;
  contacts: { id: string; name: string; email: string | null; type: string; company: string | null }[];
}

const NO_COMPANY = "(No Company)";

export function AddRFQsButton({ projectId, contacts }: AddRFQsButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string) {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleToggleCompany(companyContacts: typeof contacts) {
    const ids = companyContacts.map((c) => c.id);
    const allSelected = ids.every((id) => selectedContacts.includes(id));
    if (allSelected) {
      setSelectedContacts((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedContacts((prev) => [...new Set([...prev, ...ids])]);
    }
  }

  function handleClose() {
    setOpen(false);
    setSelectedContacts([]);
    setSearch("");
  }

  function handleSubmit() {
    if (selectedContacts.length === 0) return;
    startTransition(async () => {
      await createRFQs(projectId, selectedContacts);
      handleClose();
    });
  }

  const grouped: Record<string, typeof contacts> = {};
  for (const contact of contacts) {
    const company = contact.company || NO_COMPANY;
    if (!grouped[company]) grouped[company] = [];
    grouped[company].push(contact);
  }
  const sortedCompanies = Object.keys(grouped).sort((a, b) => {
    if (a === NO_COMPANY) return 1;
    if (b === NO_COMPANY) return -1;
    return a.localeCompare(b);
  });

  const query = search.toLowerCase();
  const filteredCompanies = sortedCompanies.filter((company) => {
    if (!query) return true;
    if (company.toLowerCase().includes(query)) return true;
    return grouped[company].some((c) => c.name.toLowerCase().includes(query));
  });

  const submitLabel =
    selectedContacts.length > 0
      ? `Add ${selectedContacts.length} RFQ${selectedContacts.length !== 1 ? "s" : ""}`
      : "Add RFQs";

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Contacts
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Contacts to RFQ</DialogTitle>
          </DialogHeader>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Contacts
            </label>
            {contacts.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                All contacts already have RFQs for this project, or there are no contacts yet.
              </p>
            ) : (
              <>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)] pointer-events-none" />
                <Input
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <div className="rounded-lg border border-[var(--border)] max-h-64 overflow-y-auto divide-y divide-[var(--border)]">
                {filteredCompanies.length === 0 && (
                  <p className="px-3 py-4 text-sm text-[var(--muted-foreground)] text-center">No companies match your search.</p>
                )}
                {filteredCompanies.map((company) => {
                  const companyContacts = grouped[company];
                  const ids = companyContacts.map((c) => c.id);
                  const allSelected = ids.every((id) => selectedContacts.includes(id));
                  const someSelected = ids.some((id) => selectedContacts.includes(id));
                  return (
                    <div key={company}>
                      <label className="flex items-center gap-3 px-3 py-1.5 bg-[var(--muted)] cursor-pointer hover:bg-[var(--muted)]/80">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                          onChange={() => handleToggleCompany(companyContacts)}
                          className="h-4 w-4 rounded border-[var(--input)]"
                        />
                        <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                          {company}
                        </span>
                      </label>
                      {companyContacts.map((contact) => (
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
                  );
                })}
              </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedContacts.length === 0 || isPending}
            >
              {isPending ? "Adding..." : submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
