import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { AppearanceSettings } from "./AppearanceSettings";
import { SubcategorySettings } from "./SubcategorySettings";
import { getSubcategoryRecords } from "@/lib/subcategories";
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const subcategories = await getSubcategoryRecords();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--muted-foreground)]">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose your preferred color theme</CardDescription>
          </CardHeader>
          <CardContent>
            <AppearanceSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Subcategories</CardTitle>
            <CardDescription>
              Define the subcategories available when adding or editing contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubcategorySettings subcategories={subcategories} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Profile settings will be available here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
            <CardDescription>Your company details for bid documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Company settings will be available here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Notification settings will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
