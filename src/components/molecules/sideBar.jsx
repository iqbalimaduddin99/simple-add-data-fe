'use client';

import React, { useState } from "react";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div className="w-64 h-screen bg-gray-50 p-4 shadow-lg">
      <ul>
        <li>
          <a
            href="/"
            className="block py-3 px-4 text-gray-800 hover:bg-gray-200 border-b border-gray-300"
          >
            Dashboardxasdfasd
          </a>
        </li>

        <li>
          <button
            onClick={() => toggleMenu("dashboard")}
            className="w-full text-left py-3 px-4 text-gray-800 hover:bg-gray-200 border-b border-gray-300"
          >
            Data Transaksi
          </button>
          {openMenu === "dashboard" && (
            <ul className="pl-6">
              <li>
                <a
                  href="/dashboard/overview"
                  className="block py-2 px-2 text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-100"
                >
                  Tambah Data Transaksi
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/analytics"
                  className="block py-2 px-2 text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-100"
                >
                  List Data Transaksi
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/settings"
                  className="block py-2 px-2 text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-100"
                >
                  Rekap Data Transaksi
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
