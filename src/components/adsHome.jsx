export default function AdsHome() {
  const images = ["/bricks-2181920_1280.jpg", "/coding-924920_1280.jpg", "/sevilla-tower-786180_1280.jpg", "/telework-6795505_1280.jpg"];

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
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
