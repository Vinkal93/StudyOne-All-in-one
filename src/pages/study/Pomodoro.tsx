import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPlayArrow, MdPause, MdRefresh, MdSettings, MdClose } from 'react-icons/md';

const Pomodoro: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
    const audioRef = useRef<HTMLAudioElement>(null);

    const durations = { focus: settings.focus * 60, shortBreak: settings.shortBreak * 60, longBreak: settings.longBreak * 60 };

    useEffect(() => {
        const saved = localStorage.getItem('pomodoro_settings');
        if (saved) setSettings(JSON.parse(saved));
        const savedSessions = localStorage.getItem('pomodoro_sessions');
        if (savedSessions) setSessions(parseInt(savedSessions));
    }, []);

    useEffect(() => { setTimeLeft(durations[mode]); }, [mode, settings]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            playSound();
            if (mode === 'focus') {
                const newSessions = sessions + 1;
                setSessions(newSessions);
                localStorage.setItem('pomodoro_sessions', newSessions.toString());
                setMode(newSessions % 4 === 0 ? 'longBreak' : 'shortBreak');
            } else {
                setMode('focus');
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const playSound = () => {
        if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); }
    };

    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

    const modeConfig = {
        focus: { label: 'Focus Time', color: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' },
        shortBreak: { label: 'Short Break', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
        longBreak: { label: 'Long Break', color: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)' },
    };

    const saveSettings = () => {
        localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
        setShowSettings(false);
        setTimeLeft(durations[mode]);
    };

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', borderBottom: '1px solid #E2E8F0' },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        title: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        content: { padding: '24px 16px' },
        modeSelector: { display: 'flex', gap: '8px', marginBottom: '32px', background: 'white', padding: '6px', borderRadius: '16px', border: '1px solid #E2E8F0' },
        modeBtn: (active: boolean, color: string) => ({ flex: 1, padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', background: active ? color : 'transparent', color: active ? 'white' : '#64748B', boxShadow: active ? `0 4px 12px ${color}40` : 'none' }),
        timerCard: (gradient: string) => ({ background: gradient, borderRadius: '32px', padding: '48px 32px', textAlign: 'center' as const, color: 'white', boxShadow: '0 16px 48px rgba(79, 70, 229, 0.3)', marginBottom: '32px' }),
        timerRing: { position: 'relative' as const, display: 'inline-block', marginBottom: '24px' },
        timerText: { position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' },
        time: { fontSize: '56px', fontWeight: 700, letterSpacing: '-2px', lineHeight: 1 },
        modeLabel: { fontSize: '16px', opacity: 0.9, marginTop: '8px' },
        controls: { display: 'flex', justifyContent: 'center', gap: '16px' },
        controlBtn: (primary: boolean) => ({ width: primary ? '72px' : '56px', height: primary ? '72px' : '56px', borderRadius: '50%', background: primary ? 'white' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary ? '#4F46E5' : 'white', boxShadow: primary ? '0 8px 24px rgba(0,0,0,0.15)' : 'none' }),
        statsCard: { background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0' },
        statsTitle: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '20px' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
        statItem: { textAlign: 'center' as const },
        statValue: (color: string) => ({ fontSize: '28px', fontWeight: 700, color }),
        statLabel: { fontSize: '12px', color: '#64748B', marginTop: '4px' },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: 'white', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '400px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1E293B' },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        inputGroup: { marginBottom: '20px' },
        label: { fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '8px', display: 'block' },
        input: { width: '100%', padding: '14px', fontSize: '16px', background: '#F7F7F7', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' },
        saveBtn: { width: '100%', padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'white', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
    };

    return (
        <div style={styles.container}>
            <audio ref={audioRef} src="data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU" />
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Pomodoro Timer</span>
                <button style={styles.iconBtn} onClick={() => setShowSettings(true)}><MdSettings size={22} /></button>
            </div>

            <div style={styles.content}>
                <div style={styles.modeSelector}>
                    {(['focus', 'shortBreak', 'longBreak'] as const).map(m => (
                        <button key={m} style={styles.modeBtn(mode === m, modeConfig[m].color)} onClick={() => { setMode(m); setIsRunning(false); }}>
                            {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short' : 'Long'}
                        </button>
                    ))}
                </div>

                <div style={styles.timerCard(modeConfig[mode].gradient)}>
                    <div style={styles.timerRing}>
                        <svg width="200" height="200" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={`${(progress / 100) * 565} 565`} transform="rotate(-90 100 100)" style={{ transition: 'stroke-dasharray 1s ease' }} />
                        </svg>
                        <div style={styles.timerText}>
                            <span style={styles.time}>{formatTime(timeLeft)}</span>
                            <span style={styles.modeLabel}>{modeConfig[mode].label}</span>
                        </div>
                    </div>
                    <div style={styles.controls}>
                        <button style={styles.controlBtn(false)} onClick={() => { setTimeLeft(durations[mode]); setIsRunning(false); }}><MdRefresh size={24} /></button>
                        <button style={styles.controlBtn(true)} onClick={() => setIsRunning(!isRunning)}>{isRunning ? <MdPause size={32} /> : <MdPlayArrow size={32} />}</button>
                    </div>
                </div>

                <div style={styles.statsCard}>
                    <div style={styles.statsTitle}>Today's Stats</div>
                    <div style={styles.statsGrid}>
                        <div style={styles.statItem}><div style={styles.statValue('#4F46E5')}>{sessions}</div><div style={styles.statLabel}>Sessions</div></div>
                        <div style={styles.statItem}><div style={styles.statValue('#10B981')}>{sessions * settings.focus}</div><div style={styles.statLabel}>Focus Mins</div></div>
                        <div style={styles.statItem}><div style={styles.statValue('#F59E0B')}>{Math.floor(sessions / 4)}</div><div style={styles.statLabel}>Cycles</div></div>
                    </div>
                </div>
            </div>

            {showSettings && (
                <div style={styles.modal} onClick={() => setShowSettings(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>Timer Settings</span>
                            <button style={styles.closeBtn} onClick={() => setShowSettings(false)}><MdClose size={20} /></button>
                        </div>
                        <div style={styles.inputGroup}><label style={styles.label}>Focus Time (minutes)</label><input style={styles.input} type="number" value={settings.focus} onChange={e => setSettings({ ...settings, focus: parseInt(e.target.value) || 25 })} /></div>
                        <div style={styles.inputGroup}><label style={styles.label}>Short Break (minutes)</label><input style={styles.input} type="number" value={settings.shortBreak} onChange={e => setSettings({ ...settings, shortBreak: parseInt(e.target.value) || 5 })} /></div>
                        <div style={styles.inputGroup}><label style={styles.label}>Long Break (minutes)</label><input style={styles.input} type="number" value={settings.longBreak} onChange={e => setSettings({ ...settings, longBreak: parseInt(e.target.value) || 15 })} /></div>
                        <button style={styles.saveBtn} onClick={saveSettings}>Save Settings</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pomodoro;
