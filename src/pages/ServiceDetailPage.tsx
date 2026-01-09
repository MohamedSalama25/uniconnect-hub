import { useParams } from "react-router-dom";
import { services } from "@/data/mockData";
import { ServiceDetailTemplate } from "@/features/services/templates/ServiceDetailTemplate";

const ServiceDetailPage = () => {
    const { id } = useParams();
    const service = services.find((s) => s.id === id);

    return <ServiceDetailTemplate service={service} />;
};

export default ServiceDetailPage;
