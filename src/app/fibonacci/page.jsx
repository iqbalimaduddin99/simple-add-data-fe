"use client";

import { useState } from "react";
import api from "../../lib/api";

import Header from "../../components/header";

export default function FibonacciForm() {
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const payload = { n1, n2 };
      const res = await api.post(`/fibonacci`, payload);
      const json = await res.data;
      if (!json.success) {
        setError(json.message);
      } else {
        setResult(json.data);
      }
    } catch (err) {
      setError("Gagal konek ke backend.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-center dark:text-black">
            Penjumlahan Bilangan Fibonacci
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              value={n1}
              onChange={(e) => setN1(e.target.value)}
              placeholder="Masukkan nilai n1"
              required
              className="dark:text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="number"
              value={n2}
              onChange={(e) => setN2(e.target.value)}
              placeholder="Masukkan nilai n2"
              required
              className="dark:text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
            >
              Hitung
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-red-600 font-semibold">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-6 text-center text-gray-800 dark:text-black">
              <p className="font-mono">
                Fibonacci ke-{n1}:{" "}
                <span className="font-mono">{result.fib1}</span>
              </p>
              <p className="font-mono">
                Fibonacci ke-{n2}:{" "}
                <span className="font-mono">{result.fib2}</span>
              </p>
              <h2 className="mt-4 text-lg font-mono font-semibold">
                Jumlah: {result.sum}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
