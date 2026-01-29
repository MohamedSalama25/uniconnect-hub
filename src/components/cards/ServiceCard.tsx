import { MapPin, Star, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/features/services/types/service.types';
import { IconRenderer } from '@/components/globalComponents/IconRenderer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();
  const { fullProfile } = useAuthStore();
  const categoryIcon = service.serviceCategoryName?.toLowerCase() || "briefcase";

  const formatTime = (time: any) => {
    if (!time) return "";
    if (typeof time === 'string') return time.split(':').slice(0, 2).join(':');
    if (time.hours !== undefined && time.minutes !== undefined) {
      return `${time.hours}:${time.minutes.toString().padStart(2, '0')}`;
    }
    return "";
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-white/5 shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
      <div className="flex items-start gap-5">
        {/* Icon */}
        <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
          <IconRenderer name={categoryIcon} size={28} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-black text-xl tracking-tight group-hover:text-primary transition-colors">{service.name}</h3>
              <Badge variant="secondary" className="mt-2 bg-primary/5 text-primary border-none font-bold px-3">
                {service.serviceCategoryName}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-black text-sm">{1}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-primary/70" />
              <span className="line-clamp-1">{service.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary/70" />
              <span dir="ltr">{service.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>
                {formatTime(service.workingFrom)} - {formatTime(service.workingTo)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              size="sm"
              className="rounded-xl px-6 font-bold bg-primary hover:scale-105 transition-transform h-10"
              onClick={() => window.location.href = `tel:${service.phone}`}
            >
              <Phone className="w-4 h-4 ml-2" />
              اتصل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-6 font-bold border-muted hover:bg-muted/50 transition-colors h-10"
              onClick={() => window.open(`https://www.google.com/maps?q=${service.latitude},${service.longitude}`, '_blank')}
            >
              <MapPin className="w-4 h-4 ml-2" />
              الاتجاهات
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl px-6 font-bold bg-muted/50 hover:bg-muted transition-colors h-10 w-full sm:w-auto"
              onClick={() => navigate(`/service/${service.id}`)}
            >
              التفاصيل
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
