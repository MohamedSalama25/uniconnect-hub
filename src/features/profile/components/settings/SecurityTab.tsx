import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurityTabProps {
    handleSave: (section: string) => void;
}

export const SecurityTab = ({ handleSave }: SecurityTabProps) => {
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
                        <PasswordInput placeholder="••••••••" className="h-12 rounded-xl text-right" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold block">كلمة المرور الجديدة</Label>
                        <PasswordInput placeholder="••••••••" className="h-12 rounded-xl text-right" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold block">تأكيد كلمة المرور الجديدة</Label>
                        <PasswordInput placeholder="••••••••" className="h-12 rounded-xl text-right" />
                    </div>
                </div>
                <div className="pt-4 flex justify-start">
                    <Button onClick={() => handleSave('الأمان')} className="rounded-xl px-8 py-6 h-auto gap-2 text-lg font-bold shadow-lg shadow-primary/20">
                        <Shield className="w-5 h-5" />
                        تغيير كلمة المرور
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
