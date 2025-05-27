import { useState, useRef, useEffect } from "react";

export default function SectionItem({ item, reverse }) {
  const [showMore, setShowMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const originalClass = el.className;
    el.className = originalClass.replace("line-clamp-4", "");

    requestAnimationFrame(() => {
      const fullHeight = el.getBoundingClientRect().height;

      el.className = originalClass;

      requestAnimationFrame(() => {
        const clampedHeight = el.getBoundingClientRect().height;

        if (fullHeight > clampedHeight) {
          setIsOverflowing(true);
        }
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      if (!descRef.current || showMore) return;

      const fullHeight = descRef.current.scrollHeight;
      const currentHeight = descRef.current.clientHeight;

      if (fullHeight > currentHeight) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [showMore]);

  return (
    <div
      className={`
    flex gap-4 items-start dark:bg-gray-100 bg-gray-100 p-4 rounded shadow
    flex-col md:flex-row
    ${reverse ? "md:flex-row-reverse md:justify-between" : ""}
  `}
    >
      <div className={`flex dark:text-black justify-center items-center min-w-32 min-h-32 md:min-w-60 md:min-h-60  ${reverse ? "self-end" : ""}`}>
        <img
          src={item.image}
          alt={item.title}
          className="max-h-full object-contain"
        />
      </div>

      <div
        className={`flex flex-col dark:text-black justify-center min-w-32 min-h-32 md:min-w-60 md:min-h-60 `}
      >
        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
        <p
          ref={descRef}
          className={`mb-0 overflow-hidden transition-all duration-300 ${
            !showMore ? "line-clamp-4" : ""
          } `}
        >
          {item.desc}
        </p>
        {isOverflowing && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-2 text-blue-600 hover:underline flex justify-end "
          >
            {showMore ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}
