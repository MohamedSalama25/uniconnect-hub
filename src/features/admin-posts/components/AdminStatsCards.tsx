import React from "react";
import { LayoutGrid, Clock, CheckCircle, XCircle } from "lucide-react";
import StatsCard from "@/components/globalComponents/StatsCard";

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
            <StatsCard
                title="إجمالي المنشورات"
                value={stats.total}
                icon={LayoutGrid}
                description="منشور في النظام"
                variant="primary"
            />
            <StatsCard
                title="قيد المراجعة"
                value={stats.pending}
                icon={Clock}
                description="تحتاج اتخاذ إجراء"
                variant="amber"
            />
            <StatsCard
                title="المنشورات المقبولة"
                value={stats.completed}
                icon={CheckCircle}
                description="تظهر حالياً للجميع"
                variant="green"
            />
            <StatsCard
                title="المرفوضة"
                value={stats.rejected}
                icon={XCircle}
                description="تم استبعادها"
                variant="red"
            />
        </div>
    );
};

export default AdminStatsCards;
