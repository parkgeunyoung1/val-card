import { useEffect, useMemo, useRef } from 'react';
import PlayerCard from './PlayerCard';
import './LegendReveal.css';

const TEAM_REGION = {
  'Sentinels': 'VCT Americas',    'NRG': 'VCT Americas',
  'Evil Geniuses': 'VCT Americas','100 Thieves': 'VCT Americas',
  'M80': 'VCT Americas',          'KRÜ Esports': 'VCT Americas',
  'LOUD': 'VCT Americas',         'Cloud9': 'VCT Americas',
  'Fnatic': 'VCT EMEA',           'Team Liquid': 'VCT EMEA',
  'Team Vitality': 'VCT EMEA',    'NaVi': 'VCT EMEA',
  'Guild Esports': 'VCT EMEA',
  'ZETA DIVISION': 'VCT Pacific', 'DRX': 'VCT Pacific',
};

const COUNTRY = {
  CA: 'Canada',       US: 'United States', BR: 'Brazil',
  TR: 'Turkey',       BE: 'Belgium',       RU: 'Russia',
  FI: 'Finland',      FR: 'France',        UZ: 'Uzbekistan',
  AR: 'Argentina',    CL: 'Chile',         JP: 'Japan',
  KR: 'South Korea',  IT: 'Italy',         ES: 'Spain',
  UA: 'Ukraine',      GB: 'United Kingdom',
};

const FLAG = {
  CA:'🇨🇦', US:'🇺🇸', BR:'🇧🇷', TR:'🇹🇷', BE:'🇧🇪', RU:'🇷🇺',
  FI:'🇫🇮', FR:'🇫🇷', UZ:'🇺🇿', AR:'🇦🇷', CL:'🇨🇱', JP:'🇯🇵',
  KR:'🇰🇷', IT:'🇮🇹', ES:'🇪🇸', UA:'🇺🇦', GB:'🇬🇧',
};

const ROLE_ICON = {
  DUELIST:'⚔️', INITIATOR:'💡', FLEX:'🔄', SENTINEL:'🛡️', CONTROLLER:'🌫️',
};

function Particles() {
  const list = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left:     `${5 + (i * 4.7) % 90}%`,
      delay:    `${(i * 0.17) % 3}s`,
      duration: `${2.2 + (i * 0.22) % 2}s`,
      size:     `${3 + (i * 1.9) % 7}px`,
    })), []);

  return (
    <div className="particles" aria-hidden>
      {list.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

function LegendReveal({ player, onComplete }) {
  const { name, team, nationality, role } = player;
  const doneRef = useRef(false);

  const region  = TEAM_REGION[team] || 'VCT';
  const country = COUNTRY[nationality] || nationality;
  const flag    = FLAG[nationality] || '';

  const rows = [
    { label: 'TOURNAMENT',  value: region,                      delay: '0.5s'  },
    { label: 'TEAM',        value: team,                        delay: '1.2s'  },
    { label: 'NATIONALITY', value: `${flag}  ${country}`,       delay: '1.9s'  },
    { label: 'ROLE',        value: `${ROLE_ICON[role]}  ${role}`, delay: '2.6s' },
  ];

  function done() {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  }

  // 자동 넘김 6초
  useEffect(() => {
    const t = setTimeout(done, 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="legend-overlay" onClick={done}>
      <div className="beam" />
      <div className="beam beam2" />
      <Particles />

      {/* ── 전광판 ── */}
      <div className="rev-board" onClick={e => e.stopPropagation()}>
        <div className="board-badge">
          <span className="badge-star">★</span>
          <span className="badge-text">LEGEND PLAYER</span>
          <span className="badge-star">★</span>
        </div>

        <div className="board-line" />

        <div className="board-rows">
          {rows.map(({ label, value, delay }) => (
            <div key={label} className="board-row" style={{ animationDelay: delay }}>
              <span className="row-label">{label}</span>
              <span className="row-value">{value}</span>
            </div>
          ))}
        </div>

        <div className="board-line" style={{ animationDelay: '3.2s' }} />

        <div className="player-name-text" style={{ animationDelay: '3.4s' }}>
          {name}
        </div>
      </div>

      {/* ── 카드 등장 ── */}
      <div className="card-stage">
        <div className="card-aura" />
        <PlayerCard player={player} delay={0} />
      </div>

      <p className="skip-hint">클릭하여 계속</p>
    </div>
  );
}

export default LegendReveal;
