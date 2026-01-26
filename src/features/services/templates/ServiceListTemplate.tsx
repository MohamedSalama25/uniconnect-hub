import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AddServiceModal } from '@/components/services/AddServiceModal';
import { ServiceFilters } from '../components/ServiceFilters';
import { ServiceList } from '../components/ServiceList';
import { usePublicServices } from '../hooks/useServices';
import { Loader2 } from 'lucide-react';

export const ServiceListTemplate = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: servicesData, isLoading } = usePublicServices({
        Search: searchQuery || undefined,
        CatogeryId: selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined,
        PageSize: 100
    });

    const services = servicesData?.data || [];

    const handleReset = () => {
        setSelectedCategory('all');
        setSearchQuery('');
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in text-right">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">الخدمات القريبة</h1>
                            <p className="text-muted-foreground mt-1 font-bold">
                                {servicesData?.count || 0} خدمة متاحة في منطقتك
                            </p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2 rounded-full px-6">
                            <Plus className="w-4 h-4" />
                            إضافة خدمة
                        </Button>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="ابحث عن خدمة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-10 text-right"
                        />
                    </div>
                </div>

                <AddServiceModal open={isModalOpen} onOpenChange={setIsModalOpen} />

                {/* Category Filters */}
                <ServiceFilters
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* Services Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="font-bold text-muted-foreground">جاري تحميل الخدمات...</p>
                    </div>
                ) : (
                    <ServiceList
                        services={services as any}
                        onResetFilters={handleReset}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};
