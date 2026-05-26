const players = [
  // ── DUELIST ──────────────────────────────────
  { id: 1,  name: 'TenZ',     team: 'Sentinels',     role: 'DUELIST',    nationality: 'CA', rarity: 'legend', image_url: '', stats: { rating: 99, aim: 98, game_sense: 95, clutch: 97 } },
  { id: 2,  name: 'Aspas',    team: 'LOUD',          role: 'DUELIST',    nationality: 'BR', rarity: 'legend', image_url: '', stats: { rating: 98, aim: 99, game_sense: 93, clutch: 96 } },
  { id: 3,  name: 'cNed',     team: 'NaVi',          role: 'DUELIST',    nationality: 'TR', rarity: 'legend', image_url: '', stats: { rating: 96, aim: 97, game_sense: 92, clutch: 94 } },
  { id: 4,  name: 'Derke',    team: 'Fnatic',        role: 'DUELIST',    nationality: 'FI', rarity: 'rare',   image_url: '', stats: { rating: 88, aim: 90, game_sense: 85, clutch: 87 } },
  { id: 5,  name: 'ScreaM',   team: 'Team Liquid',   role: 'DUELIST',    nationality: 'BE', rarity: 'rare',   image_url: '', stats: { rating: 87, aim: 92, game_sense: 83, clutch: 86 } },
  { id: 6,  name: 'Victor',   team: 'NRG',           role: 'DUELIST',    nationality: 'US', rarity: 'rare',   image_url: '', stats: { rating: 85, aim: 86, game_sense: 83, clutch: 84 } },
  { id: 7,  name: 'Cryo',     team: '100 Thieves',   role: 'DUELIST',    nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 74, aim: 75, game_sense: 72, clutch: 73 } },
  { id: 8,  name: 'Asuna',    team: '100 Thieves',   role: 'DUELIST',    nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 73, aim: 74, game_sense: 71, clutch: 72 } },
  { id: 9,  name: 'Tex',      team: 'KRÜ Esports',  role: 'DUELIST',    nationality: 'AR', rarity: 'common', image_url: '', stats: { rating: 69, aim: 70, game_sense: 68, clutch: 68 } },
  { id: 10, name: 'Genghsta', team: 'M80',           role: 'DUELIST',    nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 71, aim: 72, game_sense: 70, clutch: 70 } },

  // ── INITIATOR ─────────────────────────────────
  { id: 11, name: 'Zekken',   team: 'Sentinels',     role: 'INITIATOR',  nationality: 'US', rarity: 'legend', image_url: '', stats: { rating: 97, aim: 96, game_sense: 94, clutch: 95 } },
  { id: 12, name: 'jawgemo',  team: 'Evil Geniuses', role: 'INITIATOR',  nationality: 'US', rarity: 'legend', image_url: '', stats: { rating: 93, aim: 91, game_sense: 94, clutch: 92 } },
  { id: 13, name: 'Sacy',     team: 'Sentinels',     role: 'INITIATOR',  nationality: 'BR', rarity: 'rare',   image_url: '', stats: { rating: 84, aim: 81, game_sense: 88, clutch: 83 } },
  { id: 14, name: 'Less',     team: 'LOUD',          role: 'INITIATOR',  nationality: 'BR', rarity: 'rare',   image_url: '', stats: { rating: 83, aim: 80, game_sense: 86, clutch: 82 } },
  { id: 15, name: 'Shao',     team: 'NaVi',          role: 'INITIATOR',  nationality: 'UZ', rarity: 'rare',   image_url: '', stats: { rating: 82, aim: 80, game_sense: 85, clutch: 81 } },
  { id: 16, name: 'Bang',     team: '100 Thieves',   role: 'INITIATOR',  nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 72, aim: 70, game_sense: 75, clutch: 71 } },
  { id: 17, name: 'Nukkye',   team: 'Guild Esports', role: 'INITIATOR',  nationality: 'IT', rarity: 'common', image_url: '', stats: { rating: 71, aim: 73, game_sense: 70, clutch: 70 } },
  { id: 18, name: 'Mistic',   team: 'Team Vitality', role: 'INITIATOR',  nationality: 'ES', rarity: 'common', image_url: '', stats: { rating: 70, aim: 68, game_sense: 73, clutch: 69 } },

  // ── FLEX ──────────────────────────────────────
  { id: 19, name: 'Rb',       team: 'ZETA DIVISION', role: 'FLEX',       nationality: 'JP', rarity: 'legend', image_url: '', stats: { rating: 95, aim: 93, game_sense: 96, clutch: 94 } },
  { id: 20, name: 'Lakia',    team: 'DRX',           role: 'FLEX',       nationality: 'KR', rarity: 'legend', image_url: '', stats: { rating: 94, aim: 92, game_sense: 95, clutch: 93 } },
  { id: 21, name: 'Crashies', team: 'NRG',           role: 'FLEX',       nationality: 'US', rarity: 'rare',   image_url: '', stats: { rating: 84, aim: 82, game_sense: 87, clutch: 83 } },
  { id: 22, name: 'Zellsis',  team: 'Sentinels',     role: 'FLEX',       nationality: 'US', rarity: 'rare',   image_url: '', stats: { rating: 83, aim: 81, game_sense: 86, clutch: 82 } },
  { id: 23, name: 'Xeta',     team: '100 Thieves',   role: 'FLEX',       nationality: 'KR', rarity: 'rare',   image_url: '', stats: { rating: 82, aim: 83, game_sense: 84, clutch: 81 } },
  { id: 24, name: 'Funn1k',   team: 'Team Liquid',   role: 'FLEX',       nationality: 'UA', rarity: 'common', image_url: '', stats: { rating: 73, aim: 74, game_sense: 74, clutch: 72 } },
  { id: 25, name: 'SUYGETSU', team: 'Team Liquid',   role: 'FLEX',       nationality: 'UA', rarity: 'common', image_url: '', stats: { rating: 72, aim: 71, game_sense: 73, clutch: 71 } },
  { id: 26, name: 'Genkai',   team: 'ZETA DIVISION', role: 'FLEX',       nationality: 'JP', rarity: 'common', image_url: '', stats: { rating: 70, aim: 69, game_sense: 72, clutch: 69 } },

  // ── SENTINEL ──────────────────────────────────
  { id: 27, name: 'Alfajer',  team: 'Fnatic',        role: 'SENTINEL',   nationality: 'TR', rarity: 'legend', image_url: '', stats: { rating: 96, aim: 93, game_sense: 97, clutch: 95 } },
  { id: 28, name: 'Boaster',  team: 'Fnatic',        role: 'SENTINEL',   nationality: 'GB', rarity: 'legend', image_url: '', stats: { rating: 94, aim: 88, game_sense: 99, clutch: 93 } },
  { id: 29, name: 'Chronicle',team: 'Team Vitality', role: 'SENTINEL',   nationality: 'RU', rarity: 'rare',   image_url: '', stats: { rating: 86, aim: 85, game_sense: 89, clutch: 85 } },
  { id: 30, name: 'Shyy',     team: 'KRÜ Esports',  role: 'SENTINEL',   nationality: 'CL', rarity: 'rare',   image_url: '', stats: { rating: 81, aim: 79, game_sense: 84, clutch: 80 } },
  { id: 31, name: 'Ange1',    team: 'NaVi',          role: 'SENTINEL',   nationality: 'UA', rarity: 'rare',   image_url: '', stats: { rating: 83, aim: 80, game_sense: 88, clutch: 82 } },
  { id: 32, name: 'Johnqt',   team: 'M80',           role: 'SENTINEL',   nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 72, aim: 69, game_sense: 76, clutch: 71 } },
  { id: 33, name: 'Klaus',    team: 'KRÜ Esports',  role: 'SENTINEL',   nationality: 'AR', rarity: 'common', image_url: '', stats: { rating: 70, aim: 67, game_sense: 74, clutch: 69 } },
  { id: 34, name: 'Icy',      team: 'Cloud9',        role: 'SENTINEL',   nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 69, aim: 68, game_sense: 72, clutch: 68 } },

  // ── CONTROLLER ────────────────────────────────
  { id: 35, name: 'Leo',      team: 'Team Vitality', role: 'CONTROLLER', nationality: 'FR', rarity: 'legend', image_url: '', stats: { rating: 95, aim: 88, game_sense: 99, clutch: 92 } },
  { id: 36, name: 'FNS',      team: 'NRG',           role: 'CONTROLLER', nationality: 'CA', rarity: 'legend', image_url: '', stats: { rating: 93, aim: 85, game_sense: 99, clutch: 91 } },
  { id: 37, name: 'Marved',   team: 'NRG',           role: 'CONTROLLER', nationality: 'CA', rarity: 'rare',   image_url: '', stats: { rating: 85, aim: 81, game_sense: 89, clutch: 84 } },
  { id: 38, name: 'Boostio',  team: 'Evil Geniuses', role: 'CONTROLLER', nationality: 'US', rarity: 'rare',   image_url: '', stats: { rating: 84, aim: 82, game_sense: 87, clutch: 83 } },
  { id: 39, name: 'Pancada',  team: 'LOUD',          role: 'CONTROLLER', nationality: 'BR', rarity: 'rare',   image_url: '', stats: { rating: 82, aim: 79, game_sense: 86, clutch: 81 } },
  { id: 40, name: 'Demon1',   team: 'Evil Geniuses', role: 'CONTROLLER', nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 75, aim: 78, game_sense: 76, clutch: 74 } },
  { id: 41, name: 'Mako',     team: 'DRX',           role: 'CONTROLLER', nationality: 'KR', rarity: 'common', image_url: '', stats: { rating: 73, aim: 70, game_sense: 77, clutch: 72 } },
  { id: 42, name: 'Noodlz',   team: 'Cloud9',        role: 'CONTROLLER', nationality: 'US', rarity: 'common', image_url: '', stats: { rating: 70, aim: 68, game_sense: 74, clutch: 69 } },
];

export default players;
