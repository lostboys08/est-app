"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { createContact } from "../actions";
import { contactTypes, SUBCATEGORIES } from "../contact-types";

const selectClass =
  "flex h-10 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2";

export default function NewContactPage() {
  const [selectedType, setSelectedType] = useState("OTHER");
  const subcategories = SUBCATEGORIES[selectedType] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/contacts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add Contact</h1>
          <p className="text-[var(--muted-foreground)]">
            Add a new contact to your network.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createContact} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" name="name" placeholder="Full name" required />
              <Input label="Company" name="company" placeholder="Company name" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Email" name="email" type="email" placeholder="email@example.com" />
              <Input label="Phone" name="phone" type="tel" placeholder="(555) 555-5555" />
            </div>
            <div className={subcategories.length > 0 ? "grid gap-4 sm:grid-cols-2" : ""}>
              <div className="space-y-1.5">
                <label htmlFor="type" className="block text-sm font-medium text-[var(--foreground)]">
                  Contact Type
                </label>
                <select
                  id="type"
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
              {subcategories.length > 0 && (
                <div className="space-y-1.5">
                  <label htmlFor="subCategory" className="block text-sm font-medium text-[var(--foreground)]">
                    Sub Category
                  </label>
                  <select
                    key={selectedType}
                    id="subCategory"
                    name="subCategory"
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {subcategories.map((sc) => (
                      <option key={sc} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Input label="Location" name="location" placeholder="City, Province / Region" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="notes" className="block text-sm font-medium text-[var(--foreground)]">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Any additional notes..."
                className="flex w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Add Contact</Button>
              <Link href="/contacts">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
