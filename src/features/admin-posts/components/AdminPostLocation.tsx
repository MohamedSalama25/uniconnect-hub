import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { LocationViewer } from "@/components/globalComponents/LocationViewer";

interface AdminPostLocationProps {
    title: string;
    lat?: number;
    lng?: number;
    address: string;
}

const AdminPostLocation: React.FC<AdminPostLocationProps> = ({
    title,
    lat = 24.7136,
    lng = 46.6753,
    address,
}) => {
    return (
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden mt-6">
            <CardHeader className="p-6 pb-0">
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> الموقع الجغرافي
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <LocationViewer
                    lat={lat}
                    lng={lng}
                    title={title}
                />
                <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{address}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminPostLocation;
