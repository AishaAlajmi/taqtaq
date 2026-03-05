//C:\Users\aisha\Downloads\New folder (4)\src\pages\ControllerPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSocket } from "../services/socket";
import { Bell, AlertCircle, Trophy } from "lucide-react";
import { HexCell } from "../components/HexCell";

/** ========= Types (حل مشاكل implicit any) ========= */
type TeamId = 1 | 2;

type BoardCell = {
  r: number;
  c: number;
  letter: string;
  team: 0 | TeamId;
};

type ActiveCell = {
  r: number;
  c: number;
  letter: string;
};

type Question = {
  q: string;
  a: string;
};

type GameState = {
  board?: BoardCell[];
  activeCell?: ActiveCell | null;
  currentQuestion?: Question | null;
  buzzerWinner?: TeamId | null;
  buzzerLocked?: boolean;
};

/** Join room callback response */
type JoinRoomResponse =
  | { error: string }
  | {
      state: GameState;
      buzzerWinner: TeamId | null;
      buzzerLocked: boolean;
    };

/** Socket payloads */
type BuzzerPressedPayload = { teamId: TeamId };
type BuzzerLockedPayload = { locked: boolean };
function toFriendlyRoomError(raw: string) {
  const msg = (raw || "").toLowerCase();

  const roomGone =
    msg.includes("not_found") ||
    msg.includes("not found") ||
    msg.includes("expired") ||
    msg.includes("ended") ||
    msg.includes("invalid room") ||
    msg.includes("no active") ||
    (msg.includes("room") && msg.includes("not") && msg.includes("found"));

  if (roomGone) {
    return "يبدو أن الغرفة انتهت أو لم تعد متاحة. اطلب من المضيف إنشاء كود جديد ثم جرّب مرة ثانية.";
  }

  const serverish =
    msg.includes("supabase") ||
    msg.includes("vercel") ||
    msg.includes("server") ||
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("failed") ||
    msg.includes("timeout");

  if (serverish) {
    return "تعذّر الاتصال حالياً. إذا كانت الغرفة قديمة فغالباً انتهت. جرّب تحديث الصفحة أو اطلب كود جديد من المضيف.";
  }

  return raw || "حدث خطأ غير متوقع. جرّب مرة ثانية.";
}
export function ControllerPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [teamId, setTeamId] = useState<TeamId | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const [buzzerWinner, setBuzzerWinner] = useState<TeamId | null>(null);
  const [buzzerLocked, setBuzzerLocked] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rows = useMemo(() => {
    if (!gameState?.board) return [];
    const maxR = Math.max(...gameState.board.map((c) => c.r));
    const r: BoardCell[][] = Array.from({ length: maxR + 1 }, () => []);
    for (const cell of gameState.board) r[cell.r].push(cell);
    return r;
  }, [gameState?.board]);

  const GRID_COLS =
    rows.length > 0 ? Math.max(...rows.map((r) => r.length)) : 5;
  const maxBoardWidth = Math.min(350, windowWidth - 32);
  const CELL_SIZE = Math.max(
    25,
    Math.min(50, maxBoardWidth / (GRID_COLS * 0.9)),
  );

  useEffect(() => {
    const socket = getSocket();

    // join room once team selected
    if (teamId && roomId) {
      socket.emit(
        "join_room",
        { roomId, teamId },
        (response: JoinRoomResponse) => {
          if ("error" in response) {
            setError(toFriendlyRoomError(response.error));
            return;
          }

          setGameState(response.state);
          setBuzzerWinner(response.buzzerWinner);
          setBuzzerLocked(response.buzzerLocked);
        },
      );
    }

    // ✅ Types added here to remove implicit any
    socket.on("game_state_updated", (state: GameState) => {
      setGameState(state);
      if (state.buzzerLocked !== undefined) setBuzzerLocked(state.buzzerLocked);
      if (state.buzzerWinner !== undefined)
        setBuzzerWinner(state.buzzerWinner ?? null);
    });

    socket.on(
      "buzzer_pressed",
      ({ teamId: winnerId }: BuzzerPressedPayload) => {
        setBuzzerWinner(winnerId);
        setBuzzerLocked(true);

        if (winnerId === teamId && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      },
    );

    socket.on("buzzer_locked", ({ locked }: BuzzerLockedPayload) => {
      setBuzzerLocked(locked);
      if (!locked) {
        setBuzzerWinner(null);
        if (navigator.vibrate) navigator.vibrate(50);
      }
    });

    socket.on("buzzer_reset", () => {
      setBuzzerWinner(null);
      setBuzzerLocked(false);
      if (navigator.vibrate) navigator.vibrate(50);
    });

    socket.on("host_disconnected", () => {
      setError("انتهت الغرفة لأن المضيف خرج. اطلب منه إنشاء كود جديد.");
    });

    return () => {
      socket.off("game_state_updated");
      socket.off("buzzer_pressed");
      socket.off("buzzer_locked");
      socket.off("buzzer_reset");
      socket.off("host_disconnected");
    };
  }, [roomId, teamId]);

  const handleBuzz = () => {
    if (buzzerLocked || buzzerWinner) return;

    if (navigator.vibrate) navigator.vibrate(100);

    const socket = getSocket();
    socket.emit("buzz_press", { roomId, teamId });
  };

  if (error) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white"
      >
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black mb-2">عذراً!</h1>
        <p className="text-slate-400 mb-8">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  if (!teamId) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white"
      >
        <h1 className="text-3xl font-black mb-8 text-center">اختر فريقك</h1>
        <div className="w-full max-w-md space-y-4">
          <button
            onClick={() => setTeamId(1)}
            className="w-full bg-red-600 hover:bg-red-500 text-white p-8 rounded-3xl font-black text-2xl border-4 border-red-800 shadow-[0_8px_0_rgb(153,27,27)] active:shadow-[0_0_0_rgb(153,27,27)] active:translate-y-2 transition-all"
          >
            الفريق الأحمر
          </button>
          <button
            onClick={() => setTeamId(2)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-8 rounded-3xl font-black text-2xl border-4 border-blue-800 shadow-[0_8px_0_rgb(30,58,138)] active:shadow-[0_0_0_rgb(30,58,138)] active:translate-y-2 transition-all"
          >
            الفريق الأزرق
          </button>
        </div>
      </div>
    );
  }

  const isMyTeam = buzzerWinner === teamId;
  const isOtherTeam = buzzerWinner && buzzerWinner !== teamId;
  const teamColor = teamId === 1 ? "red" : "blue";

  let bgColor = "bg-slate-900";
  let statusText = "انتظر...";
  let buttonState = "disabled";

  if (!buzzerLocked && !buzzerWinner) {
    bgColor = teamColor === "red" ? "bg-red-950" : "bg-blue-950";
    statusText = "اضغط!";
    buttonState = "ready";
  } else if (isMyTeam) {
    bgColor = "bg-emerald-900";
    statusText = "دورك تجاوب!";
    buttonState = "winner";
  } else if (isOtherTeam) {
    bgColor = "bg-slate-900";
    statusText = "سبقك الفريق الآخر";
    buttonState = "loser";
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col items-center p-4 transition-colors duration-300 ${bgColor} text-white overflow-x-hidden`}
    >
      <div className="w-full text-center mt-4 mb-4">
        <div className="text-slate-400 font-bold mb-1 text-sm">
          غرفة: {roomId}
        </div>
        <div
          className={`text-xl font-black ${teamColor === "red" ? "text-red-400" : "text-blue-400"}`}
        >
          {teamId === 1 ? "الفريق الأحمر" : "الفريق الأزرق"}
        </div>
      </div>

      {gameState?.board && rows.length > 0 && (
        <div className="w-full max-w-[350px] mb-6 flex items-center justify-center">
          <div className="relative rounded-[20px] bg-[#e83525] shadow-lg border-2 border-white overflow-hidden w-full aspect-square flex items-center justify-center p-4">
            <div
              className="absolute top-[-12%] bottom-[-12%] left-[-18%] w-[72%] bg-[#1d64ba] opacity-100 z-0"
              style={{ clipPath: "polygon(0 0, 88% 50%, 0 100%)" }}
            />
            <div
              className="absolute top-[-12%] bottom-[-12%] right-[-18%] w-[72%] bg-[#1d64ba] opacity-100 z-0"
              style={{ clipPath: "polygon(100% 0, 12% 50%, 100% 100%)" }}
            />

            <div className="relative z-10 rounded-[15px] bg-white/30 border border-white/60 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] w-full h-full flex items-center justify-center p-4">
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
                      {row.map((cell: any) => (
                        <HexCell
                          key={`${cell.r},${cell.c}`}
                          cell={cell}
                          cellSize={CELL_SIZE}
                          teamRed={1}
                          teamBlue={2}
                          isActive={
                            gameState.activeCell &&
                            cell.r === gameState.activeCell.r &&
                            cell.c === gameState.activeCell.c
                          }
                          onClick={() => {}}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md flex-grow flex flex-col items-center justify-center relative mb-24">
        {/* The BIG Button */}
        <button
          onClick={handleBuzz}
          disabled={buttonState !== "ready"}
          className={`
            relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center
            border-8 transition-all duration-150 select-none
            ${
              buttonState === "ready"
                ? `bg-${teamColor}-500 border-${teamColor}-400 shadow-[0_15px_0_rgb(0,0,0,0.3),0_0_30px_rgba(${teamColor === "red" ? "239,68,68" : "59,130,246"},0.5)] active:shadow-[0_0_0_rgb(0,0,0,0.3)] active:translate-y-[15px]`
                : buttonState === "winner"
                  ? "bg-emerald-500 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.8)] scale-110"
                  : "bg-slate-800 border-slate-700 opacity-50 scale-95"
            }
          `}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {buttonState === "ready" && (
            <Bell className="w-16 h-16 sm:w-20 sm:h-20 mb-2 animate-bounce" />
          )}
          {buttonState === "winner" && (
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 mb-2 text-yellow-300" />
          )}
          {buttonState === "loser" && (
            <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 mb-2 text-slate-500" />
          )}
          {buttonState === "disabled" && (
            <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 mb-2 text-slate-500" />
          )}

          <span className="text-2xl sm:text-3xl font-black tracking-wider">
            {statusText}
          </span>
        </button>
      </div>

      {gameState?.activeCell && (
        <div className="fixed bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 z-50">
          <div className="text-xs text-slate-300 font-bold mb-1">
            السؤال الحالي (حرف {gameState.activeCell.letter})
          </div>
          <div className="text-lg font-black leading-snug">
            {gameState.currentQuestion?.q}
          </div>
        </div>
      )}
    </div>
  );
}
