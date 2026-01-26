import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Clock,
    XCircle,
    Loader,
    Search,
    AlertCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Feature Imports
import AdminStatsCards from "@/features/admin-posts/components/AdminStatsCards";

const AdminHelpRequestsPage = () => {
    const navigate = useNavigate();

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Placeholder data
    const helpRequestsData = {
        count: 0,
        data: [],
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0
    };

    const stats = {
        total: 0,
        pending: 0,
        completed: 0,
        rejected: 0,
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "عنوان الطلب",
            cell: ({ row }) => <span className="font-bold text-primary">{row.original.title}</span>
        },
        {
            accessorKey: "user",
            header: "صاحب الطلب",
            cell: ({ row }) => (
                <span className="font-medium hover:text-primary transition-colors cursor-pointer border-b text-center border-dashed border-muted-foreground/50 hover:border-primary">
                    {row.original.user || "غير معروف"}
                </span>
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
                if (status === 'Pending') return <Badge className="bg-amber-500 hover:bg-amber-600 border-none gap-1"><Clock className="w-3 h-3" /> قيد المراجعة</Badge>;
                if (status === 'Accepted') return <Badge className="bg-green-500 hover:bg-green-600 border-none gap-1"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
                return <Badge className="bg-rose-500 hover:bg-rose-600 border-none gap-1"><XCircle className="w-3 h-3" /> مرفوض</Badge>;
            }
        }
    ];

    const actions: Action<any>[] = [
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
                        <div className="relative flex-1 min-w-[280px] max-w-[350px]">
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

                    <div className="flex flex-col items-center justify-center p-20 border border-dashed rounded-3xl text-muted-foreground gap-4">
                        <AlertCircle className="w-12 h-12 text-primary/40" />
                        <p className="text-xl font-bold">لا توجد طلبات مساعدة حالياً</p>
                        <p className="font-medium text-sm">سيتم عرض قائمة الطلبات هنا فور توفرها.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminHelpRequestsPage;
