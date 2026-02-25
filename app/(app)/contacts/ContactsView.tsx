"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui";
import { ContactActionsMenu } from "./ContactActionsMenu";

interface Contact {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  type: string;
  subCategory: string | null;
  location: string | null;
  notes: string | null;
}

const contactTypeLabels: Record<string, string> = {
  SUBCONTRACTOR: "Subcontractor",
  SUPPLIER: "Supplier",
  GENERAL_CONTRACTOR: "General Contractor",
  OWNER: "Owner",
  ARCHITECT: "Architect",
  OTHER: "Other",
};

const contactTypeBadgeVariant: Record<
  string,
  "default" | "success" | "warning" | "secondary"
> = {
  SUBCONTRACTOR: "default",
  SUPPLIER: "success",
  GENERAL_CONTRACTOR: "warning",
  OWNER: "secondary",
  ARCHITECT: "secondary",
  OTHER: "secondary",
};

const tabs = [
  { key: "ALL", label: "All" },
  { key: "SUBCONTRACTOR", label: "Subcontractors" },
  { key: "SUPPLIER", label: "Suppliers" },
  { key: "OTHER", label: "Other" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function ContactsView({
  contacts,
  subcategories,
}: {
  contacts: Contact[];
  subcategories: Record<string, string[]>;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const filteredContacts = useMemo(() => {
    let result = contacts;

    if (activeTab !== "ALL") {
      if (activeTab === "OTHER") {
        result = result.filter(
          (c) => c.type !== "SUBCONTRACTOR" && c.type !== "SUPPLIER"
        );
      } else {
        result = result.filter((c) => c.type === activeTab);
      }
    }

    if (categoryFilter) {
      result = result.filter((c) => c.subCategory === categoryFilter);
    }

    return result;
  }, [contacts, activeTab, categoryFilter]);

  // Get available subcategories based on current tab
  const availableCategories = useMemo(() => {
    if (activeTab === "SUBCONTRACTOR") return subcategories.SUBCONTRACTOR ?? [];
    if (activeTab === "SUPPLIER") return subcategories.SUPPLIER ?? [];
    if (activeTab === "OTHER") return [];
    // For "ALL", combine both
    return [
      ...(subcategories.SUBCONTRACTOR ?? []),
      ...(subcategories.SUPPLIER ?? []),
    ].sort();
  }, [activeTab, subcategories]);

  // Reset category filter when switching tabs if the selected category isn't available
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === "OTHER") {
      setCategoryFilter("");
    } else if (categoryFilter) {
      const newCategories =
        tab === "SUBCONTRACTOR"
          ? (subcategories.SUBCONTRACTOR ?? [])
          : tab === "SUPPLIER"
            ? (subcategories.SUPPLIER ?? [])
            : [...(subcategories.SUBCONTRACTOR ?? []), ...(subcategories.SUPPLIER ?? [])];
      if (!newCategories.includes(categoryFilter)) {
        setCategoryFilter("");
      }
    }
  };

  const tabCounts = useMemo(() => {
    const all = contacts.length;
    const subs = contacts.filter((c) => c.type === "SUBCONTRACTOR").length;
    const suppliers = contacts.filter((c) => c.type === "SUPPLIER").length;
    const other = all - subs - suppliers;
    return { ALL: all, SUBCONTRACTOR: subs, SUPPLIER: suppliers, OTHER: other };
  }, [contacts]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-[var(--muted-foreground)]">
                {tabCounts[tab.key]}
              </span>
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
              )}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {availableCategories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--muted-foreground)]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          <p>No contacts found{categoryFilter ? ` in "${categoryFilter}"` : ""}.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                {activeTab === "ALL" || activeTab === "OTHER" ? (
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                ) : null}
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-4 py-3 font-medium">{contact.name}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.company || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.phone || "—"}
                  </td>
                  {activeTab === "ALL" || activeTab === "OTHER" ? (
                    <td className="px-4 py-3">
                      <Badge variant={contactTypeBadgeVariant[contact.type]}>
                        {contactTypeLabels[contact.type]}
                      </Badge>
                    </td>
                  ) : null}
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.subCategory || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {contact.location || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ContactActionsMenu contact={contact} subcategories={subcategories} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
