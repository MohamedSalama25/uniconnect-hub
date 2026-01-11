import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, Clock, CheckCircle, XCircle } from "lucide-react";

interface AdminStatsCardsProps {
    stats: {
        total: number;
        pending: number;
        completed: number;
        rejected: number;
    };
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
    return (
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
    );
};

export default AdminStatsCards;
