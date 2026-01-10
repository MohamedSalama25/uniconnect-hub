import { create } from 'zustand';

interface ImageViewerStore {
    isOpen: boolean;
    imageUrl: string | null;
    open: (url: string) => void;
    close: () => void;
}

export const useImageViewerStore = create<ImageViewerStore>((set) => ({
    isOpen: false,
    imageUrl: null,
    open: (url: string) => set({ isOpen: true, imageUrl: url }),
    close: () => set({ isOpen: false, imageUrl: null }),
}));
