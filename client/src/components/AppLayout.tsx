import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export function AppLayout({ children, currentPath }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Sidebar */}
      <AppSidebar currentPath={currentPath} />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
