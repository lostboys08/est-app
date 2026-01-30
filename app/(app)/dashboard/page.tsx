import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { FileText, Users, Send, FolderKanban } from "lucide-react";

const stats = [
  { title: "Active Bids", value: "12", icon: FileText, description: "3 due this week" },
  { title: "Contacts", value: "48", icon: Users, description: "5 new this month" },
  { title: "Pending RFQs", value: "7", icon: Send, description: "2 awaiting response" },
  { title: "Projects", value: "9", icon: FolderKanban, description: "4 in progress" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">
          Welcome back! Here&apos;s an overview of your estimating activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-[var(--muted-foreground)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bids</CardTitle>
            <CardDescription>Your most recent bid submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              No recent bids to display. Create your first bid to get started.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Bids and RFQs due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              No upcoming deadlines. You&apos;re all caught up!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
