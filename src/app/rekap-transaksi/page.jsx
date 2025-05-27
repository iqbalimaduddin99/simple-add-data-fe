"use client";

import React, { useEffect, useState } from "react";
import api from "./../../lib/api";
// import { useRouter } from "next/router";

const masterCategories = [
  { id: 1, name: "Income" },
  { id: 2, name: "Expense" },
];

export default function RekapTransaksiPage() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  // const router = useRouter();

  const [rekapData, setRekapData] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const fetchRekap = async () => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    if (categoryId) params.append("category_id", categoryId);

    try {
      const res = await api.get(`/transactions/rekap?${params.toString()}`);
      setRekapData(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch rekap data", err);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, [dateFrom, dateTo, categoryId]);

  const isFilterActive = dateFrom || dateTo || categoryId;

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCategoryId("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // router.push("/");
    window.location.href = "/";
  };

  return (
    <div className="flex dark:bg-white dark:text-black">
      {/* <Sidebar /> */}
      <div className="w-64 h-screen bg-gray-50 p-4 shadow-lg w-[18%]">
        <ul>
          <li>
            <a
              href="/"
              className="block py-3 px-4 text-gray-800 hover:bg-gray-200 border-b border-gray-300"
            >
              Dashboard
            </a>
          </li>

          <li>
            <button
              onClick={() => toggleMenu("dashboard")}
              className="flex justify-between items-center w-full text-left py-3 px-4 text-gray-800 hover:bg-gray-200 border-b border-gray-300"
            >
              Data Transaksi
              <span>{openMenu === "dashboard" ? "▲" : "▼"}</span>
            </button>
            {openMenu === "dashboard" && (
              <ul className="pl-6">
                <li>
                  <a
                    href="/tambah-transaksi"
                    className="block py-2 px-2 text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-100"
                  >
                    Tambah Data Transaksi
                  </a>
                </li>
                <li>
                  <a
                    href="/list-transaksi"
                    className="block py-2 px-2 text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-100"
                  >
                    List Data Transaksi
                  </a>
                </li>
                <li>
                  <a
                    href="/rekap-transaksi"
                    className="block py-2 px-2 text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-100"
                  >
                    Rekap Data Transaksi
                  </a>
                </li>
              </ul>
            )}
          </li>

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </ul>
      </div>
      <div className="p-6  w-[82%]">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Rekap Transaksi</h2>

          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex gap-2">
              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Reset Filter
                </button>
              )}
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
                placeholder="Dari"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
                placeholder="Sampai"
              />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="">Semua Kategori</option>
                {masterCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border-b text-left">Tanggal</th>
                <th className="px-3 py-2 border-b text-left">Kategori</th>
                <th className="px-3 py-2 border-b text-left">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {rekapData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    Tidak ada data rekap.
                  </td>
                </tr>
              ) : (
                rekapData.map(({ date, category, nominal }, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-3 py-2">{date}</td>
                    <td className="px-3 py-2">{category}</td>
                    <td className="px-3 py-2">
                      {nominal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
