import { HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { HelpRequestCard } from '@/components/cards/HelpRequestCard';
import { EmptyState } from '@/components/ui/empty-state';
import { HelpRequest } from '../types/help-request.types';
import { Button } from '@/components/ui/button';

interface HelpRequestListProps {
    requests: HelpRequest[];
    onResetFilters: () => void;
    totalCount: number;
    pageSize: number;
    pageIndex: number;
    onPageChange: (page: number) => void;
}

export const HelpRequestList = ({
    requests,
    onResetFilters,
    totalCount,
    pageSize,
    pageIndex,
    onPageChange
}: HelpRequestListProps) => {
    if (requests.length === 0) {
        return (
            <div className="bg-card/50 rounded-3xl border border-dashed p-16">
                <EmptyState
                    icon={HelpCircle}
                    title="لا توجد طلبات"
                    description="لم نعثر على طلبات مساعدة في هذا التصنيف حالياً."
                    actionLabel="عرض جميع الطلبات"
                    onAction={onResetFilters}
                />
            </div>
        );
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {requests.map((request, index) => (
                    <div
                        key={request.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <HelpRequestCard helpRequest={request as any} />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl h-12 w-12 bg-muted/30 border-none hover:bg-muted/50 transition-all font-bold"
                        onClick={() => onPageChange(pageIndex + 1)}
                        disabled={pageIndex >= totalPages}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>

                    <span className="font-black text-lg bg-muted/30 px-6 py-2.5 rounded-xl">
                        صفحة {pageIndex} من {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl h-12 w-12 bg-muted/30 border-none hover:bg-muted/50 transition-all font-bold"
                        onClick={() => onPageChange(pageIndex - 1)}
                        disabled={pageIndex <= 1}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    );
};
