import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface NotificationsTabProps {
    handleSave: (section: string) => void;
}

export const NotificationsTab = ({ handleSave }: NotificationsTabProps) => {
    return (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6 border-b text-right">
                <CardTitle className="text-xl">الإشعارات</CardTitle>
                <CardDescription>تحكم في كيفية وصول التنبيهات إليك.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border gap-4" dir="rtl">
                        <div className="space-y-1 text-right">
                            <p className="font-bold">إشعارات البريد الإلكتروني</p>
                            <p className="text-sm text-muted-foreground">تلقي تحديثات عن منشوراتك ورسائلك عبر البريد.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border gap-4" dir="rtl">
                        <div className="space-y-1 text-right">
                            <p className="font-bold">تنبيهات المتصفح</p>
                            <p className="text-sm text-muted-foreground">تلقي إشعارات فورية عند وجود رسائل جديدة.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border gap-4" dir="rtl">
                        <div className="space-y-1 text-right">
                            <p className="font-bold">إشعارات العروض الجديدة</p>
                            <p className="text-sm text-muted-foreground">تنبيهك عند إضافة سكن أو خدمات قريبة منك.</p>
                        </div>
                        <Switch />
                    </div>
                </div>
                <div className="pt-4 flex justify-start">
                    <Button onClick={() => handleSave('الإشعارات')} className="rounded-xl px-8 py-6 h-auto gap-2 text-lg font-bold shadow-lg shadow-primary/20">
                        <Bell className="w-5 h-5" />
                        حفظ الإعدادات
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
