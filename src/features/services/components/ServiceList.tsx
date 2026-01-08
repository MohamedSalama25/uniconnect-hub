import { Briefcase } from 'lucide-react';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EmptyState } from '@/components/ui/empty-state';
import type { Service } from '@/data/mockData';

interface ServiceListProps {
    services: Service[];
    onResetFilters: () => void;
}

export const ServiceList = ({ services, onResetFilters }: ServiceListProps) => {
    if (services.length === 0) {
        return (
            <EmptyState
                icon={Briefcase}
                title="لا توجد نتائج"
                description="لم نعثر على خدمات تطابق معايير البحث. جرب البحث بكلمات مختلفة."
                actionLabel="عرض جميع الخدمات"
                onAction={onResetFilters}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => (
                <div
                    key={service.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <ServiceCard service={service} />
                </div>
            ))}
        </div>
    );
};
