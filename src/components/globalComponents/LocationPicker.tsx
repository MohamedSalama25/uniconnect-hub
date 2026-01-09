import { useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
    onLocationSelect: (location: { lat: number; lng: number }) => void;
    defaultLocation?: { lat: number; lng: number };
}

// ✅ مصر كـ Default
const DEFAULT_CENTER = { lat: 26.8206, lng: 30.8025 };

function MapEvents({
    onSelect,
}: {
    onSelect: (latlng: { lat: number; lng: number }) => void;
}) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng);
        },
    });
    return null;
}

function FlyToLocation({
    location,
}: {
    location: { lat: number; lng: number };
}) {
    const map = useMap();

    useEffect(() => {
        if (location) {
            map.flyTo(location, 16, {
                animate: true,
                duration: 1.2,
            });
        }
    }, [location, map]);

    return null;
}

export function LocationPicker({
    onLocationSelect,
    defaultLocation,
}: LocationPickerProps) {
    const [position, setPosition] = useState<{
        lat: number;
        lng: number;
    } | null>(defaultLocation || null);

    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    useEffect(() => {
        if (position) {
            onLocationSelect(position);
        }
    }, [position, onLocationSelect]);

    const handleGetCurrentLocation = () => {
        // Try to get from localStorage first
        const storedLocation = localStorage.getItem("location");
        if (storedLocation) {
            try {
                const parsedLocation = JSON.parse(storedLocation);
                if (parsedLocation.lat && parsedLocation.lng) {
                    setPosition({ lat: parsedLocation.lat, lng: parsedLocation.lng });
                    toast.success("تم تحديد موقعك من البيانات المحفوظة");
                    return;
                }
            } catch (e) {
                console.error("Error parsing stored location", e);
            }
        }

        if (!navigator.geolocation) {
            toast.error("المتصفح لا يدعم تحديد الموقع");
            return;
        }

        setIsLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;

                console.log("Accuracy (meters):", accuracy);

                const newLocation = { lat: latitude, lng: longitude };
                setPosition(newLocation);

                // Update local storage
                localStorage.setItem("location", JSON.stringify({
                    ...newLocation,
                    timestamp: new Date().getTime()
                }));

                setIsLoadingLocation(false);

                if (accuracy > 500) {
                    toast.warning(
                        "⚠️ دقة الموقع ضعيفة، يفضل تحديد موقعك يدويًا على الخريطة"
                    );
                } else {
                    toast.success("✅ تم تحديد موقعك بدقة");
                }
            },
            (error) => {
                console.error(error);
                toast.error("فشل تحديد الموقع، تأكد من تفعيل GPS");
                setIsLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0,
            }
        );
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {position ? (
                        <span>
                            الموقع المحدد: {position.lat.toFixed(5)} ,{" "}
                            {position.lng.toFixed(5)}
                        </span>
                    ) : (
                        <span>اضغط على الخريطة أو استخدم موقعك الحالي</span>
                    )}
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="gap-2"
                >
                    {isLoadingLocation ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <Navigation className="w-3 h-3" />
                    )}
                    موقعي الحالي
                </Button>
            </div>

            {/* Map */}
            <div className="h-[300px] w-full rounded-xl overflow-hidden border shadow-sm">
                <MapContainer
                    center={defaultLocation || DEFAULT_CENTER}
                    zoom={6}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapEvents onSelect={setPosition} />

                    {position && <Marker position={position} />}
                    {position && <FlyToLocation location={position} />}
                </MapContainer>
            </div>
        </div>
    );
}
