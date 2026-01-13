import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUsersFilterProps {
  filters: {
    search: string;
    role: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function AdminUsersFilter({
  filters,
  onFilterChange,
  onClearFilters,
}: AdminUsersFilterProps) {
  return (
    <div className="flex flex-col gap-4 py-4" dir="rtl">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو البريد الإلكتروني..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pr-10 h-11"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.role}
            onValueChange={(value) => onFilterChange("role", value)}
          >
            <SelectTrigger className="w-full md:w-[140px] h-11">
              <SelectValue placeholder="كل الأدوار" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأدوار</SelectItem>
              <SelectItem value="Admin">مشرف</SelectItem>
              <SelectItem value="Student">طالب</SelectItem>
              <SelectItem value="Service">مقدم خدمة</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger className="w-full md:w-[140px] h-11">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="pending">معلق</SelectItem>
              <SelectItem value="blocked">محظور</SelectItem>
            </SelectContent>
          </Select>

          {(filters.search || filters.role !== "all" || filters.status !== "all") && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClearFilters}
                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="مسح الفلاتر"
              >
                  <X className="h-5 w-5" />
              </Button>
          )}
        </div>
      </div>
    </div>
  );
}
