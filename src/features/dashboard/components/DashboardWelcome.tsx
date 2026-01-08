import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { currentStudent } from '@/data/mockData';

interface DashboardWelcomeProps {
    user: typeof currentStudent;
}

export const DashboardWelcome = ({ user }: DashboardWelcomeProps) => {
    return (
        <div className="gradient-primary rounded-3xl p-6 md:p-8 text-primary-foreground text-right">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        مرحباً، {user.name} 👋
                    </h1>
                    <p className="text-primary-foreground/80">
                        {user.university} • {user.city}
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="ابحث عن سكن، خدمات..."
                        className="pr-12 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground/30 text-right"
                    />
                </div>
            </div>
        </div>
    );
};
