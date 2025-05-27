"use client";

import React, { useState, useEffect } from "react";
// import Sidebar from "../../../components/molecules/sidebar";
import api from "../../../lib/api";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";

const masterCategories = [
  { id: 1, name: "Income" },
  { id: 2, name: "Exchange" },
];

export default function DataTransaction() {
  const { id } = useParams();
  const transactionId = id;
  // Sidebar
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  // const router = useRouter();
  const [desc, setDesc] = useState("");
  const [code, setCode] = useState("");
  const [rateEuro, setRateEuro] = useState("");
  const [datePaid, setDatePaid] = useState("");
  const [details, setDetails] = useState([
    { transaction_category_id: "", name: "", value_idr: "" },
  ]);
  const [removedDetails, setRemovedDetails] = useState([]);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const res = await api.get(`/transactions/${transactionId}`);

        if (res.data) {
          const data = res.data.data;
          console.log(data);

          setDesc(data.desc || "");
          setCode(data.code || "");
          setRateEuro(data.rate_euro?.toString() || "");
          setDatePaid(data.date_paid || "");
          const mappedDetails = data.details.map((d) => ({
            transaction_category_id: d.transaction_category_id,
            name: d.name,
            value_idr: d.value_idr.toString(),
            id: d.id,
          }));
          setDetails(
            mappedDetails.length
              ? mappedDetails
              : [{ transaction_category_id: "", name: "", value_idr: "" }]
          );
        }
      } catch (error) {
        console.error("Gagal fetch transaksi:", error);
      }
    }

    fetchTransaction();
  }, [transactionId]);

  const groupedDetails = details.reduce((acc, item, idx) => {
    if (!item.transaction_category_id) return acc;
    if (!acc[item.transaction_category_id])
      acc[item.transaction_category_id] = [];
    acc[item.transaction_category_id].push({ ...item, idx });
    return acc;
  }, {});

  const handleDetailChange = (idx, field, value) => {
    const newDetails = [...details];
    newDetails[idx][field] = value;
    setDetails(newDetails);
  };

  const addDetail = (categoryId) => {
    setDetails([
      ...details,
      { transaction_category_id: categoryId, name: "", value_idr: "" },
    ]);
  };
  const removeDetail = (idx) => {
    const itemToRemove = details[idx];
    const newDetails = details.filter((_, i) => i !== idx);

    if (itemToRemove.id) {
      setRemovedDetails((prev) => [
        ...prev,
        { ...itemToRemove, destroy: true },
      ]);
    }

    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      desc,
      code,
      rate_euro: Number(rateEuro),
      date_paid: datePaid,
      details: [
        ...details
          .filter((d) => d.transaction_category_id && d.name && d.value_idr)
          .map((d) => ({
            transaction_category_id: Number(d.transaction_category_id),
            name: d.name,
            value_idr: Number(d.value_idr),
            ...(d.id && { id: d.id }),
            destroy: d.destroy || false,
          })),
        ...removedDetails.map((d) => ({
          transaction_category_id: Number(d.transaction_category_id),
          name: d.name,
          value_idr: Number(d.value_idr),
          ...(d.id && { id: d.id }),
          destroy: true,
        })),
      ],
    };

    console.log("Submit payload:", payload);

    try {
      const res = await api.put(`/transactions/${transactionId}`, payload);
      const json = await res.data;

      if (!json.success) {
        console.error("Update gagal:", json);
        showToast("Gagal mengedit transaksi", "error");

        return;
      }

      console.log("Update sukses:", json);
      showToast("Transaksi berhasil diedit", "success");
    } catch (error) {
      showToast("Terjadi kesalahan saat mengirim data", "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
      if (type === "success") {
        // router.push("/list-transaksi");
        window.location.href = "/list-transaksi";
      }
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // router.push("/");
    window.location.href = "/";
  };

  return (
    <div className="flex dark:bg-white dark:text-black">
      {toast && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow text-white text-center z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {confirmDeleteIdx !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-white rounded-lg p-6 shadow-md w-80 text-center">
            <p className="mb-4">
              Anda yakin ingin delete detail transaksi ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  removeDetail(confirmDeleteIdx);
                  setConfirmDeleteIdx(null);
                }}
              >
                Ya
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setConfirmDeleteIdx(null)}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
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

      <form onSubmit={handleSubmit} className="space-y-6 p-4 w-[82%]">
        <h2 className="text-2xl font-bold mb-4">Edit Data Transaksi</h2>

        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Deskripsi transaksi"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              style={{ minHeight: "13rem" }}
              required
            />
          </div>

          <div className="flex flex-col gap-4 w-1/3">
            <div>
              <label className="block font-semibold mb-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Kode transaksi"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Rate Euro</label>
              <input
                type="number"
                value={rateEuro}
                onChange={(e) => setRateEuro(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Rate Euro"
                required
                min={0}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Date Paid</label>
              <input
                type="date"
                value={datePaid}
                onChange={(e) => setDatePaid(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-300 rounded p-4 shadow-md space-y-6">
          {masterCategories.map((cat) => {
            const catDetails = groupedDetails[cat.id] || [];

            return (
              <div key={cat.id} className="border border-gray-200 rounded p-4">
                <div className="flex items-start gap-4">
                  <h3 className="font-semibold mb-4">Category :</h3>
                  <p className="mb-4">{cat.name}</p>
                </div>

                <div className="flex items-start gap-4">
                  <table className="w-full border border-gray-300 rounded text-left text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-3 border-b">Nama Transaksi</th>
                        <th className="py-2 px-3 border-b">Nominal (IDR)</th>
                        <th className="py-2 px-3 border-b text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catDetails.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-3 px-3 text-center text-gray-500"
                          >
                            Belum ada transaksi di kategori ini
                          </td>
                        </tr>
                      )}
                      {catDetails.map(({ idx }) => (
                        <tr key={idx}>
                          <td className="border-b px-3 py-2">
                            <input
                              type="text"
                              value={details[idx].name}
                              onChange={(e) =>
                                handleDetailChange(idx, "name", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1"
                              placeholder="Nama transaksi"
                              required
                            />
                          </td>
                          <td className="border-b px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              value={details[idx].value_idr}
                              onChange={(e) =>
                                handleDetailChange(
                                  idx,
                                  "value_idr",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1"
                              placeholder="Nominal"
                              required
                            />
                          </td>
                          <td className="border-b px-3 py-2 text-center">
                            <button
                              type="button"
                              className="text-red-600 hover:underline"
                              onClick={() => {
                                if (details[idx]?.id) {
                                  setConfirmDeleteIdx(idx);
                                } else {
                                  removeDetail(idx);
                                }
                              }}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    type="button"
                    className="mb-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => addDetail(cat.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
}
