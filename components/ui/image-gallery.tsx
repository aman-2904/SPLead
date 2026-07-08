import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ImageGalleryProps {
  images: string[];
  isVerified?: boolean;
  className?: string;
}

export function ImageGallery({ images, isVerified = false, className }: ImageGalleryProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Gallery split grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[280px] md:h-[380px] rounded-2xl overflow-hidden border border-accent/20 shadow-md">
        {/* Large Feature image */}
        <div 
          onClick={() => { setActiveIndex(0); setShowLightbox(true); }}
          className="md:col-span-2 relative h-full w-full overflow-hidden group cursor-pointer"
        >
          <img 
            src={images[0]} 
            alt="Feature Wedding Scene"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out" 
          />
          {isVerified && (
            <div className="absolute top-3 left-3 bg-primary text-secondary text-[8px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-accent/30 shadow-md">
              <ShieldCheck className="h-3 w-3 text-accent" /> Verified Location
            </div>
          )}
        </div>

        {/* Thumbnail stack */}
        <div className="hidden md:grid grid-rows-3 gap-3 h-full">
          {images.slice(1, 4).map((url, idx) => (
            <div 
              key={idx}
              onClick={() => { setActiveIndex(idx + 1); setShowLightbox(true); }}
              className="relative overflow-hidden cursor-pointer h-full w-full group border border-accent/10"
            >
              <img 
                src={url} 
                alt="Wedding Setup Detail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox full screen Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Slider arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-4 p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-4 p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Viewer */}
            <div className="w-full max-w-4xl max-h-[85vh] flex items-center justify-center relative">
              <motion.img 
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={images[activeIndex]} 
                alt="Fullscreen Wedding Detail View"
                className="max-w-full max-h-[80vh] object-contain rounded-xl border border-accent/20" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
