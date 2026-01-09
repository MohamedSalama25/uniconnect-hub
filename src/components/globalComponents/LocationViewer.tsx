
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React (Repeated here to ensure it works properly if imported independently)
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationViewerProps {
    lat: number;
    lng: number;
    title?: string;
    className?: string;
}

export function LocationViewer({ lat, lng, title, className }: LocationViewerProps) {
    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    الموقع على الخريطة
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={openGoogleMaps}
                    className="gap-2 text-xs font-bold hover:bg-blue-50 text-blue-600 border-blue-200"
                >
                    <ExternalLink className="w-3 h-3" />
                    الحصول على الاتجاهات
                </Button>
            </div>

            <div className="h-[250px] w-full rounded-xl overflow-hidden border shadow-sm relative z-0">
                <MapContainer
                    center={{ lat, lng }}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={{ lat, lng }}>
                        {title && <Popup>{title}</Popup>}
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}
