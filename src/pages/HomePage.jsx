import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Settings,
  BookOpen,
  Sparkles,
  Gamepad2,
  Users,
  LogIn,
} from "lucide-react";
import { Logo } from "../components/Logo";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center p-6 text-[#111111] overflow-hidden relative"
    >
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF2A2A] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#1F51FF] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/2 w-40 h-40 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md flex flex-col items-center z-10 relative">
        <Logo className="mb-4 scale-110 md:scale-125" />

        <div className="w-full space-y-4 mt-6">
          <button
            onClick={() => navigate("/setup")}
            className="group relative w-full flex items-center justify-center gap-3 bg-[#FFD700] text-[#111111] text-2xl font-black py-5 px-8 rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[3px_3px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
          >
            <Play className="w-8 h-8 fill-[#111111] group-hover:animate-pulse" />
            <span>ابدا الطقطقه</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/online-setup")}
              className="group relative w-full flex items-center justify-center gap-2 bg-[#1F51FF] text-white text-lg font-black py-4 px-2 rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[3px_3px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
            >
              <Users className="w-6 h-6" />
              <span>إنشاء غرفة</span>
            </button>

            <button
              onClick={() => navigate("/join")}
              className="group relative w-full flex items-center justify-center gap-2 bg-[#FF2A2A] text-white text-lg font-black py-4 px-2 rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[3px_3px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
            >
              <LogIn className="w-6 h-6" />
              <span>الانضمام</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/settings")}
              className="group relative w-full flex items-center justify-center gap-2 bg-white text-slate-900 text-lg font-black py-4 px-2 rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[3px_3px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
            >
              <Settings className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              <span>الإعدادات</span>
            </button>

            <button
              onClick={() => navigate("/bank")}
              className="group relative w-full flex items-center justify-center gap-2 bg-white text-slate-900 text-lg font-black py-4 px-2 rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[3px_3px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
            >
              <BookOpen className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
              <span>بنك الأسئلة</span>
            </button>
          </div>
        </div>

        <div className="mt-16 text-center"></div>
      </div>
    </div>
  );
}
