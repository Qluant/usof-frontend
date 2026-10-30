export function getGamerRank(xp = 0) {
  const points = Number(xp) || 0;

  if (points >= 100) {
    return {
      title: 'Legendary Forum Master',
      shortTitle: 'Forum Master',
      tier: 'diamond',
      level: Math.min(99, Math.floor(points / 20)),
      color: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.5)',
      progress: 100
    };
  }

  if (points >= 50) {
    return {
      title: 'Raid Veteran',
      shortTitle: 'Veteran',
      tier: 'gold',
      level: Math.floor(points / 15),
      color: '#a78bfa',
      border: 'rgba(167, 139, 250, 0.45)',
      progress: Math.min(100, Math.round(((points - 50) / 50) * 100))
    };
  }

  if (points >= 20) {
    return {
      title: 'Dungeon Crawler',
      shortTitle: 'Crawler',
      tier: 'silver',
      level: Math.floor(points / 10),
      color: '#38bdf8',
      border: 'rgba(56, 189, 248, 0.4)',
      progress: Math.min(100, Math.round(((points - 20) / 30) * 100))
    };
  }

  return {
    title: 'Novice Scout',
    shortTitle: 'Scout',
    tier: 'bronze',
    level: Math.max(1, Math.floor(points / 5)),
    color: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.3)',
    progress: Math.min(100, Math.round((points / 20) * 100))
  };
}
