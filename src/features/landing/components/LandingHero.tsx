import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
    const navigate = useNavigate();

    return (
        <section className="h-screen relative overflow-hidden flex items-center justify-center">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-[1.77]"
                >
                    <source src="/Ved/HomePage" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Primary Color Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/50  mix-blend-multiply " />
            </div>

            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse z-10" />

            <div className="container mx-auto text-center relative z-20 px-6">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight animate-slide-up text-white will-change-transform">
                    بوابتك لكل ما تحتاجه <br />
                    <span className="text-white tracking-tight">في حياتك الجامعية</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto animate-slide-up animate-delay-100 leading-relaxed will-change-transform">
                    من السكن إلى الخدمات الطلابية، كل شيء في مكان واحد. انضم الآن لأكثر من 10,000 طالب وطالبة.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-200">
                    <Button onClick={() => navigate("/register")} size="lg" className="rounded-full text-lg px-8 py-6 group shadow-xl hover:shadow-primary/30 transition-all border-none bg-primary text-white">
                        ابدأ الآن مجاناً
                        <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full text-lg px-8 py-6 backdrop-blur-md text-foreground border-white hover:bg-white/10" onClick={() => navigate("/login")}>
                        اكتشف الخدمات
                    </Button>
                </div>
            </div>
        </section>
    );
};
