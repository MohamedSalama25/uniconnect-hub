import { Building, Briefcase, MessageCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardQuickActions = () => {
    const navigate = useNavigate();
    const actions = [
        { icon: Building, label: 'البحث عن سكن', color: 'gradient-primary', path: '/accommodations' },
        { icon: Briefcase, label: 'استكشاف الخدمات', color: 'gradient-accent', path: '/services' },
        { icon: HelpCircle, label: 'طلب مساعدة', color: 'bg-success text-white', path: '/help' },
        { icon: MessageCircle, label: 'بدء محادثة', color: 'bg-secondary', path: '/chat' },
    ];

    return (
        <section className="space-y-4 text-right">
            <h2 className="text-xl md:text-2xl font-bold">إجراءات سريعة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(action.path)}
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
