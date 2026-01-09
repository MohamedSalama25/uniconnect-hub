import { useParams, Navigate } from "react-router-dom";
import { mockBookings } from "@/features/provider-bookings/data/mockBookings";
import { BookingDetailTemplate } from "@/features/provider-bookings/templates/BookingDetailTemplate";

const BookingDetailPage = () => {
    const { id } = useParams();
    const booking = mockBookings.find((b) => b.id === id);

    if (!booking) {
        return <Navigate to="/provider/bookings" replace />;
    }

    return <BookingDetailTemplate booking={booking} />;
};

export default BookingDetailPage;
