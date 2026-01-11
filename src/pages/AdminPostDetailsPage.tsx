import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

// Feature Imports
import { PostDetails } from "@/features/admin-posts/types";
import AdminPostDetailsHeader from "@/features/admin-posts/components/AdminPostDetailsHeader";
import AdminPostMainContent from "@/features/admin-posts/components/AdminPostMainContent";
import AdminPostLocation from "@/features/admin-posts/components/AdminPostLocation";
import AdminPostAuthorSidebar from "@/features/admin-posts/components/AdminPostAuthorSidebar";

// Mock data for posts (in a real app, this would come from an API based on id)
const mockPosts: Record<string, PostDetails> = {
    "1": {
        id: "1",
        title: "شقة مفروشة للإيجار - حي النرجس",
        author: "أحمد محمد",
        authorId: "user-1",
        university: "جامعة الملك سعود",
        phone: "+966 50 123 4567",
        email: "ahmed@example.com",
        date: "2026-01-08",
        status: "pending",
        type: "سكن",
        description: "شقة واسعة ومفروشة بالكامل تقع في حي النرجس الراقي، قريبة من جميع الخدمات والجامعة. تتكون من غرفتين وصالة ومطبخ وحمامين. الإيجار يشمل الكهرباء والماء والإنترنت.",
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&height=600&fit=crop",
            "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&height=600&fit=crop",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&height=600&fit=crop",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&height=600&fit=crop"
        ]
    },
    "2": {
        id: "2",
        title: "توصيل طالبات من حي الملك فهد",
        author: "سارة علي",
        authorId: "user-2",
        university: "جامعة الأميرة نورة",
        phone: "+966 55 987 6543",
        email: "sara@example.com",
        date: "2026-01-07",
        status: "completed",
        type: "مواصلات",
        description: "سيارة حديثة ومكيفة لتوصيل الطالبات من حي الملك فهد إلى جامعة الأميرة نورة. الالتزام بالمواعيد والأمان هما أولويتنا. يوجد مكان لـ 3 طالبات إضافيات.",
        images: []
    }
};

const AdminPostDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // In a real app, you'd fetch the post by id
    const post = mockPosts[id as string] || mockPosts["1"];

    const handleApprove = () => {
        toast.success("تم قبول المنشور بنجاح");
        navigate("/admin/posts");
    };

    const handleReject = () => {
        toast.error("تم رفض المنشور");
        navigate("/admin/posts");
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <AdminPostDetailsHeader
                    onBack={() => navigate("/admin/posts")}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <AdminPostMainContent post={post} />
                        <AdminPostLocation
                            title={post.title}
                            address="حي النرجس، الرياض"
                        />
                    </div>

                    <AdminPostAuthorSidebar post={post} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPostDetailsPage;
