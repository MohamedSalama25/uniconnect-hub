import { Building, Briefcase, MessageCircle, HelpCircle } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import type { stats } from '@/data/mockData';

interface DashboardStatsProps {
    stats: typeof stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
                title="السكن المتاح"
                value={stats.availableAccommodations}
                icon={Building}
                variant="primary"
                trend={{ value: 12, isPositive: true }}
            />
            <StatCard
                title="الخدمات القريبة"
                value={stats.nearbyServices}
                icon={Briefcase}
                trend={{ value: 5, isPositive: true }}
            />
            <StatCard
                title="المحادثات النشطة"
                value={stats.activeChats}
                icon={MessageCircle}
            />
            <StatCard
                title="طلبات المساعدة"
                value={stats.helpRequests}
                icon={HelpCircle}
                variant="accent"
            />
        </div>
    );
};
