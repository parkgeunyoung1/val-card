import { useState, useEffect, useRef, useMemo } from 'react';
import PlayerCard from './PlayerCard';
import { TEAM_LOGOS, LEAGUE_LOGOS } from '../data/logos';
import './LegendReveal.css';

const RANK_COLOR = { CHAMPION:'#ffffff', RADIANT:'#ffd700' };

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

function Particles({ color, count = 18, className = 'particles' }) {
  const list = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left:     `${4 + (i * (92 / count)) % 92}%`,
    delay:    `${(i * 0.18) % 3}s`,
    duration: `${1.8 + (i * 0.22) % 2.4}s`,
    size:     `${3 + (i * 2.1) % 8}px`,
  })), [count]);

  return (
    <div className={className} aria-hidden>
      {list.map(p => (
        <span key={p.id} className="particle"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size, background: color, boxShadow: `0 0 6px ${color}` }}
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
  const isChampion = player.rank === 'CHAMPION';
  const color = RANK_COLOR[player.rank] || '#ffd700';

  useEffect(() => {
    const imageSources = [LEAGUE_LOGOS[player.seasonId], TEAM_LOGOS[player.team]].filter(Boolean);
    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [player.seasonId, player.team]);

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
      t = setTimeout(() => setPhase('out'), isChampion ? 900 : 650);
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
            setTimeout(complete, isChampion ? 30000 : 3000);
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
        <div key={`${stepIndex}-${phase}-${step.type}`} className={`reveal-step ${phase === 'in' ? 'entering' : 'exiting'} xl`}>
          <span className="step-label">{step.label}</span>
          <span className="step-value reveal-role" style={isChampion ? {} : { color, textShadow: `0 0 32px ${color}88` }}>
            {step.value}
          </span>
        </div>
      );
    }

    return (
      <div key={`${stepIndex}-${phase}-${step.type}`} className={`reveal-step ${phase === 'in' ? 'entering' : 'exiting'}`}>
        <div className="reveal-visual">
          {step.image ? (
            <img key={step.image} src={step.image} alt={step.label} className="reveal-logo" />
          ) : (
            <span key={step.fallback} className="reveal-fallback" style={isChampion ? {} : { color, textShadow: `0 0 32px ${color}88` }}>{step.fallback}</span>
          )}
        </div>
        <span className="step-label">{step.type === 'season' ? 'SEASON' : 'TEAM'}</span>
      </div>
    );
  }

  return (
    <div className={`legend-overlay${isChampion ? ' champion' : ''}`} onClick={handleSkip}>
      {/* 배경 빛줄기 */}
      <div className="beam" style={{ '--bcolor': color }} />
      {isChampion && <div className="beam beam-gold" style={{ '--bcolor': '#ffd700' }} />}

      {/* 파티클 */}
      <Particles color={color} count={isChampion ? 36 : 18} />
      {isChampion && <Particles color="#ffd700" count={20} className="particles particles-gold" />}

      {flash && <div className={`step-flash${isChampion ? ' champion-flash' : ''}`} />}

      {/* CHAMPION 전용 상단 뱃지 */}
      {isChampion && !showCard && (
        <div className="champion-badge">CHAMPION</div>
      )}
      {isChampion && !showCard && <div className="champion-shimmer" />}

      {/* SKIP 버튼 */}
      <button className="skip-btn" onClick={e => { e.stopPropagation(); handleSkip(); }}>
        SKIP ▶
      </button>

      {!showCard && step && renderStep()}

      {/* 카드 등장 */}
      {showCard && (
        <div className={`card-stage${isChampion ? ' champion-stage' : ''}`} onClick={e => { e.stopPropagation(); complete(); }}>
          {isChampion && <div className="champion-ring" />}
          <div className="card-aura" style={{ '--acolor': color }} />
          {isChampion && <div className="card-aura card-aura-gold" style={{ '--acolor': '#ffd700' }} />}
          <PlayerCard player={player} delay={0} />
        </div>
      )}

      <p className="skip-hint">{showCard ? '클릭하여 계속' : '화면을 클릭하면 카드로 건너뜁니다'}</p>
    </div>
  );
}

export default LegendReveal;
