import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mapFiltersConfig } from './MapFiltersPanel';

interface MapViewProps {
    activeFilters: string[];
}

export const MapView = ({ activeFilters }: MapViewProps) => {
    return (
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
                        const filter = mapFiltersConfig.find(f => f.id === filterId);
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
    );
};
