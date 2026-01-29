import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Clock,
    XCircle,
    Loader,
    Plus,
    Edit,
    Trash2,
    Search,
    AlertCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { helpRequestService } from "@/features/help/services/help-request.service";
import { useAdminHelpRequests } from "@/features/help/hooks/useAdminHelpRequests";
import { HelpRequest } from "@/features/help/types/help-request.types";
import { useAuthStore } from "@/store/useAuthStore";
import { AddHelpRequestDialog } from "@/features/help/components/AddHelpRequestDialog";

// Feature Imports
import AdminStatsCards from "@/features/admin-posts/components/AdminStatsCards";

const AdminHelpRequestsPage = () => {
    const navigate = useNavigate();
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id;
    const isAdmin = user?.roles?.includes("Admin");
    const queryClient = useQueryClient();

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedTypeId, setSelectedTypeId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(10);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<HelpRequest | undefined>(undefined);

    const { data: requestTypesData } = useQuery({
        queryKey: ["help-request-types"],
        queryFn: () => helpRequestService.getRequestTypes({ pageSize: 100 }),
    });
    const requestTypes = requestTypesData?.data || [];

    const { data: helpData, isLoading, isFetching } = useAdminHelpRequests({
        Search: searchTerm || undefined,
        PageIndex: pageIndex,
        PageSize: pageSize,
        Status: filterStatus !== 'all' ? (Number(filterStatus) as any) : undefined,
        TypeId: selectedTypeId !== 'all' ? Number(selectedTypeId) : undefined
    });

    const helpRequests = helpData?.data || [];
    const totalCount = helpData?.count || 0;

    const stats = {
        total: helpData?.totalHelpRequests || 0,
        pending: helpData?.pendingHelpRequests || 0,
        completed: helpData?.acceptedHelpRequests || 0,
        rejected: helpData?.rejectedHelpRequests || 0,
    };

    const handleApprove = async (id: number) => {
        try {
            await helpRequestService.updateHelpRequestStatus(id, 'Accepted');
            toast.success("تم قبول الطلب بنجاح");
            queryClient.invalidateQueries({ queryKey: ['admin-help-requests'] });
        } catch (err) {
            toast.error("فشل في قبول الطلب");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await helpRequestService.updateHelpRequestStatus(id, 'Rejected');
            toast.error("تم رفض الطلب");
            queryClient.invalidateQueries({ queryKey: ['admin-help-requests'] });
        } catch (err) {
            toast.error("فشل في رفض الطلب");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await helpRequestService.deleteHelpRequest(id);
            toast.success("تم حذف الطلب بنجاح");
            queryClient.invalidateQueries({ queryKey: ['admin-help-requests'] });
        } catch (err) {
            toast.error("فشل في حذف الطلب");
        }
    };

    const columns: ColumnDef<HelpRequest>[] = [
        {
            accessorKey: "title",
            header: "عنوان الطلب",
            cell: ({ row }) => <span className="font-bold text-primary">{row.original.title}</span>
        },
        {
            accessorKey: "createdUser",
            header: "صاحب الطلب",
            cell: ({ row }) => (
                <span className="font-medium hover:text-primary transition-colors cursor-pointer border-b text-center border-dashed border-muted-foreground/50 hover:border-primary">
                    {row.original.createdUser?.username || "غير معروف"}
                </span>
            )
        },
        {
            accessorKey: "helpRequestTypeName",
            header: "النوع",
            cell: ({ row }) => (
                <Badge variant="secondary" className="px-3 py-1 font-bold">
                    {row.original.helpRequestTypeName || "عام"}
                </Badge>
            )
        },
        {
            accessorKey: "createdAt",
            header: "تاريخ الطلب",
            cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const status = row.original.status;
                if ((status as any) === 'Pending' || (status as any) === 0) return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none gap-1"><Clock className="w-3 h-3" /> قيد المراجعة</Badge>;
                if ((status as any) === 'Accepted' || (status as any) === 1) return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none gap-1"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
                if ((status as any) === 'Rejected' || (status as any) === 2) return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none gap-1"><XCircle className="w-3 h-3" /> مرفوض</Badge>;
                return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none gap-1"><XCircle className="w-3 h-3" /> مرفوض</Badge>;
            }
        }
    ];

    const actions: Action<HelpRequest>[] = [
        {
            label: "تعديل",
            onClick: (row) => {
                setEditingRequest(row);
                setIsEditDialogOpen(true);
            },
            show: (row) => String(row.createdUser?.id) === String(currentUserId),
            icon: Edit
        },
        {
            label: "حذف",
            onClick: (row) => handleDelete(row.id),
            show: (row) => String(row.createdUser?.id) === String(currentUserId),
            classname: "text-rose-600 hover:text-rose-700",
            icon: Trash2
        },
        {
            label: "قبول",
            icon: CheckCircle,
            show: (row) => isAdmin && ((row.status as any) !== 'Accepted' && (row.status as any) !== 1),
            onClick: (row) => handleApprove(row.id),
            classname: "text-emerald-600"
        },
        {
            label: "رفض",
            icon: XCircle,
            show: (row) => isAdmin && String(row.createdUser?.id) !== String(currentUserId) && ((row.status as any) !== 'Rejected' && (row.status as any) !== 2),
            onClick: (row) => handleReject(row.id),
            classname: "text-rose-600"
        },
        {
            label: "عرض",
            onClick: (row) => navigate(`/admin/help/${row.id}`),
            classname: "text-blue-500"
        }
    ];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">إدارة طلبات المساعدة</h1>
                        <p className="text-muted-foreground mt-1 font-medium">مراجعة والتحكم في طلبات المساعدة المقدمة.</p>
                    </div>
                </div>

                <AdminStatsCards stats={stats} />

                <div className="bg-background p-6 rounded-3xl shadow-sm border space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap items-center gap-4 flex-1">
                            <div className="relative min-w-[280px] max-w-[350px]">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="البحث في الطلبات..."
                                    className="pr-12 h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPageIndex(1);
                                    }}
                                />
                            </div>

                            <Select
                                value={selectedTypeId}
                                onValueChange={(value) => {
                                    setSelectedTypeId(value);
                                    setPageIndex(1);
                                }}
                            >
                                <SelectTrigger dir="rtl" className="h-12 w-[180px] bg-muted/40 border-none rounded-2xl focus:ring-1 focus:ring-primary/20 transition-all font-bold text-sm">
                                    <SelectValue dir="rtl" placeholder="كل الأنواع" />
                                </SelectTrigger>
                                <SelectContent dir="rtl" className="rounded-xl border-none shadow-2xl">
                                    <SelectItem dir="rtl" value="all" className="font-bold">كل الأنواع</SelectItem>
                                    {requestTypes.map((type) => (
                                        <SelectItem dir="rtl" key={type.id} value={type.id.toString()} className="font-bold">
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex bg-muted/30 rounded-2xl p-1.5 gap-2 border border-muted/50 shadow-inner">
                            {['all', '0', '1', '2'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === status
                                        ? "bg-background text-primary shadow-md"
                                        : "text-muted-foreground hover:bg-white/50"
                                        }`}
                                >
                                    {status === 'all' ? 'الكل' :
                                        status === '0' ? 'قيد المراجعة' :
                                            status === '1' ? 'المقبولة' : 'المرفوضة'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border bg-card">
                        <UniTable
                            columns={columns}
                            data={helpRequests}
                            actions={actions}
                            totalItems={totalCount}
                            itemsPerPage={pageSize}
                            currentPage={pageIndex}
                            onPageChange={(page) => setPageIndex(page)}
                            tableName="طلبات المساعدة"
                            isLoading={isLoading || isFetching}
                        />
                    </div>
                </div>
            </div>

            <AddHelpRequestDialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setEditingRequest(undefined);
                }}
                initialData={editingRequest}
                trigger={null}
            />
        </DashboardLayout>
    );
};

export default AdminHelpRequestsPage;
