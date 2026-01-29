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
    <div className="bg-card/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-2xl hover:shadow-primary/10 transition-all duration-500 group relative overflow-hidden flex flex-col h-full text-right" dir="rtl">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />

      <div className="relative flex flex-col h-full space-y-3">
        {/* Header: Icon & Rating (Icons on the right in RTL) */}
        <div className="flex items-center justify-between flex-row">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
            <IconRenderer name={categoryIcon} size={20} />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-black text-[10px] leading-none">{(service.servicesAverageRating || 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <h3 className="font-black text-xl md:text-2xl tracking-tight group-hover:text-primary transition-colors line-clamp-1 leading-tight">
              {service.name}
            </h3>
            <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold px-2.5 py-1 rounded-lg text-[11px]">
              {service.serviceCategoryName}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground font-semibold pt-1">
            <div className="flex items-center gap-2.5 group/item">
              <MapPin className="w-4.5 h-4.5 text-primary/70 shrink-0" />
              <span className="line-clamp-1 flex-1 text-right group-hover/item:text-foreground transition-colors">{service.address}</span>
            </div>
            <div className="flex items-center gap-2.5 group/item">
              <Phone className="w-4.5 h-4.5 text-primary/70 shrink-0" />
              <span dir="ltr" className="group-hover/item:text-foreground transition-colors">{service.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 group/item">
              <Clock className="w-4.5 h-4.5 text-primary/70 shrink-0" />
              <span className="group-hover/item:text-foreground transition-colors">
                {formatTime(service.workingFrom)} - {formatTime(service.workingTo)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            size="sm"
            className="rounded-lg font-black bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all h-10 text-xs shadow-lg shadow-primary/20 p-0"
            onClick={() => window.location.href = `tel:${service.phone}`}
          >
            اتصل
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg font-black border-white/10 bg-white/5 hover:bg-primary/10 hover:text-primary transition-all h-10 text-xs p-0"
            onClick={() => window.open(`https://www.google.com/maps?q=${service.latitude},${service.longitude}`, '_blank')}
          >
            الموقع
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-lg font-black bg-muted/40 hover:bg-muted/60 transition-all h-10 text-xs p-0"
            onClick={() => navigate(`/service/${service.id}`)}
          >
            التفاصيل
          </Button>
        </div>
      </div>
    </div>
  );
}
