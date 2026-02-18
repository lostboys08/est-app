import { ThemeProvider, SidebarProvider, Sidebar, Header, MobileNav, MainContent } from "@/components/layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
    <SidebarProvider>
      <div className="min-h-screen bg-[var(--background)]">
        <Sidebar />
        <Header />
        <MainContent>{children}</MainContent>
        <MobileNav />
      </div>
    </SidebarProvider>
    </ThemeProvider>
  );
}
