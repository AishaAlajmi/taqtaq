import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Play } from "lucide-react";
import { getTeams, saveTeams } from "../utils/storage";

export function TeamSetupPage() {
  const navigate = useNavigate();
  const [teams, setTeamsState] = useState(getTeams());

  useEffect(() => {
    setTeamsState(getTeams());
  }, []);

  const handleStart = () => {
    saveTeams(teams);
    navigate("/game");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-slate-900 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="w-full max-w-2xl space-y-8">
        <header className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate("/")}
            className="p-3 bg-white hover:bg-slate-50 rounded-full transition shadow-sm border border-slate-200"
          >
            <ArrowRight size={24} className="text-slate-600" />
          </button>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Users size={36} /> إعداد الفرق
          </h1>
          <div className="w-12"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team A */}
          <div className="bg-white/80 backdrop-blur-xl border border-red-200 rounded-[2rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h2 className="text-3xl font-black text-red-600 relative z-10">
              الفريق الأول
            </h2>
            <div className="space-y-3 relative z-10">
              <label className="text-lg font-bold text-slate-700">
                اسم الفريق
              </label>
              <input
                type="text"
                value={teams.teamA.name}
                onChange={(e) =>
                  setTeamsState((p) => ({
                    ...p,
                    teamA: { ...p.teamA, name: e.target.value },
                  }))
                }
                className="w-full bg-slate-50 border border-red-200 rounded-2xl p-4 text-2xl font-black focus:border-red-500 outline-none transition text-slate-900"
                placeholder="فريق واحد"
              />
            </div>
          </div>

          {/* Team B */}
          <div className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-[2rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h2 className="text-3xl font-black text-blue-600 relative z-10">
              الفريق الثاني
            </h2>
            <div className="space-y-3 relative z-10">
              <label className="text-lg font-bold text-slate-700">
                اسم الفريق
              </label>
              <input
                type="text"
                value={teams.teamB.name}
                onChange={(e) =>
                  setTeamsState((p) => ({
                    ...p,
                    teamB: { ...p.teamB, name: e.target.value },
                  }))
                }
                className="w-full bg-slate-50 border border-blue-200 rounded-2xl p-4 text-2xl font-black focus:border-blue-500 outline-none transition text-slate-900"
                placeholder="فريق اثنين"
              />
            </div>
          </div>
        </div>

        <div className="pt-12 flex justify-center">
          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-3xl py-6 px-16 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4 shadow-[0_10px_40px_rgba(79,70,229,0.4)]"
          >
            <Play size={36} fill="currentColor" /> ابدأ التحدي
          </button>
        </div>
      </div>
    </div>
  );
}
