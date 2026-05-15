import { useEffect, useRef, useCallback, useState } from 'react';
import type { Difficulty, DifficultyConfig, SessionResult } from '../types';

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { radius: 30, timeLimit: 3000, label: 'EASY' },
  medium: { radius: 20, timeLimit: 2000, label: 'MEDIUM' },
  hard: { radius: 12, timeLimit: 1200, label: 'HARD' },
};

const TOTAL_DOTS = 20;
const HEADER_HEIGHT = 60;

interface DotPosition {
  x: number;
  y: number;
}

interface GameScreenProps {
  difficulty: Difficulty;
  onComplete: (result: SessionResult) => void;
}

function randomDotPosition(radius: number): DotPosition {
  const padding = radius + 8;
  const areaWidth = window.innerWidth;
  const areaHeight = window.innerHeight - HEADER_HEIGHT;
  const x = padding + Math.random() * (areaWidth - padding * 2);
  const y = padding + Math.random() * (areaHeight - padding * 2);
  return { x, y };
}

export default function GameScreen({ difficulty, onComplete }: GameScreenProps) {
  const config = DIFFICULTY_CONFIGS[difficulty];

  const [dotIndex, setDotIndex] = useState(0);
  const [dotPos, setDotPos] = useState<DotPosition>(() => randomDotPosition(config.radius));
  const [score, setScore] = useState(0);
  const [timerProgress, setTimerProgress] = useState(1); // 1 = full, 0 = empty
  const [showMiss, setShowMiss] = useState(false);

  // Refs to avoid stale closures
  const dotIndexRef = useRef(0);
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);
  const missesRef = useRef(0);
  const reactionTimesRef = useRef<number[]>([]);
  const dotStartTimeRef = useRef<number>(Date.now());
  const timerRafRef = useRef<number | null>(null);
  const missTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    if (timerRafRef.current !== null) {
      cancelAnimationFrame(timerRafRef.current);
      timerRafRef.current = null;
    }
    if (missTimeoutRef.current !== null) {
      clearTimeout(missTimeoutRef.current);
      missTimeoutRef.current = null;
    }
    if (dotTimeoutRef.current !== null) {
      clearTimeout(dotTimeoutRef.current);
      dotTimeoutRef.current = null;
    }
  }, []);

  const finishSession = useCallback(() => {
    clearAllTimers();
    onComplete({
      difficulty,
      totalScore: scoreRef.current,
      hits: hitsRef.current,
      misses: missesRef.current,
      reactionTimes: reactionTimesRef.current,
    });
  }, [difficulty, onComplete, clearAllTimers]);

  const spawnNextDot = useCallback(() => {
    const nextIndex = dotIndexRef.current + 1;
    if (nextIndex >= TOTAL_DOTS) {
      finishSession();
      return;
    }
    dotIndexRef.current = nextIndex;
    isProcessingRef.current = false;
    setDotIndex(nextIndex);
    setDotPos(randomDotPosition(config.radius));
    setTimerProgress(1);
    dotStartTimeRef.current = Date.now();
  }, [config.radius, finishSession]);

  const triggerMiss = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    clearAllTimers();
    missesRef.current += 1;
    setShowMiss(true);
    setTimerProgress(0);

    missTimeoutRef.current = setTimeout(() => {
      setShowMiss(false);
      spawnNextDot();
    }, 200);
  }, [clearAllTimers, spawnNextDot]);

  // Start timer bar animation and dot timeout whenever dotPos changes
  useEffect(() => {
    isProcessingRef.current = false;
    dotStartTimeRef.current = Date.now();
    const { timeLimit } = config;

    const tick = () => {
      const elapsed = Date.now() - dotStartTimeRef.current;
      const remaining = Math.max(0, 1 - elapsed / timeLimit);
      setTimerProgress(remaining);
      if (remaining > 0) {
        timerRafRef.current = requestAnimationFrame(tick);
      }
    };
    timerRafRef.current = requestAnimationFrame(tick);

    dotTimeoutRef.current = setTimeout(() => {
      triggerMiss();
    }, timeLimit);

    return () => {
      if (timerRafRef.current !== null) cancelAnimationFrame(timerRafRef.current);
      if (dotTimeoutRef.current !== null) clearTimeout(dotTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotPos]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const handlePlayAreaClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isProcessingRef.current) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dx = clickX - dotPos.x;
    const dy = clickY - dotPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= config.radius) {
      // Hit!
      isProcessingRef.current = true;
      clearAllTimers();

      const reactionTime = Date.now() - dotStartTimeRef.current;
      const pointsEarned = Math.round((config.timeLimit - reactionTime) / config.timeLimit * 1000);
      const clampedPoints = Math.max(0, pointsEarned);

      hitsRef.current += 1;
      reactionTimesRef.current.push(reactionTime);
      scoreRef.current += clampedPoints;
      setScore(scoreRef.current);

      spawnNextDot();
    } else {
      // Miss — clicked outside dot
      triggerMiss();
    }
  }, [dotPos, config.radius, config.timeLimit, clearAllTimers, spawnNextDot, triggerMiss]);

  const displayDotNumber = dotIndex + 1;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div style={{
        height: `${HEADER_HEIGHT}px`,
        minHeight: `${HEADER_HEIGHT}px`,
        background: '#ffffff',
        borderBottom: '3px solid #000000',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '16px',
        zIndex: 10,
      }}>
        {/* Score */}
        <div style={{
          fontFamily: "'BBH Bartle', serif",
          fontWeight: 900,
          fontSize: '18px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          minWidth: '140px',
        }}>
          SCORE: {score}
        </div>

        {/* Dot counter - center */}
        <div style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: "'BBH Bartle', serif",
          fontWeight: 900,
          fontSize: '18px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          {displayDotNumber} / {TOTAL_DOTS}
        </div>

        {/* Timer bar */}
        <div style={{
          minWidth: '160px',
          maxWidth: '240px',
          flex: 1,
          height: '20px',
          border: '2px solid #000000',
          background: '#ffffff',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${timerProgress * 100}%`,
            background: '#000000',
            transition: 'none',
          }} />
        </div>
      </div>

      {/* Play area */}
      <div
        onClick={handlePlayAreaClick}
        style={{
          flex: 1,
          position: 'relative',
          background: '#ffffff',
          cursor: 'crosshair',
          overflow: 'hidden',
        }}
      >
        {/* Dot */}
        <div
          style={{
            position: 'absolute',
            left: dotPos.x - config.radius,
            top: dotPos.y - config.radius,
            width: config.radius * 2,
            height: config.radius * 2,
            background: '#000000',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Miss flash overlay */}
      {showMiss && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#ff0000',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: "'BBH Bartle', serif",
            fontSize: 'clamp(80px, 20vw, 160px)',
            fontWeight: 900,
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            MISS
          </span>
        </div>
      )}
    </div>
  );
}
