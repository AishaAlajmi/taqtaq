import React, { useMemo } from 'react';

const LETTERS = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

export function BackgroundPattern() {
  const grid = useMemo(() => {
    const R = 75; // Larger radius for more visible hexagons
    const WIDTH = 2 * R;
    const HEIGHT = Math.sqrt(3) * R;
    const HORIZ_SPACING = 1.5 * R;
    const VERT_SPACING = HEIGHT;
    
    // Cover a massive area to ensure it fills any screen size even with rotation
    const cols = 40;
    const rows = 25;
    
    const items = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // 80% chance to have a letter
        const hasLetter = Math.random() > 0.2;
        
        // Randomly assign some cells as "answered" by teams
        // 0 = empty/unanswered, 1 = red team, 2 = blue team
        let teamState = 0;
        const rand = Math.random();
        if (hasLetter) {
          if (rand > 0.85) teamState = 1; // 15% chance red
          else if (rand > 0.7) teamState = 2; // 15% chance blue
        }

        items.push({
          id: `${c}-${r}`,
          letter: hasLetter ? LETTERS[Math.floor(Math.random() * LETTERS.length)] : '',
          teamState,
          c,
          r
        });
      }
    }
    return { items, R, WIDTH, HEIGHT, HORIZ_SPACING, VERT_SPACING, cols, rows };
  }, []);

  return (
    <div dir="ltr" className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#6b4c9a]">
      {/* Hexagon Grid */}
      <div 
        className="absolute top-1/2 left-1/2 opacity-40"
        style={{ 
          width: grid.cols * grid.HORIZ_SPACING, 
          height: grid.rows * grid.VERT_SPACING,
          transform: 'translate(-50%, -50%) rotate(-5deg) scale(1.1)' // Slight rotation for dynamic feel
        }}
      >
        {grid.items.map((cell) => {
          const x = cell.c * grid.HORIZ_SPACING;
          const y = cell.r * grid.VERT_SPACING + (cell.c % 2 === 1 ? grid.VERT_SPACING / 2 : 0);
          
          // Determine colors based on team state
          let fillColor = "#5a3d85"; // Default empty cell (darker purple)
          let strokeColor = "#4a2e73";
          let textColor = "#7c5ba8"; // Lighter purple for text

          if (cell.teamState === 1) {
            fillColor = "rgba(232, 53, 37, 0.75)"; // Red team
            strokeColor = "rgba(196, 42, 29, 0.75)";
            textColor = "rgba(255, 255, 255, 0.9)";
          } else if (cell.teamState === 2) {
            fillColor = "rgba(29, 100, 186, 0.75)"; // Blue team
            strokeColor = "rgba(21, 77, 145, 0.75)";
            textColor = "rgba(255, 255, 255, 0.9)";
          }

          return (
            <div
              key={cell.id}
              className="absolute flex items-center justify-center transition-all duration-1000"
              style={{
                width: grid.WIDTH,
                height: grid.HEIGHT,
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <svg 
                viewBox="0 0 100 86.6" 
                className="absolute inset-0 w-full h-full" 
                style={{ 
                  fill: fillColor,
                  stroke: strokeColor,
                  strokeWidth: 3, 
                  strokeLinejoin: 'round', 
                  transform: 'scale(0.92)' 
                }}
              >
                <polygon points="25,2 75,2 98,43.3 75,84.6 25,84.6 2,43.3" />
              </svg>
              {cell.letter && (
                <span 
                  className="relative z-10 font-black drop-shadow-md" 
                  style={{ 
                    fontSize: grid.R * 0.8, 
                    transform: 'translateY(-5%)',
                    color: textColor,
                    opacity: cell.teamState === 0 ? 0.6 : 0.9 // Make answered cells pop more
                  }}
                >
                  {cell.letter}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Center Fade Overlay - Only hides the very center, leaving edges visible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#6b4c9a_20%,_transparent_75%)] opacity-95" />
    </div>
  );
}
