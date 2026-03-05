import React from 'react';

export function HexCell({ cell, isActive, onClick, cellSize, teamRed, teamBlue }) {
  const team = cell.team;
  const mainColor = isActive
    ? "#fbd947" // Yellow
    : team === teamRed
      ? "#e83525" // Red
      : team === teamBlue
        ? "#1d64ba" // Blue
        : "#fdfbf7"; // White/Cream

  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-300 transform ${isActive ? "scale-110 z-20 shadow-none" : "hover:scale-105 cursor-pointer"}`}
      style={{ width: cellSize, height: cellSize }}
    >
      {/* Deep shadow layer */}
      <div
        className="absolute inset-0 bg-[#111111]/20 translate-y-2 scale-[0.95] blur-[2px]"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />


      {/* Extra shadow for active cell (keeps the shadow in the same hex/diamond shape) */}
      {isActive && (
        <div
          className="absolute inset-0 -z-10 blur-[10px] opacity-60"
          style={{
            background: "rgba(17,17,17,0.35)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            transform: "translateY(6px) scale(0.98)",
          }}
        />
      )}

      {/* Main Cell Body */}
      <div
        className="absolute inset-[3px] flex items-center justify-center overflow-hidden transition-all duration-300"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          backgroundColor: mainColor,
          background: team
            ? `linear-gradient(135deg, ${mainColor} 0%, ${team === teamRed ? "#c92a1c" : "#154d91"} 100%)`
            : isActive
              ? `linear-gradient(180deg, #fce044 0%, #fbd947 100%)`
              : "linear-gradient(180deg, #ffffff 0%, #fdfbf7 100%)",
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.15)",
        }}
      >
        <span
          className={`font-black transition-colors ${isActive ? "text-[#111111]" : (team !== 0 ? "text-white" : "text-[#111111]")}`}
          style={{
            fontSize: Math.max(18, Math.round(cellSize * 0.45)),
            lineHeight: 1,
            textShadow: (team === 0 && !isActive) || isActive ? "none" : "0px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {cell.letter}
        </span>

        {/* Glossy overlay for unselected cells */}
        {team === 0 && !isActive && (
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
        )}
        {/* Inner border effect (only for unselected cells)
            - Removes the white edges when the cell is colored by a team.
        */}
        {team === 0 && !isActive && (
          <div
            className="absolute inset-0 border-2 border-white/50 pointer-events-none"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          />
        )}
      </div>
    </div>
  );
}
