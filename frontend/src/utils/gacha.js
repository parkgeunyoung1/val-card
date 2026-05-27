import { allPlayers } from '../data/seasons';

function pickRank() {
  const roll = Math.random() * 100;
  if (roll < 10) return 'RADIANT';
  if (roll < 35) return 'IMMORTAL';
  if (roll < 70) return 'ASCENDANT';
  return 'DIAMOND';
}

function pickOne(pool, excludeNames) {
  const rank = pickRank();
  const byRank = pool.filter(p => p.rank === rank && !excludeNames.includes(p.name));
  const fallback = pool.filter(p => !excludeNames.includes(p.name));
  const source = byRank.length > 0 ? byRank : fallback;
  return source[Math.floor(Math.random() * source.length)];
}

export function pull15(seasonIds = []) {
  const pool = seasonIds.length > 0
    ? allPlayers.filter(p => seasonIds.includes(p.seasonId))
    : allPlayers;
  const usedNames = [];
  return Array.from({ length: 15 }, () => {
    const card = pickOne(pool, usedNames);
    if (card) usedNames.push(card.name);
    return card;
  });
}
