import { User, Mail, Phone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProfileSettings = () => {
    return (
        <div className="bg-card rounded-2xl p-6 shadow-card space-y-4 text-right">
            <h3 className="font-semibold text-lg">إعدادات الحساب</h3>

            <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                        <User className="w-4 h-4 ml-3" />
                        تعديل المعلومات الشخصية
                    </div>
                </Button>
                <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                        <Mail className="w-4 h-4 ml-3" />
                        تغيير البريد الإلكتروني
                    </div>
                </Button>
                <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                        <Phone className="w-4 h-4 ml-3" />
                        تغيير رقم الهاتف
                    </div>
                </Button>
                <Button variant="outline" className="w-full justify-between text-destructive hover:text-destructive">
                    <div className="flex items-center">
                        <LogOut className="w-4 h-4 ml-3" />
                        تسجيل الخروج
                    </div>
                </Button>
            </div>
        </div>
    );
};
