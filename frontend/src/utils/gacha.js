import players from '../data/players';

// Legend 25% / Rare 45% / Common 30%
function pickRarity() {
  const roll = Math.random() * 100;
  if (roll < 25) return 'legend';
  if (roll < 70) return 'rare';
  return 'common';
}

function pickPlayer(role, rarity) {
  const pool = players.filter(p => p.role === role && p.rarity === rarity);
  // 해당 등급에 선수가 없으면 같은 포지션에서 아무나
  const fallback = players.filter(p => p.role === role);
  const source = pool.length > 0 ? pool : fallback;
  return source[Math.floor(Math.random() * source.length)];
}

const ROLES = ['DUELIST', 'INITIATOR', 'FLEX', 'SENTINEL', 'CONTROLLER'];

export function pull() {
  return ROLES.map(role => {
    const rarity = pickRarity();
    return { ...pickPlayer(role, rarity), rarity };
  });
}

export function pullOne(role) {
  const rarity = pickRarity();
  return { ...pickPlayer(role, rarity), rarity };
}
