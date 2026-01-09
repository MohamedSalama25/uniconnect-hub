import {
  Home,
  Building,
  MapPin,
  Briefcase,
  MessageCircle,
  HelpCircle,
  User,
  X,
  GraduationCap,
  FileText
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'الرئيسية' },
  { to: '/accommodations', icon: Building, label: 'السكن' },
  { to: '/map', icon: MapPin, label: 'الخريطة' },
  { to: '/services', icon: Briefcase, label: 'الخدمات' },
  { to: '/chat', icon: MessageCircle, label: 'المحادثات' },
  { to: '/help', icon: HelpCircle, label: 'طلبات المساعدة' },
  { to: '/profile', icon: User, label: 'الملف الشخصي' },
  { to: '/admin/posts', icon: FileText, label: 'المنشورات' },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const location = useLocation();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed right-0 top-0 z-50 h-screen w-72 bg-sidebar border-l border-sidebar-border md:hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">يوني كونكت</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>





        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'hover:bg-sidebar-accent',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside >
    </>
  );
}
