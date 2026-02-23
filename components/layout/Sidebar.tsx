"use client";

import {
  LayoutDashboard,
  Users,
  Send,
  FolderKanban,
  Settings,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { SidebarNavItem } from "./SidebarNavItem";

const primaryNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/rfqs", icon: Send, label: "RFQs" },
];

const secondaryNav = [
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const { isCollapsed, toggleCollapse, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] sidebar-transition sidebar-scroll overflow-y-auto",
          // Desktop: visible, collapsible
          "hidden md:flex md:flex-col",
          isCollapsed
            ? "md:w-[var(--sidebar-collapsed-width)]"
            : "md:w-[var(--sidebar-width)]",
          // Mobile: slide in from left
          isMobileOpen && "flex flex-col w-[var(--sidebar-width)] md:hidden"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center h-14 px-4 border-b border-[var(--sidebar-border)]",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <span className="font-semibold text-lg">Estimator</span>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[var(--sidebar-item-hover)] transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex md:hidden items-center justify-center h-8 w-8 rounded-lg hover:bg-[var(--sidebar-item-hover)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-between p-2">
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <SidebarNavItem key={item.href} {...item} />
            ))}
          </div>
          <div className="space-y-1">
            {secondaryNav.map((item) => (
              <SidebarNavItem key={item.href} {...item} />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
