import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatImageUrl } from "@/lib/utils";
import { useImageViewerStore } from "@/store/useImageViewerStore";
import { ZoomIn } from "lucide-react";

interface AccommodationImageSliderProps {
    images: string[];
    type: 'shared' | 'private';
    title: string;
}

export const AccommodationImageSlider = ({ images, type, title }: AccommodationImageSliderProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: 'rtl' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const openImageViewer = useImageViewerStore(state => state.open);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden bg-muted aspect-[4/3] md:aspect-[16/9] shadow-lg">
            <div className="embla overflow-hidden h-full" ref={emblaRef}>
                <div className="embla__container flex h-full">
                    {images.map((img, index) => (
                        <div className="embla__slide flex-[0_0_100%] min-w-0" key={index}>
                            <div
                                className="relative w-full h-full cursor-zoom-in"
                                onClick={() => openImageViewer(formatImageUrl(img)!)}
                            >
                                <img
                                    src={formatImageUrl(img)}
                                    alt={`${title} - ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="w-12 h-12 text-white drop-shadow-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute inset-x-2 md:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg pointer-events-auto bg-white/80 backdrop-blur-sm"
                    onClick={scrollPrev}
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
                <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg pointer-events-auto bg-white/80 backdrop-blur-sm"
                    onClick={scrollNext}
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
            </div>

            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === selectedIndex ? "bg-white w-6" : "bg-white/50"
                        )}
                    />
                ))}
            </div>

            <div className="absolute top-6 right-6">
                <Badge className="bg-primary/90 backdrop-blur-md px-4 py-1.5 text-md font-bold">
                    {type === 'private' ? 'سكن خاص' : 'سكن مشترك'}
                </Badge>
            </div>
        </div>
    );
};
