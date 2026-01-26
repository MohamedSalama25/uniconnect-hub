import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { adminSettingsService } from '@/features/admin-settings/services/admin-settings.service';
import { IconRenderer } from '@/components/globalComponents/IconRenderer';
import { Briefcase } from 'lucide-react';

interface ServiceFiltersProps {
    selectedCategory: string | 'all';
    setSelectedCategory: (category: string | 'all') => void;
}

export const ServiceFilters = ({ selectedCategory, setSelectedCategory }: ServiceFiltersProps) => {
    const { data: categoriesData } = useQuery({
        queryKey: ["service-categories"],
        queryFn: () => adminSettingsService.getServiceCategories({ pageSize: 100 }),
    });
    const categories = categoriesData?.data || [];

    return (
        <div className="flex flex-wrap gap-3">
            <Badge
                variant={selectedCategory === 'all' ? "default" : "outline"}
                className="cursor-pointer px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 flex items-center gap-2 border-primary/20"
                onClick={() => setSelectedCategory('all')}
            >
                <Briefcase className="w-4 h-4" />
                الكل
            </Badge>
            {categories.map((category) => (
                <Badge
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                    className="cursor-pointer px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 flex items-center gap-2 border-primary/20 shadow-sm"
                    onClick={() => setSelectedCategory(category.id.toString())}
                >
                    <IconRenderer name={category.icon?.toLowerCase() || ""} size={16} />
                    {category.name}
                </Badge>
            ))}
        </div>
    );
};
