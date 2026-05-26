import { allPlayers } from '../data/seasons';

function pickRarity() {
  const roll = Math.random() * 100;
  if (roll < 25) return 'legend';
  if (roll < 70) return 'rare';
  return 'common';
}

function pickOne(excludeNames) {
  const rarity = pickRarity();
  const byRarity = allPlayers.filter(p => p.rarity === rarity && !excludeNames.includes(p.name));
  const fallback  = allPlayers.filter(p => !excludeNames.includes(p.name));
  const source = byRarity.length > 0 ? byRarity : fallback;
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
