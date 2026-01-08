import { useState } from 'react';
import { MapPin, Building, Briefcase, Bus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const mapFilters = [
  { id: 'accommodations', label: 'السكن', icon: Building, color: 'bg-primary' },
  { id: 'services', label: 'الخدمات', icon: Briefcase, color: 'bg-accent' },
  { id: 'transportation', label: 'المواصلات', icon: Bus, color: 'bg-success' },
];

const MapPage = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>(['accommodations', 'services', 'transportation']);
  const [showFilters, setShowFilters] = useState(true);

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">خريطة المنطقة</h1>
            <p className="text-muted-foreground mt-1">
              استكشف السكن والخدمات القريبة منك
            </p>
          </div>
          
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="btn-hover"
          >
            <Filter className="w-4 h-4 ml-2" />
            إظهار الفلاتر
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-72 space-y-4 animate-scale-in">
              <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                <h3 className="font-semibold">إظهار على الخريطة</h3>
                
                {mapFilters.map((filter) => (
                  <div 
                    key={filter.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => toggleFilter(filter.id)}
                  >
                    <Checkbox 
                      checked={activeFilters.includes(filter.id)}
                      onCheckedChange={() => toggleFilter(filter.id)}
                    />
                    <div className={`p-2 rounded-lg ${filter.color} text-primary-foreground`}>
                      <filter.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{filter.label}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                <h3 className="font-semibold">دليل الألوان</h3>
                
                <div className="space-y-3">
                  {mapFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${filter.color}`} />
                      <span className="text-sm">{filter.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Map Placeholder */}
          <div className="flex-1">
            <div className="relative bg-card rounded-2xl shadow-card overflow-hidden h-[500px] lg:h-[600px]">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary">
                {/* Grid Pattern */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                      linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />
                
                {/* Sample Map Pins */}
                {activeFilters.includes('accommodations') && (
                  <>
                    <MapPin className="absolute top-1/4 right-1/3 w-8 h-8 text-primary fill-primary/20 animate-bounce" style={{ animationDelay: '0s' }} />
                    <MapPin className="absolute top-1/2 right-1/4 w-8 h-8 text-primary fill-primary/20 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <MapPin className="absolute top-1/3 left-1/3 w-8 h-8 text-primary fill-primary/20 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </>
                )}
                
                {activeFilters.includes('services') && (
                  <>
                    <MapPin className="absolute top-2/3 right-1/2 w-8 h-8 text-accent fill-accent/20 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <MapPin className="absolute bottom-1/4 left-1/4 w-8 h-8 text-accent fill-accent/20 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </>
                )}
                
                {activeFilters.includes('transportation') && (
                  <>
                    <MapPin className="absolute bottom-1/3 right-1/4 w-8 h-8 text-success fill-success/20 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <MapPin className="absolute top-1/4 left-1/4 w-8 h-8 text-success fill-success/20 animate-bounce" style={{ animationDelay: '0.35s' }} />
                  </>
                )}
                
                {/* Center Marker (You are here) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-destructive rounded-full animate-ping absolute" />
                    <div className="w-6 h-6 bg-destructive rounded-full relative z-10 border-4 border-card" />
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="rounded-xl shadow-lg">
                  +
                </Button>
                <Button size="icon" variant="secondary" className="rounded-xl shadow-lg">
                  −
                </Button>
              </div>

              {/* Active Filters Display */}
              <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                {activeFilters.map((filterId) => {
                  const filter = mapFilters.find(f => f.id === filterId);
                  if (!filter) return null;
                  return (
                    <Badge 
                      key={filterId} 
                      className={`${filter.color} text-primary-foreground`}
                    >
                      <filter.icon className="w-3 h-3 ml-1" />
                      {filter.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MapPage;
