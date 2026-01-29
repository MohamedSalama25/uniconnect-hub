import { Building, Briefcase, HelpCircle } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';

interface DashboardStatsProps {
    stats: {
        acceptedHouses: number;
        acceptedServices: number;
        acceptedHelpRequests: number;
    };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StatCard
                title="السكن المتاح"
                value={stats.acceptedHouses}
                icon={Building}
                variant="primary"
                trend={{ value: 12, isPositive: true }}
            />
            <StatCard
                title="الخدمات القريبة"
                value={stats.acceptedServices}
                icon={Briefcase}
                trend={{ value: 5, isPositive: true }}
            />
            <StatCard
                title="طلبات المساعدة"
                value={stats.acceptedHelpRequests}
                icon={HelpCircle}
                variant="accent"
            />
        </div>
    );
};
