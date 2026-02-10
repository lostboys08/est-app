"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { createRFQ } from "../actions";

interface NewRFQFormProps {
  projects: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
}

export function NewRFQForm({ projects, contacts }: NewRFQFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/rfqs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New RFQ</h1>
          <p className="text-[var(--muted-foreground)]">
            Create a new request for quote.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RFQ Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRFQ} className="space-y-4">
            <Input label="Subject" name="subject" placeholder="RFQ subject" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="projectId" className="block text-sm font-medium text-[var(--foreground)]">
                  Project
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  defaultValue=""
                  className="flex h-10 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                >
                  <option value="">None</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contactId" className="block text-sm font-medium text-[var(--foreground)]">
                  Contact
                </label>
                <select
                  id="contactId"
                  name="contactId"
                  defaultValue=""
                  className="flex h-10 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                >
                  <option value="">None</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Input label="Due Date" name="dueDate" type="date" />
            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Details about what you're requesting..."
                className="flex w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Create RFQ</Button>
              <Link href="/rfqs">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
