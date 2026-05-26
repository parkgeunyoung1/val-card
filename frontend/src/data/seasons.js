const p = (id, name, team, role, nat, rarity, seasonId, seasonLabel, seasonBadge, seasonColor) =>
  ({ id, name, team, role, nationality: nat, rarity, image_url: '', seasonId, seasonLabel, seasonBadge, seasonColor });

// ──────────────────────────────────────────────────────
// VCT 2025 Champions London  🏆
// ──────────────────────────────────────────────────────
const CL_META = ['champions-paris-25', "Champions '25", '🏆', '#f59e0b'];
const cl = (id, name, team, role, nat, rarity) => p(id, name, team, role, nat, rarity, ...CL_META);

const championsLondon = [
  // DUELIST
  cl('cl-d1','TenZ',    'Sentinels',    'DUELIST','CA','legend'),
  cl('cl-d2','Aspas',   'LOUD',         'DUELIST','BR','legend'),
  cl('cl-d3','cNed',    'NaVi',         'DUELIST','TR','legend'),
  cl('cl-d4','Derke',   'Fnatic',       'DUELIST','FI','rare'),
  cl('cl-d5','Rb',      'ZETA DIVISION','DUELIST','JP','rare'),
  cl('cl-d6','Victor',  'NRG',          'DUELIST','US','rare'),
  cl('cl-d7','ScreaM',  'Team Liquid',  'DUELIST','BE','common'),
  cl('cl-d8','Cryo',    '100 Thieves',  'DUELIST','US','common'),
  cl('cl-d9','Tex',     'KRÜ Esports', 'DUELIST','AR','common'),
  // INITIATOR
  cl('cl-i1','Zekken',  'Sentinels',    'INITIATOR','US','legend'),
  cl('cl-i2','jawgemo', 'Evil Geniuses','INITIATOR','US','legend'),
  cl('cl-i3','Sacy',    'Sentinels',    'INITIATOR','BR','rare'),
  cl('cl-i4','Less',    'LOUD',         'INITIATOR','BR','rare'),
  cl('cl-i5','Shao',    'NaVi',         'INITIATOR','UZ','rare'),
  cl('cl-i6','Bang',    '100 Thieves',  'INITIATOR','US','common'),
  cl('cl-i7','Nukkye',  'Guild Esports','INITIATOR','IT','common'),
  cl('cl-i8','Mistic',  'Team Vitality','INITIATOR','ES','common'),
  // FLEX
  cl('cl-f1','Lakia',   'DRX',          'FLEX','KR','legend'),
  cl('cl-f2','Alfajer', 'Fnatic',       'FLEX','TR','legend'),
  cl('cl-f3','Crashies','NRG',          'FLEX','US','rare'),
  cl('cl-f4','Zellsis', 'Sentinels',    'FLEX','US','rare'),
  cl('cl-f5','Xeta',    '100 Thieves',  'FLEX','KR','rare'),
  cl('cl-f6','Funn1k',  'Team Liquid',  'FLEX','UA','common'),
  cl('cl-f7','SUYGETSU','Team Liquid',  'FLEX','UA','common'),
  cl('cl-f8','Genkai',  'ZETA DIVISION','FLEX','JP','common'),
  // SENTINEL
  cl('cl-s1','Boaster', 'Fnatic',       'SENTINEL','GB','legend'),
  cl('cl-s2','Chronicle','Team Vitality','SENTINEL','RU','legend'),
  cl('cl-s3','Ange1',   'NaVi',         'SENTINEL','UA','rare'),
  cl('cl-s4','Shyy',    'KRÜ Esports', 'SENTINEL','CL','rare'),
  cl('cl-s5','Johnqt',  'M80',          'SENTINEL','US','common'),
  cl('cl-s6','Klaus',   'KRÜ Esports', 'SENTINEL','AR','common'),
  cl('cl-s7','Icy',     'Cloud9',       'SENTINEL','US','common'),
  // CONTROLLER
  cl('cl-c1','Leo',     'Team Vitality','CONTROLLER','FR','legend'),
  cl('cl-c2','FNS',     'NRG',          'CONTROLLER','CA','legend'),
  cl('cl-c3','Marved',  'NRG',          'CONTROLLER','CA','rare'),
  cl('cl-c4','Boostio', 'Evil Geniuses','CONTROLLER','US','rare'),
  cl('cl-c5','Pancada', 'LOUD',         'CONTROLLER','BR','rare'),
  cl('cl-c6','Demon1',  'Evil Geniuses','CONTROLLER','US','common'),
  cl('cl-c7','Mako',    'DRX',          'CONTROLLER','KR','common'),
  cl('cl-c8','Noodlz',  'Cloud9',       'CONTROLLER','US','common'),
];

// ──────────────────────────────────────────────────────
// VCT 2025 Masters Toronto  🎯
// ──────────────────────────────────────────────────────
const MT_META = ['masters-toronto-25', "Masters '25", '🎯', '#a855f7'];
const mt = (id, name, team, role, nat, rarity) => p(id, name, team, role, nat, rarity, ...MT_META);

const mastersToronto = [
  // DUELIST
  mt('mt-d1','Aspas',   'LOUD',         'DUELIST','BR','legend'),
  mt('mt-d2','Derke',   'Fnatic',       'DUELIST','FI','legend'),
  mt('mt-d3','TenZ',    'Sentinels',    'DUELIST','CA','rare'),
  mt('mt-d4','Victor',  'NRG',          'DUELIST','US','rare'),
  mt('mt-d5','Rb',      'ZETA DIVISION','DUELIST','JP','rare'),
  mt('mt-d6','Cryo',    '100 Thieves',  'DUELIST','US','common'),
  mt('mt-d7','Asuna',   '100 Thieves',  'DUELIST','US','common'),
  // INITIATOR
  mt('mt-i1','Zekken',  'Sentinels',    'INITIATOR','US','legend'),
  mt('mt-i2','Less',    'LOUD',         'INITIATOR','BR','legend'),
  mt('mt-i3','Sacy',    'Sentinels',    'INITIATOR','BR','rare'),
  mt('mt-i4','Shao',    'NaVi',         'INITIATOR','UZ','rare'),
  mt('mt-i5','Bang',    '100 Thieves',  'INITIATOR','US','common'),
  mt('mt-i6','Nukkye',  'Guild Esports','INITIATOR','IT','common'),
  // FLEX
  mt('mt-f1','Lakia',   'DRX',          'FLEX','KR','legend'),
  mt('mt-f2','Crashies','NRG',          'FLEX','US','rare'),
  mt('mt-f3','Zellsis', 'Sentinels',    'FLEX','US','rare'),
  mt('mt-f4','Xeta',    '100 Thieves',  'FLEX','KR','rare'),
  mt('mt-f5','SUYGETSU','Team Liquid',  'FLEX','UA','common'),
  mt('mt-f6','Genkai',  'ZETA DIVISION','FLEX','JP','common'),
  // SENTINEL
  mt('mt-s1','Alfajer', 'Fnatic',       'SENTINEL','TR','legend'),
  mt('mt-s2','Boaster', 'Fnatic',       'SENTINEL','GB','rare'),
  mt('mt-s3','Ange1',   'NaVi',         'SENTINEL','UA','rare'),
  mt('mt-s4','Chronicle','Team Vitality','SENTINEL','RU','rare'),
  mt('mt-s5','Shyy',    'KRÜ Esports', 'SENTINEL','CL','common'),
  mt('mt-s6','Johnqt',  'M80',          'SENTINEL','US','common'),
  // CONTROLLER
  mt('mt-c1','FNS',     'NRG',          'CONTROLLER','CA','legend'),
  mt('mt-c2','Leo',     'Team Vitality','CONTROLLER','FR','legend'),
  mt('mt-c3','Pancada', 'LOUD',         'CONTROLLER','BR','rare'),
  mt('mt-c4','Marved',  'NRG',          'CONTROLLER','CA','rare'),
  mt('mt-c5','Boostio', 'Evil Geniuses','CONTROLLER','US','common'),
  mt('mt-c6','Mako',    'DRX',          'CONTROLLER','KR','common'),
];

// ──────────────────────────────────────────────────────
// VCT 2025 Pacific Stage 2  🌏
// ──────────────────────────────────────────────────────
const PS_META = ['pacific-stage2-25', "Pacific S2 '25", '🌏', '#3b82f6'];
const ps = (id, name, team, role, nat, rarity) => p(id, name, team, role, nat, rarity, ...PS_META);

const pacificStage2 = [
  // DUELIST
  ps('ps-d1','Rb',      'ZETA DIVISION','DUELIST','JP','legend'),
  ps('ps-d2','Lakia',   'DRX',          'DUELIST','KR','legend'),
  ps('ps-d3','Genghsta','M80',          'DUELIST','US','rare'),
  ps('ps-d4','Tex',     'KRÜ Esports', 'DUELIST','AR','rare'),
  ps('ps-d5','Asuna',   '100 Thieves',  'DUELIST','US','common'),
  ps('ps-d6','Cryo',    '100 Thieves',  'DUELIST','US','common'),
  // INITIATOR
  ps('ps-i1','Xeta',    '100 Thieves',  'INITIATOR','KR','legend'),
  ps('ps-i2','Less',    'LOUD',         'INITIATOR','BR','rare'),
  ps('ps-i3','Bang',    '100 Thieves',  'INITIATOR','US','rare'),
  ps('ps-i4','Mistic',  'Team Vitality','INITIATOR','ES','common'),
  ps('ps-i5','Nukkye',  'Guild Esports','INITIATOR','IT','common'),
  // FLEX
  ps('ps-f1','Genkai',  'ZETA DIVISION','FLEX','JP','legend'),
  ps('ps-f2','Zellsis', 'Sentinels',    'FLEX','US','rare'),
  ps('ps-f3','Crashies','NRG',          'FLEX','US','rare'),
  ps('ps-f4','SUYGETSU','Team Liquid',  'FLEX','UA','common'),
  ps('ps-f5','Funn1k',  'Team Liquid',  'FLEX','UA','common'),
  // SENTINEL
  ps('ps-s1','Chronicle','Team Vitality','SENTINEL','RU','legend'),
  ps('ps-s2','Shyy',    'KRÜ Esports', 'SENTINEL','CL','rare'),
  ps('ps-s3','Klaus',   'KRÜ Esports', 'SENTINEL','AR','rare'),
  ps('ps-s4','Johnqt',  'M80',          'SENTINEL','US','common'),
  ps('ps-s5','Icy',     'Cloud9',       'SENTINEL','US','common'),
  // CONTROLLER
  ps('ps-c1','Mako',    'DRX',          'CONTROLLER','KR','legend'),
  ps('ps-c2','Pancada', 'LOUD',         'CONTROLLER','BR','rare'),
  ps('ps-c3','Boostio', 'Evil Geniuses','CONTROLLER','US','rare'),
  ps('ps-c4','Demon1',  'Evil Geniuses','CONTROLLER','US','common'),
  ps('ps-c5','Noodlz',  'Cloud9',       'CONTROLLER','US','common'),
];

// ──────────────────────────────────────────────────────
// VCT 2025 Americas Stage 2  🌎
// ──────────────────────────────────────────────────────
const AS_META = ['americas-stage2-25', "Americas S2 '25", '🌎', '#22c55e'];
const as_ = (id, name, team, role, nat, rarity) => p(id, name, team, role, nat, rarity, ...AS_META);

const americasStage2 = [
  // DUELIST
  as_('as-d1','TenZ',    'Sentinels',    'DUELIST','CA','legend'),
  as_('as-d2','Aspas',   'LOUD',         'DUELIST','BR','legend'),
  as_('as-d3','Victor',  'NRG',          'DUELIST','US','rare'),
  as_('as-d4','Cryo',    '100 Thieves',  'DUELIST','US','rare'),
  as_('as-d5','Demon1',  'Evil Geniuses','DUELIST','US','rare'),
  as_('as-d6','Asuna',   '100 Thieves',  'DUELIST','US','common'),
  as_('as-d7','Genghsta','M80',          'DUELIST','US','common'),
  // INITIATOR
  as_('as-i1','Zekken',  'Sentinels',    'INITIATOR','US','legend'),
  as_('as-i2','jawgemo', 'Evil Geniuses','INITIATOR','US','legend'),
  as_('as-i3','Sacy',    'Sentinels',    'INITIATOR','BR','rare'),
  as_('as-i4','Less',    'LOUD',         'INITIATOR','BR','rare'),
  as_('as-i5','Bang',    '100 Thieves',  'INITIATOR','US','common'),
  as_('as-i6','Xeta',    '100 Thieves',  'INITIATOR','KR','common'),
  // FLEX
  as_('as-f1','Crashies','NRG',          'FLEX','US','legend'),
  as_('as-f2','Zellsis', 'Sentinels',    'FLEX','US','rare'),
  as_('as-f3','Boostio', 'Evil Geniuses','FLEX','US','rare'),
  as_('as-f4','Johnqt',  'M80',          'FLEX','US','common'),
  as_('as-f5','Genghsta','M80',          'FLEX','US','common'),
  // SENTINEL
  as_('as-s1','Boaster', 'Fnatic',       'SENTINEL','GB','legend'),
  as_('as-s2','Ange1',   'NaVi',         'SENTINEL','UA','rare'),
  as_('as-s3','Shyy',    'KRÜ Esports', 'SENTINEL','CL','rare'),
  as_('as-s4','Klaus',   'KRÜ Esports', 'SENTINEL','AR','common'),
  as_('as-s5','Icy',     'Cloud9',       'SENTINEL','US','common'),
  // CONTROLLER
  as_('as-c1','FNS',     'NRG',          'CONTROLLER','CA','legend'),
  as_('as-c2','Marved',  'NRG',          'CONTROLLER','CA','legend'),
  as_('as-c3','Pancada', 'LOUD',         'CONTROLLER','BR','rare'),
  as_('as-c4','Boostio', 'Evil Geniuses','CONTROLLER','US','rare'),
  as_('as-c5','Demon1',  'Evil Geniuses','CONTROLLER','US','common'),
  as_('as-c6','Noodlz',  'Cloud9',       'CONTROLLER','US','common'),
];

// ── 전체 풀 (시즌 구분 없이 하나로 합침) ──────────────
export const allPlayers = [
  ...championsLondon,
  ...mastersToronto,
  ...pacificStage2,
  ...americasStage2,
];

const seasons = [
  {
    id: 'champions-paris-25',
    name: "VCT 2025 Champions Paris",
    short: "Champions '25",
    period: '2025 · 8월 · 파리',
    badge: '🏆',
    color: '#f59e0b',
    description: '전 권역 최강팀 16개가 격돌하는 연간 최대 국제대회',
    players: championsLondon,
  },
  {
    id: 'masters-toronto-25',
    name: "VCT 2025 Masters Toronto",
    short: "Masters '25",
    period: '2025 · 6월 · 토론토',
    badge: '🎯',
    color: '#a855f7',
    description: '각 권역 상위 12개 팀이 참가하는 국제대회',
    players: mastersToronto,
  },
  {
    id: 'pacific-stage2-25',
    name: "VCT 2025 Pacific Stage 2",
    short: "Pacific S2 '25",
    period: '2025 · 5월 · 서울',
    badge: '🌏',
    color: '#3b82f6',
    description: 'VCT 퍼시픽 권역 리그 2스테이지',
    players: pacificStage2,
  },
  {
    id: 'americas-stage2-25',
    name: "VCT 2025 Americas Stage 2",
    short: "Americas S2 '25",
    period: '2025 · 5월 · 로스앤젤레스',
    badge: '🌎',
    color: '#22c55e',
    description: 'VCT 아메리카스 권역 리그 2스테이지',
    players: americasStage2,
  },
];

export default seasons;
