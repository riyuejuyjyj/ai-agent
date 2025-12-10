import DashboardSidebar from "@/components/dashboard/ui/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-screen bg-muted">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
