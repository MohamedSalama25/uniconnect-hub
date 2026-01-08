import { useState } from 'react';
import { Search, SlidersHorizontal, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { EmptyState } from '@/components/ui/empty-state';
import { accommodations } from '@/data/mockData';

const Accommodations = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedType, setSelectedType] = useState<'all' | 'private' | 'shared'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAccommodations = accommodations.filter(acc => {
    const priceMatch = acc.price >= priceRange[0] && acc.price <= priceRange[1];
    const typeMatch = selectedType === 'all' || acc.type === selectedType;
    return priceMatch && typeMatch;
  });

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
          
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن سكن..."
                className="pr-10"
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
          <div className="bg-card rounded-2xl p-6 shadow-card animate-scale-in space-y-6">
            <h3 className="font-semibold">خيارات الفلترة</h3>
            
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">نطاق السعر (جنيه/شهر)</label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0]} جنيه</span>
                <span>{priceRange[1]} جنيه</span>
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">نوع السكن</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'الكل' },
                  { value: 'private', label: 'خاص' },
                  { value: 'shared', label: 'مشترك' },
                ].map((type) => (
                  <Badge
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
                    onClick={() => setSelectedType(type.value as typeof selectedType)}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setPriceRange([0, 10000]);
                setSelectedType('all');
              }}
            >
              إعادة ضبط الفلاتر
            </Button>
          </div>
        )}

        {/* Accommodations Grid */}
        {filteredAccommodations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredAccommodations.map((accommodation, index) => (
              <div 
                key={accommodation.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AccommodationCard accommodation={accommodation} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building}
            title="لا توجد نتائج"
            description="لم نعثر على سكن يطابق معايير البحث. جرب تعديل الفلاتر."
            actionLabel="إعادة ضبط الفلاتر"
            onAction={() => {
              setPriceRange([0, 10000]);
              setSelectedType('all');
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Accommodations;
