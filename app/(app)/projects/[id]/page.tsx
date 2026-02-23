import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CalendarDays, MapPin } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { SendRFQButton, SendCompanyRFQButton } from "@/app/(app)/rfqs/send-button";
import { AddRFQsButton } from "./AddRFQsButton";
export const dynamic = "force-dynamic";

const NO_COMPANY = "(No Company)";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const user = await getDefaultUser();

  const [project, allContacts] = await Promise.all([
    prisma.project.findFirst({
      where: { id, userId: user.id },
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

  if (!project) notFound();

  // Contacts that don't yet have an RFQ on this project
  const existingContactIds = new Set(project.rfqs.map((r) => r.contactId));
  const availableContacts = allContacts.filter((c) => !existingContactIds.has(c.id));

  // Group RFQs by company
  const grouped: Record<string, typeof project.rfqs> = {};
  for (const rfq of project.rfqs) {
    const company = rfq.contact?.company || NO_COMPANY;
    if (!grouped[company]) grouped[company] = [];
    grouped[company].push(rfq);
  }
  const sortedTypes = Object.keys(grouped).sort((a, b) => {
    if (a === NO_COMPANY) return 1;
    if (b === NO_COMPANY) return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          All Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-[var(--muted-foreground)]">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location}
                </span>
              )}
              {project.dueDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Due {new Date(project.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </div>
          </div>
          {project.archived && (
            <Badge variant="secondary">Archived</Badge>
          )}
        </div>
      </div>

      {/* Project details */}
      {(project.description || project.fileUrl) && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            {project.description && (
              <p className="text-sm text-[var(--muted-foreground)]">{project.description}</p>
            )}
            {project.fileUrl && (
              <a
                href={project.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Project Files
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* RFQs section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>RFQs</CardTitle>
            <AddRFQsButton projectId={project.id} contacts={availableContacts} />
          </div>
        </CardHeader>
        <CardContent>
          {sortedTypes.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              No RFQs yet. Use the Add Contacts button to send quotes for this project.
            </p>
          ) : (
            <div className="space-y-4">
              {sortedTypes.map((type) => {
                const dueDateStr = project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "[Due Date TBD]";
                const fileLink = project.fileUrl ?? "[Insert project files link here]";

                const companyEmails = grouped[type]
                  .map((rfq) => rfq.contact?.email)
                  .filter((e): e is string => Boolean(e));
                const draftRfqIds = grouped[type]
                  .filter((rfq) => rfq.status === "DRAFT" && rfq.contact?.email)
                  .map((rfq) => rfq.id);
                const companyMailtoUrl = companyEmails.length > 0
                  ? `mailto:${companyEmails.join(",")}?subject=${encodeURIComponent(
                      `Request for Quote - ${project.name}`
                    )}&body=${encodeURIComponent(
                      `Hi,\n\nWe are requesting a quote for the ${project.name} project. Please review the project documents and provide pricing for your scope of work.\n\nOur bid is due on ${dueDateStr}, so we must receive your quote no later than that date. Earlier submission is strongly preferred to allow adequate time for review.\n\nThe project files are available at the link below:\n${fileLink}\n\nIf you have any questions or need additional information, please contact us as soon as possible. Bids should be sent to: Estimating@kennyseng.com.\n\nThank you for your prompt attention to this request.\n\nThanks,`
                    )}`
                  : "";

                return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[var(--muted-foreground)]">
                      {type}
                    </h3>
                    {companyEmails.length > 0 && (
                      <SendCompanyRFQButton
                        draftRfqIds={draftRfqIds}
                        mailtoUrl={companyMailtoUrl}
                        projectId={project.id}
                      />
                    )}
                  </div>
                  <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-[var(--border)]">
                        {grouped[type].map((rfq) => {
                          const contact = rfq.contact;
                          const firstName =
                            contact?.name?.split(" ")[0] ?? contact?.name ?? "";
                          const mailtoUrl = contact?.email
                            ? `mailto:${contact.email}?subject=${encodeURIComponent(
                                `Request for Quote - ${project.name}`
                              )}&body=${encodeURIComponent(
                                `Hi ${firstName},\n\nWe are requesting a quote for the ${project.name} project. Please review the project documents and provide pricing for your scope of work.\n\nOur bid is due on ${dueDateStr}, so we must receive your quote no later than that date. Earlier submission is strongly preferred to allow adequate time for review.\n\nThe project files are available at the link below:\n${fileLink}\n\nIf you have any questions or need additional information, please contact us as soon as possible. Bids should be sent to: Estimating@kennyseng.com.\n\nThank you for your prompt attention to this request.\n\nThanks,`
                              )}`
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
