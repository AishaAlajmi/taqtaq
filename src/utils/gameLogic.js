export function getNeighbors(r, c, gridRows, gridCols) {
  const neighbors = [];
  const dirs = [
    [0, -1], [0, 1], [-1, 0], [1, 0],
    r % 2 === 0 ? [-1, -1] : [-1, 1],
    r % 2 === 0 ? [1, -1] : [1, 1],
  ];
  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridCols) {
      neighbors.push([nr, nc]);
    }
  }
  return neighbors;
}

export function checkWinner(board, gridRows, gridCols, teamOrange, teamGreen) {
  const keyOf = (r, c) => `${r},${c}`;
  const map = new Map(board.map((c) => [keyOf(c.r, c.c), c]));
  
  // Orange: Top to Bottom (r=0 to r=gridRows-1)
  const start1 = board.filter((c) => c.r === 0 && c.team === teamOrange);
  const q1 = [...start1];
  const v1 = new Set(start1.map((c) => keyOf(c.r, c.c)));
  while (q1.length) {
    const cur = q1.shift();
    if (cur.r === gridRows - 1) return teamOrange;
    for (const [nr, nc] of getNeighbors(cur.r, cur.c, gridRows, gridCols)) {
      const k = keyOf(nr, nc);
      if (v1.has(k)) continue;
      const nxt = map.get(k);
      if (nxt?.team === teamOrange) {
        v1.add(k);
        q1.push(nxt);
      }
    }
  }
  
  // Green: Left to Right (c=0 to c=gridCols-1)
  const start2 = board.filter((c) => c.c === 0 && c.team === teamGreen);
  const q2 = [...start2];
  const v2 = new Set(start2.map((c) => keyOf(c.r, c.c)));
  while (q2.length) {
    const cur = q2.shift();
    if (cur.c === gridCols - 1) return teamGreen;
    for (const [nr, nc] of getNeighbors(cur.r, cur.c, gridRows, gridCols)) {
      const k = keyOf(nr, nc);
      if (v2.has(k)) continue;
      const nxt = map.get(k);
      if (nxt?.team === teamGreen) {
        v2.add(k);
        q2.push(nxt);
      }
    }
  }
  return null;
}

export function shuffleArray(input) {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
