export const defaultSettings = {
  bestOf: 1,
  gridSize: 5,
  gameMode: 'all_players', // 'all_players' or 'host'
  category: 'all',
  difficulty: 'all'
};

export function getSettings() {
  try {
    const s = localStorage.getItem('gameSettings');
    return s ? { ...defaultSettings, ...JSON.parse(s) } : defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  localStorage.setItem('gameSettings', JSON.stringify(settings));
}

export const defaultTeams = {
  teamA: { name: 'فريق واحد', color: 'orange' },
  teamB: { name: 'فريق اثنين', color: 'green' }
};

export function getTeams() {
  try {
    const s = localStorage.getItem('gameTeams');
    return s ? { ...defaultTeams, ...JSON.parse(s) } : defaultTeams;
  } catch (e) {
    return defaultTeams;
  }
}

export function saveTeams(teams) {
  localStorage.setItem('gameTeams', JSON.stringify(teams));
}
