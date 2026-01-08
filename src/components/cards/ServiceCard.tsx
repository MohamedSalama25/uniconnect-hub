import { MapPin, Star, Phone, Clock, Utensils, Pill, Hospital, Shirt, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Service } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const categoryConfig: Record<Service['category'], { 
  icon: LucideIcon; 
  label: string; 
  color: string;
}> = {
  restaurant: { icon: Utensils, label: 'مطعم', color: 'bg-accent text-accent-foreground' },
  pharmacy: { icon: Pill, label: 'صيدلية', color: 'bg-success text-success-foreground' },
  hospital: { icon: Hospital, label: 'مستشفى', color: 'bg-destructive text-destructive-foreground' },
  laundry: { icon: Shirt, label: 'مغسلة', color: 'bg-primary text-primary-foreground' },
  transportation: { icon: Bus, label: 'مواصلات', color: 'bg-secondary text-secondary-foreground' },
};

export function ServiceCard({ service }: ServiceCardProps) {
  const config = categoryConfig[service.category];
  const Icon = config.icon;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card card-hover">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn('p-3 rounded-xl', config.color)}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">{service.name}</h3>
              <Badge variant="outline" className="mt-1">
                {config.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{service.rating}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{service.address}</span>
              <span className="text-primary font-medium">({service.distance} كم)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span dir="ltr">{service.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{service.hours}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="btn-hover">
              <Phone className="w-4 h-4 ml-2" />
              اتصل
            </Button>
            <Button variant="outline" size="sm" className="btn-hover">
              <MapPin className="w-4 h-4 ml-2" />
              الاتجاهات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
