import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { services as allServices, Service } from '@/data/mockData';
import { AddServiceModal } from '@/components/services/AddServiceModal';
import { ServiceFilters } from '../components/ServiceFilters';
import { ServiceList } from '../components/ServiceList';

export const ServiceListTemplate = () => {
    const [selectedCategory, setSelectedCategory] = useState<Service['category'] | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredServices = allServices.filter(service => {
        const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
        const searchMatch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
    });

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
                            <h1 className="text-2xl md:text-3xl font-bold">الخدمات القريبة</h1>
                            <p className="text-muted-foreground mt-1">
                                {filteredServices.length} خدمة متاحة في منطقتك
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
                <ServiceList
                    services={filteredServices}
                    onResetFilters={handleReset}
                />
            </div>
        </DashboardLayout>
    );
};
