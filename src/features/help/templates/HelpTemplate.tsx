import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { helpRequests as allRequests, HelpRequest } from '@/data/mockData';
import { HelpFilters } from '../components/HelpFilters';
import { HelpRequestList } from '../components/HelpRequestList';
import { AddHelpRequestDialog } from '../components/AddHelpRequestDialog';

export const HelpTemplate = () => {
    const [selectedCategory, setSelectedCategory] = useState<HelpRequest['category'] | 'all'>('all');

    const filteredRequests = allRequests.filter(
        req => selectedCategory === 'all' || req.category === selectedCategory
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in text-right">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">طلبات المساعدة</h1>
                        <p className="text-muted-foreground mt-1">
                            ساعد زملاءك الطلاب أو اطلب المساعدة
                        </p>
                    </div>

                    <AddHelpRequestDialog />
                </div>

                {/* Category Filters */}
                <HelpFilters
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* Help Requests List */}
                <HelpRequestList
                    requests={filteredRequests}
                    onResetFilters={() => setSelectedCategory('all')}
                />
            </div>
        </DashboardLayout>
    );
};
