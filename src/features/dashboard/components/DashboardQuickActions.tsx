import { Building, Briefcase, MessageCircle, HelpCircle } from 'lucide-react';

export const DashboardQuickActions = () => {
    const actions = [
        { icon: Building, label: 'البحث عن سكن', color: 'gradient-primary' },
        { icon: Briefcase, label: 'استكشاف الخدمات', color: 'gradient-accent' },
        { icon: HelpCircle, label: 'طلب مساعدة', color: 'bg-success text-white' },
        { icon: MessageCircle, label: 'بدء محادثة', color: 'bg-secondary' },
    ];

    return (
        <section className="space-y-4 text-right">
            <h2 className="text-xl md:text-2xl font-bold">إجراءات سريعة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={`p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${action.color} ${action.color.includes('gradient') ? 'text-primary-foreground' :
                                action.color.includes('bg-success') ? 'text-success-foreground' : 'text-secondary-foreground'
                            }`}
                    >
                        <action.icon className="w-8 h-8 mx-auto mb-3" />
                        <span className="font-medium">{action.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};
