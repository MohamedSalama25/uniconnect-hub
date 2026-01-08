import { useParams } from "react-router-dom";
import { accommodations } from "@/data/mockData";
import { AccommodationDetailTemplate } from "@/features/accommodation-detail/templates/AccommodationDetailTemplate";

const AccommodationDetail = () => {
    const { id } = useParams();
    const accommodation = accommodations.find((a) => a.id === id);

    return <AccommodationDetailTemplate accommodation={accommodation} />;
};

export default AccommodationDetail;
