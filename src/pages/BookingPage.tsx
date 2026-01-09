import { useParams, Navigate } from "react-router-dom";
import { accommodations } from "@/data/mockData";
import { BookingTemplate } from "@/features/booking/templates/BookingTemplate";


const BookingPage = () => {
    const { id } = useParams();
    const accommodation = accommodations.find((a) => a.id === id);

    if (!accommodation) {
        return <Navigate to="/accommodations" replace />;
    }

    return <BookingTemplate accommodation={accommodation} />;
};

export default BookingPage;
