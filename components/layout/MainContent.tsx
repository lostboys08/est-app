"use client";

import { useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "pb-[var(--mobile-nav-height)] md:pb-0 transition-[padding] duration-200",
        isCollapsed
          ? "md:pl-[var(--sidebar-collapsed-width)]"
          : "md:pl-[var(--sidebar-width)]"
      )}
    >
      <div className="p-4 md:p-6">{children}</div>
    </main>
  );
}
