import { useEffect } from "react";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const LocationPrompt = () => {
    useEffect(() => {
        const storedLocation = localStorage.getItem("location");

        if (!storedLocation) {
            const toastId = toast.info("نحتاج الوصول إلى موقعك", {
                description: "لنساعدك في العثور على الخدمات القريبة منك بشكل أسرع.",
                icon: <MapPin className="h-5 w-5 text-primary" />,
                duration: Infinity,
                position: "bottom-center",
                action: {
                    label: "السماح",
                    onClick: () => {
                        if ("geolocation" in navigator) {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const location = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude,
                                        timestamp: new Date().getTime(),
                                    };
                                    localStorage.setItem("location", JSON.stringify(location));
                                    toast.success("تم حفظ موقعك بنجاح", { id: toastId });
                                },
                                (error) => {
                                    console.error("Error getting location:", error);
                                    toast.error("حدث خطأ أثناء محاولة الوصول للموقع", { id: toastId });
                                }
                            );
                        } else {
                            toast.error("متصفحك لا يدعم خاصية الموقع الجغرافي", { id: toastId });
                        }
                    },
                },
                cancel: {
                    label: "لاحقاً",
                    onClick: () => toast.dismiss(toastId),
                },
            });
        }
    }, []);

    return null;
};

export default LocationPrompt;
