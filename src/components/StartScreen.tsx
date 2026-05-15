import type { Difficulty, DifficultyConfig } from '../types';

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { radius: 30, timeLimit: 3000, label: 'EASY' },
  medium: { radius: 20, timeLimit: 2000, label: 'MEDIUM' },
  hard: { radius: 12, timeLimit: 1200, label: 'HARD' },
};

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
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
        fontSize: 'clamp(36px, 6vw, 72px)',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#000000',
        borderBottom: '4px solid #000000',
        paddingBottom: '16px',
        marginBottom: '48px',
        textAlign: 'center',
      }}>
        TRACKPAD TRAINER
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '480px',
      }}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
          const config = DIFFICULTY_CONFIGS[diff];
          return (
            <button
              key={diff}
              onClick={() => onStart(diff)}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: '3px solid #000000',
                padding: '24px 32px',
                fontSize: 'clamp(24px, 4vw, 40px)',
                fontWeight: 900,
                fontFamily: "'BBH Bartle', serif",
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.1s, color 0.1s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#000000';
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                (e.currentTarget as HTMLButtonElement).style.color = '#000000';
              }}
            >
              <span>{config.label}</span>
              <span style={{
                fontSize: 'clamp(11px, 1.5vw, 14px)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                opacity: 0.7,
              }}>
                {config.radius * 2}PX DOT · {config.timeLimit / 1000}S LIMIT
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
