"use client";

export default function DropdownCard({ title, items = [] }) {
  return (
    <div className="relative group">
      <div className="hover:underline cursor-pointer">{title}</div>
      <div className="absolute top-full left-0 mt-0 bg-white text-black shadow-lg rounded p-4 hidden group-hover:flex flex-col z-50 w-auto whitespace-nowrap">
        {items.map((item, idx) => (
          <span key={idx} className="hover:underline cursor-pointer">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
