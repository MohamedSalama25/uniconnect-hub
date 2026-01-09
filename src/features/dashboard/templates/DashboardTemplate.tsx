import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent, accommodations, stats } from '@/data/mockData';
import { DashboardWelcome } from '../components/DashboardWelcome';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardRecommended } from '../components/DashboardRecommended';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { CreatePostDialog } from '@/components/globalComponents/CreatePostDialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardTemplate = () => {
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in relative">
                <div className="flex justify-end mb-4">
                    <CreatePostDialog
                        trigger={
                            <Button className="gap-2 font-bold shadow-xl bg-gradient-to-l from-primary to-primary/80 hover:scale-105 transition-all duration-300">
                                <Plus className="w-5 h-5" />
                                <span>إضافة منشور جديد</span>
                            </Button>
                        }
                    />
                </div>
                <DashboardWelcome user={currentStudent} />
                <DashboardStats stats={stats} />
                <DashboardRecommended accommodations={accommodations} />
                <DashboardQuickActions />
            </div>
        </DashboardLayout>
    );
};
