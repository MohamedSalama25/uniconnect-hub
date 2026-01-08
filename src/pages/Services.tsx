import { useState } from 'react';
import { Search, Utensils, Pill, Hospital, Shirt, Bus, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EmptyState } from '@/components/ui/empty-state';
import { services, Service } from '@/data/mockData';
import { LucideIcon } from 'lucide-react';

const categories: { id: Service['category'] | 'all'; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'الكل', icon: Briefcase },
  { id: 'restaurant', label: 'مطاعم', icon: Utensils },
  { id: 'pharmacy', label: 'صيدليات', icon: Pill },
  { id: 'hospital', label: 'مستشفيات', icon: Hospital },
  { id: 'laundry', label: 'مغاسل', icon: Shirt },
  { id: 'transportation', label: 'مواصلات', icon: Bus },
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<Service['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => {
    const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
    const searchMatch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">الخدمات القريبة</h1>
            <p className="text-muted-foreground mt-1">
              {filteredServices.length} خدمة متاحة في منطقتك
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث عن خدمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 flex items-center gap-2"
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </Badge>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {filteredServices.map((service, index) => (
              <div 
                key={service.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="لا توجد نتائج"
            description="لم نعثر على خدمات تطابق معايير البحث. جرب البحث بكلمات مختلفة."
            actionLabel="عرض جميع الخدمات"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Services;
