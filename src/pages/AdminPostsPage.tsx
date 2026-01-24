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
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatDate } from "@/lib/utils";

// Feature Imports
import AdminPostsHeader from "@/features/admin-posts/components/AdminPostsHeader";
import AdminStatsCards from "@/features/admin-posts/components/AdminStatsCards";
import AdminPostsFilter, { PostCategory } from "@/features/admin-posts/components/AdminPostsFilter";
import { useAdminHouses } from "@/features/admin-posts/hooks/useAdminHouses";
import { House } from "@/features/accommodation-list/types/house.types";
import { houseService } from "@/features/accommodation-list/services/house.service";

const AdminPostsPage = () => {
    const navigate = useNavigate();

    // State management for filters and pagination
    const [selectedCategory, setSelectedCategory] = useState<PostCategory>("housing");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Fetching data only for housing for now (can be expanded easily)
    const { data: housesData, isLoading: housesLoading, refetch } = useAdminHouses({
        Search: searchTerm || undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
    });

    const handleAcceptReject = async (id: number, isAccepted: boolean) => {
        setProcessingId(id);
        try {
            await houseService.acceptHouse(id, isAccepted);
            toast.success(isAccepted ? "تم قبول المنشور بنجاح" : "تم رفض المنشور");
            refetch();
        } catch (error: any) {
            toast.error("فشل في تحديث حالة المنشور");
        } finally {
            setProcessingId(null);
        }
    };

    // Stats calculation (Mocking for now while waiting for real stats API)
    const stats = {
        total: housesData?.count || 0,
        pending: 0, // Should come from API
        completed: 0,
        rejected: 0,
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
            accessorKey: "isAccepted",
            header: "الحالة",
            cell: ({ row }) => {
                const isAccepted = row.original.isAccepted;
                if (!isAccepted) return <Badge className="bg-amber-500 hover:bg-amber-600 border-none gap-1"><Clock className="w-3 h-3" /> قيد المراجعة</Badge>;
                return <Badge className="bg-green-500 hover:bg-green-600 border-none gap-1"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
            }
        }
    ];

    const actions: Action<any>[] = [
        {
            label: "وافق",
            onClick: (row) => handleAcceptReject(row.id, true),
            show: (row) => !row.isAccepted,
            disabled: (row) => processingId === row.id,
            classname: "text-green-600 hover:text-green-700"
        },
        {
            label: "رفض",
            onClick: (row) => handleAcceptReject(row.id, false),
            show: (row) => !row.isAccepted,
            disabled: (row) => processingId === row.id,
            classname: "text-red-600 hover:text-red-700"
        },
        {
            label: "عرض",
            onClick: (row) => navigate(`/admin/post/${row.id}`),
            classname: "text-blue-500"
        }
    ];

    // Determine data to display
    const tableData = selectedCategory === "housing" ? (housesData?.data || []) : [];
    const totalItems = selectedCategory === "housing" ? (housesData?.count || 0) : 0;
    const isLoading = selectedCategory === "housing" && housesLoading;

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <AdminPostsHeader />

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

                    {isLoading ? (
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
                                    selectedCategory === "complaints" ? "شكاوى" :
                                        selectedCategory === "transport" ? "مواصلات" : "أدوات"
                            }
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPostsPage;
