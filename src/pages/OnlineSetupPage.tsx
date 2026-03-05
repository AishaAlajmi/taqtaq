import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Play, ArrowRight, QrCode } from "lucide-react";
import { Logo } from "../components/Logo";
import { getSocket } from "../services/socket";
import { saveTeams } from "../utils/storage";

export function OnlineSetupPage() {
  const navigate = useNavigate();
  const [teamA, setTeamA] = useState("الفريق الأحمر");
  const [teamB, setTeamB] = useState("الفريق الأزرق");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = () => {
    if (!teamA.trim() || !teamB.trim()) return;

    setIsCreating(true);
    saveTeams({
      teamA: { name: teamA, color: "red" },
      teamB: { name: teamB, color: "blue" },
    });

    // Navigate to game page with createRoom flag
    navigate(`/game?createRoom=true&isHost=true`);
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
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                إنشاء غرفة أونلاين
              </h1>
              <p className="text-slate-500 font-bold">
                جهز فرقك وابدأ اللعب عن بعد
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-red-600 uppercase tracking-wider">
                الفريق الأول
              </label>
              <input
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full bg-red-50 border-2 border-red-200 focus:border-red-500 text-slate-900 px-4 py-4 rounded-2xl outline-none font-bold text-lg transition-colors"
                placeholder="اسم الفريق الأول"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-blue-600 uppercase tracking-wider">
                الفريق الثاني
              </label>
              <input
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full bg-blue-50 border-2 border-blue-200 focus:border-blue-500 text-slate-900 px-4 py-4 rounded-2xl outline-none font-bold text-lg transition-colors"
                placeholder="اسم الفريق الثاني"
              />
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={handleCreateRoom}
                disabled={isCreating || !teamA.trim() || !teamB.trim()}
                className="w-full bg-[#FFD700] text-slate-900 font-black py-4 px-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[2px_2px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? "جاري الإنشاء..." : "إنشاء الغرفة"}
                <Play className="w-5 h-5 fill-current" />
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
