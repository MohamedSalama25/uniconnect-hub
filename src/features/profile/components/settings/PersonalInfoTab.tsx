import { User, Mail, Phone, GraduationCap, AlignRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PersonalInfoTabProps {
    formData: any;
    setFormData: (data: any) => void;
    handleSave: (section: string) => void;
}

export const PersonalInfoTab = ({ formData, setFormData, handleSave }: PersonalInfoTabProps) => {
    return (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6 border-b text-right">
                <CardTitle className="text-xl">تعديل الملف الشخصي</CardTitle>
                <CardDescription>قم بتحديث معلوماتك الشخصية التي تظهر للآخرين.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold">الاسم الكامل</Label>
                        <div className="relative">
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="pr-10 h-12 rounded-xl focus-visible:ring-primary text-right"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold">البريد الإلكتروني</Label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="pr-10 h-12 rounded-xl focus-visible:ring-primary text-right"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-bold">رقم الهاتف</Label>
                        <div className="relative">
                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="pr-10 h-12 rounded-xl focus-visible:ring-primary text-right"
                                dir="ltr"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="university" className="text-sm font-bold">الجامعة</Label>
                        <div className="relative">
                            <GraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="university"
                                value={formData.university}
                                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                className="pr-10 h-12 rounded-xl focus-visible:ring-primary text-right"
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-bold">نبذة تعريفية</Label>
                    <div className="relative">
                        <AlignRight className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="pr-10 min-h-[120px] rounded-xl focus-visible:ring-primary resize-none p-3 pt-3 text-right"
                        />
                    </div>
                </div>
                <div className="pt-4 flex justify-start">
                    <Button onClick={() => handleSave('المعلومات الشخصية')} className="rounded-xl px-8 py-6 h-auto gap-2 text-lg font-bold shadow-lg shadow-primary/20">
                        <Save className="w-5 h-5" />
                        حفظ التغييرات
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
