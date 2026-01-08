import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AccommodationFiltersProps {
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    selectedType: 'all' | 'private' | 'shared';
    setSelectedType: (type: 'all' | 'private' | 'shared') => void;
    onReset: () => void;
}

export const AccommodationFilters = ({
    priceRange,
    setPriceRange,
    selectedType,
    setSelectedType,
    onReset,
}: AccommodationFiltersProps) => {
    return (
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
                            onClick={() => setSelectedType(type.value as 'all' | 'private' | 'shared')}
                        >
                            {type.label}
                        </Badge>
                    ))}
                </div>
            </div>

            <Button
                variant="ghost"
                onClick={onReset}
            >
                إعادة ضبط الفلاتر
            </Button>
        </div>
    );
};
