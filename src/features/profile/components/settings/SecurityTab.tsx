import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/features/auth/services/auth.service';
import { toast } from 'sonner';

export const SecurityTab = () => {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleSubmit = async () => {
        if (!passwords.new || !passwords.current) {
            toast.error("يرجى إدخال كلمة المرور");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            toast.error("كلمة المرور الجديدة غير متطابقة");
            return;
        }

        setIsLoading(true);
        try {
            await authService.changePassword(user?.token || '', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });

            toast.success("تم تغيير كلمة المرور بنجاح");
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            toast.error(error.message || "فشل تغيير كلمة المرور");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6 border-b text-right">
                <CardTitle className="text-xl">الأمان والحماية</CardTitle>
                <CardDescription>قم بتحديث كلمة المرور وإعدادات الأمان الخاصة بحسابك.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
                <div className="space-y-4 max-w-md mr-0 ml-auto">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold block">كلمة المرور الحالية</Label>
                        <PasswordInput
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            placeholder="••••••••"
                            className="h-12 rounded-xl text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold block">كلمة المرور الجديدة</Label>
                        <PasswordInput
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            placeholder="••••••••"
                            className="h-12 rounded-xl text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold block">تأكيد كلمة المرور الجديدة</Label>
                        <PasswordInput
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            placeholder="••••••••"
                            className="h-12 rounded-xl text-right"
                        />
                    </div>
                </div>
                <div className="pt-4 flex justify-start">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="rounded-xl px-8 py-6 h-auto gap-2 text-lg font-bold shadow-lg shadow-primary/20"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                        تغيير كلمة المرور
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
