import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { Loader2, XCircle, CheckCircle, Info, Trash2, Edit, Calendar, User, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Feature Imports
import AdminPostDetailsHeader from "@/features/admin-posts/components/AdminPostDetailsHeader";
import AdminPostAuthorSidebar from "@/features/admin-posts/components/AdminPostAuthorSidebar";
import { useHelpRequestDetail } from "@/features/help/hooks/useAdminHelpRequests";
import { helpRequestService } from "@/features/help/services/help-request.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";
import { AddHelpRequestDialog } from "@/features/help/components/AddHelpRequestDialog";

const AdminHelpRequestDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id;

    const { data: request, isLoading, error } = useHelpRequestDetail(id, true);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const queryClient = useQueryClient();

    const handleApprove = async () => {
        if (!request) return;
        try {
            await helpRequestService.updateHelpRequestStatus(request.id, 'Accepted');
            toast.success("تم قبول طلب المساعدة بنجاح");
            navigate("/admin/help-requests");
        } catch (err) {
            toast.error("فشل في قبول الطلب");
        }
    };

    const handleReject = async () => {
        if (!request) return;
        try {
            await helpRequestService.updateHelpRequestStatus(request.id, 'Rejected');
            toast.error("تم رفض طلب المساعدة");
            navigate("/admin/help-requests");
        } catch (err) {
            toast.error("فشل في رفض الطلب");
        }
    };

    const handleDelete = async () => {
        if (!request) return;
        try {
            await helpRequestService.deleteHelpRequest(request.id);
            toast.success("تم حذف الطلب بنجاح");
            setIsDeleteDialogOpen(false);
            navigate("/admin/help-requests");
        } catch (err) {
            toast.error("فشل في حذف الطلب");
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-xl font-bold text-primary">جاري تحميل تفاصيل الطلب...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !request) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center" dir="rtl">
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 max-w-md w-full">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-xl font-bold text-red-600 mb-2">عذراً، الطلب غير موجود</p>
                        <button
                            onClick={() => navigate("/admin/help-requests")}
                            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all w-full shadow-lg shadow-red-200"
                        >
                            العودة لقائمة الطلبات
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const isOwner = String(request.createdUser?.id) === String(currentUserId);
    const isAdmin = user?.roles?.includes("Admin");

    const mappedPost = {
        id: request.id.toString(),
        title: request.title,
        author: request.createdUser?.username || "غير معروف",
        authorId: request.createdUser?.id,
        phone: request.createdUser?.phonenumber || "غير متوفر",
        email: request.createdUser?.email || "غير متوفر",
        university: request.createdUser?.universityName || "غير متوفر",
        date: formatDate(request.createdAt),
        status: request.status === 'Accepted' ? "completed" as const : "pending" as const,
        type: request.helpRequestTypeName || "طلب مساعدة",
        description: request.description,
        address: "غير متوفر"
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <AdminPostDetailsHeader
                    onBack={() => navigate("/admin/help-requests")}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    status={request.status}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onEdit={() => setIsEditDialogOpen(true)}
                    onDelete={() => setIsDeleteDialogOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-background">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground font-bold">تاريخ الطلب</p>
                                        <p className="text-lg font-black tracking-tight">{formatDate(request.createdAt)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-background">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                        <Info className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground font-bold">نوع الطلب</p>
                                        <p className="text-lg font-black tracking-tight">{request.helpRequestTypeName}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-background">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-3 text-primary border-b pb-4">
                                    <MessageCircle className="w-6 h-6" />
                                    <h2 className="text-xl font-bold">وصف طلب المساعدة</h2>
                                </div>
                                <h3 className="text-2xl font-black">{request.title}</h3>
                                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                    {request.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <AdminPostAuthorSidebar post={mappedPost as any} user={request.createdUser} />
                </div>

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title="حذف الطلب"
                    description="هل أنت متأكد من أنك تريد حذف هذا الطلب؟"
                    variant="destructive"
                    confirmText="نعم، حذف"
                    cancelText="إلغاء"
                />

                <AddHelpRequestDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    initialData={request}
                    trigger={null}
                />
            </div>
        </DashboardLayout>
    );
};

export default AdminHelpRequestDetailsPage;
