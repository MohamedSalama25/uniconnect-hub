import { MapPin, Info, ArrowLeft, Loader2, Navigation, LocateFixed } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { mapFiltersConfig } from './MapFiltersPanel';
import { houseService } from '@/features/accommodation-list/services/house.service';
import { serviceService } from '@/features/services/services/service.service';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';

interface MapViewProps {
    activeFilters: string[];
}

const MAX_DISTANCE_METERS = 10000; // 10km

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

// Helper to map real coordinates to the visual grid relative to user
const mapToGrid = (lat: number, lng: number, userLat: number, userLng: number, id: any, type?: 'accommodation' | 'service') => {
    // 10km radius means we show +/- 10km from center.
    const latSpan = 0.18; // approx 20km in degrees lat
    const lngSpan = 0.18; // approx 20km in degrees lng

    const deltaLat = lat - userLat;
    const deltaLng = lng - userLng;

    // Map to percentages (50% is center)
    const top = 50 - (deltaLat / (latSpan / 2) * 50);
    const right = 50 - (deltaLng / (lngSpan / 2) * 50);

    // Significant jitter to spread pins effectively even if they have the exact same coordinates
    // Using a combination of ID and a "hash" of sorts for more variety
    const seed = parseInt(id) || Math.floor(Math.random() * 1000);

    // Type-based base offset to separate houses from services visually
    const typeOffsetTop = type === 'service' ? 5 : -5;
    const typeOffsetRight = type === 'service' ? -5 : 5;

    // Dynamic jitter based on seed
    const jitterTop = ((seed * 13) % 40) - 20; // +/- 20% jitter
    const jitterRight = ((seed * 17) % 40) - 20; // +/- 20% jitter

    return {
        top: `${Math.max(10, Math.min(90, top + jitterTop + typeOffsetTop))}%`,
        right: `${Math.max(10, Math.min(90, right + jitterRight + typeOffsetRight))}%`,
        animationDelay: `${(seed % 5) * 0.5}s`
    };
};

export const MapView = ({ activeFilters }: MapViewProps) => {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

    // 1. Fetch Data
    const { data: housesData, isLoading: isLoadingHouses, refetch: refetchHouses } = useQuery({
        queryKey: ['map-houses'],
        queryFn: () => houseService.getAllHouses({ pageSize: 100, Status: 'Accepted' })
    });

    const { data: servicesData, isLoading: isLoadingServices, refetch: refetchServices } = useQuery({
        queryKey: ['map-services'],
        queryFn: () => serviceService.getDashboardServices({ PageSize: 100, Status: 'Accepted' })
    });

    // 2. Geolocation logic
    const handleUpdateLocation = () => {
        if (!navigator.geolocation) {
            toast.error("متصفحك لا يدعم خاصية تحديد الموقع");
            return;
        }

        setIsUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                setUserLocation(loc);
                localStorage.setItem('location', JSON.stringify(loc));
                toast.success("تم تحديث موقعك بنجاح");
                setIsUpdatingLocation(false);
                // Also refetch data to be sure
                refetchHouses();
                refetchServices();
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error("فشل في تحديد موقعك، يرجى تفعيل الـ GPS");
                setIsUpdatingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        const savedLocation = localStorage.getItem('location');
        if (savedLocation) {
            setUserLocation(JSON.parse(savedLocation));
        }
        handleUpdateLocation();
    }, []);

    // 3. Filter and Map Data
    const filteredHouses = useMemo(() => {
        if (!housesData?.data || !userLocation) return [];
        return housesData.data
            .filter(item => {
                const dist = calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude);
                return dist <= MAX_DISTANCE_METERS;
            })
            .map(item => ({
                ...item,
                type: 'accommodation' as const,
                gridPos: mapToGrid(item.latitude, item.longitude, userLocation.lat, userLocation.lng, item.id, 'accommodation')
            }));
    }, [housesData, userLocation]);

    const filteredServices = useMemo(() => {
        if (!servicesData?.data || !userLocation) return [];
        return servicesData.data
            .filter(item => {
                const dist = calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude);
                return dist <= MAX_DISTANCE_METERS;
            })
            .map(item => ({
                ...item,
                type: 'service' as const,
                gridPos: mapToGrid(item.latitude, item.longitude, userLocation.lat, userLocation.lng, item.id, 'service')
            }));
    }, [servicesData, userLocation]);

    const isLoading = isLoadingHouses || isLoadingServices;

    return (
        <div className="flex-1">
            <div className="relative bg-card rounded-[2.5rem] shadow-2xl overflow-hidden h-[600px] lg:h-[750px] border border-border/50">
                {/* Map Background - Theme Aware */}
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.08] dark:opacity-20 text-slate-900 dark:text-slate-400"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }}
                    />

                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-sm z-50">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            <p className="text-primary font-bold animate-pulse">جاري تحديد الموقع وجلب البيانات...</p>
                        </div>
                    ) : !userLocation ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center bg-background/80 backdrop-blur-md z-50">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                                <Navigation className="w-10 h-10 text-primary animate-bounce" />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-2xl font-black">يرجى السماح بالوصول للموقع</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    نحتاج للوصول إلى موقعك الحالي لنتمكن من عرض السكن والخدمات المجاورة لك بدقة في نطاق 10 كم.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Radial Glow around center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/5 rounded-full blur-[100px] z-0" />

                            {/* Center Marker (You are here) - Lower z-index than pins to avoid blocking */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                <div className="relative">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping absolute -top-1 -left-1" />
                                    <div className="w-6 h-6 bg-primary rounded-full relative z-10 border-4 border-background shadow-[0_0_20px_rgba(var(--primary),0.5)] flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded-md font-bold border border-border shadow-sm backdrop-blur-sm">
                                        أنت هنا
                                    </div>
                                </div>
                            </div>

                            {/* Accommodation Pins */}
                            {activeFilters.includes('accommodations') && filteredHouses.map((item) => (
                                <MapPinMarker
                                    key={`acc-${item.id}`}
                                    item={{
                                        ...item,
                                        title: item.name,
                                        image: item.imageUrls?.[0],
                                        location: item.address
                                    }}
                                    type="accommodation"
                                    gridPos={item.gridPos}
                                    color="text-primary"
                                    onNavigate={() => navigate(`/accommodation/${item.id}`)}
                                    userLocation={userLocation}
                                />
                            ))}

                            {/* Service Pins */}
                            {activeFilters.includes('services') && filteredServices.map((item) => (
                                <MapPinMarker
                                    key={`ser-${item.id}`}
                                    item={{
                                        ...item,
                                        title: item.name,
                                        image: null, // services don't have images in current schema
                                        location: item.address
                                    }}
                                    type="service"
                                    gridPos={item.gridPos}
                                    color="text-accent"
                                    onNavigate={() => navigate(`/service/${item.id}`)}
                                    userLocation={userLocation}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-8 left-8 flex flex-col gap-3 z-30">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleUpdateLocation}
                        disabled={isUpdatingLocation}
                        className="rounded-2xl shadow-2xl h-14 w-14 bg-primary text-white hover:bg-primary/90 transition-all border-none"
                    >
                        {isUpdatingLocation ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <LocateFixed className="w-6 h-6" />
                        )}
                    </Button>
                </div>

                {/* Range Info */}
                <div className="absolute top-8 left-8 z-30 pointer-events-none">
                    <div className="bg-popover/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-border shadow-sm flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                        <span className="text-foreground font-bold text-sm tracking-tight">نطاق التغطية: 10 كم</span>
                    </div>
                </div>

                {/* Active Filters Display */}
                <div className="absolute top-8 right-8 flex flex-wrap gap-2 pointer-events-none z-30">
                    {activeFilters.map((filterId) => {
                        const filter = mapFiltersConfig.find(f => f.id === filterId);
                        if (!filter) return null;
                        return (
                            <Badge
                                key={filterId}
                                className={`${filter.color} text-primary-foreground border-none px-4 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-black/20`}
                            >
                                <filter.icon className="w-3.5 h-3.5 ml-1.5" />
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
    type: 'accommodation' | 'service';
    gridPos: { top: string; right: string; animationDelay: string };
    color: string;
    onNavigate: () => void;
    userLocation: { lat: number; lng: number } | null;
}

const MapPinMarker = ({ item, type, gridPos, color, onNavigate, userLocation }: MapPinMarkerProps) => {
    const lat = item.latitude;
    const lng = item.longitude;

    const distance = userLocation && lat && lng
        ? calculateDistance(userLocation.lat, userLocation.lng, lat, lng)
        : null;

    return (
        <div className="absolute w-10 h-10 group z-20" style={{ top: gridPos.top, right: gridPos.right }}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={`${color} fill-current/20 animate-bounce-slow hover:scale-125 transition-all outline-none filter drop-shadow-[0_0_8px_currentColor]`}
                        style={{ animationDelay: gridPos.animationDelay }}
                    >
                        <MapPin className="w-10 h-10" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden w-72 animate-in fade-in zoom-in-95 backdrop-blur-xl bg-card/90" side="top" align="center" sideOffset={10}>
                    <div className="bg-card text-card-foreground">
                        {item.image && (
                            <div className="h-32 w-full overflow-hidden">
                                <img src={item.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                            </div>
                        )}
                        <div className="p-6 space-y-4" dir="rtl">
                            <div className="flex justify-between items-start gap-4">
                                <h4 className="font-black text-base line-clamp-2 leading-tight">{item.title}</h4>
                                <Badge variant="secondary" className="text-[10px] px-3 py-0.5 rounded-full bg-primary/10 text-primary border-none font-black shrink-0">
                                    {type === 'accommodation' ? 'سكن' : 'خدمة'}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold italic">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                    <span className="line-clamp-1">{item.location}</span>
                                </div>

                            </div>

                            <Button
                                size="sm"
                                className="w-full rounded-2xl gap-2 h-12 text-sm font-black bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate();
                                }}
                            >
                                <Info className="w-4 h-4" /> عرض التفاصيل
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
