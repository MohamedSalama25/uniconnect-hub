import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { accommodations as allAccommodations } from '@/data/mockData';
import { AccommodationFilters } from '../components/AccommodationFilters';
import { AccommodationList } from '../components/AccommodationList';
import { AddAccommodationDialog } from '@/components/globalComponents/AddAccommodationDialog';
import { Plus } from 'lucide-react';

export const AccommodationListTemplate = () => {
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedType, setSelectedType] = useState<'all' | 'private' | 'shared'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredAccommodations = allAccommodations.filter(acc => {
        const priceMatch = acc.price >= priceRange[0] && acc.price <= priceRange[1];
        const typeMatch = selectedType === 'all' || acc.type === selectedType;
        const searchMatch = acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.location.toLowerCase().includes(searchQuery.toLowerCase());
        return priceMatch && typeMatch && searchMatch;
    });

    const handleReset = () => {
        setPriceRange([0, 10000]);
        setSelectedType('all');
        setSearchQuery("");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">السكن المتاح</h1>
                        <p className="text-muted-foreground mt-1">
                            {filteredAccommodations.length} وحدة سكنية متاحة
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <AddAccommodationDialog
                            trigger={
                                <Button className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4" />
                                    <span>إضافة سكن</span>
                                </Button>
                            }
                        />
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
                <AccommodationList
                    accommodations={filteredAccommodations}
                    onResetFilters={handleReset}
                />
            </div>
        </DashboardLayout>
    );
};
