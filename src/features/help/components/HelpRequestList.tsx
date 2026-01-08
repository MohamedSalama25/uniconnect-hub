import { HelpCircle } from 'lucide-react';
import { HelpRequestCard } from '@/components/cards/HelpRequestCard';
import { EmptyState } from '@/components/ui/empty-state';
import type { HelpRequest } from '@/data/mockData';

interface HelpRequestListProps {
    requests: HelpRequest[];
    onResetFilters: () => void;
}

export const HelpRequestList = ({ requests, onResetFilters }: HelpRequestListProps) => {
    if (requests.length === 0) {
        return (
            <EmptyState
                icon={HelpCircle}
                title="لا توجد طلبات"
                description="لم نعثر على طلبات مساعدة في هذا التصنيف."
                actionLabel="عرض جميع الطلبات"
                onAction={onResetFilters}
            />
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((request, index) => (
                <div
                    key={request.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <HelpRequestCard helpRequest={request} />
                </div>
            ))}
        </div>
    );
};
