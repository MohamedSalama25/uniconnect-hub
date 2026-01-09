import { MapPin, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { mapFiltersConfig } from './MapFiltersPanel';
import { accommodations, services } from '@/data/mockData';

interface MapViewProps {
    activeFilters: string[];
}

// Helper to generate a consistent "random" position for pins based on ID and type
const getPosition = (id: string, index: number, type: string) => {
    const seed = parseInt(id) || index;
    // Map items to different clusters but with offsets to avoid stacking
    let baseTop = 15 + (seed * 13) % 70;
    let baseRight = 10 + (seed * 17) % 80;

    // Add micro-offsets based on type to prevent exact stacking
    const offset = type === 'accommodation' ? 0 : type === 'service' ? 3 : 6;

    return {
        top: `${baseTop + offset}%`,
        right: `${baseRight + offset}%`,
        animationDelay: `${(seed % 5) * 0.5}s`
    };
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
};

export const MapView = ({ activeFilters }: MapViewProps) => {
    const navigate = useNavigate();

    // Retrieve user location from localStorage
    const savedLocation = localStorage.getItem('location');
    const userLocation = savedLocation ? JSON.parse(savedLocation) : null;

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

                    {/* Accommodation Pins */}
                    {activeFilters.includes('accommodations') && accommodations.map((item, idx) => (
                        <MapPinMarker
                            key={`acc-${item.id}`}
                            item={item}
                            type="accommodation"
                            position={getPosition(item.id, idx, 'accommodation')}
                            color="text-primary"
                            onNavigate={() => navigate(`/accommodation/${item.id}`)}
                            userLocation={userLocation}
                        />
                    ))}

                    {/* Service Pins */}
                    {activeFilters.includes('services') && services.filter(s => s.category !== 'transportation').map((item, idx) => (
                        <MapPinMarker
                            key={`ser-${item.id}`}
                            item={item}
                            type="service"
                            position={getPosition(item.id, idx, 'service')}
                            color="text-accent"
                            onNavigate={() => navigate(`/service/${item.id}`)}
                            userLocation={userLocation}
                        />
                    ))}

                    {/* Transportation Pins */}
                    {activeFilters.includes('transportation') && services.filter(s => s.category === 'transportation').map((item, idx) => (
                        <MapPinMarker
                            key={`tra-${item.id}`}
                            item={item}
                            type="transportation"
                            position={getPosition(item.id, idx, 'transportation')}
                            color="text-success"
                            onNavigate={() => navigate(`/service/${item.id}`)}
                            userLocation={userLocation}
                        />
                    ))}

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
                <div className="absolute top-4 right-4 flex flex-wrap gap-2 pointer-events-none">
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

interface MapPinMarkerProps {
    item: any;
    type: 'accommodation' | 'service' | 'transportation';
    position: { top: string; right: string; animationDelay: string };
    color: string;
    onNavigate: () => void;
    userLocation: { lat: number; lng: number } | null;
}

const MapPinMarker = ({ item, type, position, color, onNavigate, userLocation }: MapPinMarkerProps) => {
    // Calculate distance if both user location and item coordinates exist
    const distance = userLocation && item.lat && item.lng
        ? calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng)
        : null;

    return (
        <div className="absolute w-8 h-8 group" style={{ top: position.top, right: position.right }}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={`${color} fill-current/20 animate-bounce-slow hover:scale-125 transition-transform outline-none`}
                        style={{ animationDelay: position.animationDelay }}
                    >
                        <MapPin className="w-8 h-8" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-none shadow-2xl rounded-2xl overflow-hidden w-64 animate-in fade-in zoom-in-95" side="top" align="center" sideOffset={10}>
                    <div className="bg-card text-card-foreground">
                        {item.image && (
                            <div className="h-24 w-full overflow-hidden">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-4 space-y-3" dir="rtl">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm line-clamp-1">{item.title || item.name}</h4>
                                <Badge variant="secondary" className="text-[10px] h-4">
                                    {type === 'accommodation' ? 'سكن' : type === 'service' ? 'خدمة' : 'مواصلات'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{item.location || item.address}</span>
                            </div>
                            {distance !== null && (
                                <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                                    <span>📍</span>
                                    <span>
                                        {(distance / 1000).toFixed(1)} كم منك
                                    </span>
                                </div>
                            )}
                            <Button
                                size="sm"
                                className="w-full rounded-xl gap-2 h-8 text-xs font-bold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate();
                                }}
                            >
                                <Info className="w-3 h-3" /> عرض التفاصيل
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
