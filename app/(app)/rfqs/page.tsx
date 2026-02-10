import Link from "next/link";
import { Send, Plus } from "lucide-react";
import { Button, Badge, EmptyState } from "@/components/ui";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  RECEIVED: "Received",
  CLOSED: "Closed",
};

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  DRAFT: "secondary",
  SENT: "default",
  RECEIVED: "success",
  CLOSED: "warning",
};

export default async function RFQsPage() {
  const user = await getDefaultUser();
  const rfqs = await prisma.rFQ.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { name: true } },
      contact: { select: { name: true } },
      _count: { select: { responses: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFQs</h1>
          <p className="text-[var(--muted-foreground)]">
            Send and track requests for quotes from your contacts.
          </p>
        </div>
        <Link href="/rfqs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New RFQ
          </Button>
        </Link>
      </div>

      {rfqs.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No RFQs yet"
          description="Create your first request for quote to start getting pricing from your subcontractors and suppliers."
          action={
            <Link href="/rfqs/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create RFQ
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Subject</th>
                <th className="text-left px-4 py-3 font-medium">Project</th>
                <th className="text-left px-4 py-3 font-medium">Contact</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Responses</th>
                <th className="text-left px-4 py-3 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {rfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-4 py-3 font-medium">{rfq.subject}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {rfq.project?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {rfq.contact?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant[rfq.status] || "secondary"}>
                      {statusLabels[rfq.status] || rfq.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{rfq._count.responses}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {rfq.dueDate
                      ? new Date(rfq.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
