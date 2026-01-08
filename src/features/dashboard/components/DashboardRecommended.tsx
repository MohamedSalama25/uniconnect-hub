import { Button } from '@/components/ui/button';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import type { accommodations } from '@/data/mockData';

interface DashboardRecommendedProps {
    accommodations: typeof accommodations;
}

export const DashboardRecommended = ({ accommodations }: DashboardRecommendedProps) => {
    return (
        <section className="space-y-4 text-right">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">السكن الموصى به</h2>
                <Button variant="ghost" className="text-primary">
                    عرض الكل
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {accommodations.slice(0, 3).map((accommodation, index) => (
                    <div key={accommodation.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <AccommodationCard accommodation={accommodation} />
                    </div>
                ))}
            </div>
        </section>
    );
};
