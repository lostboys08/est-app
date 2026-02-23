import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { getSubcategories } from "@/lib/subcategories";
import { NewContactForm } from "./NewContactForm";
export const dynamic = "force-dynamic";

export default async function NewContactPage() {
  const subcategories = await getSubcategories();

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
          <NewContactForm subcategories={subcategories} />
        </CardContent>
      </Card>
    </div>
  );
}
