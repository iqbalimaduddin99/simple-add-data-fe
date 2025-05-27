"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", form);
      localStorage.setItem("token", data.data.token);
      router.push("/list-transaksi");
    } catch (err) {
      console.error(err);
      alert("Login gagal. Cek email dan password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h2 className="dark:text-black text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            type="email"
            required
            className="dark:text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            type="password"
            required
            className="dark:text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:underline"
          >
            Daftar sekarang
          </button>
        </p>
      </div>
    </div>
  );
}
