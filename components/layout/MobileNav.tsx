"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

const mobileNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/bids", icon: FileText, label: "Bids" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/rfqs", icon: Send, label: "RFQs" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden h-[var(--mobile-nav-height)] bg-[var(--background)] border-t border-[var(--border)]">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              isActive
                ? "text-[var(--primary)]"
                : "text-[var(--muted-foreground)]"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium text-[var(--muted-foreground)] transition-colors"
      >
        <MoreHorizontal className="h-5 w-5" />
        <span>More</span>
      </button>
    </nav>
  );
}
