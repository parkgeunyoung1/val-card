// 팀 이름 → 로컬 이미지 경로
export const TEAM_LOGOS = {
  'Sentinels':       '/logos/teams/sentinels.png',
  'LOUD':            '/logos/teams/loud.png',
  'NRG':             '/logos/teams/nrg.png',
  'Evil Geniuses':   '/logos/teams/evil-geniuses.png',
  '100 Thieves':     '/logos/teams/100-thieves.png',
  'M80':             '/logos/teams/m80.png',
  'KRÜ Esports':    '/logos/teams/kru-esports.png',
  'Cloud9':          '/logos/teams/cloud9.png',
  'Leviatán':        '/logos/teams/leviatan.png',
  'MIBR':            '/logos/teams/mibr.png',
  '2Game Esports':   '/logos/teams/2game-esports.png',
  'G2 Esports':      '/logos/teams/g2-esports.png',
  'FURIA':           '/logos/teams/furia.png',
  'Fnatic':          '/logos/teams/fnatic.png',
  'Team Liquid':     '/logos/teams/team-liquid.png',
  'Team Vitality':   '/logos/teams/team-vitality.png',
  'NaVi':            '/logos/teams/natus-vincere.png',
  'Guild Esports':   '/logos/teams/guild-esports.png',
  'BBL Esports':     '/logos/teams/bbl-esports.png',
  'Karmine Corp':    '/logos/teams/karmine-corp.png',
  'FUT Esports':     '/logos/teams/fut-esports.png',
  'Gentle Mates':    '/logos/teams/gentle-mates.png',
  'GIANTX':          '/logos/teams/giantx.png',
  'Apeks':           '/logos/teams/apeks.png',
  'Team Heretics':   '/logos/teams/team-heretics.png',
  'KOI':             '/logos/teams/koi.png',
  'ZETA DIVISION':   '/logos/teams/zeta-division.png',
  'DRX':             '/logos/teams/drx.png',
  'Paper Rex':       '/logos/teams/paper-rex.png',
  'T1':              '/logos/teams/t1.png',
  'Gen.G':           '/logos/teams/geng.png',
  'Global Esports':  '/logos/teams/global-esports.png',
  'Talon Esports':   '/logos/teams/talon-esports.png',
  'RRQ':             '/logos/teams/rrq.png',
  'DFM':             '/logos/teams/dfm.png',
  'Bleed Esports':   '/logos/teams/bleed-esports.png',
  // ── China ──────────────────────────────────────────
  'EDward Gaming':      '/logos/teams/edg.png',
  'Bilibili Gaming':    '/logos/teams/blg.png',
  'FunPlus Phoenix':    '/logos/teams/fpx.png',
  'Trace Esports':      '/logos/teams/trace-esports.png',
  'Dragon Ranger Gaming':'/logos/teams/drg.png',
  'Nova Esports':       '/logos/teams/nova-esports.png',
  'Wolves Esports':     '/logos/teams/wolves-esports.png',
  'All Gamers':         '/logos/teams/all-gamers.png',
  'Titan Esports Club': '/logos/teams/tec.png',
  'Xi Lai Gaming':      '/logos/teams/xlg.png',
  'JD Gaming':          '/logos/teams/jdg.png',
  'TYLOO':              '/logos/teams/tyloo.png',
  // ── Aliases (CSV name → same logo) ────────────────
  'Movistar KOI':       '/logos/teams/koi.png',
  'Kiwoom DRX':         '/logos/teams/drx.png',
  'Giants Gaming':      '/logos/teams/giantx.png',
  // ── Pacific ────────────────────────────────────────
  'BOOM Esports':       '/logos/teams/boom-esports.png',
  'Team Secret':        '/logos/teams/team-secret.png',
  'FULL SENSE':         '/logos/teams/full-sense.png',
  'Nongshim RedForce':  '/logos/teams/nongshim-redforce.png',
  'VL':                 '/logos/teams/varrel.png',
  // ── EMEA ───────────────────────────────────────────
  'Eternal Fire':       '/logos/teams/eternal-fire.png',
  'PCIFIC Esports':     '/logos/teams/pcific-esports.png',
  'ULF Esports':        '/logos/teams/ulf-esports.png',
  // ── Americas ───────────────────────────────────────
  'ENVY':               '/logos/teams/envy.png',
  // ── Intl (Masters/Champions only) ──────────────────
  'Attacking Soul Esports': '/logos/teams/attacking-soul.png',
};

const AMERICAS_SEASONS = [
  'americas-league-23',
  'americas-kickoff-24',
  'americas-stage1-24',
  'americas-stage2-24',
  'americas-kickoff-25',
  'americas-stage1-25',
  'americas-stage2-25',
  'americas-kickoff-26',
  'americas-stage1-26',
  'americas-stage2-26',
];

const EMEA_SEASONS = [
  'emea-league-23',
  'emea-kickoff-24',
  'emea-stage1-24',
  'emea-stage2-24',
  'emea-kickoff-25',
  'emea-stage1-25',
  'emea-stage2-25',
  'emea-kickoff-26',
  'emea-stage1-26',
  'emea-stage2-26',
];

const PACIFIC_SEASONS = [
  'pacific-league-23',
  'pacific-kickoff-24',
  'pacific-stage1-24',
  'pacific-stage2-24',
  'pacific-kickoff-25',
  'pacific-stage1-25',
  'pacific-stage2-25',
  'pacific-kickoff-26',
  'pacific-stage1-26',
  'pacific-stage2-26',
];

const CHINA_SEASONS = [
  'china-kickoff-24',
  'china-stage1-24',
  'china-stage2-24',
  'china-kickoff-25',
  'china-stage1-25',
  'china-stage2-25',
  'china-kickoff-26',
  'china-stage1-26',
  'china-stage2-26',
];

const MASTERS_SEASONS = [
  'masters-tokyo-23',
  'masters-madrid-24',
  'masters-shanghai-24',
  'masters-bangkok-25',
  'masters-toronto-25',
  'masters-santiago-26',
  'masters-london-26',
];

const CHAMPIONS_SEASONS = [
  'champions-los-angeles-23',
  'champions-seoul-24',
  'champions-paris-25',
  'champions-26',
];

// 시즌 ID → 리그/토너먼트 로고
export const LEAGUE_LOGOS = Object.fromEntries([
  ['lock-in-sao-paulo-23', '/logos/leagues/vct-lock-in-23.png'],
  ...AMERICAS_SEASONS.map((id) => [id, '/logos/leagues/vct-americas.png']),
  ...EMEA_SEASONS.map((id)    => [id, '/logos/leagues/vct-emea.png']),
  ...PACIFIC_SEASONS.map((id) => [id, '/logos/leagues/vct-pacific.png']),
  ...CHINA_SEASONS.map((id)   => [id, '/logos/leagues/vct-china.png']),
  ...MASTERS_SEASONS.map((id) => [id, '/logos/leagues/vct-masters-2025.png']),
  ...CHAMPIONS_SEASONS.map((id) => [id, '/logos/leagues/vct-champions-2025.png']),
  ['masters-bangkok-25', '/logos/leagues/vct-masters-bangkok-25.png'],
]);

// 팀 소속 권역
export const TEAM_REGION = {
  'Sentinels':'americas', 'LOUD':'americas', 'NRG':'americas',
  'Evil Geniuses':'americas', '100 Thieves':'americas', 'M80':'americas',
  'KRÜ Esports':'americas', 'Cloud9':'americas', 'Leviatán':'americas',
  'MIBR':'americas', '2Game Esports':'americas', 'G2 Esports':'americas', 'FURIA':'americas',
  'Fnatic':'emea', 'Team Liquid':'emea', 'Team Vitality':'emea',
  'NaVi':'emea', 'Guild Esports':'emea', 'BBL Esports':'emea',
  'Karmine Corp':'emea', 'FUT Esports':'emea', 'Gentle Mates':'emea',
  'GIANTX':'emea', 'Apeks':'emea', 'Team Heretics':'emea', 'KOI':'emea',
  'ZETA DIVISION':'pacific', 'DRX':'pacific', 'Paper Rex':'pacific',
  'T1':'pacific', 'Gen.G':'pacific', 'Global Esports':'pacific',
  'Talon Esports':'pacific', 'RRQ':'pacific', 'DFM':'pacific', 'Bleed Esports':'pacific',
};
