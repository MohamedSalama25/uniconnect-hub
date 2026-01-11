import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { UserProfileTrigger } from "@/components/globalComponents/UserProfileTrigger";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Feature Imports
import { Post } from "@/features/admin-posts/types";
import AdminPostsHeader from "@/features/admin-posts/components/AdminPostsHeader";
import AdminStatsCards from "@/features/admin-posts/components/AdminStatsCards";
import AdminPostsFilter from "@/features/admin-posts/components/AdminPostsFilter";

const AdminPostsPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Post[]>([
        { id: "1", title: "شقة مفروشة للإيجار - حي النرجس", author: "أحمد محمد", date: "2026-01-08", status: "pending", type: "سكن" },
        { id: "2", title: "توصيل طالبات من حي الملك فهد", author: "سارة علي", date: "2026-01-07", status: "completed", type: "مواصلات" },
        { id: "3", title: "مطلوب شريك سكن بجوار الجامعة", author: "خالد سعيد", date: "2026-01-06", status: "rejected", type: "سكن" },
        { id: "4", title: "بيع كتب هندسة طبية - مستوى 3", author: "نورة حسن", date: "2026-01-05", status: "pending", type: "أدوات دراسية" },
        { id: "5", title: "نقل عفش وأثاث طالبات", author: "محمد إبراهيم", date: "2026-01-04", status: "completed", type: "مواصلات" },
    ]);

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = data.filter(item => {
        const matchesStatus = filterStatus === "all" || item.status === filterStatus;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: data.length,
        pending: data.filter(i => i.status === "pending").length,
        completed: data.filter(i => i.status === "completed").length,
        rejected: data.filter(i => i.status === "rejected").length,
    };

    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: "title",
            header: "عنوان المنشور",
            cell: ({ row }) => <span className="font-bold text-primary">{row.original.title}</span>
        },
        {
            accessorKey: "author",
            header: "صاحب المنشور",
            cell: ({ row }) => (
                <UserProfileTrigger name={row.original.author} className="w-fit">
                    <span className="font-medium hover:text-primary transition-colors cursor-pointer border-b border-dashed border-muted-foreground/50 hover:border-primary">
                        {row.original.author}
                    </span>
                </UserProfileTrigger>
            )
        },
        {
            accessorKey: "type",
            header: "القسم",
            cell: ({ row }) => <Badge variant="secondary" className="px-3 py-1">{row.original.type}</Badge>
        },
        {
            accessorKey: "date",
            header: "تاريخ النشر",
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const s = row.original.status;
                if (s === "pending") return <Badge className="bg-amber-500 hover:bg-amber-600 border-none gap-1"><Clock className="w-3 h-3" /> قيد المراجعة</Badge>;
                if (s === "completed") return <Badge className="bg-green-500 hover:bg-green-600 border-none gap-1"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
                return <Badge className="bg-red-500 hover:bg-red-600 border-none gap-1"><XCircle className="w-3 h-3" /> مرفوض</Badge>;
            }
        }
    ];

    const actions: Action<Post>[] = [
        {
            label: "وافق",
            onClick: (row) => {
                setData(prev => prev.map(p => p.id === row.id ? { ...p, status: "completed" } : p));
                toast.success("تم قبول المنشور بنجاح");
            },
            show: (row) => row.status === "pending"
        },
        {
            label: "رفض",
            onClick: (row) => {
                setData(prev => prev.map(p => p.id === row.id ? { ...p, status: "rejected" } : p));
                toast.error("تم رفض المنشور");
            },
            show: (row) => row.status === "pending"
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
                <AdminPostsHeader />

                <AdminStatsCards stats={stats} />

                <div className="space-y-6">
                    <AdminPostsFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />

                    <UniTable
                        columns={columns}
                        data={filteredData}
                        actions={actions}
                        totalItems={filteredData.length}
                        itemsPerPage={5}
                        currentPage={1}
                        tableName="المنشورات"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPostsPage;
