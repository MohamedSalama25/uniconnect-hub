import { MessageCircle, Clock, User, Home, GraduationCap, Users, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HelpRequest } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface HelpRequestCardProps {
  helpRequest: HelpRequest;
}

const categoryConfig: Record<HelpRequest['category'], { 
  icon: LucideIcon; 
  label: string; 
  color: string;
}> = {
  housing: { icon: Home, label: 'سكن', color: 'bg-primary/10 text-primary border-primary/20' },
  academic: { icon: GraduationCap, label: 'أكاديمي', color: 'bg-accent/10 text-accent border-accent/20' },
  social: { icon: Users, label: 'اجتماعي', color: 'bg-success/10 text-success border-success/20' },
  emergency: { icon: AlertTriangle, label: 'طوارئ', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  other: { icon: HelpCircle, label: 'أخرى', color: 'bg-muted text-muted-foreground border-border' },
};

export function HelpRequestCard({ helpRequest }: HelpRequestCardProps) {
  const config = categoryConfig[helpRequest.category];
  const Icon = config.icon;

  return (
    <div className={cn(
      'bg-card rounded-2xl p-5 shadow-card card-hover border-r-4',
      helpRequest.category === 'emergency' ? 'border-r-destructive' : 'border-r-primary'
    )}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg line-clamp-1">{helpRequest.title}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{helpRequest.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{helpRequest.timePosted}</span>
              </div>
            </div>
          </div>
          <Badge className={cn('border', config.color)}>
            <Icon className="w-3.5 h-3.5 ml-1" />
            {config.label}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2">
          {helpRequest.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>{helpRequest.responses} ردود</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="btn-hover">
              <MessageCircle className="w-4 h-4 ml-2" />
              تواصل خاص
            </Button>
            <Button size="sm" className="btn-hover">
              رد على الطلب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
