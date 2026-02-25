import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { FileText, Send, FolderKanban } from "lucide-react";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import Link from "next/link";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function DashboardPage() {
  const user = await getDefaultUser();
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    projectsCount,
    projectsDueThisWeek,
    pendingRfqsCount,
    sentRfqsCount,
    upcomingProjectDeadlines,
    projectsWithPendingRfqs,
  ] = await Promise.all([
    prisma.project.count({ where: { userId: user.id, archived: false } }),
    prisma.project.count({
      where: {
        userId: user.id,
        archived: false,
        bidDueDate: { gte: now, lte: nextWeek },
      },
    }),
    prisma.rFQ.count({
      where: { userId: user.id, status: { in: ["DRAFT", "SENT"] } },
    }),
    prisma.rFQ.count({
      where: { userId: user.id, status: "SENT" },
    }),
    prisma.project.findMany({
      where: {
        userId: user.id,
        archived: false,
        bidDueDate: { gte: now, lte: next30Days },
      },
      orderBy: { bidDueDate: "asc" },
      take: 8,
    }),
    prisma.project.findMany({
      where: {
        userId: user.id,
        archived: false,
        rfqs: {
          some: {
            status: "SENT",
            dueDate: { gte: now, lte: nextWeek },
          },
        },
      },
      include: {
        rfqs: {
          where: {
            status: "SENT",
            dueDate: { gte: now, lte: nextWeek },
          },
          orderBy: { dueDate: "asc" },
          select: { id: true, subject: true, dueDate: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">
          Welcome back! Here&apos;s an overview of your estimating activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsCount}</div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {projectsCount === 1 ? "1 active project" : `${projectsCount} active projects`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bids Due This Week</CardTitle>
            <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsDueThisWeek}</div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {projectsDueThisWeek > 0 ? "Needs attention" : "Nothing due this week"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending RFQs</CardTitle>
            <Send className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRfqsCount}</div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {sentRfqsCount > 0 ? `${sentRfqsCount} awaiting response` : "No RFQs awaiting response"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Projects with bid due dates in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingProjectDeadlines.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-3">
                {upcomingProjectDeadlines.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div className="flex items-center justify-between gap-2 hover:bg-[var(--muted)]/50 rounded p-1 -mx-1">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{project.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{project.location ?? "Project"}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {formatDate(project.bidDueDate!)}
                        </span>
                        <Badge variant="secondary">Bid Due</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RFQ Follow-up Needed</CardTitle>
            <CardDescription>Projects with sent RFQs due this week and no response yet</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsWithPendingRfqs.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No RFQs need follow-up this week.</p>
            ) : (
              <div className="space-y-4">
                {projectsWithPendingRfqs.map((project) => (
                  <div key={project.id}>
                    <Link href={`/projects/${project.id}`}>
                      <p className="text-sm font-semibold hover:underline truncate">{project.name}</p>
                    </Link>
                    <div className="mt-1 space-y-1">
                      {project.rfqs.map((rfq) => (
                        <Link key={rfq.id} href={`/projects/${project.id}`}>
                          <div className="flex items-center justify-between gap-2 text-xs hover:bg-[var(--muted)]/50 rounded p-1 -mx-1">
                            <span className="text-[var(--muted-foreground)] truncate">{rfq.subject}</span>
                            {rfq.dueDate && (
                              <span className="shrink-0 text-[var(--muted-foreground)]">{formatDate(rfq.dueDate)}</span>
                            )}
                          </div>
                        </Link>
                      ))}
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
