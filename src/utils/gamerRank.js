export function getGamerRank(xp = 0) {
  const points = Number(xp) || 0;

  if (points >= 100) {
    return {
      title: 'Master',
      shortTitle: 'Master',
      tier: 'diamond',
      level: Math.min(99, Math.floor(points / 20)),
      color: '#000000',
      border: 'transparent',
      progress: 100
    };
  }

  if (points >= 50) {
    return {
      title: 'Veteran',
      shortTitle: 'Veteran',
      tier: 'gold',
      level: Math.floor(points / 15),
      color: '#000000',
      border: 'transparent',
      progress: Math.min(100, Math.round(((points - 50) / 50) * 100))
    };
  }

  if (points >= 20) {
    return {
      title: 'Contributor',
      shortTitle: 'Contributor',
      tier: 'silver',
      level: Math.floor(points / 10),
      color: '#000000',
      border: 'transparent',
      progress: Math.min(100, Math.round(((points - 20) / 30) * 100))
    };
  }

  return {
    title: 'Member',
    shortTitle: 'Member',
    tier: 'bronze',
    level: Math.max(1, Math.floor(points / 5)),
    color: '#000000',
    border: 'transparent',
    progress: Math.min(100, Math.round((points / 20) * 100))
  };
}
