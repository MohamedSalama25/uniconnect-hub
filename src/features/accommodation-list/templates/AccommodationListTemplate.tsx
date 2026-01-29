import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AccommodationFilters } from '../components/AccommodationFilters';
import { AccommodationList } from '../components/AccommodationList';
import { houseService } from '../services/house.service';
import { useQuery } from '@tanstack/react-query';
import { House } from '../types/house.types';
import { CustomLoader } from '@/components/ui/loader';
import { mapHouseToAccommodation } from '@/lib/house-mapper';

export const AccommodationListTemplate = () => {
    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [selectedType, setSelectedType] = useState<'all' | 'private' | 'shared'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ['public-houses', searchQuery, selectedType],
        queryFn: () => houseService.getAllHouses({
            Search: searchQuery,
            TypeId: selectedType === 'private' ? 1 : selectedType === 'shared' ? 2 : undefined, // Assuming IDs
        })
    });


    const filteredAccommodations = (data?.data || []).map(mapHouseToAccommodation).filter(acc => {
        const priceMatch = acc.price >= priceRange[0] && acc.price <= priceRange[1];
        return priceMatch;
    });

    const handleReset = () => {
        setPriceRange([0, 500000]);
        setSelectedType('all');
        setSearchQuery("");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in ">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">السكن المتاح</h1>
                        <p className="text-muted-foreground mt-1">
                            {isLoading ? "" : `${filteredAccommodations.length} وحدة سكنية متاحة`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="ابحث عن سكن..."
                                className="pr-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant={showFilters ? "default" : "outline"}
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn-hover"
                        >
                            <SlidersHorizontal className="w-4 h-4 ml-2" />
                            فلترة
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <AccommodationFilters
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        onReset={handleReset}
                    />
                )}

                {/* Accommodations Grid */}
                <div className="relative min-h-[400px]">
                    {isLoading ? (
                        <CustomLoader className="min-h-[400px] rounded-3xl" />
                    ) : (
                        <AccommodationList
                            accommodations={filteredAccommodations}
                            onResetFilters={handleReset}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
