import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/cards/ServiceCard";
import type { Service } from "@/data/mockData";
import { cn } from "@/lib/utils";
import React from "react";

interface LandingFeaturedServicesProps {
    sectionRef: React.RefObject<HTMLElement>;
    isVisible: boolean;
    services: Service[];
}

export const LandingFeaturedServices = ({ sectionRef, isVisible, services }: LandingFeaturedServicesProps) => {
    const navigate = useNavigate();

    return (
        <section ref={sectionRef} className="py-24 bg-muted/50">
            <div className="container mx-auto px-6 text-right">
                <div className={cn("flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-r-4 border-purple-500 pr-6", isVisible ? "animate-slide-right" : "opacity-0 translate-x-[-20px]")}>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 justify-end text-purple-500 font-bold">
                            <Briefcase className="w-6 h-6" />
                            <span className="uppercase tracking-widest text-sm">خدماتنا</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black">خدمات قريبة منك</h2>
                        <p className="text-muted-foreground text-lg max-w-lg">كل ما تحتاجه من خدمات أساسية في محيطك الجامعي بأسعار منافسة.</p>
                    </div>
                    <Button variant="outline" className="rounded-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all h-12 px-8 font-bold gap-2 group" onClick={() => navigate("/login")}>
                        مشاهدة الكل <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <div key={service.id} className={cn(isVisible ? "animate-slide-up" : "opacity-0 translate-y-4", index === 0 ? "animate-delay-100" : index === 1 ? "animate-delay-200" : "")}>
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
