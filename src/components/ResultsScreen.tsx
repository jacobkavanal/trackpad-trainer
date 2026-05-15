import type { Difficulty, SessionResult } from '../types';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
};

const MAX_SCORE = 20000;

interface ResultsScreenProps {
  result: SessionResult;
  onRetry: () => void;
  onChangeDifficulty: () => void;
}

export default function ResultsScreen({ result, onRetry, onChangeDifficulty }: ResultsScreenProps) {
  const { difficulty, totalScore, hits, misses, reactionTimes } = result;
  const total = hits + misses;
  const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0;
  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : null;

  const labelStyle: React.CSSProperties = {
    fontFamily: "'BBH Bartle', serif",
    fontSize: 'clamp(11px, 1.5vw, 13px)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#000000',
    opacity: 0.6,
    marginBottom: '4px',
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: "'BBH Bartle', serif",
    fontSize: 'clamp(28px, 4vw, 48px)',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#000000',
  };

  const statRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '480px',
    borderBottom: '2px solid #000000',
    padding: '16px 0',
    gap: '16px',
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      padding: '32px',
    }}>
      <h1 style={{
        fontFamily: "'BBH Bartle', serif",
        fontSize: 'clamp(28px, 5vw, 56px)',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#000000',
        borderBottom: '4px solid #000000',
        paddingBottom: '12px',
        marginBottom: '36px',
        textAlign: 'center',
        width: '100%',
        maxWidth: '480px',
      }}>
        SESSION COMPLETE
      </h1>

      {/* Stats */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '480px',
        marginBottom: '40px',
        borderTop: '2px solid #000000',
      }}>
        {/* Score */}
        <div style={statRowStyle}>
          <div style={labelStyle}>SCORE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={valueStyle}>{totalScore}</div>
            <div style={{ ...labelStyle, opacity: 0.4, marginBottom: 0 }}>/ {MAX_SCORE}</div>
          </div>
        </div>

        {/* Accuracy */}
        <div style={statRowStyle}>
          <div style={labelStyle}>ACCURACY</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={valueStyle}>{hits}/{total}</div>
            <div style={{ ...labelStyle, opacity: 0.4, marginBottom: 0 }}>{accuracy}%</div>
          </div>
        </div>

        {/* Avg Reaction */}
        <div style={{ ...statRowStyle, borderBottom: 0 }}>
          <div style={labelStyle}>AVG REACTION</div>
          <div style={valueStyle}>
            {avgReaction !== null ? `${avgReaction}MS` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onRetry}
          style={{
            background: '#000000',
            color: '#ffffff',
            border: '3px solid #000000',
            padding: '16px 32px',
            fontSize: 'clamp(14px, 2vw, 20px)',
            fontWeight: 900,
            fontFamily: "'BBH Bartle', serif",
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#333333';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#000000';
          }}
        >
          RETRY {DIFFICULTY_LABELS[difficulty]}
        </button>

        <button
          onClick={onChangeDifficulty}
          style={{
            background: '#ffffff',
            color: '#000000',
            border: '3px solid #000000',
            padding: '16px 32px',
            fontSize: 'clamp(14px, 2vw, 20px)',
            fontWeight: 900,
            fontFamily: "'BBH Bartle', serif",
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
          }}
        >
          CHANGE DIFFICULTY
        </button>
      </div>
    </div>
  );
}
