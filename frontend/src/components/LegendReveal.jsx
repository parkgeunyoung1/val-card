import { useState, useEffect, useRef, useMemo } from 'react';
import PlayerCard from './PlayerCard';
import { TEAM_LOGOS, LEAGUE_LOGOS } from '../data/logos';
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
const RARITY_COLOR = { legend:'#f59e0b', rare:'#60a5fa', common:'#94a3b8' };

function buildSteps(player) {
  const steps = [];
  if (player.seasonId && (LEAGUE_LOGOS[player.seasonId] || player.seasonLabel)) {
    steps.push({ type: 'season', label: player.seasonLabel, image: LEAGUE_LOGOS[player.seasonId] || null, fallback: player.seasonBadge || '' });
  }
  if (player.team && (TEAM_LOGOS[player.team] || player.team)) {
    steps.push({ type: 'team', label: player.team, image: TEAM_LOGOS[player.team] || null, fallback: player.team });
  }
  if (player.role) {
    steps.push({ type: 'role', label: 'POSITION', value: player.role, xl: true });
  }
  return steps;
}

function Particles({ color }) {
  const list = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left:     `${4 + (i * 5.4) % 92}%`,
    delay:    `${(i * 0.21) % 3}s`,
    duration: `${2.2 + (i * 0.28) % 2.2}s`,
    size:     `${3 + (i * 2.3) % 7}px`,
  })), []);

  return (
    <div className="particles" aria-hidden>
      {list.map(p => (
        <span key={p.id} className="particle"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size, background: color, boxShadow: `0 0 5px ${color}` }}
        />
      ))}
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────
function LegendReveal({ player, onComplete }) {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = 인트로 딜레이
  const [phase, setPhase]         = useState('in'); // 'in' | 'out'
  const [flash, setFlash]         = useState(false);
  const [showCard, setShowCard]   = useState(false);
  const doneRef = useRef(false);

  const steps = buildSteps(player);
  const color = RARITY_COLOR[player.rarity] || '#fff';

  function complete() {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  }

  function handleSkip() {
    if (showCard) {
      complete();
    } else {
      // 텍스트 중 → 카드로 바로 점프
      setShowCard(true);
      setTimeout(complete, 3000);
    }
  }

  // 시작 딜레이
  useEffect(() => {
    const t = setTimeout(() => setStepIndex(0), 350);
    return () => clearTimeout(t);
  }, []);

  // 스텝 상태머신
  useEffect(() => {
    if (stepIndex < 0 || showCard) return;
    let t;

    if (phase === 'in') {
      // 650ms 보여준 뒤 exit
      t = setTimeout(() => setPhase('out'), 650);
    } else {
      // exit 후 → 플래시 → 다음 스텝
      t = setTimeout(() => {
        setFlash(true);
        setTimeout(() => {
          setFlash(false);
          if (stepIndex < steps.length - 1) {
            setStepIndex(i => i + 1);
            setPhase('in');
          } else {
            setShowCard(true);
            setTimeout(complete, 3000); // 카드 보고 3초 후 자동 종료
          }
        }, 120);
      }, 280);
    }
    return () => clearTimeout(t);
  }, [stepIndex, phase, showCard]);

  const step = stepIndex >= 0 ? steps[stepIndex] : null;

  function renderStep() {
    if (!step) return null;

    if (step.type === 'role') {
      return (
        <div className={`reveal-step ${phase === 'in' ? 'entering' : 'exiting'} xl`}>
          <span className="step-label">{step.label}</span>
          <span className="step-value reveal-role" style={{ color, textShadow: `0 0 32px ${color}88` }}>
            {step.value}
          </span>
        </div>
      );
    }

    return (
      <div className={`reveal-step ${phase === 'in' ? 'entering' : 'exiting'}`}>
        <div className="reveal-visual">
          {step.image ? (
            <img src={step.image} alt={step.label} className="reveal-logo" />
          ) : (
            <span className="reveal-fallback" style={{ color, textShadow: `0 0 32px ${color}88` }}>{step.fallback}</span>
          )}
        </div>
        <span className="step-label">{step.type === 'season' ? 'SEASON' : 'TEAM'}</span>
      </div>
    );
  }

  return (
    <div className="legend-overlay" onClick={handleSkip}>
      {/* 배경 */}
      <div className="beam" style={{ '--bcolor': color }} />
      <Particles color={color} />
      {flash && <div className="step-flash" />}

      {/* SKIP 버튼 */}
      <button className="skip-btn" onClick={e => { e.stopPropagation(); handleSkip(); }}>
        SKIP ▶
      </button>

      {!showCard && step && renderStep()}

      {/* 카드 등장 */}
      {showCard && (
        <div className="card-stage" onClick={e => { e.stopPropagation(); complete(); }}>
          <div className="card-aura" style={{ '--acolor': color }} />
          <PlayerCard player={player} delay={0} />
        </div>
      )}

      <p className="skip-hint">{showCard ? '클릭하여 계속' : '화면을 클릭하면 카드로 건너뜁니다'}</p>
    </div>
  );
}

export default LegendReveal;
