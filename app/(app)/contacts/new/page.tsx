"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";

export default function NewContactPage() {
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
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" name="name" placeholder="Full name" />
              <Input label="Company" name="company" placeholder="Company name" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Email" name="email" type="email" placeholder="email@example.com" />
              <Input label="Phone" name="phone" type="tel" placeholder="(555) 555-5555" />
            </div>
            <Input label="Contact Type" name="type" placeholder="Subcontractor, Supplier, etc." />
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
