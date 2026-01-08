import { Utensils, Pill, Hospital, Shirt, Bus, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Service } from '@/data/mockData';
import { LucideIcon } from 'lucide-react';

export const categories: { id: Service['category'] | 'all'; label: string; icon: LucideIcon }[] = [
    { id: 'all', label: 'الكل', icon: Briefcase },
    { id: 'restaurant', label: 'مطاعم', icon: Utensils },
    { id: 'pharmacy', label: 'صيدليات', icon: Pill },
    { id: 'hospital', label: 'مستشفيات', icon: Hospital },
    { id: 'laundry', label: 'مغاسل', icon: Shirt },
    { id: 'transportation', label: 'مواصلات', icon: Bus },
];

interface ServiceFiltersProps {
    selectedCategory: Service['category'] | 'all';
    setSelectedCategory: (category: Service['category'] | 'all') => void;
}

export const ServiceFilters = ({ selectedCategory, setSelectedCategory }: ServiceFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
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
