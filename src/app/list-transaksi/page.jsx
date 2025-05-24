"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";

const masterCategories = [
  { id: 1, name: "Income" },
  { id: 2, name: "Exchange" },
];

export default function TransactionListPage() {
  //Sidebar
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date_paid");
  const [sortOrder, setSortOrder] = useState("asc");
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: null,
    code: "",
  });

  const openConfirmDelete = (id, code) => {
    setConfirmDelete({ open: true, id, code });
  };

  const closeConfirmDelete = () => {
    setConfirmDelete({ open: false, id: null, code: "" });
  };

  const handleConfirmedDelete = async () => {
    try {
      await api.delete(`/transactions/${confirmDelete.id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to delete", err);
    }
    closeConfirmDelete();
  };

  const fetchTransactions = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (categoryId) params.append("category_id", categoryId);
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    params.append("sort_by", sortBy);
    params.append("sort_order", sortOrder);

    try {
      const res = await api.get(
        `/transactions/filter-data?${params.toString()}`
      );
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, categoryId, dateFrom, dateTo, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const isFilterActive = search || categoryId || dateFrom || dateTo;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); 
  };

  return (
    <div className="flex">
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm text-center shadow-lg">
            <h3 className="text-lg font-bold mb-4">Peringatan!</h3>
            <p className="mb-6">
              Jika Anda klik hapus, maka akan menghapus semua transaksi dengan
              code <b>{confirmDelete.code}</b>.<br />
              Masuk ke halaman edit untuk menghapus detail transaksi.
              <br />
              <br />
              Tetap hapus?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmedDelete}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Ya
              </button>
              <button
                onClick={closeConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

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
      <div className="p-6 w-[82%]">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Daftar Transaksi</h2>

          <div className="flex justify-between mb-4">
            <Link href="/tambah-transaksi">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Tambah Transaksi
              </button>
            </Link>

            <div className="flex gap-2">
              {isFilterActive && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryId("");
                    setDateFrom("");
                    setDateTo("");
                  }}
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
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari..."
                className="border px-2 py-1 rounded text-sm"
              />
            </div>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  ["No", ""],
                  ["Desc", "desc"],
                  ["Code", "code"],
                  ["Rate Euro", "rate_euro"],
                  ["Date Paid", "date_paid"],
                  ["Kategori", "category_id"],
                  ["Nama Transaksi", "detail_name"],
                  ["Nominal", "value_idr"],
                  ["Aksi", ""],
                ].map(([label, key]) => (
                  <th
                    key={label}
                    className="px-3 py-2 border-b cursor-pointer text-left"
                    onClick={() => key && handleSort(key)}
                  >
                    {label}{" "}
                    {key === sortBy && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.flatMap((trx, i) => {
                if (trx.details.length === 0) {
                  return (
                    <tr key={`${trx.id}-empty`} className="border-b">
                      <td className="px-3 py-2 text-left">{i + 1}.0</td>
                      <td className="px-3 py-2 text-left">{trx.desc}</td>
                      <td className="px-3 py-2 text-left">{trx.code}</td>
                      <td className="px-3 py-2 text-left">{trx.rate_euro}</td>
                      <td className="px-3 py-2 text-left">{trx.date_paid}</td>
                      <td className="px-3 py-2 text-left">-</td>
                      <td className="px-3 py-2 text-left">-</td>
                      <td className="px-3 py-2 text-left">-</td>
                      <td className="px-3 py-2 text-left space-x-2">
                        <Link href={`/edit-transaksi/${trx.id}`}>
                          <button className="text-blue-600 hover:underline">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => openConfirmDelete(trx.id, trx.code)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                } else {
                  return trx.details.map((detail, j) => (
                    <tr key={`${trx.id}-${j}`} className="border-b">
                      <td className="px-3 py-2 text-left">
                        {i + 1}.{j + 1}
                      </td>
                      <td className="px-3 py-2 text-left">{trx.desc}</td>
                      <td className="px-3 py-2 text-left">{trx.code}</td>
                      <td className="px-3 py-2 text-left">{trx.rate_euro}</td>
                      <td className="px-3 py-2 text-left">{trx.date_paid}</td>
                      <td className="px-3 py-2 text-left">
                        {masterCategories.find(
                          (c) => c.id === detail.transaction_category_id
                        )?.name || "-"}
                      </td>
                      <td className="px-3 py-2 text-left">{detail.name}</td>
                      <td className="px-3 py-2 text-left">
                        {detail.value_idr}
                      </td>
                      <td className="px-3 py-2 text-left space-x-2">
                        <Link href={`/edit-transaksi/${trx.id}`}>
                          <button className="text-blue-600 hover:underline">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => openConfirmDelete(trx.id, trx.code)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ));
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
