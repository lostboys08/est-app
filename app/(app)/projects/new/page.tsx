"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-[var(--muted-foreground)]">
            Create a new project to organize your bids and RFQs.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProject} className="space-y-4">
            <Input label="Name" name="name" placeholder="Project name" required />
            <Input label="Location" name="location" placeholder="City, State" />
            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)]">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Project description..."
                className="flex w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Create Project</Button>
              <Link href="/projects">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
