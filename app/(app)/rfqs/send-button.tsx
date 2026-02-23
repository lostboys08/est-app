"use client";

import { useTransition } from "react";
import { Mail, Check } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { markRFQSent, markRFQsSent } from "./actions";

interface SendRFQButtonProps {
  rfqId: string;
  mailtoUrl: string;
  status: string;
}

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

interface SendCompanyRFQButtonProps {
  draftRfqIds: string[];
  mailtoUrl: string;
  projectId: string;
}

export function SendCompanyRFQButton({ draftRfqIds, mailtoUrl, projectId }: SendCompanyRFQButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    window.location.href = mailtoUrl;
    if (draftRfqIds.length > 0) {
      startTransition(async () => {
        await markRFQsSent(draftRfqIds, projectId);
      });
    }
  };

  return (
    <Button size="sm" variant="secondary" onClick={handleClick} disabled={isPending}>
      <Mail className="h-3 w-3 mr-1" />
      {isPending ? "Sending..." : "Send All"}
    </Button>
  );
}

export function SendRFQButton({ rfqId, mailtoUrl, status }: SendRFQButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    window.location.href = mailtoUrl;
    if (status === "DRAFT") {
      startTransition(async () => {
        await markRFQSent(rfqId);
      });
    }
  };

  if (status === "SENT") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={statusBadgeVariant["SENT"]}>
          <Check className="h-3 w-3 mr-1" />
          Sent
        </Badge>
        <Button size="sm" variant="ghost" onClick={handleClick}>
          <Mail className="h-3 w-3 mr-1" />
          Resend
        </Button>
      </div>
    );
  }

  if (status !== "DRAFT") {
    return (
      <Badge variant={statusBadgeVariant[status] || "secondary"}>
        <Check className="h-3 w-3 mr-1" />
        {statusLabels[status] || status}
      </Badge>
    );
  }

  return (
    <Button size="sm" onClick={handleClick} disabled={isPending}>
      <Mail className="h-3 w-3 mr-1" />
      {isPending ? "Sending..." : "Send RFQ"}
    </Button>
  );
}
