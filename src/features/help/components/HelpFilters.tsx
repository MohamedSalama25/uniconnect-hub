import { Home, GraduationCap, Users, AlertTriangle, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { HelpRequest } from '@/data/mockData';
import { LucideIcon } from 'lucide-react';

export const helpCategories: { id: HelpRequest['category'] | 'all'; label: string; icon: LucideIcon }[] = [
    { id: 'all', label: 'الكل', icon: HelpCircle },
    { id: 'housing', label: 'سكن', icon: Home },
    { id: 'academic', label: 'أكاديمي', icon: GraduationCap },
    { id: 'social', label: 'اجتماعي', icon: Users },
    { id: 'emergency', label: 'طوارئ', icon: AlertTriangle },
];

interface HelpFiltersProps {
    selectedCategory: HelpRequest['category'] | 'all';
    setSelectedCategory: (category: HelpRequest['category'] | 'all') => void;
}

export const HelpFilters = ({ selectedCategory, setSelectedCategory }: HelpFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {helpCategories.map((category) => (
                <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 flex items-center gap-2"
                    onClick={() => setSelectedCategory(category.id)}
                >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                </Badge>
            ))}
        </div>
    );
};
