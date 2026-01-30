"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function SidebarNavItem({ href, icon: Icon, label }: SidebarNavItemProps) {
  const pathname = usePathname();
  const { isCollapsed, setMobileOpen } = useSidebar();

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-[var(--sidebar-item-hover)]",
        isActive
          ? "bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)]"
          : "text-[var(--muted-foreground)]",
        isCollapsed && "justify-center px-2"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}
