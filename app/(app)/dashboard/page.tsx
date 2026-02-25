import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { FileText, Users, Send, FolderKanban } from "lucide-react";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import Link from "next/link";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

const BID_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  WON: "Won",
  LOST: "Lost",
  CANCELLED: "Cancelled",
};

const BID_STATUS_VARIANTS: Record<string, "default" | "secondary" | "success" | "destructive"> = {
  DRAFT: "secondary",
  SUBMITTED: "default",
  WON: "success",
  LOST: "destructive",
  CANCELLED: "secondary",
};

export default async function DashboardPage() {
  const user = await getDefaultUser();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    activeBidsCount,
    bidsDueThisWeek,
    contactsCount,
    newContactsThisMonth,
    pendingRfqsCount,
    sentRfqsCount,
    projectsCount,
    recentBids,
    upcomingBidDeadlines,
    upcomingProjectDeadlines,
  ] = await Promise.all([
    prisma.bid.count({
      where: { userId: user.id, status: { in: ["DRAFT", "SUBMITTED"] } },
    }),
    prisma.bid.count({
      where: {
        userId: user.id,
        status: { in: ["DRAFT", "SUBMITTED"] },
        dueDate: { gte: now, lte: nextWeek },
      },
    }),
    prisma.contact.count({ where: { userId: user.id } }),
    prisma.contact.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.rFQ.count({
      where: { userId: user.id, status: { in: ["DRAFT", "SENT"] } },
    }),
    prisma.rFQ.count({
      where: { userId: user.id, status: "SENT" },
    }),
    prisma.project.count({ where: { userId: user.id, archived: false } }),
    prisma.bid.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: { select: { name: true } } },
    }),
    prisma.bid.findMany({
      where: {
        userId: user.id,
        status: { in: ["DRAFT", "SUBMITTED"] },
        dueDate: { gte: now, lte: next30Days },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { project: { select: { name: true } } },
    }),
    prisma.project.findMany({
      where: {
        userId: user.id,
        archived: false,
        dueDate: { gte: now, lte: next30Days },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      title: "Active Bids",
      value: activeBidsCount.toString(),
      icon: FileText,
      description: bidsDueThisWeek > 0 ? `${bidsDueThisWeek} due this week` : "No bids due this week",
      href: "/bids",
    },
    {
      title: "Contacts",
      value: contactsCount.toString(),
      icon: Users,
      description: newContactsThisMonth > 0 ? `${newContactsThisMonth} new this month` : "No new contacts this month",
      href: "/contacts",
    },
    {
      title: "Pending RFQs",
      value: pendingRfqsCount.toString(),
      icon: Send,
      description: sentRfqsCount > 0 ? `${sentRfqsCount} awaiting response` : "No RFQs awaiting response",
      href: "/rfqs",
    },
    {
      title: "Projects",
      value: projectsCount.toString(),
      icon: FolderKanban,
      description: projectsCount > 0 ? `${projectsCount} active` : "No active projects",
      href: "/projects",
    },
  ];

  // Merge and sort upcoming deadlines
  type DeadlineItem =
    | { kind: "bid"; id: string; name: string; project: string | null; dueDate: Date; status: string; amount: number | null }
    | { kind: "project"; id: string; name: string; dueDate: Date };

  const deadlines: DeadlineItem[] = [
    ...upcomingBidDeadlines.map((b) => ({
      kind: "bid" as const,
      id: b.id,
      name: b.name,
      project: b.project?.name ?? null,
      dueDate: b.dueDate!,
      status: b.status,
      amount: b.totalAmount ? Number(b.totalAmount) : null,
    })),
    ...upcomingProjectDeadlines.map((p) => ({
      kind: "project" as const,
      id: p.id,
      name: p.name,
      dueDate: p.dueDate!,
    })),
  ].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()).slice(0, 6);

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
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:border-[var(--primary)]/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-[var(--muted-foreground)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-[var(--muted-foreground)]">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bids</CardTitle>
            <CardDescription>Your most recently created bids</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBids.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                No bids yet. <Link href="/bids/new" className="underline text-[var(--foreground)]">Create your first bid</Link> to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {recentBids.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{bid.name}</p>
                      {bid.project && (
                        <p className="text-xs text-[var(--muted-foreground)] truncate">{bid.project.name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {bid.totalAmount && (
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {formatCurrency(Number(bid.totalAmount))}
                        </span>
                      )}
                      <Badge variant={BID_STATUS_VARIANTS[bid.status] ?? "secondary"}>
                        {BID_STATUS_LABELS[bid.status] ?? bid.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Bids and projects due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {deadlines.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                No upcoming deadlines. You&apos;re all caught up!
              </p>
            ) : (
              <div className="space-y-3">
                {deadlines.map((item) => (
                  <div key={`${item.kind}-${item.id}`} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {item.kind === "bid" ? (item.project ? item.project : "Bid") : "Project"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {formatDate(item.dueDate)}
                      </span>
                      <Badge variant="secondary">
                        {item.kind === "project" ? "Project" : BID_STATUS_LABELS[item.status] ?? item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
