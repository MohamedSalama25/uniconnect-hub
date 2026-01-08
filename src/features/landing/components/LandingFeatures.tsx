import { Shield, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: string;
    animation?: string;
    isVisible: boolean;
}

const FeatureCard = ({ icon, title, description, delay, animation, isVisible }: FeatureCardProps) => (
    <div className={cn("p-10 rounded-[2rem] bg-card border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group text-right", isVisible ? animation : "opacity-0 translate-y-4", delay)}>
        <div className="mb-6 p-4 rounded-2xl bg-muted w-fit mr-auto group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg">
            {description}
        </p>
    </div>
);

interface LandingFeaturesProps {
    sectionRef: React.RefObject<HTMLElement>;
    isVisible: boolean;
}

export const LandingFeatures = ({ sectionRef, isVisible }: LandingFeaturesProps) => {
    return (
        <section ref={sectionRef} className="py-20 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className={cn("text-center mb-16", isVisible ? "animate-slide-up" : "opacity-0 translate-y-4")}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا يوني كونكت؟</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">نحن ندرك التحديات التي تواجه الطلاب، ولذلك قمنا ببناء حل شامل يسهل عليك كل شيء.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-primary" />}
                        title="أمان تام"
                        description="جميع التعاملات والبيانات مشفرة ومحمية بأعلى المعايير."
                        delay="animate-delay-100"
                        animation="animate-slide-right"
                        isVisible={isVisible}
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-500" />}
                        title="سرعة فائقة"
                        description="احصل على خدماتك في دقائق معدودة وبضغطة زر واحدة."
                        delay="animate-delay-200"
                        animation="animate-slide-up"
                        isVisible={isVisible}
                    />
                    <FeatureCard
                        icon={<Globe className="w-8 h-8 text-blue-500" />}
                        title="مجتمع متكامل"
                        description="تواصل مع زملائك وتبادل الخبرات والمعلومات بسهولة."
                        delay="animate-delay-300"
                        animation="animate-slide-left"
                        isVisible={isVisible}
                    />
                </div>
            </div>
        </section>
    );
};
