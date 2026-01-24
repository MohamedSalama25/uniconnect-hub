import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { UserProfileTrigger } from "@/components/globalComponents/UserProfileTrigger";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    Loader,
    Plus,
    Edit,
    Trash2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button"; // Added Button
import { formatDate } from "@/lib/utils";

// Feature Imports
import AdminPostsHeader from "@/features/admin-posts/components/AdminPostsHeader";
import AdminStatsCards from "@/features/admin-posts/components/AdminStatsCards";
import AdminPostsFilter, { PostCategory } from "@/features/admin-posts/components/AdminPostsFilter";
import { useAdminHouses } from "@/features/admin-posts/hooks/useAdminHouses";
import { House } from "@/features/accommodation-list/types/house.types";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { useAuthStore } from "@/store/useAuthStore";
import { AddAccommodationDialog } from "@/components/globalComponents/AddAccommodationDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";

const AdminPostsPage = () => {
    const navigate = useNavigate();
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id; // Adjust based on your auth store structure

    // State management for filters and pagination
    const [selectedCategory, setSelectedCategory] = useState<PostCategory>("housing");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingHouse, setEditingHouse] = useState<House | undefined>(undefined);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [houseToDelete, setHouseToDelete] = useState<number | null>(null);

    // Fetching data only for housing for now (can be expanded easily)
    const { data: housesData, isLoading: housesLoading, isFetching: housesFetching, refetch } = useAdminHouses({
        Search: searchTerm || undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
        Status: filterStatus !== 'all' ? (filterStatus as any) : undefined
    });

    const handleAcceptReject = async (id: number, status: 'Accepted' | 'Rejected') => {
        setProcessingId(id);
        try {
            await houseService.acceptHouse(id, status);
            toast.success(status === 'Accepted' ? "تم قبول المنشور بنجاح" : "تم رفض المنشور");
            refetch();
        } catch (error: any) {
            toast.error("فشل في تحديث حالة المنشور");
        } finally {
            setProcessingId(null);
        }
    };

    const confirmDelete = (id: number) => {
        setHouseToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!houseToDelete) return;
        setProcessingId(houseToDelete);
        try {
            await houseService.deleteHouse(houseToDelete);
            toast.success("تم حذف المنشور بنجاح");
            setIsDeleteDialogOpen(false);
            setHouseToDelete(null);
            refetch();
        } catch (error: any) {
            toast.error("فشل في حذف المنشور");
        } finally {
            setProcessingId(null);
        }
    };

    const handleEdit = (house: House) => {
        setEditingHouse(house);
        setIsAddDialogOpen(true);
    };

    const handleAddDialogClose = (open: boolean) => {
        setIsAddDialogOpen(open);
        if (!open) {
            setEditingHouse(undefined);
            refetch(); // Refetch to show new/updated data
        }
    };

    // Stats from API response
    const stats = {
        total: housesData?.totalHouses || 0,
        pending: housesData?.pendingHouses || 0,
        completed: housesData?.acceptedHouses || 0,
        rejected: housesData?.rejectedHouses || 0,
    };

    const housingColumns: ColumnDef<House>[] = [
        {
            accessorKey: "name",
            header: "عنوان المنشور",
            cell: ({ row }) => <span className="font-bold text-primary">{row.original.name}</span>
        },
        {
            accessorKey: "createdUser",
            header: "صاحب المنشور",
            cell: ({ row }) => (
                <span className="font-medium hover:text-primary transition-colors cursor-pointer border-b text-center border-dashed border-muted-foreground/50 hover:border-primary">
                    {row.original.createdUser?.username || "غير معروف"}
                </span>
            )
        },
        {
            accessorKey: "typeName",
            header: "القسم",
            cell: ({ row }) => <Badge variant="secondary" className="px-3 py-1">{row.original.typeName || "سكن"}</Badge>
        },
        {
            accessorKey: "createdAt",
            header: "تاريخ النشر",
            cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const status = row.original.status;
                if (status === 'Pending') return <Badge className="bg-amber-500 hover:bg-amber-600 border-none gap-1"><Clock className="w-3 h-3" /> قيد المراجعة</Badge>;
                if (status === 'Accepted') return <Badge className="bg-green-500 hover:bg-green-600 border-none gap-1"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
                return <Badge className="bg-rose-500 hover:bg-rose-600 border-none gap-1"><XCircle className="w-3 h-3" /> مرفوض</Badge>;
            }
        }
    ];

    const actions: Action<any>[] = [
        // Admin Actions
        {
            label: "وافق",
            onClick: (row) => handleAcceptReject(row.id, 'Accepted'),
            show: (row) => row.status === 'Pending' && (user?.roles?.includes("Admin") || false),
            disabled: (row) => processingId === row.id,
            classname: "text-green-600 hover:text-green-700"
        },
        {
            label: "رفض",
            onClick: (row) => handleAcceptReject(row.id, 'Rejected'),
            show: (row) => row.status === 'Pending' && (user?.roles?.includes("Admin") || false),
            disabled: (row) => processingId === row.id,
            classname: "text-red-600 hover:text-red-700"
        },
        // Owner Actions
        {
            label: "تعديل",
            onClick: (row) => handleEdit(row),
            show: (row) => String(row.createdUser?.id) === String(currentUserId),
            classname: "text-blue-600 hover:text-blue-700 font-bold",
            icon: Edit
        },
        {
            label: "حذف",
            onClick: (row) => confirmDelete(row.id),
            show: (row) => String(row.createdUser?.id) === String(currentUserId),
            classname: "text-red-600 hover:text-red-700 font-bold",
            icon: Trash2
        },
        // View Details (Common)
        {
            label: "عرض",
            onClick: (row) => navigate(`/admin/post/${row.id}`),
            classname: "text-blue-500"
        }
    ];

    // Determine data to display
    const tableData = selectedCategory === "housing" ? (housesData?.data || []) : [];
    const totalItems = selectedCategory === "housing" ? (housesData?.count || 0) : 0;
    const isDataLoading = selectedCategory === "housing" && (housesLoading || housesFetching);

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <AdminPostsHeader />
                    {selectedCategory === "housing" && (
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    setEditingHouse(undefined);
                                    setIsAddDialogOpen(true);
                                }}
                                className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20 font-bold h-12"
                            >
                                <Plus className="w-5 h-5" />
                                <span>إضافة سكن</span>
                            </Button>
                        </div>
                    )}
                </div>

                <AdminStatsCards stats={stats} />

                <div className="space-y-6">
                    <AdminPostsFilter
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        searchTerm={searchTerm}
                        setSearchTerm={(term) => {
                            setSearchTerm(term);
                            setPageIndex(1); // Reset to page 1 on search
                        }}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />

                    {isDataLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-background rounded-3xl border border-dashed text-muted-foreground gap-4">
                            <Loader className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <UniTable
                            columns={selectedCategory === "housing" ? housingColumns : []}
                            data={tableData}
                            actions={actions}
                            totalItems={totalItems}
                            itemsPerPage={pageSize}
                            currentPage={pageIndex}
                            onPageChange={setPageIndex}
                            tableName={
                                selectedCategory === "housing" ? "سكن" :
                                    selectedCategory === "complaints" ? "طلبات المساعدة" :
                                        selectedCategory === "transport" ? "خدمات" : ""
                            }
                        />
                    )}
                </div>

                <AddAccommodationDialog
                    open={isAddDialogOpen}
                    onOpenChange={handleAddDialogClose}
                    initialData={editingHouse}
                    trigger={null}
                />

                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title="حذف المنشور"
                    description="هل أنت متأكد من أنك تريد حذف هذا السكن؟ لا يمكن التراجع عن هذا الإجراء."
                    variant="destructive"
                    confirmText="نعم، حذف"
                    cancelText="إلغاء"
                    isLoading={processingId === houseToDelete}
                />
            </div>
        </DashboardLayout>
    );
};

export default AdminPostsPage;
