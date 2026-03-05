import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RotateCcw,
  Shuffle,
  LogOut,
  LayoutGrid,
  Trophy,
  Maximize2,
  X,
  Smartphone,
  Copy,
  BellRing,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import logoImage from "../components/logo.png";
import { getSocket } from "../services/socket";
import { Confetti } from "../components/Confetti";
import { HexCell } from "../components/HexCell";
import { PillButton } from "../components/PillButton";
import { getSettings, getTeams } from "../utils/storage";
import { getQuestionForLetter } from "../data/questions";
import { checkWinner, shuffleArray } from "../utils/gameLogic";
import { compareAnswers } from "../utils/normalizeArabic";
import { Howl } from "howler";
const TEAM_RED = 1;
const TEAM_BLUE = 2;
const ARABIC_LETTERS = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

// 🎉 احتفال واضح فوق كل شيء (فوق المودال)
function CelebrationLayer({ active }) {
  const pieces = useMemo(() => {
    const icons = ["🎉", "✨", "🏆", "🎊", "⭐", "💥"];
    return Array.from({ length: 52 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.4 + Math.random() * 1.4,
      size: 22 + Math.random() * 26,
      rotate: -35 + Math.random() * 70,
      drift: -30 + Math.random() * 60,
    }));
  }, []);

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes taqRain {
          0%   { transform: translateY(-50px) translateX(0px) rotate(var(--rot)); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(115vh) translateX(var(--drift)) rotate(calc(var(--rot) * 2)); opacity: 0; }
        }
        @keyframes taqPulseGlow {
          0%, 100% { opacity: .20; transform: scale(1); }
          50%      { opacity: .34; transform: scale(1.05); }
        }
      `}</style>

      {/* هالة احتفالية */}
      <div className="pointer-events-none fixed inset-0 z-[220]">
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent"
          style={{ animation: "taqPulseGlow 1.1s ease-in-out infinite" }}
        />
      </div>

      {/* مطر رموز */}
      <div className="pointer-events-none fixed inset-0 z-[230] overflow-hidden">
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.left}%`,
              animation: `taqRain ${p.duration}s linear ${p.delay}s infinite`,
              fontSize: `${p.size}px`,
              ["--rot"]: `${p.rotate}deg`,
              ["--drift"]: `${p.drift}px`,
            }}
            className="absolute top-0 drop-shadow-[0_14px_20px_rgba(0,0,0,0.28)]"
          >
            {p.icon}
          </div>
        ))}
      </div>
    </>
  );
}

// 🎉 بانر تهنئة كبير فوق الشاشة
function WinBanner({ open, text, tone = "gold" }) {
  if (!open) return null;

  const toneClass =
    tone === "red"
      ? "from-red-600 via-red-500 to-orange-400"
      : tone === "blue"
        ? "from-blue-700 via-blue-500 to-cyan-400"
        : "from-yellow-500 via-amber-400 to-orange-400";

  return (
    <>
      <style>{`
        @keyframes bannerIn {
          0%   { transform: translateY(-30px) scale(.95); opacity: 0; }
          60%  { transform: translateY(8px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        @keyframes shine {
          0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
          25% { opacity: .7; }
          100% { transform: translateX(140%) skewX(-18deg); opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none fixed top-4 left-0 right-0 z-[240] flex justify-center px-4">
        <div
          className={`relative w-full max-w-3xl rounded-[1.6rem] bg-gradient-to-r ${toneClass} text-white shadow-[0_22px_60px_rgba(0,0,0,0.35)] border border-white/30 overflow-hidden`}
          style={{ animation: "bannerIn .55s ease-out both" }}
        >
          {/* لمعان */}
          <div
            className="absolute top-0 left-0 h-full w-1/3 bg-white/25"
            style={{ animation: "shine 1.6s ease-in-out infinite" }}
          />
          <div className="relative px-5 py-4 md:px-7 md:py-5 flex items-center justify-between gap-3">
            <div className="text-2xl md:text-3xl font-black drop-shadow">
              {text}
            </div>
            <div className="hidden md:flex items-center gap-2 text-xl font-black">
              <span>🎊</span>
              <span>🏆</span>
              <span>🎉</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ✅ مودال الفوز (احتفالي أكثر)
function WinnerModal({
  open,
  kind, // "round" | "final"
  winnerName,
  winnerColor, // "red" | "blue"
  scoreLine,
  onPrimary,
  onClose,
}) {
  if (!open) return null;

  const isFinal = kind === "final";

  const palette =
    winnerColor === "red"
      ? {
          ring: "ring-red-200",
          name: "text-red-700",
          badge: "bg-red-50 text-red-700 border-red-100",
          glow: "shadow-[0_0_100px_rgba(239,68,68,0.25)]",
          button: "bg-[#e83525] hover:bg-red-500",
          bg: "from-red-50 via-white to-orange-50",
        }
      : {
          ring: "ring-blue-200",
          name: "text-blue-700",
          badge: "bg-blue-50 text-blue-700 border-blue-100",
          glow: "shadow-[0_0_100px_rgba(59,130,246,0.25)]",
          button: "bg-[#1d64ba] hover:bg-blue-500",
          bg: "from-blue-50 via-white to-cyan-50",
        };

  const title = isFinal ? "🏆 حُسم التحدّي!" : "🎉 مبروك الفوز بالجولة!";
  const subtitle = isFinal
    ? "يا سلام! فزتوا بالتحدّي 👑"
    : "نقطة انحسمت.. جهّزوا للجولة اللي بعدها 🔥";

  const primaryLabel = isFinal ? "تحدّي جديد" : "جولة جديدة";

  return (
    <>
      <style>{`
        @keyframes popWow {
          0% { transform: translateY(18px) scale(.92); opacity: 0; }
          60% { transform: translateY(-6px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        @keyframes trophyBounce {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
      `}</style>

      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />

        <div
          className={`relative w-full max-w-2xl rounded-[2.2rem] bg-gradient-to-b ${palette.bg} border border-slate-200 ${palette.glow} ring-4 ${palette.ring} overflow-hidden`}
          style={{ animation: "popWow .55s ease-out both" }}
        >
          {/* رأس */}
          <div className="p-6 md:p-7 border-b border-slate-100 bg-white/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${palette.badge}`}
                style={{ animation: "trophyBounce 1.1s ease-in-out infinite" }}
              >
                <Trophy size={26} />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-slate-900">
                  {title}
                </div>
                <div className="text-sm md:text-base font-bold text-slate-700">
                  {subtitle}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600"
              title="إغلاق"
            >
              <X size={22} />
            </button>
          </div>

          {/* محتوى */}
          <div className="p-7 md:p-9 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/70 text-slate-800 font-black">
              ✨ الفائز: <span className={`${palette.name}`}>{winnerName}</span>
            </div>

            <div
              className={`text-5xl md:text-7xl font-black ${palette.name} leading-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)]`}
            >
              {winnerName}
            </div>

            <div className="flex justify-center gap-2 text-2xl">
              <span>🎉</span>
              <span>🎊</span>
              <span>🏆</span>
              <span>✨</span>
            </div>

            <div className="rounded-2xl bg-white/75 border border-slate-200 p-4">
              <div className="text-xs font-black text-slate-500 mb-2">
                النتيجة الحالية
              </div>
              <div className="text-base md:text-lg font-black text-slate-900">
                {scoreLine}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={onPrimary}
                className={`${palette.button} text-white font-black px-6 py-4 rounded-2xl transition text-lg shadow-lg`}
              >
                {primaryLabel}
              </button>

              <button
                onClick={onClose}
                className="bg-white text-slate-700 font-black px-6 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition text-lg"
              >
                إغلاق
              </button>
            </div>

            <div className="text-xs font-bold text-slate-600">
              🔥 الجولة الجاية لكم.. يلا!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function GamePage() {
  const navigate = useNavigate();
  const settings = getSettings();
  const teams = getTeams();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const GRID_ROWS = settings.gridSize;
  const GRID_COLS = settings.gridSize;

  const maxBoardWidth = Math.min(600, windowWidth - 64);
  const baseCellSize = Math.max(
    52,
    Math.min(
      100 - (settings.gridSize - 4) * 12,
      maxBoardWidth / (settings.gridSize * 0.9),
    ),
  );
  const CELL_SIZE = baseCellSize;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isHost = queryParams.get("isHost") === "true";
  const shouldCreateRoom = queryParams.get("createRoom") === "true";

  const [roomId, setRoomId] = useState(null);
  const [showQrModal, setShowQrModal] = useState(shouldCreateRoom);
  const [buzzerWinner, setBuzzerWinner] = useState(null);
  const [buzzerLocked, setBuzzerLocked] = useState(true);
  const [players, setPlayers] = useState({});

  const [board, setBoard] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [winner, setWinner] = useState(null);
  const [matchWinner, setMatchWinner] = useState(null);
  const [wins, setWins] = useState({ [TEAM_RED]: 0, [TEAM_BLUE]: 0 });
  const [zoom, setZoom] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [inputs, setInputs] = useState({ [TEAM_RED]: "", [TEAM_BLUE]: "" });
  const [submissions, setSubmissions] = useState({
    [TEAM_RED]: null,
    [TEAM_BLUE]: null,
  });
  const [feedback, setFeedback] = useState(null);

  const [showWinModal, setShowWinModal] = useState(false);
  // 🔊 صوت التصفيق (اختياري)
  const [soundOn, setSoundOn] = useState(() => {
    const saved = localStorage.getItem("taq_soundOn");
    return saved === null ? true : saved === "1";
  });

  useEffect(() => {
    localStorage.setItem("taq_soundOn", soundOn ? "1" : "0");
  }, [soundOn]);

  // ✅ Howler instance
  const clapRef = useRef(null);

  // ✅ جهّزي الصوت مرة وحدة
  useEffect(() => {
    clapRef.current = new Howl({
      src: [
        "https://actions.google.com/sounds/v1/crowds/applause.ogg",
        "https://actions.google.com/sounds/v1/crowds/applause.mp3",
      ],
      volume: 0.9,
      preload: true,
    });

    return () => {
      try {
        clapRef.current?.unload?.();
      } catch {}
    };
  }, []);

  // ✅ شغل التصفيق (بدون ملف صوت)
  const playClap = useCallback(() => {
    if (!soundOn) return;
    try {
      clapRef.current?.stop?.();
      clapRef.current?.play?.();
    } catch {}
  }, [soundOn]);

  const currentQuestion = useMemo(
    () =>
      activeCell
        ? getQuestionForLetter(
            activeCell.letter,
            settings.category,
            settings.difficulty,
            qIndex,
          )
        : null,
    [activeCell, qIndex, settings.category, settings.difficulty],
  );

  const getTeamName = (teamId) =>
    teamId === TEAM_RED ? teams.teamA.name : teams.teamB.name;
  const getTeamTone = (teamId) => (teamId === TEAM_RED ? "red" : "blue");

  useEffect(() => {
    if (!shouldCreateRoom && !roomId) return;

    const socket = getSocket();

    if (shouldCreateRoom && !roomId) {
      socket.emit("create_room", { initialState: {} }, (response) => {
        if (response.error) {
          alert("خطأ في إنشاء الغرفة: " + response.error);
          return;
        }
        if (response.roomId) {
          setRoomId(response.roomId);
          window.history.replaceState(
            null,
            "",
            `/game?roomId=${response.roomId}&isHost=true`,
          );
        }
      });
    }

    socket.on("player_joined", ({ socketId, teamId }) => {
      setPlayers((prev) => ({ ...prev, [socketId]: teamId }));
    });

    socket.on("buzzer_pressed", ({ teamId }) => {
      setBuzzerWinner(teamId);
      setBuzzerLocked(true);
    });

    socket.on("buzzer_locked", ({ locked }) => {
      setBuzzerLocked(locked);
      if (!locked) setBuzzerWinner(null);
    });

    socket.on("buzzer_reset", () => {
      setBuzzerWinner(null);
      setBuzzerLocked(false);
    });

    return () => {
      socket.off("player_joined");
      socket.off("buzzer_pressed");
      socket.off("buzzer_locked");
      socket.off("buzzer_reset");
    };
  }, [shouldCreateRoom, roomId]);

  const activateBuzzer = useCallback(() => {
    if (roomId) {
      setShowQrModal(true);
      return;
    }
    const socket = getSocket();
    socket.emit("create_room", { initialState: {} }, (response) => {
      if (response.error) {
        alert("خطأ في إنشاء الغرفة: " + response.error);
        return;
      }
      if (response.roomId) {
        setRoomId(response.roomId);
        setShowQrModal(true);
        window.history.replaceState(
          null,
          "",
          `/game?roomId=${response.roomId}&isHost=true`,
        );
      }
    });
  }, [roomId]);

  const rows = useMemo(() => {
    const r = Array.from({ length: GRID_ROWS }, () => []);
    for (const cell of board) r[cell.r].push(cell);
    return r;
  }, [board, GRID_ROWS]);

  const createBoard = useCallback(
    ({ shuffleLetters }) => {
      const letters = shuffleLetters
        ? shuffleArray(ARABIC_LETTERS)
        : ARABIC_LETTERS;
      let idx = 0;
      const next = [];
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          next.push({ r, c, letter: letters[idx % letters.length], team: 0 });
          idx++;
        }
      }
      setBoard(next);
    },
    [GRID_ROWS, GRID_COLS],
  );

  const resetBuzzer = useCallback(() => {
    setBuzzerWinner(null);
    setBuzzerLocked(false);
    if (roomId && isHost) {
      const socket = getSocket();
      socket.emit("buzz_reset", { roomId });
    }
  }, [roomId, isHost]);

  const lockBuzzer = useCallback(
    (locked) => {
      setBuzzerLocked(locked);
      if (!locked) setBuzzerWinner(null);
      if (roomId && isHost) {
        const socket = getSocket();
        socket.emit("buzz_lock", { roomId, locked });
      }
    },
    [roomId, isHost],
  );

  const resetRoundState = useCallback(() => {
    setActiveCell(null);
    setQIndex(0);
    setInputs({ [TEAM_RED]: "", [TEAM_BLUE]: "" });
    setSubmissions({ [TEAM_RED]: null, [TEAM_BLUE]: null });
    setFeedback(null);
    setZoom(false);
    setShowAnswer(false);
    lockBuzzer(true);
  }, [lockBuzzer]);

  const newGame = useCallback(() => {
    setWinner(null);
    setMatchWinner(null);
    setWins({ [TEAM_RED]: 0, [TEAM_BLUE]: 0 });
    setShowWinModal(false);
    resetRoundState();
    createBoard({ shuffleLetters: true });
  }, [createBoard, resetRoundState]);

  const nextRound = useCallback(() => {
    setWinner(null);
    setShowWinModal(false);
    resetRoundState();
    createBoard({ shuffleLetters: true });
  }, [createBoard, resetRoundState]);

  const clearBoard = useCallback(() => {
    setWinner(null);
    setShowWinModal(false);
    resetRoundState();
    setBoard((prev) => prev.map((c) => ({ ...c, team: 0 })));
  }, [resetRoundState]);

  const randomizeBoard = useCallback(() => {
    setWinner(null);
    setShowWinModal(false);
    resetRoundState();
    createBoard({ shuffleLetters: true });
  }, [createBoard, resetRoundState]);

  useEffect(() => {
    createBoard({ shuffleLetters: true });
  }, [createBoard]);

  const openQuestionForCell = useCallback(
    (cell) => {
      if (winner || matchWinner) return;

      if (activeCell && cell.r === activeCell.r && cell.c === activeCell.c) {
        resetRoundState();
        return;
      }

      if (cell.team !== 0) {
        setBoard((prev) =>
          prev.map((c) =>
            c.r === cell.r && c.c === cell.c
              ? {
                  ...c,
                  team:
                    c.team === TEAM_BLUE
                      ? TEAM_RED
                      : c.team === TEAM_RED
                        ? 0
                        : TEAM_BLUE,
                }
              : c,
          ),
        );
        return;
      }

      if (!activeCell) {
        setActiveCell(cell);
        setQIndex(0);
        setShowAnswer(false);
        setInputs({ [TEAM_RED]: "", [TEAM_BLUE]: "" });
        setSubmissions({ [TEAM_RED]: null, [TEAM_BLUE]: null });
        setFeedback(null);
        resetBuzzer();
      }
    },
    [activeCell, winner, matchWinner, resetBuzzer, resetRoundState],
  );

  // ✅ اكتشاف الفائز + تشغيل الاحتفاليات/الصوت
  useEffect(() => {
    if (winner || matchWinner || board.length === 0) return;

    const w = checkWinner(board, GRID_ROWS, GRID_COLS, TEAM_RED, TEAM_BLUE);
    if (w) {
      setWinner(w);
      setShowWinModal(true);
      playClap();

      setWins((old) => {
        const newWins = { ...old, [w]: (old[w] ?? 0) + 1 };
        if (newWins[w] >= settings.bestOf) {
          setMatchWinner(w);
          // صوت مرة ثانية للفوز النهائي (اختياري)
          setTimeout(() => playClap(), 250);
        }
        return newWins;
      });
    }
  }, [
    board,
    winner,
    matchWinner,
    GRID_ROWS,
    GRID_COLS,
    settings.bestOf,
    playClap,
  ]);

  const applyCorrect = useCallback(
    (teamNum) => {
      const target = activeCell;
      if (!target) return;

      setBoard((prev) =>
        prev.map((c) =>
          c.r === target.r && c.c === target.c ? { ...c, team: teamNum } : c,
        ),
      );

      setTimeout(() => {
        resetRoundState();
      }, 1500);
    },
    [activeCell, resetRoundState],
  );

  const applyIncorrect = useCallback(() => {
    setFeedback({
      type: "error",
      msg: "سؤال جديد لنفس الحرف 👀",
    });
    setTimeout(() => {
      setQIndex((p) => p + 1);
      setInputs({ [TEAM_RED]: "", [TEAM_BLUE]: "" });
      setSubmissions({ [TEAM_RED]: null, [TEAM_BLUE]: null });
      setFeedback(null);
    }, 2000);
  }, []);

  const handleInputChange = (teamNum, val) => {
    if (submissions[teamNum] || (feedback && feedback.type !== "warning"))
      return;
    setInputs((prev) => ({ ...prev, [teamNum]: val }));
  };

  const handleInputSubmit = (teamNum) => {
    if (!activeCell || submissions[teamNum]) return;
    if (feedback && feedback.type !== "warning") return;

    const ans = inputs[teamNum].trim();
    if (!ans) return;

    const isCorrect = compareAnswers(ans, currentQuestion.a);

    setSubmissions((prev) => {
      const next = {
        ...prev,
        [teamNum]: { answer: ans, isCorrect, time: Date.now() },
      };

      if (isCorrect) {
        setFeedback({
          type: "success",
          msg: `صح عليك! نقطة لـ ${teamNum === TEAM_RED ? teams.teamA.name : teams.teamB.name} ✅`,
        });
        setTimeout(() => applyCorrect(teamNum), 1000);
      } else {
        const otherTeam = teamNum === TEAM_RED ? TEAM_BLUE : TEAM_RED;
        if (next[otherTeam]) {
          applyIncorrect();
        } else {
          setFeedback({
            type: "warning",
            msg: `قريبين! فرصة الفريق الثاني الآن 👈`,
          });
          setTimeout(() => {
            setFeedback((prevFb) =>
              prevFb?.type === "warning" ? null : prevFb,
            );
          }, 2000);
        }
      }
      return next;
    });
  };

  const scoreLine = `${teams.teamA.name}: ${wins[TEAM_RED]}  —  ${teams.teamB.name}: ${wins[TEAM_BLUE]}`;
  const celebrationActive = !!(winner || matchWinner);

  const bannerText = matchWinner
    ? `🏆 مبروك! حُسم التحدّي لـ ${getTeamName(matchWinner)}`
    : winner
      ? `🎉 مبروك! فازت الجولة لـ ${getTeamName(winner)}`
      : "";

  const bannerTone = matchWinner
    ? getTeamTone(matchWinner)
    : winner
      ? getTeamTone(winner)
      : "gold";

  return (
    <div
      dir="rtl"
      className="min-h-screen text-slate-900 relative overflow-hidden"
    >
      {/* ✅ بانر الفوز الكبير */}
      <WinBanner open={celebrationActive} text={bannerText} tone={bannerTone} />

      {/* ✅ احتفاليات واضحة فوق كل شيء */}
      {celebrationActive && (
        <div className="pointer-events-none fixed inset-0 z-[210]">
          <Confetti />
        </div>
      )}
      <CelebrationLayer active={celebrationActive} />

      {/* ✅ مودال الفوز */}
      <WinnerModal
        open={showWinModal && !!winner && !matchWinner}
        kind="round"
        winnerName={winner ? getTeamName(winner) : ""}
        winnerColor={winner ? getTeamTone(winner) : "red"}
        scoreLine={scoreLine}
        onPrimary={nextRound}
        onClose={() => setShowWinModal(false)}
      />

      <WinnerModal
        open={showWinModal && !!matchWinner}
        kind="final"
        winnerName={matchWinner ? getTeamName(matchWinner) : ""}
        winnerColor={matchWinner ? getTeamTone(matchWinner) : "red"}
        scoreLine={scoreLine}
        onPrimary={newGame}
        onClose={() => setShowWinModal(false)}
      />

      <header className="px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <PillButton
              tone="purple"
              onClick={newGame}
              className="flex items-center gap-2 px-3 md:px-5"
            >
              <RotateCcw size={18} />{" "}
              <span className="hidden sm:inline">تصفير اللعبة</span>
            </PillButton>

            <PillButton
              tone={roomId ? "red" : "blue"}
              onClick={() => (roomId ? setShowQrModal(true) : activateBuzzer())}
              className="flex items-center gap-2 px-3 md:px-5"
            >
              <Smartphone size={18} />
              <span className="hidden sm:inline">
                {roomId ? "عرض الكود" : "تفعيل الجرس"}
              </span>
            </PillButton>
          </div>

          <div className="h-10 md:h-12 flex items-center justify-center overflow-hidden">
            <img
              src={logoImage}
              alt="طقطق"
              className="h-10 md:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="hidden md:block opacity-60 text-xs font-bold uppercase tracking-widest text-slate-700">
            Best of {settings.bestOf}
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 py-4 md:py-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_400px_300px] gap-6 md:gap-8 items-start">
          {/* Board */}
          <section className="relative md:col-span-2 lg:col-span-1 rounded-[40px] bg-[#e83525] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white overflow-hidden w-full max-w-[600px] aspect-square mx-auto flex items-center justify-center p-4">
            <div
              className="absolute top-[-12%] bottom-[-12%] left-[-18%] w-[72%] bg-[#1d64ba] opacity-100 z-0"
              style={{ clipPath: "polygon(0 0, 88% 50%, 0 100%)" }}
            />
            <div
              className="absolute top-[-12%] bottom-[-12%] right-[-18%] w-[72%] bg-[#1d64ba] opacity-100 z-0"
              style={{ clipPath: "polygon(100% 0, 12% 50%, 100% 100%)" }}
            />

            <div className="relative z-10 rounded-[30px] w-full h-full flex items-center justify-center p-4">
              <div
                dir="ltr"
                className="w-full h-full flex items-center justify-center"
              >
                <div
                  className="w-fit"
                  style={{ transform: `translateX(-${CELL_SIZE / 4}px)` }}
                >
                  {rows.map((row, r) => (
                    <div
                      key={r}
                      className="flex justify-center"
                      style={{
                        marginTop: r === 0 ? 0 : -(CELL_SIZE * 0.25),
                        transform:
                          r % 2 !== 0
                            ? `translateX(${CELL_SIZE / 2}px)`
                            : "none",
                      }}
                    >
                      {row.map((cell) => (
                        <HexCell
                          key={`${cell.r},${cell.c}`}
                          cell={cell}
                          cellSize={CELL_SIZE}
                          teamRed={TEAM_RED}
                          teamBlue={TEAM_BLUE}
                          isActive={
                            activeCell &&
                            cell.r === activeCell.r &&
                            cell.c === activeCell.c
                          }
                          onClick={() => openQuestionForCell(cell)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Question */}
          <section className="space-y-6">
            <div className="rounded-[2rem] bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden min-h-[420px] flex flex-col relative">
              {!activeCell ? (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shadow-inner">
                    <Trophy
                      size={48}
                      className="text-indigo-400 animate-pulse"
                    />
                  </div>
                  <div className="text-3xl font-black mb-2 text-slate-800">
                    اختر حرفًا لعرض السؤال
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center font-black text-2xl bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-900">
                        {activeCell.letter}
                      </div>
                      <div className="font-black text-xl text-slate-700">
                        سؤال الحرف
                      </div>
                    </div>

                    {roomId && (
                      <div
                        className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
                          buzzerWinner
                            ? buzzerWinner === TEAM_RED
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                            : buzzerLocked
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <BellRing size={16} />
                        {buzzerWinner
                          ? `${buzzerWinner === TEAM_RED ? teams.teamA.name : teams.teamB.name} ضغط أولاً!`
                          : buzzerLocked
                            ? "الجرس مغلق"
                            : "الجرس مفتوح"}
                      </div>
                    )}

                    <button
                      onClick={() => setZoom(true)}
                      className="p-2 bg-white hover:bg-slate-50 rounded-xl transition shadow-sm border border-slate-200 text-slate-600"
                    >
                      <Maximize2 size={24} />
                    </button>
                  </div>

                  <div className="flex-grow p-4 md:p-6 flex flex-col justify-center text-center space-y-6 md:space-y-8">
                    <div className="text-2xl md:text-3xl font-black leading-snug text-slate-900 drop-shadow-sm">
                      {currentQuestion?.q}
                    </div>

                    {settings.gameMode === "host" ? (
                      <div className="space-y-4 md:space-y-6 animate-in fade-in">
                        <div className="bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-2xl">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="text-xs md:text-sm uppercase font-bold text-indigo-500">
                              الإجابة
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowAnswer((v) => !v)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-700 text-sm font-bold"
                              title={
                                showAnswer ? "إخفاء الإجابة" : "إظهار الإجابة"
                              }
                            >
                              {showAnswer ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                              {showAnswer ? "إخفاء" : "إظهار"}
                            </button>
                          </div>

                          <div className="text-2xl md:text-3xl font-black text-slate-900">
                            {showAnswer
                              ? currentQuestion?.a || "أي كلمة تبدأ بالحرف"
                              : "••••••"}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                          <button
                            onClick={() => {
                              setFeedback({
                                type: "success",
                                msg: `تم احتساب النقطة لـ ${teams.teamA.name}`,
                              });
                              setTimeout(() => applyCorrect(TEAM_RED), 1000);
                            }}
                            className="bg-[#e83525] hover:bg-red-500 text-white p-3 md:p-4 rounded-2xl font-black text-lg md:text-xl transition shadow-lg disabled:opacity-50"
                            disabled={
                              !!feedback ||
                              (buzzerWinner && buzzerWinner !== TEAM_RED)
                            }
                          >
                            {teams.teamA.name}
                          </button>

                          <button
                            onClick={() => {
                              setFeedback({
                                type: "success",
                                msg: `تم احتساب النقطة لـ ${teams.teamB.name}`,
                              });
                              setTimeout(() => applyCorrect(TEAM_BLUE), 1000);
                            }}
                            className="bg-[#1d64ba] hover:bg-blue-500 text-white p-3 md:p-4 rounded-2xl font-black text-lg md:text-xl transition shadow-lg disabled:opacity-50"
                            disabled={
                              !!feedback ||
                              (buzzerWinner && buzzerWinner !== TEAM_BLUE)
                            }
                          >
                            {teams.teamB.name}
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (feedback) return;
                            if (buzzerWinner) {
                              setFeedback({
                                type: "warning",
                                msg: "تمام.. افتحنا الفرصة للفريق الثاني 👈",
                              });
                              resetBuzzer();
                              setTimeout(
                                () =>
                                  setFeedback((p) =>
                                    p?.type === "warning" ? null : p,
                                  ),
                                2000,
                              );
                            } else {
                              applyIncorrect();
                            }
                          }}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-3 md:p-4 rounded-2xl font-bold text-base md:text-lg transition disabled:opacity-50"
                          disabled={!!feedback}
                        >
                          {buzzerWinner
                            ? "إجابة غير صحيحة (فتح الجرس)"
                            : "سؤال اخر"}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        <div
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            submissions[TEAM_RED]
                              ? submissions[TEAM_RED].isCorrect
                                ? "bg-emerald-50 border-emerald-500"
                                : "bg-red-50 border-red-500 opacity-50"
                              : "bg-red-50/50 border-red-200 focus-within:border-red-500 focus-within:bg-red-50"
                          }`}
                        >
                          <div className="text-sm font-bold text-red-600 mb-2">
                            {teams.teamA.name}
                          </div>
                          <div className="flex gap-2">
                            <input
                              disabled={
                                !!submissions[TEAM_RED] ||
                                !!feedback ||
                                (buzzerWinner && buzzerWinner !== TEAM_RED)
                              }
                              value={inputs[TEAM_RED]}
                              onChange={(e) =>
                                handleInputChange(TEAM_RED, e.target.value)
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleInputSubmit(TEAM_RED)
                              }
                              placeholder="إجابة الفريق الأول..."
                              className="flex-grow bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl outline-none font-bold text-lg disabled:opacity-50 focus:border-red-500"
                            />
                            <button
                              disabled={
                                !!submissions[TEAM_RED] ||
                                !!feedback ||
                                !inputs[TEAM_RED].trim() ||
                                (buzzerWinner && buzzerWinner !== TEAM_RED)
                              }
                              onClick={() => handleInputSubmit(TEAM_RED)}
                              className="bg-[#e83525] hover:bg-red-500 disabled:bg-red-500/30 text-white px-6 rounded-xl font-black transition"
                            >
                              إرسال
                            </button>
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            submissions[TEAM_BLUE]
                              ? submissions[TEAM_BLUE].isCorrect
                                ? "bg-emerald-50 border-emerald-500"
                                : "bg-red-50 border-red-500 opacity-50"
                              : "bg-blue-50/50 border-blue-200 focus-within:border-blue-500 focus-within:bg-blue-50"
                          }`}
                        >
                          <div className="text-sm font-bold text-blue-600 mb-2">
                            {teams.teamB.name}
                          </div>
                          <div className="flex gap-2">
                            <input
                              disabled={
                                !!submissions[TEAM_BLUE] ||
                                !!feedback ||
                                (buzzerWinner && buzzerWinner !== TEAM_BLUE)
                              }
                              value={inputs[TEAM_BLUE]}
                              onChange={(e) =>
                                handleInputChange(TEAM_BLUE, e.target.value)
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleInputSubmit(TEAM_BLUE)
                              }
                              placeholder="إجابة الفريق الثاني..."
                              className="flex-grow bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl outline-none font-bold text-lg disabled:opacity-50 focus:border-blue-500"
                            />
                            <button
                              disabled={
                                !!submissions[TEAM_BLUE] ||
                                !!feedback ||
                                !inputs[TEAM_BLUE].trim() ||
                                (buzzerWinner && buzzerWinner !== TEAM_BLUE)
                              }
                              onClick={() => handleInputSubmit(TEAM_BLUE)}
                              className="bg-[#1d64ba] hover:bg-blue-500 disabled:bg-blue-500/30 text-white px-6 rounded-xl font-black transition"
                            >
                              إرسال
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {feedback && (
                      <div
                        className={`p-4 rounded-2xl font-black animate-in zoom-in border-2 ${
                          feedback.type === "success"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : feedback.type === "warning"
                              ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                              : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {feedback.msg}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => resetRoundState()}
                    className="p-4 bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase tracking-widest transition border-t border-slate-200 italic text-slate-500"
                  >
                    تخطي هذا السؤال
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="rounded-[2rem] p-5 bg-white/80 border border-slate-200 backdrop-blur-xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between mb-2 px-1 text-slate-500">
              <span className="font-black text-lg">لوحة الترتيب</span>
              <LayoutGrid size={18} />
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl p-4 border border-red-200 shadow-sm bg-gradient-to-br from-red-50 to-white relative overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="font-black text-xl text-red-600">
                    {teams.teamA.name}
                  </div>
                  <div className="text-4xl font-black text-red-500">
                    {wins[TEAM_RED]}
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-24 bg-red-100/50 -skew-x-12 translate-x-12 group-hover:translate-x-6 transition-transform duration-500"></div>
              </div>

              <div className="rounded-2xl p-4 border border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-white relative overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="font-black text-xl text-blue-600">
                    {teams.teamB.name}
                  </div>
                  <div className="text-4xl font-black text-blue-500">
                    {wins[TEAM_BLUE]}
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-24 bg-blue-100/50 -skew-x-12 translate-x-12 group-hover:translate-x-6 transition-transform duration-500"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 grid gap-2">
              <PillButton
                tone="purple"
                onClick={randomizeBoard}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm"
              >
                <Shuffle size={18} /> توزيع عشوائي
              </PillButton>
              <PillButton
                tone="purple"
                onClick={clearBoard}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm"
              >
                <RotateCcw size={18} /> تفريغ اللوحة
              </PillButton>
              <PillButton
                tone="red"
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm"
              >
                <LogOut size={18} /> خروج
              </PillButton>
            </div>
          </aside>
        </div>
      </main>

      {/* Zoom Modal */}
      {zoom && activeCell && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in">
          <button
            onClick={() => setZoom(false)}
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
          >
            <X size={32} />
          </button>
          <div className="w-24 h-24 flex items-center justify-center font-black text-5xl bg-indigo-600 border-4 border-indigo-400 rounded-3xl mb-12 shadow-2xl text-white">
            {activeCell.letter}
          </div>
          <div className="text-6xl md:text-8xl font-black text-center leading-tight max-w-5xl drop-shadow-2xl text-white">
            {currentQuestion?.q}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && roomId && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in">
          <button
            onClick={() => setShowQrModal(false)}
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
          >
            <X size={32} />
          </button>

          <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center max-w-md w-full text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Smartphone className="w-8 h-8 text-indigo-600" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              انضم كلاعب
            </h2>
            <p className="text-slate-500 font-bold mb-8">
              امسح الكود بجوالك أو استخدم الرابط
            </p>

            <div className="bg-white p-4 rounded-2xl border-4 border-slate-100 mb-8 shadow-sm">
              <QRCodeSVG
                value={`${window.location.origin}/play/${roomId}`}
                size={200}
                imageSettings={{
                  src: logoImage,
                  height: 60,
                  width: 60,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 flex items-center justify-between">
                <span className="font-black text-2xl tracking-[0.5em] text-slate-800">
                  {roomId}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  كود الغرفة
                </span>
              </div>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/play/${roomId}`,
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 font-black py-4 rounded-xl hover:bg-indigo-100 transition"
              >
                <Copy size={20} /> نسخ الرابط
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
