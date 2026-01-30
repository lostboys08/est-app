"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";

export default function NewBidPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/bids">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Bid</h1>
          <p className="text-[var(--muted-foreground)]">
            Create a new bid proposal.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bid Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Bid Name" name="name" placeholder="Enter bid name" />
            <Input label="Project" name="project" placeholder="Select or enter project" />
            <Input label="Due Date" name="dueDate" type="date" />
            <Input label="Total Amount" name="totalAmount" type="number" placeholder="0.00" />
            <div className="flex gap-3 pt-4">
              <Button type="submit">Create Bid</Button>
              <Link href="/bids">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
