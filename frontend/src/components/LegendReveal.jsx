import { useState, useEffect, useRef, useMemo } from 'react';
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
const ROLE_ICON = {
  DUELIST:'⚔️', INITIATOR:'💡', FLEX:'🔄', SENTINEL:'🛡️', CONTROLLER:'🌫️',
};
const RARITY_COLOR = { legend:'#f59e0b', rare:'#60a5fa', common:'#94a3b8' };

function buildSteps(player) {
  return [
    { label: 'TEAM',        value: player.team,                                                           xl: false },
    { label: 'NATIONALITY', value: `${FLAG[player.nationality] || ''} ${COUNTRY[player.nationality] || player.nationality}`, xl: false },
    { label: 'ROLE',        value: `${ROLE_ICON[player.role] || ''} ${player.role}`,                      xl: false },
    { label: null,          value: player.name,                                                           xl: true  },
  ];
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

      {/* 순차 텍스트 */}
      {!showCard && step && (
        phase === 'in'
          ? (
            <div key={`${stepIndex}-in`} className={`reveal-step entering${step.xl ? ' xl' : ''}`}>
              {step.label && <span className="step-label">{step.label}</span>}
              <span className="step-value" style={{ color, textShadow: `0 0 32px ${color}88` }}>
                {step.value}
              </span>
            </div>
          ) : (
            <div key={`${stepIndex}-out`} className={`reveal-step exiting${step.xl ? ' xl' : ''}`}>
              {step.label && <span className="step-label">{step.label}</span>}
              <span className="step-value" style={{ color, textShadow: `0 0 32px ${color}88` }}>
                {step.value}
              </span>
            </div>
          )
      )}

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
