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
        <div className="relative flex-1 max-w-[300px]">
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
            <SelectTrigger dir="rtl" className="w-full md:w-[150px] h-12 bg-muted/40 border-none rounded-2xl focus:ring-1 focus:ring-primary/20 transition-all font-bold text-sm">
              <SelectValue placeholder="كل الأدوار" />
            </SelectTrigger>
            <SelectContent dir="rtl" className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all" className="font-bold">كل الأدوار</SelectItem>
              <SelectItem value="Admin" className="font-bold">مشرف</SelectItem>
              <SelectItem value="Student" className="font-bold">طالب</SelectItem>
              <SelectItem value="Service" className="font-bold">مقدم خدمة</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger dir="rtl" className="w-full md:w-[150px] h-12 bg-muted/40 border-none rounded-2xl focus:ring-1 focus:ring-primary/20 transition-all font-bold text-sm">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent dir="rtl" className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all" className="font-bold">كل الحالات</SelectItem>
              <SelectItem value="active" className="font-bold">نشط</SelectItem>
              <SelectItem value="pending" className="font-bold">معلق</SelectItem>
              <SelectItem value="blocked" className="font-bold">محظور</SelectItem>
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
