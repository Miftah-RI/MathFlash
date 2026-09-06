"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "motion/react";
import { getAvatarUrl } from "@/lib/avatars";

interface LeaderboardUser {
  id: string;
  displayName: string;
  totalScore: number;
  avatarSeed?: string;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const fetchedLeaders: LeaderboardUser[] = [];
        querySnapshot.forEach((doc) => {
          fetchedLeaders.push({ id: doc.id, ...doc.data() } as LeaderboardUser);
        });
        setLeaders(fetchedLeaders);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      <header className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => router.push('/')}
          className="p-3 bg-white text-[#111827] rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:-translate-y-1 transition-all"
        >
          <ArrowLeft className="w-5 h-5 font-black" />
        </button>
        <div className="flex-1 text-center pr-10">
          <div className="inline-flex items-center justify-center bg-blue-600 text-white w-16 h-16 rounded-[24px] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black rotate-6">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[#111827]">Global Leaderboard</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">Top 10 siswa terbaik</p>
        </div>
      </header>

      <div className="bg-black text-white rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 flex flex-col gap-4 overflow-hidden border-2 border-black relative">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-bold uppercase">Memuat data...</div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => {
              const isCurrentUser = user?.uid === leader.id;
              
              const avatarColors = ["bg-pink-500", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
              const avatarBg = avatarColors[index % avatarColors.length];
              
              const avatarUrl = getAvatarUrl(leader.avatarSeed || leader.id);
              
              if (isCurrentUser) {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={leader.id} 
                    className="flex items-center gap-4 p-4 bg-blue-600 rounded-2xl border-2 border-blue-400 mt-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10"
                  >
                    <span className="text-white font-black italic text-2xl w-8 text-center">{index + 1 < 10 ? `0${index+1}` : index+1}</span>
                    <div className="w-12 h-12 bg-white rounded-xl border-2 border-white flex items-center justify-center overflow-hidden p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase text-white truncate">KAMU</p>
                      <p className="text-xs text-blue-200 font-bold uppercase">{leader.totalScore} PTS</p>
                    </div>
                  </motion.div>
                );
              }

              let rankColor = "text-gray-500";
              if (index === 0) rankColor = "text-yellow-400";
              else if (index === 1) rankColor = "text-gray-300";
              else if (index === 2) rankColor = "text-orange-400";

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={leader.id} 
                  className={`flex items-center gap-4 p-4 bg-zinc-900 rounded-2xl border-2 border-zinc-800 ${index > 2 ? 'opacity-80' : ''}`}
                >
                  <span className={`${rankColor} font-black italic text-2xl w-8 text-center`}>{index + 1 < 10 ? `0${index+1}` : index+1}</span>
                  <div className={`w-12 h-12 ${avatarBg} rounded-xl border-2 border-zinc-800 flex items-center justify-center overflow-hidden p-1`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase text-white truncate">
                      {leader.displayName || 'Anonim'}
                    </p>
                    <p className="text-xs text-gray-400 font-bold uppercase">{leader.totalScore} PTS</p>
                  </div>
                </motion.div>
              );
            })}
            
            {leaders.length === 0 && (
              <div className="p-12 text-center text-gray-500 font-bold uppercase">Belum ada skor.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
