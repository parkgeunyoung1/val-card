const TEAM_REGION = {
  'Sentinels':'VCT Americas', 'NRG':'VCT Americas',
  'Evil Geniuses':'VCT Americas', '100 Thieves':'VCT Americas',
  'M80':'VCT Americas', 'KRÜ Esports':'VCT Americas',
  'LOUD':'VCT Americas', 'Cloud9':'VCT Americas',
  'Fnatic':'VCT EMEA', 'Team Liquid':'VCT EMEA',
  'Team Vitality':'VCT EMEA', 'NaVi':'VCT EMEA', 'Guild Esports':'VCT EMEA',
  'ZETA DIVISION':'VCT Pacific', 'DRX':'VCT Pacific',
};

const COUNTRY = {
  CA:'Canada', US:'United States', BR:'Brazil', TR:'Turkey',
  BE:'Belgium', RU:'Russia', FI:'Finland', FR:'France',
  UZ:'Uzbekistan', AR:'Argentina', CL:'Chile', JP:'Japan',
  KR:'South Korea', IT:'Italy', ES:'Spain', UA:'Ukraine', GB:'United Kingdom',
};

const FLAG = {
  CA:'🇨🇦', US:'🇺🇸', BR:'🇧🇷', TR:'🇹🇷', BE:'🇧🇪', RU:'🇷🇺',
  FI:'🇫🇮', FR:'🇫🇷', UZ:'🇺🇿', AR:'🇦🇷', CL:'🇨🇱', JP:'🇯🇵',
  KR:'🇰🇷', IT:'🇮🇹', ES:'🇪🇸', UA:'🇺🇦', GB:'🇬🇧',
};

function region(team) { return TEAM_REGION[team] || ''; }

// 케미스트리 계산
// 연결 타입 우선순위: team(3pt) > season(2pt) > nationality(1pt)
export function calcChemistry(slots) {
  const cards = slots;
  const connections = [];

  for (let i = 0; i < 5; i++) {
    for (let j = i + 1; j < 5; j++) {
      const a = cards[i], b = cards[j];
      if (!a || !b) continue;

      if (a.team === b.team) {
        connections.push({ from: i, to: j, type: 'team' });
      } else if (a.seasonId === b.seasonId) {
        connections.push({ from: i, to: j, type: 'season' });
      } else if (a.nationality === b.nationality) {
        connections.push({ from: i, to: j, type: 'nationality' });
      }
    }
  }

  const POINTS = { team: 3, season: 2, nationality: 1 };
  const playerChem = Array(5).fill(0);
  for (const { from, to, type } of connections) {
    const pts = POINTS[type];
    playerChem[from] = Math.min(3, playerChem[from] + pts);
    playerChem[to]   = Math.min(3, playerChem[to]   + pts);
  }

  const total = playerChem.reduce((a, b) => a + b, 0);
  const grade =
    total >= 13 ? 'S' :
    total >= 9  ? 'A' :
    total >= 5  ? 'B' :
    total >= 1  ? 'C' : 'D';

  // 시너지 뱃지
  const teamCount   = {};
  const natCount    = {};
  const regionCount = {};
  for (const c of cards) {
    if (!c) continue;
    teamCount[c.team] = (teamCount[c.team] || 0) + 1;
    natCount[c.nationality]   = (natCount[c.nationality]   || 0) + 1;
    const r = region(c.team);
    if (r) regionCount[r] = (regionCount[r] || 0) + 1;
  }

  // 시즌별 카운트
  const seasonCount = {};
  for (const c of cards) {
    if (!c) continue;
    seasonCount[c.seasonId] = (seasonCount[c.seasonId] || 0) + 1;
  }

  const badges = [];
  for (const [team, cnt] of Object.entries(teamCount)) {
    if (cnt >= 2) badges.push({ icon: '🛡️', label: team, count: cnt, type: 'team' });
  }
  for (const [sid, cnt] of Object.entries(seasonCount)) {
    if (cnt >= 3) badges.push({ icon: '📅', label: sid, count: cnt, type: 'season' });
  }
  for (const [nat, cnt] of Object.entries(natCount)) {
    if (cnt >= 2) {
      const flag = FLAG[nat] || '';
      const name = COUNTRY[nat] || nat;
      badges.push({ icon: flag, label: name, count: cnt, type: 'nationality' });
    }
  }
  return { connections, playerChem, total, grade, badges };
}
