export default function AdsHome() {
  const images = ["/window.svg", "/next.svg", "/file.svg", "/globe.svg"];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-100">
      {images.map((src, index) => (
        <div
          key={index}
          className="flex justify-center items-center w-full sm:w-[48%] md:w-[23%] h-40 bg-white rounded"
        >
          <img
            src={src}
            alt={`img-${index}`}
            className="max-h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}
