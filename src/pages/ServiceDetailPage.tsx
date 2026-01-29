import { useParams } from "react-router-dom";
import { ServiceDetailTemplate } from "@/features/services/templates/ServiceDetailTemplate";
import { useServiceDetail } from "@/features/services/hooks/useServiceDetail";
import { Loader2 } from "lucide-react";

const ServiceDetailPage = () => {
    const { id } = useParams();
    const { data: service, isLoading } = useServiceDetail(id);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-xl font-bold text-primary">جاري تحميل تفاصيل الخدمة...</p>
            </div>
        );
    }

    return <ServiceDetailTemplate service={service} />;
};

export default ServiceDetailPage;
