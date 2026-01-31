import { Search, Moon, Sun, Menu, LogOut, Settings, User as UserIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
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
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage on initial render
    return localStorage.getItem('theme') === 'dark';
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user, fullProfile, logout, profileUpdateTick } = useAuthStore();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
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
            <NotificationBell />

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
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem dir="rtl" className="gap-2 " onClick={() => navigate('/profile')}>
                  <UserIcon className="w-4 h-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem dir="rtl" className="gap-2" onClick={() => navigate('/profile', { state: { tab: 'settings' } })}>
                  <Settings className="w-4 h-4" />
                  <span>الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuItem dir="rtl" onClick={handleLogoutClick} className="text-destructive gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">هل أنت متأكد من تسجيل الخروج؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              سيتم تسجيل خروجك من الحساب الحالي. ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
            <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
