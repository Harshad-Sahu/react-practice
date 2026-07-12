import { useRef, useState, useEffect, useCallback, memo } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import type { ImageData } from "../../types/ComponentTypes";
import {
  API_ENDPOINT,
  IMAGES_PER_SWIPE,
} from "../../constants/CarouselConstants";

const ImageCard = memo(({ image }: { image: ImageData }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-gray-400 rounded-xl w-72 h-80 flex items-center justify-center overflow-hidden mx-4 flex-shrink-0 relative">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      )}

      {imageError ? (
        <div className="text-gray-600 text-center px-4">
          <svg
            className="w-16 h-16 mx-auto mb-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">Image unavailable</p>
        </div>
      ) : (
        <img
          src={image.download_url}
          alt={`Photo by ${image.author}`}
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
});

ImageCard.displayName = "ImageCard";

const ImageCarousel = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isScrollingRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_ENDPOINT);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: ImageData[] = await res.json();
      setImageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch images");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create infinite loop by tripling the array
  const infiniteImages = [...imageData, ...imageData, ...imageData];

  // Initialize scroll position to center section
  useEffect(() => {
    if (imageData.length > 0 && scrollRef.current) {
      const el = scrollRef.current;
      const imageCard = el.children[0] as HTMLElement;
      if (imageCard) {
        const cardWidth = imageCard.offsetWidth + 32;
        // Start at the middle section (original data)
        el.scrollLeft = cardWidth * imageData.length;
      }
    }
  }, [imageData.length]);

  // Handle infinite scroll loop
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isScrollingRef.current || imageData.length === 0) return;

    const imageCard = el.children[0] as HTMLElement;
    if (!imageCard) return;

    const cardWidth = imageCard.offsetWidth + 32;
    const sectionWidth = cardWidth * imageData.length;
    const scrollPos = el.scrollLeft;

    // If scrolled past right section, jump back to center
    if (scrollPos >= sectionWidth * 2) {
      isScrollingRef.current = true;
      el.scrollLeft = scrollPos - sectionWidth;
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 50);
    }
    // If scrolled before left section, jump forward to center
    else if (scrollPos <= 0) {
      isScrollingRef.current = true;
      el.scrollLeft = scrollPos + sectionWidth;
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 50);
    }
  }, [imageData.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const scrollByImages = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;

    const imageCard = el.children[0] as HTMLElement;
    const cardWidth = imageCard.offsetWidth + 32;
    const scrollAmount = cardWidth * IMAGES_PER_SWIPE;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, direction: "left" | "right") => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollByImages(direction);
      }
    },
    [scrollByImages],
  );

  if (loading) {
    return (
      <div className="h-screen w-full p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full p-8 flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={fetchData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (imageData.length === 0) {
    return (
      <div className="h-screen w-full p-8 flex flex-col items-center justify-center">
        <p className="text-gray-600">No images to display</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full p-8 flex flex-col items-center relative">
      <h1 className="text-2xl font-semibold text-gray-900">
        Image Carousel{" "}
        <span className="text-sm text-gray-500">(Infinite Loop)</span>
      </h1>

      <div className="mt-6 w-full relative">
        {/* Left Arrow - Always enabled for infinite scroll */}
        <button
          onClick={() => scrollByImages("left")}
          onKeyDown={(e) => handleKeyDown(e, "left")}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 bg-gray-700 hover:bg-gray-600 cursor-pointer text-white">
          <FaAngleLeft size={24} aria-hidden="true" />
        </button>

        {/* Right Arrow - Always enabled for infinite scroll */}
        <button
          onClick={() => scrollByImages("right")}
          onKeyDown={(e) => handleKeyDown(e, "right")}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 bg-gray-700 hover:bg-gray-600 cursor-pointer text-white">
          <FaAngleRight size={24} aria-hidden="true" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          role="region"
          aria-label="Image carousel with infinite scroll"
          className="flex items-center overflow-x-auto scroll-smooth py-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
          {infiniteImages.map((image, index) => (
            <ImageCard key={`${image.id}-${index}`} image={image} />
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 text-sm text-gray-600">
        {imageData.length} unique images • Infinite scrolling enabled
      </div>
    </div>
  );
};

export default ImageCarousel;
