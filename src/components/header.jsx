"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import DropdownCard from "./atom/dropdownCard";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    { label: "HomePage", href: "/" },
    { label: "News", href: "/" },
    { label: "Fibonacci", href: "/fibonacci" },
    {
      label: "Product",
      isDropdown: true,
      dropdownItems: ["Google", "Facebook", "Google", "Facebook"],
    },
    { label: "Transaksi", href: "/list-transaksi" },
    { label: "Login", href: "/login" },
  ];

  const toggleDropdown = (label) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-bold">PartnerIklan.com</div>

        <nav className="hidden md:flex space-x-4">
          {menuItems.map((item, index) =>
            item.isDropdown ? (
              <DropdownCard
                key={index}
                title={item.label}
                items={item.dropdownItems}
              />
            ) : (
              <a key={index} href={item.href} className="text-white no-underline hover:underline">
                {item.label}
              </a>
            )
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col space-y-2 dark:bg-gray-700 bg-gray-700">
          {menuItems.map((item, index) =>
            item.isDropdown ? (
              <div key={index}>
                <span
                  className=" cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown(item.label)}
                >
                  {item.label}
                  <span>{activeDropdown === item.label ? "▲" : "▼"}</span>
                </span>

                {activeDropdown === item.label && (
                  <div className="pl-4 mt-2 flex flex-col space-y-1">
                    {item.dropdownItems.map((subItem, idx) => (
                      <span
                        key={idx}
                        className=" cursor-pointer text-sm"
                      >
                        {subItem}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={index} href={item.href} className="">
                {item.label}
              </a>
            )
          )}
        </nav>
      )}
    </header>
  );
}
