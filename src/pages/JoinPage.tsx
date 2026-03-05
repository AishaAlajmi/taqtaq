import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import { Logo } from "../components/Logo";

export function JoinPage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const handleJoin = () => {
    if (roomId.trim().length === 6) {
      navigate(`/play/${roomId.toUpperCase()}`);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-900 relative overflow-hidden"
    >
      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <Logo className="scale-110" />
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border-4 border-slate-900">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center border-2 border-indigo-900">
              <LogIn className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                الانضمام لغرفة
              </h1>
              <p className="text-slate-500 font-bold">أدخل كود الغرفة للعب</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-600 uppercase tracking-wider">
                كود الغرفة
              </label>
              <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 text-center tracking-[0.5em] text-slate-900 px-4 py-4 rounded-2xl outline-none font-black text-3xl transition-colors uppercase"
                placeholder="XXXXXX"
              />
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={handleJoin}
                disabled={roomId.trim().length !== 6}
                className="w-full bg-[#1F51FF] text-white font-black py-4 px-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[2px_2px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                انضمام
                <LogIn className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-white text-slate-600 font-bold py-4 px-6 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                رجوع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
