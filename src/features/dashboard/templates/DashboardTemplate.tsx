import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent, accommodations, stats } from '@/data/mockData';
import { DashboardWelcome } from '../components/DashboardWelcome';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardRecommended } from '../components/DashboardRecommended';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { CreatePostDialog } from '@/components/globalComponents/CreatePostDialog';

export const DashboardTemplate = () => {
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in relative">
                <DashboardWelcome user={currentStudent} />
                <DashboardStats stats={stats} />
                <DashboardRecommended accommodations={accommodations} />
                <DashboardQuickActions />
            </div>
        </DashboardLayout>
    );
};
