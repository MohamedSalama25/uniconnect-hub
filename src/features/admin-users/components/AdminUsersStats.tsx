import { Users, UserCheck, UserX, Clock } from "lucide-react";
import StatsCard from "@/components/globalComponents/StatsCard";

interface AdminUsersStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    pendingUsers: number;
  };
  isLoading: boolean;
}

export function AdminUsersStats({ stats, isLoading }: AdminUsersStatsProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="إجمالي المستخدمين"
        value={stats.totalUsers}
        icon={Users}
        description="مستخدم في النظام"
        variant="blue"
        isLoading={isLoading}
      />
      <StatsCard
        title="المستخدمين النشطين"
        value={stats.activeUsers}
        icon={UserCheck}
        description="تم قبول طلباتهم"
        variant="green"
        isLoading={isLoading}
      />
      <StatsCard
        title="بانتظار الموافقة"
        value={stats.pendingUsers}
        icon={Clock}
        description="طلبات جديدة"
        variant="amber"
        isLoading={isLoading}
      />
      <StatsCard
        title="المستخدمين المحظورين"
        value={stats.blockedUsers}
        icon={UserX}
        description="تم تقييد وصولهم"
        variant="red"
        isLoading={isLoading}
      />
    </div>
  );
}
