import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MapFiltersPanel } from '../components/MapFiltersPanel';
import { MapView } from '../components/MapView';

export const MapTemplate = () => {
    const [activeFilters, setActiveFilters] = useState<string[]>(['accommodations', 'services']);
    const [showFilters, setShowFilters] = useState(true);

    const toggleFilter = (filterId: string) => {
        setActiveFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in text-right">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">خريطة المنطقة</h1>
                        <p className="text-muted-foreground mt-1">
                            استكشف السكن والخدمات القريبة منك
                        </p>
                    </div>

                    <Button
                        variant={showFilters ? "default" : "outline"}
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn-hover"
                    >
                        <Filter className="w-4 h-4 ml-2" />
                        إظهار الفلاتر
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <MapFiltersPanel
                            activeFilters={activeFilters}
                            toggleFilter={toggleFilter}
                        />
                    )}

                    {/* Map Area */}
                    <MapView activeFilters={activeFilters} />
                </div>
            </div>
        </DashboardLayout>
    );
};
