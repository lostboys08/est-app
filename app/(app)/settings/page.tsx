import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { AppearanceSettings } from "./AppearanceSettings";

export default function SettingsPage() {
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
            <CardTitle>Company</CardTitle>
            <CardDescription>Your company details for bid documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Company settings will be available here.
            </p>
          </CardContent>
        </Card>
     </div>
    </div>
  );
}
