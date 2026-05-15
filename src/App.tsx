import { useState, useCallback } from 'react';
import type { Difficulty, SessionResult } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';

type Screen = 'start' | 'playing' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [result, setResult] = useState<SessionResult | null>(null);

  const handleStart = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setResult(null);
    setScreen('playing');
  }, []);

  const handleComplete = useCallback((sessionResult: SessionResult) => {
    setResult(sessionResult);
    setScreen('results');
  }, []);

  const handleRetry = useCallback(() => {
    setResult(null);
    setScreen('playing');
  }, []);

  const handleChangeDifficulty = useCallback(() => {
    setResult(null);
    setScreen('start');
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {screen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {screen === 'playing' && (
        <GameScreen
          key={`${difficulty}-${Date.now()}`}
          difficulty={difficulty}
          onComplete={handleComplete}
        />
      )}
      {screen === 'results' && result && (
        <ResultsScreen
          result={result}
          onRetry={handleRetry}
          onChangeDifficulty={handleChangeDifficulty}
        />
      )}
    </div>
  );
}
