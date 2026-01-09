export interface Booking {
    id: string;
    user: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
    };
    accommodation: {
        title: string;
        id: string;
        image?: string;
        location?: string;
        price?: number;
    };
    date: string;
    status: 'confirmed' | 'pending' | 'rejected';
    amount: number;
    message?: string;
}

export const mockBookings: Booking[] = [
    {
        id: "1",
        user: {
            name: "أحمد محمد",
            email: "ahmed@uni.edu.eg",
            phone: "01012345678",
            avatar: "https://github.com/shadcn.png"
        },
        accommodation: {
            title: "شقة مفروشة بالدقي - 3 غرف",
            id: "1",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
            location: "الجيزة، الدقي",
            price: 3500
        },
        date: "2024-03-15",
        status: "pending",
        amount: 3500,
        message: "أنا طالب في كلية الهندسة وأبحث عن سكن هادئ للمذاكرة."
    },
    {
        id: "2",
        user: {
            name: "سارة علي",
            email: "sara@uni.edu.eg",
            phone: "01123456789",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
        },
        accommodation: {
            title: "استوديو قريب من الجامعة",
            id: "3",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
            location: "القاهرة، مدينة نصر",
            price: 2800
        },
        date: "2024-03-14",
        status: "confirmed",
        amount: 2800
    },
    {
        id: "3",
        user: {
            name: "خالد عمر",
            email: "khaled@uni.edu.eg",
            phone: "01234567890",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"
        },
        accommodation: {
            title: "غرفة مشتركة للطلاب",
            id: "2",
            image: "https://images.unsplash.com/photo-1555854743-e3c2f6f588af?w=800&q=80",
            location: "الجيزة، بين السرايات",
            price: 1500
        },
        date: "2024-03-13",
        status: "rejected",
        amount: 1500
    },
    {
        id: "4",
        user: {
            name: "منى السيد",
            email: "mona@uni.edu.eg",
            phone: "01555555555",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
        },
        accommodation: {
            title: "شقة مفروشة بالدقي - 3 غرف",
            id: "1",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
            location: "الجيزة، الدقي",
            price: 3500
        },
        date: "2024-03-12",
        status: "pending",
        amount: 3500,
        message: "هل الشقة متاحة من أول الشهر القادم؟"
    },
];
