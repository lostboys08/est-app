import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Badge, EmptyState, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { SendRFQButton } from "./send-button";
import { CreateRFQButton } from "./CreateRFQButton";
export const dynamic = "force-dynamic";

const contactTypeLabels: Record<string, string> = {
  SUBCONTRACTOR: "Subcontractors",
  SUPPLIER: "Suppliers",
  GENERAL_CONTRACTOR: "General Contractors",
  OWNER: "Owners",
  ARCHITECT: "Architects",
  OTHER: "Other",
};

const contactTypeOrder = [
  "SUBCONTRACTOR",
  "SUPPLIER",
  "GENERAL_CONTRACTOR",
  "OWNER",
  "ARCHITECT",
  "OTHER",
];

export default async function RFQsPage() {
  const user = await getDefaultUser();

  const [projects, contacts] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id, archived: false },
      orderBy: { createdAt: "desc" },
      include: {
        rfqs: {
          where: { contactId: { not: null } },
          include: { contact: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.contact.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFQs</h1>
          <p className="text-[var(--muted-foreground)]">
            Send and track requests for quotes from your contacts.
          </p>
        </div>
        <CreateRFQButton projects={projects} contacts={contacts} />
      </div>

      {projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project first, then use the New RFQ button to send quotes to your contacts."
          action={
            <Link href="/projects/new">
              <button className="inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90">
                Create Project
              </button>
            </Link>
          }
        />
      )}

      {projects.map((project) => {
        // Group RFQs by contact type
        const grouped: Record<string, typeof project.rfqs> = {};
        for (const rfq of project.rfqs) {
          const type = rfq.contact?.type || "OTHER";
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push(rfq);
        }

        const sortedTypes = contactTypeOrder.filter((t) => grouped[t]?.length);

        return (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                {project.location && (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {project.location}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {sortedTypes.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No RFQs yet. Use the New RFQ button to send quotes for this project.
                </p>
              ) : (
                <div className="space-y-4">
                  {sortedTypes.map((type) => (
                    <div key={type}>
                      <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">
                        {contactTypeLabels[type] || type}
                      </h3>
                      <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-[var(--border)]">
                            {grouped[type].map((rfq) => {
                              const contact = rfq.contact;
                              const firstName = contact?.name?.split(" ")[0] ?? contact?.name ?? "";
                              const dueDateStr = project.dueDate
                                ? new Date(project.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                                : "[Due Date TBD]";
                              const fileLink = project.fileUrl ?? "[Insert project files link here]";
                              const mailtoUrl = contact?.email
                                ? `mailto:${contact.email}?subject=${encodeURIComponent(`Request for Quote - ${project.name}`)}&body=${encodeURIComponent(`Hi ${firstName},\n\nWe are requesting a quote for the ${project.name}. Please review the project documents and provide pricing for your scope of work.\n\nOur bid is due on ${dueDateStr}, so we must receive your quote no later than that date. Earlier submission is strongly preferred to allow adequate time for review.\n\nThe project files are available at the link below:\n${fileLink}\n\nIf you have any questions or need additional information, please contact us as soon as possible. Bids should be sent to: Estimating@kennyseng.com.\n\nThank you for your prompt attention to this request.\n\nThanks,`)}`
                                : "";

                              return (
                                <tr key={rfq.id} className="hover:bg-[var(--muted)]/50">
                                  <td className="px-4 py-3 font-medium">
                                    {contact?.name || "Unknown Contact"}
                                  </td>
                                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                                    {contact?.email || "No email"}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {contact?.email ? (
                                      <SendRFQButton
                                        rfqId={rfq.id}
                                        mailtoUrl={mailtoUrl}
                                        status={rfq.status}
                                      />
                                    ) : (
                                      <Badge variant="secondary">No email</Badge>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
