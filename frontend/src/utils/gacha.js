import { allPlayers } from '../data/seasons';

function pickRank() {
  const roll = Math.random() * 100;
  if (roll < 10) return 'RADIANT';
  if (roll < 35) return 'IMMORTAL';
  if (roll < 70) return 'ASCENDANT';
  return 'DIAMOND';
}

function pickOne(excludeNames) {
  const rank = pickRank();
  const byRank = allPlayers.filter(p => p.rank === rank && !excludeNames.includes(p.name));
  const fallback = allPlayers.filter(p => !excludeNames.includes(p.name));
  const source = byRank.length > 0 ? byRank : fallback;
  return source[Math.floor(Math.random() * source.length)];
}

export function pull10() {
  const usedNames = [];
  return Array.from({ length: 10 }, () => {
    const card = pickOne(usedNames);
    if (card) usedNames.push(card.name);
    return card;
  });
}
