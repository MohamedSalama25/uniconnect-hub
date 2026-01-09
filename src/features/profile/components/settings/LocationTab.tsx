import { Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationPicker } from '@/components/globalComponents/LocationPicker';

interface LocationTabProps {
    formData: any;
    setFormData: (data: any) => void;
    handleSave: (section: string) => void;
}

export const LocationTab = ({ formData, setFormData, handleSave }: LocationTabProps) => {
    return (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6 border-b text-right">
                <CardTitle className="text-xl">الموقع الجغرافي</CardTitle>
                <CardDescription>حدد موقعك الحالي لتسهيل معرفة المسافات بينك وبين الخدمات.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-bold">المدينة</Label>
                        <div className="relative">
                            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="pr-10 h-12 rounded-xl focus-visible:ring-primary text-right"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-bold">تحديد الموقع على الخريطة</Label>
                    <div className="border rounded-2xl overflow-hidden">
                        <LocationPicker
                            onLocationSelect={(loc) => setFormData({ ...formData, location: loc })}
                            defaultLocation={formData.location}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-start">
                    <Button onClick={() => handleSave('الموقع الجغرافي')} className="rounded-xl px-8 py-6 h-auto gap-2 text-lg font-bold shadow-lg shadow-primary/20">
                        <Save className="w-5 h-5" />
                        تحديث الموقع
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
