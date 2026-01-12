import {
  Home,
  Building,
  MapPin,
  Briefcase,
  MessageCircle,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  FileText,
  CalendarCheck
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Plus } from 'lucide-react';


const navItems = [
  { to: '/', icon: Home, label: 'الرئيسية' },
  { to: '/accommodations', icon: Building, label: 'السكن' },
  { to: '/map', icon: MapPin, label: 'الخريطة' },
  { to: '/services', icon: Briefcase, label: 'الخدمات' },
  { to: '/provider/bookings', icon: CalendarCheck, label: 'الحجوزات' },
  { to: '/chat', icon: MessageCircle, label: 'المحادثات' },
  { to: '/help', icon: HelpCircle, label: 'طلبات المساعدة' },
  { to: '/profile', icon: User, label: 'الملف الشخصي' },
  { to: '/admin/posts', icon: FileText, label: 'المنشورات' },
];

export function AppSidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isAdmin = user?.roles?.includes('Admin')|| "";
  
  const finalNavItems = [
    ...navItems,
    ...(isAdmin ? [{ to: '/admin/users', icon: User, label: 'المستخدمين' }] : [])
  ];

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 z-40 h-screen transition-all duration-300 bg-sidebar border-l border-sidebar-border',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-6 border-b border-sidebar-border',
        collapsed && 'justify-center'
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold text-sidebar-foreground">يوني كونكت</span>
        )}
      </div>


      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {finalNavItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                'hover:bg-sidebar-accent',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground',
                collapsed && 'justify-center px-3'
              )}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'animate-scale-in')} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </Button>
      </div>
    </aside >
  );
}
