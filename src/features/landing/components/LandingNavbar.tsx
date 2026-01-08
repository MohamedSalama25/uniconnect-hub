import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingNavbarProps {
    isDark: boolean;
    onToggleTheme: () => void;
}

export const LandingNavbar = ({ isDark, onToggleTheme }: LandingNavbarProps) => {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b animate-fade-in">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        يوني كونكت
                    </span>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleTheme}
                        className="rounded-full w-10 h-10 mr-2"
                    >
                        {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-primary" />}
                    </Button>

                    <Link to="/login" className="hidden md:block text-muted-foreground hover:text-primary transition-colors font-medium ml-4">تسجيل الدخول</Link>

                    <Button onClick={() => navigate("/register")} className="rounded-full px-8 shadow-lg shadow-primary/20">
                        ابدأ الآن
                    </Button>
                </div>
            </div>
        </nav>
    );
};
