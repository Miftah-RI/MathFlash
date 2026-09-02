"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { LogIn, UserPlus, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Login Email/Password dinonaktifkan secara default oleh Firebase. Silakan gunakan tombol 'Lanjut dengan Google' di bawah.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[40px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="text-center mb-10">
          <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <span className="text-3xl font-black italic">M</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase text-blue-900">Math<span className="text-blue-600">Flash</span></h1>
          <p className="text-gray-500 mt-2 font-bold text-sm uppercase">Kuis matematika kilat!</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold"
              placeholder="nama@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-black py-4 px-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide mt-2"
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? "Masuk" : "Daftar Akun"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-300 after:h-px after:flex-1 after:bg-gray-300 text-gray-400 text-xs font-black uppercase tracking-widest">
          ATAU
        </div>

        <button 
          onClick={handleGoogleAuth}
          className="mt-8 w-full bg-white text-[#111827] border-2 border-black font-black py-4 px-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Mail className="w-5 h-5 text-red-500" />
          Lanjut dengan Google
        </button>

        <p className="mt-8 text-center text-xs text-gray-500 font-bold uppercase tracking-wide">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-black hover:underline"
          >
            {isLogin ? "Daftar sekarang" : "Masuk di sini"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
