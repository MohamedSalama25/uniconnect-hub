import { GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectionProps {
    onSelect: (role: "student" | "provider") => void;
}

export const RoleSelection = ({ onSelect }: RoleSelectionProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <button
                onClick={() => onSelect("student")}
                className={cn(
                    "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-border transition-all duration-300",
                    "hover:border-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-95 group"
                )}
            >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">طالب جامعي</h3>
                <p className="text-sm text-muted-foreground text-center">
                    ابحث عن سكن، مواصلات، أو خدمات جامعية أخرى
                </p>
            </button>

            <button
                onClick={() => onSelect("provider")}
                className={cn(
                    "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-border transition-all duration-300",
                    "hover:border-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-95 group"
                )}
            >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">مقدم خدمة</h3>
                <p className="text-sm text-muted-foreground text-center">
                    اعرض خدماتك (سكن، نقل، إلخ) لآلاف الطلاب
                </p>
            </button>
        </div>
    );
};
