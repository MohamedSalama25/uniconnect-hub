import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { Service } from '@/features/services/types/service.types';
import { useNavigate } from 'react-router-dom';

interface DashboardServicesProps {
    services: Service[];
}

export const DashboardServices = ({ services }: DashboardServicesProps) => {
    const navigate = useNavigate();

    return (
        <section className="space-y-4 text-right">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">خدمات قريبة</h2>
                <Button variant="ghost" className="text-primary" onClick={() => navigate('/services')}>
                    عرض الكل
                </Button>
            </div>

            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {services.slice(0, 3).map((service, index) => (
                        <div key={service.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 text-center border border-dashed border-primary/20">
                    <p className="text-muted-foreground font-bold text-lg">سيتم إضافة الخدمات قريباً </p>
                </div>
            )}
        </section>
    );
};
