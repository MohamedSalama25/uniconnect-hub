import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HelpFilters } from '../components/HelpFilters';
import { HelpRequestList } from '../components/HelpRequestList';
import { AddHelpRequestDialog } from '../components/AddHelpRequestDialog';
import { useHelpRequests } from '../hooks/useAdminHelpRequests';
import { Loader2 } from 'lucide-react';

export const HelpTemplate = () => {
    const [selectedTypeId, setSelectedTypeId] = useState<string | 'all'>('all');
    const [searchTerm] = useState(""); // Placeholder for future search implementation
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 10;

    const { data: helpData, isLoading, isFetching } = useHelpRequests({
        Search: searchTerm || undefined,
        PageIndex: pageIndex,
        PageSize: pageSize,
        TypeId: selectedTypeId !== 'all' ? Number(selectedTypeId) : undefined
    });

    const requests = helpData?.data || [];
    const totalCount = helpData?.count || 0;

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in text-right max-w-7xl mx-auto pb-10">
                {/* Header Section */}
                <div className="relative overflow-hidden pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-l from-foreground to-foreground/70 bg-clip-text text-transparent">
                                طلبات المساعدة
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium">
                                ساعد زملاءك الطلاب أو اطلب المساعدة
                            </p>
                        </div>

                        <AddHelpRequestDialog />
                    </div>
                </div>

                {/* Filters Section */}
                <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-md border-b border-transparent transition-all">
                    <HelpFilters
                        selectedTypeId={selectedTypeId}
                        setSelectedTypeId={(id) => {
                            setSelectedTypeId(id);
                            setPageIndex(1);
                        }}
                    />
                </div>

                {/* Content Area */}
                <div className="relative min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
                            </div>
                            <p className="text-xl font-bold text-muted-foreground animate-pulse">جاري تحميل الطلبات...</p>
                        </div>
                    ) : (
                        <HelpRequestList
                            requests={requests}
                            onResetFilters={() => {
                                setSelectedTypeId('all');
                                setPageIndex(1);
                            }}
                            totalCount={totalCount}
                            pageSize={pageSize}
                            pageIndex={pageIndex}
                            onPageChange={setPageIndex}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
