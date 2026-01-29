import { Button } from '@/components/ui/button';
import { HelpRequestCard } from '@/components/cards/HelpRequestCard';
import { HelpRequest } from '@/features/help/types/help-request.types';
import { useNavigate } from 'react-router-dom';

interface DashboardHelpRequestsProps {
    helpRequests: HelpRequest[];
}

export const DashboardHelpRequests = ({ helpRequests }: DashboardHelpRequestsProps) => {
    const navigate = useNavigate();

    return (
        <section className="space-y-4 text-right">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">طلبات المساعدة الأخيرة</h2>
                <Button variant="ghost" className="text-primary" onClick={() => navigate('/help')}>
                    عرض الكل
                </Button>
            </div>

            {helpRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {helpRequests.slice(0, 3).map((request, index) => (
                        <div key={request.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <HelpRequestCard helpRequest={request} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 text-center border border-dashed border-primary/20">
                    <p className="text-muted-foreground font-bold text-lg">سيتم إضافة طلبات المساعدة قريباً </p>
                </div>
            )}
        </section>
    );
};
