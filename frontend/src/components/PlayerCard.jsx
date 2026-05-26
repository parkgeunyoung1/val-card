import './PlayerCard.css';

const RARITY_LABELS = { legend: 'LEGEND', rare: 'RARE', common: 'COMMON' };

const FLAG_EMOJIS = {
  CA:'🇨🇦', US:'🇺🇸', BR:'🇧🇷', TR:'🇹🇷', BE:'🇧🇪', RU:'🇷🇺',
  FI:'🇫🇮', FR:'🇫🇷', UZ:'🇺🇿', AR:'🇦🇷', CL:'🇨🇱', JP:'🇯🇵',
  KR:'🇰🇷', IT:'🇮🇹', ES:'🇪🇸', UA:'🇺🇦', GB:'🇬🇧',
};

const ROLE_ICONS = {
  DUELIST:'⚔️', INITIATOR:'💡', FLEX:'🔄', SENTINEL:'🛡️', CONTROLLER:'🌫️',
};

function ChemDots({ level = 0 }) {
  return (
    <div className="chem-dots">
      {[0, 1, 2].map(i => (
        <span key={i} className={`chem-dot ${i < level ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

function PlayerCard({ player, delay = 0, chemLevel = 0 }) {
  const { name, team, nationality, rarity, role } = player;

  return (
    <div
      className={`player-card rarity-${rarity}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div className={`rarity-bar rarity-${rarity}`} />

      <div className="card-image-area">
        <div className={`avatar rarity-${rarity}`}>
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="card-body">
        <div className="player-name">{name}</div>
        <div className="player-meta">
          <span>{FLAG_EMOJIS[nationality] || ''}</span>
          <span className="team">{team}</span>
        </div>
        <div className="role-tag">
          {ROLE_ICONS[role]} {role}
        </div>
        <div className={`rarity-badge rarity-${rarity}`}>
          {RARITY_LABELS[rarity]}
        </div>
      </div>

      <ChemDots level={chemLevel} />
    </div>
  );
}

export default PlayerCard;
