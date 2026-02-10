"use client";

import { useTransition } from "react";
import { Mail, Check } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { markRFQSent } from "./actions";

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

export function SendRFQButton({ rfqId, mailtoUrl, status }: SendRFQButtonProps) {
  const [isPending, startTransition] = useTransition();

  if (status !== "DRAFT") {
    return (
      <Badge variant={statusBadgeVariant[status] || "secondary"}>
        <Check className="h-3 w-3 mr-1" />
        {statusLabels[status] || status}
      </Badge>
    );
  }

  const handleClick = () => {
    window.location.href = mailtoUrl;
    startTransition(async () => {
      await markRFQSent(rfqId);
    });
  };

  return (
    <Button size="sm" onClick={handleClick} disabled={isPending}>
      <Mail className="h-3 w-3 mr-1" />
      {isPending ? "Sending..." : "Send RFQ"}
    </Button>
  );
}
