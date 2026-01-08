import { Building, Briefcase, Bus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export const mapFiltersConfig = [
    { id: 'accommodations', label: 'السكن', icon: Building, color: 'bg-primary' },
    { id: 'services', label: 'الخدمات', icon: Briefcase, color: 'bg-accent' },
    { id: 'transportation', label: 'المواصلات', icon: Bus, color: 'bg-success' },
];

interface MapFiltersPanelProps {
    activeFilters: string[];
    toggleFilter: (filterId: string) => void;
}

export const MapFiltersPanel = ({ activeFilters, toggleFilter }: MapFiltersPanelProps) => {
    return (
        <div className="lg:w-72 space-y-4 animate-scale-in text-right">
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                <h3 className="font-semibold text-right">إظهار على الخريطة</h3>

                {mapFiltersConfig.map((filter) => (
                    <div
                        key={filter.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer justify-end"
                        onClick={() => toggleFilter(filter.id)}
                    >
                        <span className="font-medium flex-1 text-right">{filter.label}</span>
                        <div className={`p-2 rounded-lg ${filter.color} text-primary-foreground`}>
                            <filter.icon className="w-4 h-4" />
                        </div>
                        <Checkbox
                            checked={activeFilters.includes(filter.id)}
                            onCheckedChange={() => toggleFilter(filter.id)}
                        />
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                <h3 className="font-semibold text-right">دليل الألوان</h3>

                <div className="space-y-3">
                    {mapFiltersConfig.map((filter) => (
                        <div key={filter.id} className="flex items-center gap-3 justify-end">
                            <span className="text-sm">{filter.label}</span>
                            <div className={`w-4 h-4 rounded-full ${filter.color}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
