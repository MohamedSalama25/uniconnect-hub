import { useImageViewerStore } from "@/store/useImageViewerStore";
import { X, ZoomIn, ZoomOut, Download, RotateCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const GlobalImageViewer = () => {
    const { isOpen, imageUrl, close } = useImageViewerStore();
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setScale(1);
            setRotation(0);
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, close]);

    if (!isOpen || !imageUrl) return null;

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
            {/* Toolbar */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={close}>
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleZoomOut}>
                        <ZoomOut className="w-5 h-5" />
                    </Button>
                    <span className="text-white font-mono text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleZoomIn}>
                        <ZoomIn className="w-5 h-5" />
                    </Button>
                    <div className="w-px h-6 bg-white/20 mx-2" />
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleRotate}>
                        <RotateCw className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleDownload}>
                        <Download className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Image Container */}
            <div
                className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden cursor-grab active:cursor-grabbing"
                onClick={(e) => e.target === e.currentTarget && close()}
            >
                <img
                    src={imageUrl}
                    alt="View"
                    className="max-w-full max-h-full object-contain transition-transform duration-200 shadow-2xl"
                    style={{
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                    }}
                    onDoubleClick={() => setScale(prev => prev === 1 ? 2 : 1)}
                />
            </div>

            <div className="absolute bottom-6 text-white/50 text-sm pointer-events-none">
                انقر مرتين للتكبير • اضغط ESC للإغلاق
            </div>
        </div>
    );
};
