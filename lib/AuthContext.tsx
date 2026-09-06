"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { AVATAR_CHOICES } from "./avatars";

export interface UserProfile {
  displayName: string;
  avatarSeed?: string;
  totalScore: number;
  streak?: number;
  lastActiveDate?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  score: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  score: 0,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;
    
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        
        // Listen to real-time updates for score and profile
        unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setScore(data.totalScore || 0);
            setUserProfile(data);
          } else {
            // Initialize new user document if it doesn't exist yet
            const defaultName = currentUser.displayName || currentUser.email?.split('@')[0] || "Siswa";
            const randomSeed = AVATAR_CHOICES[Math.floor(Math.random() * AVATAR_CHOICES.length)];
            const newUserProfile = {
              displayName: defaultName,
              avatarSeed: randomSeed,
              email: currentUser.email,
              totalScore: 0,
              streak: 0,
              lastActiveDate: "",
              createdAt: serverTimestamp(),
            };
            await setDoc(userRef, newUserProfile);
            setScore(0);
            setUserProfile({ displayName: defaultName, avatarSeed: randomSeed, totalScore: 0, streak: 0, lastActiveDate: "" });
          }
        });
      } else {
        setScore(0);
        setUserProfile(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
      setLoading(false);
    });
    
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, score }}>
      {children}
    </AuthContext.Provider>
  );
};
