"use client";

import { useTransition } from "react";
import { Mail, Check, RefreshCw } from "lucide-react";
import { Button, Badge } from "@/components/ui";
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
