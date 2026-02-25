"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export function Header() {
  const { setMobileOpen, isCollapsed } = useSidebar();

  return (
    <header
      className="sticky top-0 z-30 flex items-center h-14 px-4 border-b border-[var(--border)] bg-[var(--background)] md:hidden"
    >
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-[var(--muted)] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="ml-3 font-semibold text-lg">KSC Estimator</span>
    </header>
  );
}
