"use client";

import { useState, useTransition } from "react";
import { Mail, Check, RefreshCw } from "lucide-react";
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui";
import { markRFQSent, markRFQsSent, updateRFQStatus } from "./actions";

interface SendRFQButtonProps {
  rfqId: string;
  mailtoUrl: string;
  status: string;
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  RECEIVED: "Received",
  AWAITING_REVISION: "Awaiting Revision",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
};

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  DRAFT: "secondary",
  SENT: "default",
  RECEIVED: "success",
  AWAITING_REVISION: "warning",
  ACCEPTED: "success",
  DECLINED: "destructive",
};

interface CompanyContact {
  rfqId: string;
  name: string;
  email: string | null;
  status: string;
}

interface SendCompanyRFQButtonProps {
  projectId: string;
  projectName: string;
  dueDateStr: string;
  fileLink: string;
  contacts: CompanyContact[];
}

export function SendCompanyRFQButton({ projectId, projectName, dueDateStr, fileLink, contacts }: SendCompanyRFQButtonProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const sendableContacts = contacts.filter((c) => c.email && c.status === "DRAFT");

  const handleOpen = () => {
    setSelected(sendableContacts.map((c) => c.rfqId));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected([]);
  };

  const toggleContact = (rfqId: string) => {
    setSelected((prev) =>
      prev.includes(rfqId) ? prev.filter((id) => id !== rfqId) : [...prev, rfqId]
    );
  };

  const handleSend = () => {
    const chosenContacts = sendableContacts.filter((c) => selected.includes(c.rfqId));
    const emails = chosenContacts.map((c) => c.email).filter(Boolean) as string[];
    const mailtoUrl = `mailto:${emails.join(",")}?subject=${encodeURIComponent(
      `Request for Quote - ${projectName}`
    )}&body=${encodeURIComponent(
      `Hi,\n\nWe are requesting a quote for the ${projectName} project. Please review the project documents and provide pricing for your scope of work.\n\nOur bid is due on ${dueDateStr}, so we must receive your quote no later than that date. Earlier submission is strongly preferred to allow adequate time for review.\n\nThe project files are available at the link below:\n${fileLink}\n\nIf you have any questions or need additional information, please contact us as soon as possible. Bids should be sent to: Estimating@kennyseng.com.\n\nThank you for your prompt attention to this request.\n\nThanks,`
    )}`;
    window.location.href = mailtoUrl;
    const draftRfqIds = chosenContacts.map((c) => c.rfqId);
    startTransition(async () => {
      await markRFQsSent(draftRfqIds, projectId);
      handleClose();
    });
  };

  if (sendableContacts.length === 0) return null;

  return (
    <>
      <Button size="sm" variant="secondary" onClick={handleOpen}>
        <Mail className="h-3 w-3 mr-1" />
        Send All
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Send Company RFQ</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--muted-foreground)]">
            One email will be sent to all selected contacts. Uncheck anyone you want to exclude.
          </p>
          <div className="rounded-lg border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
            {sendableContacts.map((contact) => (
              <label
                key={contact.rfqId}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--muted)]/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(contact.rfqId)}
                  onChange={() => toggleContact(contact.rfqId)}
                  className="h-4 w-4 rounded border-[var(--input)]"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{contact.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)] truncate">{contact.email}</div>
                </div>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={selected.length === 0 || isPending}>
              <Mail className="h-3 w-3 mr-1" />
              {isPending ? "Sending..." : `Send to ${selected.length}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SendRFQButton({ rfqId, mailtoUrl, status }: SendRFQButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    window.location.href = mailtoUrl;
    if (status === "DRAFT") {
      startTransition(async () => {
        await markRFQSent(rfqId);
      });
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    startTransition(async () => {
      await updateRFQStatus(rfqId, newStatus);
    });
  };

  if (status === "SENT") {
    return (
      <div className="flex items-center gap-2 justify-end flex-wrap">
        <Badge variant="default">
          <Check className="h-3 w-3 mr-1" />
          Sent
        </Badge>
        <Button size="sm" variant="ghost" onClick={handleSend} disabled={isPending}>
          <Mail className="h-3 w-3 mr-1" />
          Resend
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate("RECEIVED")} disabled={isPending}>
          <Check className="h-3 w-3 mr-1" />
          Mark Received
        </Button>
      </div>
    );
  }

  if (status === "RECEIVED") {
    return (
      <div className="flex items-center gap-2 justify-end flex-wrap">
        <Badge variant="success">
          <Check className="h-3 w-3 mr-1" />
          Received
        </Badge>
        <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate("AWAITING_REVISION")} disabled={isPending}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Req. Revision
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate("ACCEPTED")} disabled={isPending}>
          Accept
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate("DECLINED")} disabled={isPending}>
          Decline
        </Button>
      </div>
    );
  }

  if (status === "AWAITING_REVISION") {
    return (
      <div className="flex items-center gap-2 justify-end">
        <Badge variant="warning">
          <RefreshCw className="h-3 w-3 mr-1" />
          Awaiting Revision
        </Badge>
        <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate("RECEIVED")} disabled={isPending}>
          <Check className="h-3 w-3 mr-1" />
          Mark Received
        </Button>
      </div>
    );
  }

  if (status === "ACCEPTED" || status === "DECLINED") {
    return (
      <Badge variant={statusBadgeVariant[status]}>
        <Check className="h-3 w-3 mr-1" />
        {statusLabels[status]}
      </Badge>
    );
  }

  // DRAFT
  return (
    <Button size="sm" onClick={handleSend} disabled={isPending}>
      <Mail className="h-3 w-3 mr-1" />
      {isPending ? "Sending..." : "Send RFQ"}
    </Button>
  );
}
