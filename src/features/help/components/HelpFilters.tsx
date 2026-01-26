import { useQuery } from '@tanstack/react-query';
import { helpRequestService } from '../services/help-request.service';
import { HelpCircle, Home, GraduationCap, Users, AlertTriangle, LucideIcon, CreditCard, Settings, MessageSquare, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HelpFiltersProps {
    selectedTypeId: string | 'all';
    setSelectedTypeId: (id: string | 'all') => void;
}

const getIconForType = (name: string): LucideIcon => {
    const n = name?.toLowerCase() || "";
    if (n.includes('سكن') || n.includes('house')) return Home;
    if (n.includes('أكاد') || n.includes('acad')) return GraduationCap;
    if (n.includes('اجتما') || n.includes('socia')) return Users;
    if (n.includes('طوارئ') || n.includes('emergen')) return AlertTriangle;
    if (n.includes('دفع') || n.includes('pay') || n.includes('مال')) return CreditCard;
    if (n.includes('تقن') || n.includes('tech') || n.includes('مشكل')) return Settings;
    if (n.includes('عام') || n.includes('gener') || n.includes('استفس')) return MessageSquare;
    return Info;
};

export const HelpFilters = ({ selectedTypeId, setSelectedTypeId }: HelpFiltersProps) => {
    const { data: typesData } = useQuery({
        queryKey: ['help-request-types'],
        queryFn: () => helpRequestService.getRequestTypes({ pageSize: 100 }),
    });

    const types = typesData?.data || [];

    return (
        <div className="flex flex-wrap items-center justify-start gap-3 py-4" dir="rtl">
            <Badge
                variant={selectedTypeId === 'all' ? "default" : "outline"}
                className={`cursor-pointer px-6 py-3.5 text-sm font-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-3 rounded-2xl border-none ${selectedTypeId === 'all'
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)] ring-2 ring-primary/20"
                    : "bg-[#161b22] text-muted-foreground hover:bg-[#1c2128] hover:text-foreground shadow-lg shadow-black/20"
                    }`}
                onClick={() => setSelectedTypeId('all')}
            >
                <HelpCircle className="w-4 h-4" />
                <span>الكل</span>
            </Badge>

            {types.map((type) => {
                const Icon = getIconForType(type.name);
                const isSelected = selectedTypeId === type.id.toString();

                return (
                    <Badge
                        key={type.id}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer px-6 py-3.5 text-sm font-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-3 rounded-2xl border-none ${isSelected
                            ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)] ring-2 ring-primary/20"
                            : "bg-[#161b22] text-muted-foreground hover:bg-[#1c2128] hover:text-foreground shadow-lg shadow-black/20"
                            }`}
                        onClick={() => setSelectedTypeId(type.id.toString())}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{type.name}</span>
                    </Badge>
                );
            })}
        </div>
    );
};
