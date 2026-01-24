import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { Loader2, Home, Bed, Bath, DollarSign, Calendar, XCircle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Feature Imports
import AdminPostDetailsHeader from "@/features/admin-posts/components/AdminPostDetailsHeader";
import AdminPostMainContent from "@/features/admin-posts/components/AdminPostMainContent";
import AdminPostLocation from "@/features/admin-posts/components/AdminPostLocation";
import AdminPostAuthorSidebar from "@/features/admin-posts/components/AdminPostAuthorSidebar";
import { useHouseDetail } from "@/features/admin-posts/hooks/useHouseDetail";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { AddAccommodationDialog } from "@/components/globalComponents/AddAccommodationDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";

const AdminPostDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id; // Adjust based on your auth store structure

    const { data: house, isLoading, error } = useHouseDetail(id);

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Invalidate queries after edit to refresh data
    const queryClient = useQueryClient();

    const handleApprove = async () => {
        if (!house) return;
        try {
            await houseService.acceptHouse(house.id, true);
            toast.success("تم قبول المنشور بنجاح");
            navigate("/admin/posts");
        } catch (err) {
            toast.error("فشل في قبول المنشور");
        }
    };

    const handleReject = async () => {
        if (!house) return;
        try {
            await houseService.acceptHouse(house.id, false);
            toast.error("تم رفض المنشور");
            navigate("/admin/posts");
        } catch (err) {
            toast.error("فشل في رفض المنشور");
        }
    };

    const handleDelete = async () => {
        if (!house) return;
        try {
            await houseService.deleteHouse(house.id);
            toast.success("تم حذف المنشور بنجاح");
            setIsDeleteDialogOpen(false);
            navigate("/admin/posts");
        } catch (err) {
            toast.error("فشل في حذف المنشور");
        }
    };

    const handleAddDialogClose = (open: boolean) => {
        setIsAddDialogOpen(open);
        if (!open) {
            queryClient.invalidateQueries({ queryKey: ['house-detail', id] });
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-xl font-bold text-primary">جاري تحميل تفاصيل المنشور...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !house) {
        const errorMsg = (error as any)?.response?.data?.message || "حدث خطأ أثناء تحميل التفاصيل";
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center" dir="rtl">
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 max-w-md w-full">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-xl font-bold text-red-600 mb-2">عذراً، المنشور غير موجود</p>
                        <p className="text-muted-foreground mb-6">{errorMsg}</p>
                        <button
                            onClick={() => navigate("/admin/posts")}
                            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all w-full shadow-lg shadow-red-200"
                        >
                            العودة لقائمة المنشورات
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Mapping House to PostDetails-like object for compatibility
    const mappedPost = {
        id: house.id.toString(),
        title: house.name,
        author: house.createdByName || "غير معروف",
        authorId: house.createdById,
        university: "غير متوفر", // Needs real field if available
        phone: "غير متوفر",
        email: "غير متوفر",
        date: formatDate(house.createdAt),
        status: house.isAccepted ? "completed" as const : "pending" as const,
        type: house.typeName || "سكن",
        description: house.description,
        images: house.imageUrls
    };

    const isOwner = String(house.createdUser?.id) === String(currentUserId);
    const isAdmin = user?.roles?.includes("Admin");

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <AdminPostDetailsHeader
                    onBack={() => navigate("/admin/posts")}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isAccepted={house.isAccepted}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onEdit={() => setIsAddDialogOpen(true)}
                    onDelete={() => setIsDeleteDialogOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Housing Specific Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard icon={Bed} label="الغرف" value={house.numberOfRooms} bgColor="bg-blue-500/10" iconColor="text-blue-500" />
                            <StatCard icon={Bath} label="الحمامات" value={house.numberOfBathrooms} bgColor="bg-indigo-500/10" iconColor="text-indigo-500" />
                            <StatCard icon={DollarSign} label="السعر" value={`${house.price} ر.س`} bgColor="bg-green-500/10" iconColor="text-green-500" />
                            <StatCard icon={Calendar} label="متاح من" value={formatDate(house.availableFrom)} bgColor="bg-amber-500/10" iconColor="text-amber-500" />
                        </div>

                        <AdminPostMainContent post={mappedPost as any} facilityNames={house.facilityNames} />

                        <AdminPostLocation
                            title={house.name}
                            address={house.address}
                            lat={house.latitude}
                            lng={house.longitude}
                        />
                    </div>

                    <AdminPostAuthorSidebar post={mappedPost as any} user={house.createdUser} />
                </div>

                {/* Edit Dialog */}
                {house && (
                    <AddAccommodationDialog
                        open={isAddDialogOpen}
                        onOpenChange={handleAddDialogClose}
                        initialData={house}
                        trigger={<span className="hidden" />}
                    />
                )}

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title="حذف المنشور"
                    description="هل أنت متأكد من أنك تريد حذف هذا السكن؟ لا يمكن التراجع عن هذا الإجراء."
                    variant="destructive"
                    confirmText="نعم، حذف"
                    cancelText="إلغاء"
                />
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ icon: Icon, label, value, bgColor, iconColor }: any) => (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-emerald-500/5">
        <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${bgColor} ${iconColor}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground font-bold">{label}</p>
                <p className="text-lg font-black tracking-tight">{value}</p>
            </div>
        </CardContent>
    </Card>
);

export default AdminPostDetailsPage;
