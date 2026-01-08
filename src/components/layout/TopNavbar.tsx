import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
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
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
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
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث عن سكن، خدمات..."
              className="pr-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
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
                  <AvatarImage src={currentStudent.avatar} alt={currentStudent.name} />
                  <AvatarFallback>{currentStudent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-medium">{currentStudent.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
              <DropdownMenuItem>الإعدادات</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">تسجيل الخروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
