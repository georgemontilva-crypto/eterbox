import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { PullToRefresh } from "./PullToRefresh";

interface AppLayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export function AppLayout({ children, currentPath }: AppLayoutProps) {
  const handleRefresh = async () => {
    // Reload the page to refresh data
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Sidebar */}
      <AppSidebar currentPath={currentPath} />
      
      {/* Main Content with Pull to Refresh */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 max-w-full overflow-x-hidden">
        <PullToRefresh onRefresh={handleRefresh}>
          {children}
        </PullToRefresh>
      </main>
    </div>
  );
}
