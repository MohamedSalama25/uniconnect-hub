import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    CheckCircle,
    Clock,
    XCircle,
    LayoutGrid,
    Filter,
    Search,
    MoreVertical
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface Post {
    id: string;
    title: string;
    author: string;
    date: string;
    status: "pending" | "completed" | "rejected";
    type: string;
}

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">إدارة المنشورات</h1>
                        <p className="text-muted-foreground mt-1">مراجعة والتحكم في المنشورات قبل ظهورها للمستخدمين</p>
                    </div>
                    <div className="flex bg-background rounded-xl p-1 border shadow-sm">
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "all" ? "bg-primary text-white shadow-md" : "hover:bg-muted"}`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setFilterStatus("pending")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "pending" ? "bg-amber-500 text-white shadow-md" : "hover:bg-muted"}`}
                        >
                            قيد المراجعة
                        </button>
                        <button
                            onClick={() => setFilterStatus("completed")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "completed" ? "bg-green-500 text-white shadow-md" : "hover:bg-muted"}`}
                        >
                            المقبولة
                        </button>
                        <button
                            onClick={() => setFilterStatus("rejected")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "rejected" ? "bg-red-500 text-white shadow-md" : "hover:bg-muted"}`}
                        >
                            المرفوضة
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">إجمالي المنشورات</CardTitle>
                            <LayoutGrid className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">منشور في النظام</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground mt-1 text-amber-600">تحتاج اتخاذ إجراء</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">المنشورات المقبولة</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed}</div>
                            <p className="text-xs text-muted-foreground mt-1 text-green-600">تظهر حالياً للجميع</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-gradient-to-br from-red-500/10 to-red-500/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">المرفوضة</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rejected}</div>
                            <p className="text-xs text-muted-foreground mt-1 text-red-600">تم استبعادها</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="flex gap-4 items-center bg-background p-4 rounded-2xl shadow-sm border">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="البحث في المنشورات أو أصحابها..."
                                className="pr-10 bg-muted/50 border-none rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="rounded-xl gap-2 font-bold">
                            <Filter className="w-4 h-4" /> تصفية متقدمة
                        </Button>
                    </div>

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
