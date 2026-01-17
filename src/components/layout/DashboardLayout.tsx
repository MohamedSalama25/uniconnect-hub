import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { MobileSidebar } from './MobileSidebar';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/useSidebarStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { collapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300',
        collapsed ? 'md:mr-20' : 'md:mr-64'
      )}>
        <TopNavbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
