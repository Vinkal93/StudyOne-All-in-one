import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPlayArrow, MdPause, MdRefresh, MdFlag } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const StopwatchTimer: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(t => mode === 'stopwatch' ? t + 10 : Math.max(0, t - 10));
            }, 10);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, mode]);

    useEffect(() => { if (mode === 'timer' && time === 0 && isRunning) { setIsRunning(false); alert('Timer finished!'); } }, [time, mode, isRunning]);

    const formatTime = (ms: number) => {
        const hrs = Math.floor(ms / 3600000), mins = Math.floor((ms % 3600000) / 60000), secs = Math.floor((ms % 60000) / 1000), millis = Math.floor((ms % 1000) / 10);
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
    };

    const reset = () => { setTime(0); setIsRunning(false); setLaps([]); };
    const addLap = () => { if (mode === 'stopwatch' && isRunning) setLaps([time, ...laps]); };
    const startTimer = () => { setTime((timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds) * 1000); setIsRunning(true); };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        content: { padding: '20px 16px' },
        modeToggle: { display: 'flex', background: inputBg, borderRadius: '14px', padding: '4px', marginBottom: '24px' },
        modeBtn: (active: boolean) => ({ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent', color: active ? 'white' : muted }),
        displayCard: { background: card, borderRadius: '28px', padding: '48px 24px', textAlign: 'center' as const, border: `1px solid ${border}`, marginBottom: '24px' },
        timeDisplay: { fontSize: '48px', fontWeight: 800, fontFamily: 'monospace', color: text, letterSpacing: '2px' },
        controlsRow: { display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px' },
        controlBtn: (color: string, large?: boolean) => ({ width: large ? '80px' : '60px', height: large ? '80px' : '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: `0 8px 24px ${color}40` }),
        timerInputRow: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' },
        timerInput: { width: '80px', padding: '16px', fontSize: '24px', background: inputBg, borderRadius: '16px', border: `1px solid ${border}`, outline: 'none', textAlign: 'center' as const, fontWeight: 700, color: text },
        timerLabel: { fontSize: '12px', color: muted, marginTop: '4px', textAlign: 'center' as const },
        lapsList: { background: card, borderRadius: '20px', padding: '16px', border: `1px solid ${border}`, maxHeight: '200px', overflowY: 'auto' as const },
        lapItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${border}` },
        lapNum: { fontSize: '14px', fontWeight: 600, color: muted },
        lapTime: { fontSize: '16px', fontWeight: 700, fontFamily: 'monospace', color: text },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>{mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}</span>
            </div>
            <div style={styles.content}>
                <div style={styles.modeToggle}>
                    <button style={styles.modeBtn(mode === 'stopwatch')} onClick={() => { setMode('stopwatch'); reset(); }}>Stopwatch</button>
                    <button style={styles.modeBtn(mode === 'timer')} onClick={() => { setMode('timer'); reset(); }}>Timer</button>
                </div>
                {mode === 'timer' && !isRunning && time === 0 && (
                    <div style={styles.timerInputRow}>
                        {['hours', 'minutes', 'seconds'].map(unit => (
                            <div key={unit}>
                                <input style={styles.timerInput} type="number" min={0} max={unit === 'hours' ? 99 : 59} value={timerInput[unit as keyof typeof timerInput]} onChange={e => setTimerInput({ ...timerInput, [unit]: parseInt(e.target.value) || 0 })} />
                                <div style={styles.timerLabel}>{unit.charAt(0).toUpperCase()}</div>
                            </div>
                        ))}
                    </div>
                )}
                <div style={styles.displayCard}><div style={styles.timeDisplay}>{formatTime(time)}</div></div>
                <div style={styles.controlsRow}>
                    {mode === 'stopwatch' && <button style={styles.controlBtn('#64748B')} onClick={addLap}><MdFlag size={24} /></button>}
                    <button style={styles.controlBtn(isRunning ? '#EF4444' : '#10B981', true)} onClick={() => mode === 'timer' && !isRunning && time === 0 ? startTimer() : setIsRunning(!isRunning)}>
                        {isRunning ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
                    </button>
                    <button style={styles.controlBtn('#64748B')} onClick={reset}><MdRefresh size={24} /></button>
                </div>
                {laps.length > 0 && (
                    <div style={styles.lapsList}>
                        {laps.map((lap, i) => (<div key={i} style={styles.lapItem}><span style={styles.lapNum}>Lap {laps.length - i}</span><span style={styles.lapTime}>{formatTime(lap)}</span></div>))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StopwatchTimer;
