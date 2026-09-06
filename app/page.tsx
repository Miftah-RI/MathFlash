"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { LogOut, Trophy, Target, Calculator, Activity, ArrowRight, Shapes } from "lucide-react";
import { auth } from "@/lib/firebase";

const topics = [
  { id: "Trigonometri", title: "Trigonometri", icon: Activity, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "Fungsi Komposisi & Invers", title: "Fungsi Komposisi", icon: Target, color: "text-rose-500", bg: "bg-rose-100" },
  //{ id: "Matriks", title: "Matriks", icon: Shapes, color: "text-amber-500", bg: "bg-amber-100" },
  //{ id: "Transformasi Geometri", title: "Transformasi", icon: Shapes, color: "text-emerald-500", bg: "bg-emerald-100" },
  { id: "Aritmatika Cepat", title: "Aritmatika Cepat", icon: Calculator, color: "text-purple-500", bg: "bg-purple-100" },
];

export default function Dashboard() {
  const { user, loading, score } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-black text-[#111827] uppercase tracking-wide">Halo, {user.displayName || user.email?.split('@')[0]}!</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Siap asah otak hari ini?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border-2 border-black text-[#111827] px-4 py-2 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Trophy className="w-5 h-5 text-orange-500" />
            {score} <span className="text-gray-400 text-xs uppercase ml-1">Pts</span>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="p-3 bg-white border-2 border-black text-[#111827] hover:bg-red-500 hover:text-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#111827]">Pilih Topik</h2>
          <p className="text-gray-500 mt-1 font-bold text-sm uppercase tracking-wide">15 Soal • 10 Detik • mental math</p>
        </div>
        <button 
          onClick={() => router.push('/leaderboard')}
          className="flex items-center gap-2 text-[#111827] font-black uppercase bg-white border-2 border-black px-5 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <Trophy className="w-5 h-5 text-orange-500" />
          Leaderboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/quiz/${encodeURIComponent(topic.id)}`)}
              className="bg-white p-6 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-left group transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className={`${topic.bg} ${topic.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3 group-hover:rotate-0 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black uppercase text-[#111827] mb-2">{topic.title}</h3>
              <div className="flex items-center text-blue-600 font-black text-xs uppercase tracking-widest gap-1 group-hover:gap-2 transition-all">
                Mulai Kuis <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  );
}
