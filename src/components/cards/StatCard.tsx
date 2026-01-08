import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success';
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const variants = {
    default: 'bg-card',
    primary: 'gradient-primary text-primary-foreground',
    accent: 'gradient-accent text-accent-foreground',
    success: 'bg-success text-success-foreground',
  };

  const iconVariants = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-primary-foreground/20 text-primary-foreground',
    accent: 'bg-accent-foreground/20 text-accent-foreground',
    success: 'bg-success-foreground/20 text-success-foreground',
  };

  return (
    <div className={cn(
      'p-6 rounded-2xl shadow-card card-hover',
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm font-medium flex items-center gap-1',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
              <span className={variant === 'default' ? 'text-muted-foreground' : 'opacity-70'}>
                هذا الأسبوع
              </span>
            </p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl',
          iconVariants[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
