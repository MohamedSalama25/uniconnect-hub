import { Search, Bell, Moon, Sun, Menu, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { currentStudent } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { cn, formatImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { GlobalSearch } from '../globalComponents/GlobalSearch';
import { API_CONFIG } from '@/lib/api.config';
import { authService } from '@/features/auth/services/auth.service';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, fullProfile, logout, profileUpdateTick } = useAuthStore();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    try {
      if (user?.token) {
        await authService.logout()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      logout();
      navigate('/welcome');
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const avatarUrl = fullProfile?.profilePictureUrl
    ? `${formatImageUrl(fullProfile.profilePictureUrl)}?t=${profileUpdateTick}`
    : currentStudent.avatar;

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div
              className="relative w-full cursor-pointer"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <div className="flex w-full h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-muted-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 items-center">
                <span className="opacity-50">ابحث عن سكن، خدمات...</span>
                <kbd className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-xl"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-xl">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="font-medium">رد جديد على طلبك</span>
                  <span className="text-sm text-muted-foreground">منذ 5 دقائق</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="font-medium">تم حجز موعد المعاينة</span>
                  <span className="text-sm text-muted-foreground">منذ ساعة</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="font-medium">رسالة جديدة من أحمد</span>
                  <span className="text-sm text-muted-foreground">منذ 3 ساعات</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 rounded-xl pr-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={avatarUrl}
                      alt={fullProfile?.firstName ? `${fullProfile.firstName} ${fullProfile.lastName}` : (user?.displayName || currentStudent.name)}
                    />
                    <AvatarFallback>{(fullProfile?.firstName || user?.displayName || currentStudent.name).charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium">
                    {fullProfile?.firstName ? `${fullProfile.firstName} ${fullProfile.lastName}` : (user?.displayName || currentStudent.name)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2" onClick={() => navigate('/profile')}>
                  <UserIcon className="w-4 h-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => navigate('/profile', { state: { tab: 'settings' } })}>
                  <Settings className="w-4 h-4" />
                  <span>الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
}
