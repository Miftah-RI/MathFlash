"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Trophy, Target, Calculator, Activity, ArrowRight, Settings, X, Save, Flame } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AVATAR_CHOICES, getAvatarUrl } from "@/lib/avatars";

const topics = [
  { id: "Trigonometri", title: "Trigonometri", icon: Activity, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "Fungsi Komposisi & Invers", title: "Fungsi Komposisi", icon: Target, color: "text-rose-500", bg: "bg-rose-100" },
  { id: "Aritmatika Cepat", title: "Aritmatika Cepat", icon: Calculator, color: "text-purple-500", bg: "bg-purple-100" },
];

export default function Dashboard() {
  const { user, userProfile, loading, score } = useAuth();
  const router = useRouter();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarSeed, setEditAvatarSeed] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleEditProfile = () => {
    setEditName(userProfile?.displayName || "");
    setEditAvatarSeed(userProfile?.avatarSeed || AVATAR_CHOICES[0]);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: editName,
        avatarSeed: editAvatarSeed,
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Memuat...</div>;

  const currentAvatarUrl = getAvatarUrl(userProfile?.avatarSeed || user.uid);
  const previewAvatarUrl = getAvatarUrl(editAvatarSeed);

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Profil Edit Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden"
            >
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="absolute top-6 right-6 p-2 bg-white border-2 border-black rounded-xl hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6 text-[#111827]">Edit Profil</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 overflow-hidden p-2 bg-blue-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewAvatarUrl} alt="Avatar Preview" className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="w-full mt-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-3 tracking-widest text-center">Pilih Avatar</label>
                    <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-2xl border-2 border-gray-200">
                      {AVATAR_CHOICES.map((choice, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditAvatarSeed(choice)}
                          className={`aspect-square rounded-xl border-2 p-1 overflow-hidden transition-all ${
                            editAvatarSeed === choice 
                              ? 'border-blue-600 bg-blue-100 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] scale-105' 
                              : 'border-transparent hover:border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={choice} alt={`Avatar ${i}`} className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Nama Kamu</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold"
                    placeholder="Masukkan nama"
                    required
                    maxLength={20}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-black py-4 px-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide mt-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Profil
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
        <div className="flex items-center gap-4">
          <button onClick={handleEditProfile} className="group relative">
            <div className="w-14 h-14 bg-blue-50 rounded-[20px] flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 transition-all overflow-hidden p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-[#111827] p-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Settings className="w-3 h-3" />
            </div>
          </button>
          <div>
            <h1 className="text-xl font-black text-[#111827] uppercase tracking-wide">Halo, {userProfile?.displayName || "Siswa"}!</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Siap asah otak hari ini?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {(userProfile?.streak ?? 0) > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-white border-2 border-black text-[#111827] px-4 py-2 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" title="Streak Hari Ini">
              <Flame className="w-5 h-5 text-red-500 fill-red-500" />
              {userProfile?.streak} <span className="text-gray-400 text-xs uppercase ml-1">Hari</span>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-2 bg-white border-2 border-black text-[#111827] px-4 py-2 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Trophy className="w-5 h-5 text-orange-500" />
            {score} <span className="text-gray-400 text-xs uppercase ml-1">Pts</span>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="p-3 bg-white border-2 border-black text-[#111827] hover:bg-red-500 hover:text-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"
            title="Keluar"
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
          <span className="hidden sm:inline">Leaderboard</span>
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
