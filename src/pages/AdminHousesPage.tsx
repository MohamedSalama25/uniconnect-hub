import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminSettingsService } from "@/features/admin-settings/services/admin-settings.service";
import { useNavigate } from "react-router-dom";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
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
    Search,
    Building2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Feature Imports
import AdminStatsCards from "@/features/admin-posts/components/AdminStatsCards";
import { useAdminHouses } from "@/features/admin-posts/hooks/useAdminHouses";
import { House } from "@/features/accommodation-list/types/house.types";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { useAuthStore } from "@/store/useAuthStore";
import { AddAccommodationDialog } from "@/components/globalComponents/AddAccommodationDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";

const AdminHousesPage = () => {
    const navigate = useNavigate();
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id;

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedTypeId, setSelectedTypeId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingHouse, setEditingHouse] = useState<House | undefined>(undefined);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [houseToDelete, setHouseToDelete] = useState<number | null>(null);

    // Fetch house types for filtering
    const { data: houseTypesData } = useQuery({
        queryKey: ["house-types"],
        queryFn: () => adminSettingsService.getHouseTypes({ pageSize: 100 }),
    });
    const houseTypes = houseTypesData?.data || [];

    const { data: housesData, isLoading: housesLoading, isFetching: housesFetching, refetch: refetchHouses } = useAdminHouses({
        Search: searchTerm || undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
        Status: filterStatus !== 'all' ? (filterStatus as any) : undefined,
        TypeId: selectedTypeId !== 'all' ? Number(selectedTypeId) : undefined
    });

    const handleAcceptReject = async (id: number, status: 'Accepted' | 'Rejected') => {
        setProcessingId(id);
        try {
            await houseService.acceptHouse(id, status);
            toast.success(status === 'Accepted' ? "تم قبول المنشور بنجاح" : "تم رفض المنشور");
            refetchHouses();
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
            refetchHouses();
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
            refetchHouses();
        }
    };

    const stats = {
        total: housesData?.totalHouses || 0,
        pending: housesData?.pendingHouses || 0,
        completed: housesData?.acceptedHouses || 0,
        rejected: housesData?.rejectedHouses || 0,
    };

    const columns: ColumnDef<House>[] = [
        {
            accessorKey: "name",
            header: "عنوان السكن",
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
            header: "النوع",
            cell: ({ row }) => (
                <Badge variant="secondary" className="px-3 py-1 gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    {row.original.typeName || "سكن"}
                </Badge>
            )
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
                if (status === 'Pending') return (
                    <Badge className="bg-amber-500/10 text-amber-600 border border-border hover:bg-amber-500/20 gap-1.5 py-1 px-3 shadow-none">
                        <Clock className="w-3.5 h-3.5" />
                        قيد المراجعة
                    </Badge>
                );
                if (status === 'Accepted') return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 hover:bg-emerald-500/20 gap-1.5 py-1 px-3 shadow-none">
                        <CheckCircle className="w-3.5 h-3.5" />
                        مقبول
                    </Badge>
                );
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 border border-rose-200/50 hover:bg-rose-500/20 gap-1.5 py-1 px-3 shadow-none">
                        <XCircle className="w-3.5 h-3.5" />
                        مرفوض
                    </Badge>
                );
            }
        }
    ];

    const actions: Action<any>[] = [
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
        {
            label: "عرض",
            onClick: (row) => navigate(`/admin/post/${row.id}`),
            classname: "text-blue-500"
        }
    ];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">إدارة السكن</h1>
                        <p className="text-muted-foreground mt-1 font-medium">مراجعة والتحكم في منشورات السكن المضافة.</p>
                    </div>
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
                </div>

                <AdminStatsCards stats={stats} />

                <div className="bg-background p-6 rounded-3xl shadow-sm border space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-4 items-center flex-1">
                            <div className="relative flex-1 min-w-[280px] max-w-[350px]">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="البحث في السكن..."
                                    className="pr-12 h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPageIndex(1);
                                    }}
                                />
                            </div>

                            <select
                                value={selectedTypeId}
                                onChange={(e) => {
                                    setSelectedTypeId(e.target.value);
                                    setPageIndex(1);
                                }}
                                className="h-12 px-4 bg-muted/40 border-none rounded-2xl focus:ring-1 focus:ring-primary/20 transition-all font-bold text-sm outline-none cursor-pointer min-w-[150px]"
                            >
                                <option value="all">كل الأنواع</option>
                                {houseTypes.map((type) => (
                                    <option key={type.id} value={type.id.toString()}>
                                        {type.typeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex bg-muted/30 rounded-2xl p-1.5 gap-2 border border-muted/50 shadow-inner">
                            {['all', 'Pending', 'Accepted', 'Rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === status
                                        ? "bg-background text-primary shadow-md"
                                        : "text-muted-foreground hover:bg-white/50"
                                        }`}
                                >
                                    {status === 'all' ? 'الكل' :
                                        status === 'Pending' ? 'قيد المراجعة' :
                                            status === 'Accepted' ? 'المقبولة' : 'المرفوضة'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {housesLoading || housesFetching ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <UniTable
                            columns={columns}
                            data={housesData?.data || []}
                            actions={actions}
                            totalItems={housesData?.count || 0}
                            itemsPerPage={pageSize}
                            currentPage={pageIndex}
                            onPageChange={setPageIndex}
                            tableName="إدارة السكن"
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

export default AdminHousesPage;
