import { Building } from 'lucide-react';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { EmptyState } from '@/components/ui/empty-state';
import type { Accommodation } from '@/data/mockData';

interface AccommodationListProps {
    accommodations: Accommodation[];
    onResetFilters: () => void;
}

export const AccommodationList = ({ accommodations, onResetFilters }: AccommodationListProps) => {
    if (accommodations.length === 0) {
        return (
            <EmptyState
                icon={Building}
                title="لا توجد نتائج"
                description="لم نعثر على سكن يطابق معايير البحث. جرب تعديل الفلاتر."
                actionLabel="إعادة ضبط الفلاتر"
                onAction={onResetFilters}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {accommodations.map((accommodation, index) => (
                <div
                    key={accommodation.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <AccommodationCard accommodation={accommodation} />
                </div>
            ))}
        </div>
    );
};
