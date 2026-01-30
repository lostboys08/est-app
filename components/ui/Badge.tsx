import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "secondary";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-[var(--primary)] text-[var(--primary-foreground)]":
            variant === "default",
          "bg-[var(--success)] text-[var(--success-foreground)]":
            variant === "success",
          "bg-[var(--warning)] text-[var(--warning-foreground)]":
            variant === "warning",
          "bg-[var(--destructive)] text-[var(--destructive-foreground)]":
            variant === "destructive",
          "bg-[var(--secondary)] text-[var(--secondary-foreground)]":
            variant === "secondary",
        },
        className
      )}
      {...props}
    />
  );
}
