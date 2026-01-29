import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { Loader2, Phone, MapPin, Clock, XCircle, CheckCircle, Info, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Feature Imports
import AdminPostDetailsHeader from "@/features/admin-posts/components/AdminPostDetailsHeader";
import AdminPostLocation from "@/features/admin-posts/components/AdminPostLocation";
import AdminPostAuthorSidebar from "@/features/admin-posts/components/AdminPostAuthorSidebar";
import { useServiceDetail } from "@/features/services/hooks/useServiceDetail";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { serviceService } from "@/features/services/services/service.service";
import { AddServiceDialog } from "@/components/globalComponents/AddServiceDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";
import { IconRenderer } from "@/components/globalComponents/IconRenderer";

const AdminServiceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id;

    const { data: service, isLoading, error } = useServiceDetail(id, true);

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const queryClient = useQueryClient();

    const handleApprove = async () => {
        if (!service) return;
        try {
            await serviceService.updateServiceStatus(service.id, 'Accepted');
            toast.success("تم قبول الخدمة بنجاح");
            navigate("/admin/services");
        } catch (err) {
            toast.error("فشل في قبول الخدمة");
        }
    };

    const handleReject = async () => {
        if (!service) return;
        try {
            await serviceService.updateServiceStatus(service.id, 'Rejected');
            toast.error("تم رفض الخدمة");
            navigate("/admin/services");
        } catch (err) {
            toast.error("فشل في رفض الخدمة");
        }
    };

    const handleDelete = async () => {
        if (!service) return;
        try {
            await serviceService.deleteService(service.id);
            toast.success("تم حذف الخدمة بنجاح");
            setIsDeleteDialogOpen(false);
            navigate("/admin/services");
        } catch (err) {
            toast.error("فشل في حذف الخدمة");
        }
    };

    const handleAddDialogClose = (open: boolean) => {
        setIsAddDialogOpen(open);
        if (!open) {
            queryClient.invalidateQueries({ queryKey: ['service-detail', id] });
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-xl font-bold text-primary">جاري تحميل تفاصيل الخدمة...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !service) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center" dir="rtl">
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 max-w-md w-full">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-xl font-bold text-red-600 mb-2">عذراً، الخدمة غير موجودة</p>
                        <button
                            onClick={() => navigate("/admin/services")}
                            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all w-full shadow-lg shadow-red-200"
                        >
                            العودة لقائمة الخدمات
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const isOwner = String(service.createdUser?.id) === String(currentUserId);
    const isAdmin = user?.roles?.includes("Admin");

    const mappedPost = {
        id: service.id.toString(),
        title: service.name,
        author: service.createdUser?.username || "غير معروف",
        authorId: service.createdUser?.id,
        phone: service.phone,
        email: service.createdUser?.email || "غير متوفر",
        university: service.createdUser?.universityName || "غير متوفر",
        date: formatDate(service.createdAt),
        status: service.status === 'Accepted' ? "completed" as const : "pending" as const,
        type: service.serviceCategoryName || "خدمة",
        description: service.description,
        address: service.address
    };

    const formatTime = (time: any) => {
        if (!time) return "غير محدد";
        if (typeof time === 'string') return time.split(':').slice(0, 2).join(':');
        if (typeof time === 'object' && time.hours !== undefined && time.minutes !== undefined) {
            return `${time.hours}:${time.minutes.toString().padStart(2, '0')}`;
        }
        return "غير محدد";
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <AdminPostDetailsHeader
                    onBack={() => navigate("/admin/services")}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    status={service.status}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onEdit={() => setIsAddDialogOpen(true)}
                    onDelete={() => setIsDeleteDialogOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard icon={Phone} label="رقم التواصل" value={service.phone} bgColor="bg-blue-500/10" iconColor="text-blue-500" />
                            <StatCard icon={Clock} label="ساعات العمل" value={`${formatTime(service.workingFrom)} - ${formatTime(service.workingTo)}`} bgColor="bg-emerald-500/10" iconColor="text-emerald-500" />
                            <StatCard icon={MapPin} label="موقع الخدمة" value={service.address} bgColor="bg-amber-500/10" iconColor="text-amber-500" />
                        </div>

                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-background">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-3 text-primary border-b pb-4">
                                    <Info className="w-6 h-6" />
                                    <h2 className="text-xl font-bold">وصف الخدمة</h2>
                                </div>
                                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                    {service.description}
                                </p>
                            </CardContent>
                        </Card>

                        <AdminPostLocation
                            title={service.name}
                            address={service.address}
                            lat={service.latitude}
                            lng={service.longitude}
                        />
                    </div>

                    <AdminPostAuthorSidebar post={mappedPost as any} user={service.createdUser} />
                </div>

                {/* Edit Dialog */}
                <AddServiceDialog
                    open={isAddDialogOpen}
                    onOpenChange={handleAddDialogClose}
                    initialData={service}
                    trigger={null}
                />

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title="حذف الخدمة"
                    description="هل أنت متأكد من أنك تريد حذف هذه الخدمة؟"
                    variant="destructive"
                    confirmText="نعم، حذف"
                    cancelText="إلغاء"
                />
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ icon: Icon, label, value, bgColor, iconColor }: any) => (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-background">
        <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${bgColor} ${iconColor}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-bold">{label}</p>
                <p className="text-lg font-black tracking-tight">{value}</p>
            </div>
        </CardContent>
    </Card>
);

export default AdminServiceDetailsPage;
