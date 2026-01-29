import { useState, useEffect, useRef } from "react";
import { LandingNavbar } from "../components/LandingNavbar";
import { LandingHero } from "../components/LandingHero";
import { LandingFeatures } from "../components/LandingFeatures";
import { LandingFeaturedAccommodations } from "../components/LandingFeaturedAccommodations";
import { LandingFeaturedServices } from "../components/LandingFeaturedServices";
import { LandingFooter } from "../components/LandingFooter";
import { useMainPageData } from "@/features/dashboard/hooks/useMainPageData";

export const LandingTemplate = () => {
    const { data } = useMainPageData();
    const [isDark, setIsDark] = useState(false);

    // Refs for IntersectionObserver
    const featureSectionRef = useRef<HTMLElement>(null);
    const [featureSectionVisible, setFeatureSectionVisible] = useState(false);

    const accommodationSectionRef = useRef<HTMLElement>(null);
    const [accommodationSectionVisible, setAccommodationSectionVisible] = useState(false);

    const servicesSectionRef = useRef<HTMLElement>(null);
    const [servicesSectionVisible, setServicesSectionVisible] = useState(false);

    const footerRef = useRef<HTMLElement>(null);
    const [footerVisible, setFooterVisible] = useState(false);


    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setFeatureSectionVisible(true);
                    featureObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const accommodationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setAccommodationSectionVisible(true);
                    accommodationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const servicesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setServicesSectionVisible(true);
                    servicesObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setFooterVisible(true);
                    footerObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (featureSectionRef.current) featureObserver.observe(featureSectionRef.current);
        if (accommodationSectionRef.current) accommodationObserver.observe(accommodationSectionRef.current);
        if (servicesSectionRef.current) servicesObserver.observe(servicesSectionRef.current);
        if (footerRef.current) footerObserver.observe(footerRef.current);

        return () => {
            if (featureSectionRef.current) featureObserver.unobserve(featureSectionRef.current);
            if (accommodationSectionRef.current) accommodationObserver.unobserve(accommodationSectionRef.current);
            if (servicesSectionRef.current) servicesObserver.unobserve(servicesSectionRef.current);
            if (footerRef.current) footerObserver.unobserve(footerRef.current);
        };
    }, []);


    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const featuredServices = data?.readServices?.slice(0, 2) || [];
    const featuredAccommodations = data?.readHouse?.slice(0, 3) || [];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300" dir="rtl">
            <LandingNavbar isDark={isDark} onToggleTheme={toggleTheme} />
            <main>
                <LandingHero />
                <LandingFeatures
                    sectionRef={featureSectionRef}
                    isVisible={featureSectionVisible}
                />
                <LandingFeaturedAccommodations
                    sectionRef={accommodationSectionRef}
                    isVisible={accommodationSectionVisible}
                    accommodations={featuredAccommodations}
                />
                <LandingFeaturedServices
                    sectionRef={servicesSectionRef}
                    isVisible={servicesSectionVisible}
                    services={featuredServices}
                />
            </main>
            <LandingFooter
                footerRef={footerRef}
                isVisible={footerVisible}
            />
        </div>
    );
};
