import { Building, MapPin, Phone } from 'lucide-react';

interface ProfileInfoCardsProps {
    user: any;
}

export const ProfileInfoCards = ({ user }: ProfileInfoCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl text-right">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Building className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">الجامعة</p>
                    <p className="font-medium">{user.universityName || (user as any).university}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl text-right">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">المدينة / العنوان</p>
                    <p className="font-medium">{user.currentAddress || (user as any).city}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl text-right">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                    <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">الهاتف</p>
                    <p className="font-medium" dir="ltr">{user.phonenumber || user.phoneNumber || (user as any).phone}</p>
                </div>
            </div>
        </div>
    );
};
