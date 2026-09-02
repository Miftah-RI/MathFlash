"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  score: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  score: 0,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;
    
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        
        // Listen to real-time updates for score
        unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setScore(docSnap.data().totalScore || 0);
          } else {
            // Initialize new user document if it doesn't exist yet
            await setDoc(userRef, {
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || "Siswa",
              email: currentUser.email,
              totalScore: 0,
              createdAt: serverTimestamp(),
            });
            setScore(0);
          }
        });
      } else {
        setScore(0);
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
    <AuthContext.Provider value={{ user, loading, score }}>
      {children}
    </AuthContext.Provider>
  );
};
