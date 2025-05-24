import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function Banner() {
  const banners = ["/window.svg", "/next.svg", "/file.svg", "/globe.svg"];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = (index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <div
      ref={emblaRef}
      className="relative group w-full h-[400px] bg-white overflow-hidden border-b border-gray-300"
    >
      <div className="flex items-center h-full">
        {banners.map((src, index) => (
          <div
            className="min-w-full flex justify-center items-center h-full"
            key={index}
          >
            <img
              src={src}
              alt={`Banner ${index}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 
                    w-10 h-10 flex items-center justify-center
                    bg-black/50 text-white border border-white 
                    rounded-full opacity-0 group-hover:opacity-100 
                    transition"
      >
        {"<"}
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 
                    w-10 h-10 flex items-center justify-center
                    bg-black/50 text-white border border-white 
                    rounded-full opacity-0 group-hover:opacity-100 
                    transition"
      >
        {">"}
      </button>

      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {banners.map((_, index) => (
          <div
            key={index}
            onClick={() => scrollTo(index)}
            className={
              "w-3 h-3 rounded-full bg-black cursor-pointer transition-all duration-300 " +
              (index === selectedIndex ? "opacity-100 scale-125" : "opacity-50")
            }
          />
        ))}
      </div>
    </div>
  );
}
