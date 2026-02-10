import Link from "next/link";
import { Send, FolderKanban } from "lucide-react";
import { Badge, EmptyState, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { SendRFQButton } from "./send-button";
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

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      rfqs: {
        include: {
          contact: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">RFQs</h1>
          <p className="text-[var(--muted-foreground)]">
            Send and track requests for quotes from your contacts.
          </p>
        </div>
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project first — RFQs will be automatically generated for all your contacts."
          action={
            <Link href="/projects/new">
              <button className="inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90">
                Create Project
              </button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">RFQs</h1>
        <p className="text-[var(--muted-foreground)]">
          Send and track requests for quotes from your contacts.
        </p>
      </div>

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
                  No RFQs for this project. Add contacts and create a new project to generate RFQs.
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
                              const mailtoUrl = contact?.email
                                ? `mailto:${contact.email}?subject=${encodeURIComponent(`Request for Quote - ${project.name}`)}&body=${encodeURIComponent(`Hi ${contact.name},\n\nWe are requesting a quote for the following project:\n\nProject: ${project.name}${project.location ? `\nLocation: ${project.location}` : ""}${project.description ? `\nDescription: ${project.description}` : ""}\n\nPlease provide your best pricing at your earliest convenience.\n\nThank you`)}`
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
