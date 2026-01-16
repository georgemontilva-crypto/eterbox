import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export function AppLayout({ children, currentPath }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar currentPath={currentPath} />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
