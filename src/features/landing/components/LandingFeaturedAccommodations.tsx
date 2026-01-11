import { useNavigate } from "react-router-dom";
import { Hotel, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccommodationCard } from "@/components/cards/AccommodationCard";
import type { Accommodation } from "@/data/mockData";
import { cn } from "@/lib/utils";
import React from "react";

interface LandingFeaturedAccommodationsProps {
    sectionRef: React.RefObject<HTMLElement>;
    isVisible: boolean;
    accommodations: Accommodation[];
}

export const LandingFeaturedAccommodations = ({ sectionRef, isVisible, accommodations }: LandingFeaturedAccommodationsProps) => {
    const navigate = useNavigate();

    return (
        <section ref={sectionRef} className="py-24">
            <div className="container mx-auto px-6 text-right">
                <div className={cn("flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-r-4 border-primary pr-6", isVisible ? "animate-slide-right" : "opacity-0 translate-x-[-20px]")}>
                    <div className="space-y-4">
                        {/* <div className="flex items-center gap-2 justify-end text-primary font-bold">
                            <Hotel className="w-6 h-6" />
                            <span className="uppercase tracking-widest text-sm">أفضل العروض</span>
                        </div> */}
                        <h2 className="text-4xl md:text-5xl font-black">سكن طلابي متميز</h2>
                        <p className="text-muted-foreground text-lg max-w-lg">مجموعة مختارة من أفضل خيارات السكن المناسبة لميزانية واحتياجات الطلاب.</p>
                    </div>
                    <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all h-12 px-8 font-bold gap-2 group" onClick={() => navigate("/login")}>
                        مشاهدة الكل <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {accommodations.map((acc, index) => (
                        <div key={acc.id} className={cn(isVisible ? "animate-slide-up" : "opacity-0 translate-y-4", index === 0 ? "animate-delay-100" : index === 1 ? "animate-delay-200" : "animate-delay-300")}>
                            <AccommodationCard accommodation={acc} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
