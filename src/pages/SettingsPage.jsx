import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Save, RotateCcw, Settings} from "lucide-react";
import { getSettings, saveSettings, defaultSettings } from "../utils/storage";
import { CATEGORIES, DIFFICULTIES } from "../data/categories";

export function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettingsState] = useState(defaultSettings);

  useEffect(() => {
    setSettingsState(getSettings());
  }, []);

  const handleChange = (key, value) => {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    navigate("/");
  };

  const handleReset = () => {
    setSettingsState(defaultSettings);
    saveSettings(defaultSettings);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-slate-900 p-6 md:p-12 relative overflow-hidden"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="p-3 bg-white hover:bg-slate-50 rounded-full transition shadow-sm border border-slate-200"
          >
            <ArrowRight size={24} className="text-slate-600" />
          </button>
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Settings size={36} /> الإعدادات
          </h1>
          <div className="w-12"></div>
        </header>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xl font-bold text-slate-700">
                عدد جولات الفوز
              </label>
              <select
                value={settings.bestOf}
                onChange={(e) =>
                  handleChange("bestOf", parseInt(e.target.value))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xl font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
              >
                <option value={1}>جولة واحدة</option>
                <option value={2}>جولتين</option>
                <option value={3}>3 جولات</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xl font-bold text-slate-700">
                حجم الشبكة
              </label>
              <select
                value={settings.gridSize}
                onChange={(e) =>
                  handleChange("gridSize", parseInt(e.target.value))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xl font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
              >
                <option value={4}>4 × 4 (سريع)</option>
                <option value={5}>5 × 5 (قياسي)</option>
                <option value={6}>6 × 6 (طويل)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xl font-bold text-slate-700">
                وضع اللعب
              </label>
              <select
                value={settings.gameMode}
                onChange={(e) => handleChange("gameMode", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xl font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
              >
                <option value="all_players">بدون مقدم (إدخال متزامن)</option>
                <option value="host">مع مقدم (يدوي)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xl font-bold text-slate-700">
                التصنيف
              </label>
              <select
                value={settings.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xl font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xl font-bold text-slate-700">
                مستوى الصعوبة
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) => handleChange("difficulty", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xl font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4 border-t border-slate-200">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl"
            >
              <Save size={24} /> حفظ الإعدادات
            </button>
            <button
              onClick={handleReset}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-lg py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 border border-red-200"
            >
              <RotateCcw size={24} /> إعادة ضبط
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
