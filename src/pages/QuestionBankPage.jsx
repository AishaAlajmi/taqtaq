import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Filter, Download, Search } from "lucide-react";
import { QUESTIONS_DB } from "../data/questions";
import { CATEGORIES, DIFFICULTIES } from "../data/categories";

const ARABIC_LETTERS = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

export function QuestionBankPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("all");

  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DB.filter((q) => {
      const matchCat =
        selectedCategory === "all" || q.category === selectedCategory;
      const matchDiff =
        selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
      const matchLetter =
        selectedLetter === "all" || q.letter === selectedLetter;
      return matchCat && matchDiff && matchLetter;
    });
  }, [selectedCategory, selectedDifficulty, selectedLetter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-slate-900 p-6 md:p-12 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between no-print">
          <button
            onClick={() => navigate("/")}
            className="p-3 bg-white hover:bg-slate-50 rounded-full transition shadow-sm border border-slate-200"
          >
            <ArrowRight size={24} className="text-slate-600" />
          </button>
        
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Search size={36} /> بنك الأسئلة
          </h1>
          <button
            onClick={handlePrint}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition flex items-center gap-2 px-6 font-bold"
          >
            <Download size={20} /> تصدير PDF
          </button>
        </header>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 space-y-6 shadow-2xl no-print">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-700 mb-4">
            <Filter size={24} /> تصفية الأسئلة
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLetter}
              onChange={(e) => setSelectedLetter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold focus:border-indigo-500 outline-none transition appearance-none text-slate-900"
            >
              <option value="all">جميع الحروف</option>
              {ARABIC_LETTERS.map((l) => (
                <option key={l} value={l}>
                  حرف {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl print-container">
          <h2 className="text-2xl font-black mb-6 border-b-2 border-slate-200 pb-4 print-header">
            قائمة الأسئلة ({filteredQuestions.length})
          </h2>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-bold text-xl">
              لا توجد أسئلة تطابق معايير البحث
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 print-item"
                >
                  <div className="w-12 h-12 shrink-0 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-2xl">
                    {q.letter}
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="text-xl font-bold">{q.q}</div>
                    <div className="text-lg text-emerald-600 font-black">
                      ج: {q.a}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 text-sm font-bold opacity-60 text-left">
                    <span className="bg-slate-200 px-3 py-1 rounded-full">
                      {CATEGORIES.find((c) => c.id === q.category)?.name ||
                        q.category}
                    </span>
                    <span className="bg-slate-200 px-3 py-1 rounded-full">
                      {DIFFICULTIES.find((d) => d.id === q.difficulty)?.name ||
                        q.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-container { box-shadow: none !important; padding: 0 !important; }
          .print-item { break-inside: avoid; border: 1px solid #ccc !important; margin-bottom: 10px !important; }
          .print-header { display: block !important; }
        }
      `,
        }}
      />
    </div>
  );
}
