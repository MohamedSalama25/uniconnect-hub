import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent, accommodations, stats } from '@/data/mockData';
import { DashboardWelcome } from '../components/DashboardWelcome';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardRecommended } from '../components/DashboardRecommended';
import { DashboardQuickActions } from '../components/DashboardQuickActions';

export const DashboardTemplate = () => {
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                <DashboardWelcome user={currentStudent} />
                <DashboardStats stats={stats} />
                <DashboardRecommended accommodations={accommodations} />
                <DashboardQuickActions />
            </div>
        </DashboardLayout>
    );
};
