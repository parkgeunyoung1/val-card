import './PlayerCard.css';

const RARITY_LABELS = { legend: 'LEGEND', rare: 'RARE', common: 'COMMON' };

const FLAG_EMOJIS = {
  CA: '🇨🇦', US: '🇺🇸', BR: '🇧🇷', TR: '🇹🇷', BE: '🇧🇪',
  RU: '🇷🇺', FI: '🇫🇮', FR: '🇫🇷', UZ: '🇺🇿', AR: '🇦🇷',
  CL: '🇨🇱', JP: '🇯🇵', KR: '🇰🇷', IT: '🇮🇹', ES: '🇪🇸',
  UA: '🇺🇦', GB: '🇬🇧',
};

function StatBar({ label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <div className="stat-bar-bg">
        <div className="stat-bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function PlayerCard({ player, delay = 0 }) {
  const { name, team, nationality, rarity, stats } = player;

  return (
    <div
      className={`player-card rarity-${rarity}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* corner brackets */}
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
        <div className={`rarity-badge rarity-${rarity}`}>
          {RARITY_LABELS[rarity]}
        </div>

        {stats && (
          <div className="stats">
            <StatBar label="RTG" value={stats.rating} />
            <StatBar label="AIM" value={stats.aim} />
            <StatBar label="IQ"  value={stats.game_sense} />
            <StatBar label="CLT" value={stats.clutch} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;
