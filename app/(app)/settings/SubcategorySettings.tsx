"use client";

import { useState, useTransition } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { addSubcategory, deleteSubcategory } from "./actions";
import { contactTypes } from "../contacts/contact-types";

interface SubcategorySettingsProps {
  subcategories: { id: string; contactType: string; name: string }[];
}

const inputClass =
  "flex h-8 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-1.5 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2";

export function SubcategorySettings({ subcategories }: SubcategorySettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const grouped: Record<string, typeof subcategories> = {};
  for (const sc of subcategories) {
    if (!grouped[sc.contactType]) grouped[sc.contactType] = [];
    grouped[sc.contactType].push(sc);
  }

  function handleAdd(contactType: string) {
    if (!newName.trim()) return;
    startTransition(async () => {
      await addSubcategory(contactType, newName);
      setNewName("");
      setAddingType(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSubcategory(id);
    });
  }

  return (
    <div className="space-y-5">
      {contactTypes.map((ct) => {
        const items = grouped[ct.value] || [];
        const isAdding = addingType === ct.value;

        return (
          <div key={ct.value}>
            <h4 className="text-sm font-medium mb-2">{ct.label}</h4>
            <div className="rounded-lg border border-[var(--border)] divide-y divide-[var(--border)]">
              {items.length === 0 && !isAdding && (
                <p className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
                  No subcategories yet
                </p>
              )}
              {items.map((sc) => (
                <div key={sc.id} className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm">{sc.name}</span>
                  <button
                    onClick={() => handleDelete(sc.id)}
                    disabled={isPending}
                    aria-label={`Remove ${sc.name}`}
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {isAdding ? (
                <div className="flex items-center gap-2 px-3 py-2">
                  <input
                    className={inputClass}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Subcategory name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd(ct.value);
                      }
                      if (e.key === "Escape") {
                        setAddingType(null);
                        setNewName("");
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAdd(ct.value)}
                    disabled={isPending || !newName.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setAddingType(null);
                      setNewName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingType(ct.value);
                    setNewName("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] w-full transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add subcategory
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
