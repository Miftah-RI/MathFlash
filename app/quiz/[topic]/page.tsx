"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import questionsData from "@/data/questions.json";
import { Clock, X, Check, ArrowRight, Trophy } from "lucide-react";

interface Question {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizPage({ params }: { params: Promise<{ topic: string }> }) {
  const resolvedParams = use(params);
  const decodedTopic = decodeURIComponent(resolvedParams.topic);
  const { user, score } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [sessionScore, setSessionScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [finalTotalScore, setFinalTotalScore] = useState<number | null>(null);

  const currentIndexRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    // Filter and shuffle questions
    const topicQuestions = questionsData.filter(q => q.topic === decodedTopic);
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random()).slice(0, 15);
    setQuestions(shuffled);
  }, [decodedTopic]);

  useEffect(() => {
    if (isFinished || isAnimating || questions.length === 0) return;

    if (timeLeft === 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isAnimating, questions]);

  const handleTimeOut = () => {
    setAnswerStatus("wrong");
    setIsAnimating(true);
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const handleAnswer = (option: string) => {
    if (isAnimating) return;
    
    setSelectedAnswer(option);
    setIsAnimating(true);
    
    const isCorrect = option === questions[currentIndexRef.current].correctAnswer;
    
    if (isCorrect) {
      const speedBonus = timeLeft;
      const pointsEarned = 10 + speedBonus;
      setAnswerStatus("correct");
      setSessionScore(prev => prev + pointsEarned);
      scoreRef.current += pointsEarned;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#4ade80']
      });
    } else {
      setAnswerStatus("wrong");
    }

    setTimeout(() => {
      nextQuestion();
    }, 1200);
  };

  const nextQuestion = () => {
    const nextIdx = currentIndexRef.current + 1;
    if (nextIdx < questions.length) {
      currentIndexRef.current = nextIdx;
      setCurrentIndex(nextIdx);
      setTimeLeft(10);
      setSelectedAnswer(null);
      setAnswerStatus("idle");
      setIsAnimating(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);
    setFinalTotalScore(score + scoreRef.current);
    
    if (user && scoreRef.current > 0) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        totalScore: increment(scoreRef.current)
      });
    }
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Memuat soal...</div>;
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-[40px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-blue-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-[24px] flex items-center justify-center mx-auto mb-6 rotate-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#111827] mb-2">Kuis Selesai!</h2>
          <p className="text-gray-500 font-bold mb-8 uppercase tracking-wide text-sm">
            Kamu mendapatkan {sessionScore} poin! <br/>
            <span className="text-blue-600">(Termasuk poin bonus kecepatan ⚡)</span>
          </p>
          
          <div className="bg-blue-600 rounded-3xl p-6 mb-8 flex justify-center gap-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
            <div>
              <p className="text-blue-200 text-xs font-black uppercase mb-1">Poin Sesi</p>
              <p className="text-3xl font-black text-yellow-400">+{sessionScore}</p>
            </div>
            <div className="w-0.5 bg-blue-400"></div>
            <div>
              <p className="text-blue-200 text-xs font-black uppercase mb-1">Total Poin</p>
              <p className="text-3xl font-black">{finalTotalScore !== null ? finalTotalScore : (score + sessionScore)}</p>
            </div>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="w-full bg-white text-[#111827] font-black py-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header progress */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button 
            onClick={() => router.push('/')}
            className="text-[#111827] hover:bg-red-500 hover:text-white bg-white p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-black"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="bg-white px-6 py-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-[#111827] uppercase tracking-wide">
            Soal {currentIndex + 1} <span className="text-gray-400">/</span> {questions.length}
          </div>
          <div className="bg-white border-2 border-black text-[#111827] px-4 py-3 rounded-2xl font-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Trophy className="w-5 h-5 text-orange-500" />
            {sessionScore}
          </div>
        </div>

        <motion.div 
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: 1, 
            x: answerStatus === "wrong" ? [-10, 10, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black relative overflow-hidden"
        >
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-50 pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-30 pointer-events-none"></div>

          {/* Timer */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${timeLeft <= 3 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#111827]'}`}>
              <Clock className="w-6 h-6" />
              {timeLeft}s
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-center text-[#111827] mb-10 leading-tight relative z-10">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === currentQ.correctAnswer;
              
              let btnClass = "bg-white border-2 border-black hover:bg-blue-600 hover:text-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#111827] group";
              let labelClass = "bg-gray-100 text-gray-500 group-hover:bg-blue-700 group-hover:text-white";
              
              if (isAnimating) {
                if (isCorrectAnswer) {
                  btnClass = "bg-green-500 border-2 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105 z-10";
                  labelClass = "bg-green-600 text-white";
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = "bg-red-500 border-2 border-black text-white scale-95 opacity-50 shadow-none";
                  labelClass = "bg-red-600 text-white";
                } else {
                  btnClass = "bg-white border-2 border-black text-gray-400 opacity-50 shadow-none";
                  labelClass = "bg-gray-100 text-gray-400";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnimating}
                  onClick={() => handleAnswer(option)}
                  className={`relative p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-all duration-300 ${btnClass}`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0 ${labelClass}`}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  <span>{option}</span>
                  
                  {isAnimating && isCorrectAnswer && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-black text-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Check className="w-5 h-5 font-black" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
