import { Button } from '@/components/ui/button';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { House } from '@/features/accommodation-list/types/house.types';
import { mapHouseToAccommodation } from '@/lib/house-mapper';
import { useNavigate } from 'react-router-dom';

interface DashboardRecommendedProps {
    accommodations: House[];
}

export const DashboardRecommended = ({ accommodations }: DashboardRecommendedProps) => {
    const navigate = useNavigate();

    return (
        <section className="space-y-4 text-right">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">السكن الموصى به</h2>
                <Button variant="ghost" className="text-primary" onClick={() => navigate('/accommodations')}>
                    عرض الكل
                </Button>
            </div>

            {accommodations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {accommodations.slice(0, 3).map((accommodation, index) => (
                        <div key={accommodation.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <AccommodationCard accommodation={mapHouseToAccommodation(accommodation)} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 text-center border border-dashed border-primary/20">
                    <p className="text-muted-foreground font-bold text-lg">سيتم إضافة وحدات سكنية قريباً </p>
                </div>
            )}
        </section>
    );
};
