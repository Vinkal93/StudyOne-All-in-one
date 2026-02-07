import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdShuffle, MdContentCopy } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const RandomGenerator: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [mode, setMode] = useState<'number' | 'password' | 'coin' | 'dice'>('number');
    const [min, setMin] = useState('1');
    const [max, setMax] = useState('100');
    const [passLength, setPassLength] = useState(12);
    const [result, setResult] = useState<string>('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [coinSide, setCoinSide] = useState<'heads' | 'tails'>('heads');
    const [diceValue, setDiceValue] = useState(1);
    const [matrixChars, setMatrixChars] = useState<string[]>([]);
    const [slotNumbers, setSlotNumbers] = useState<number[]>([0, 0, 0]);
    const animRef = useRef<number | null>(null);

    const bgColor = isDarkMode ? '#0F172A' : '#F7F7F7';
    const cardBg = isDarkMode ? '#1E293B' : 'white';
    const textColor = isDarkMode ? '#F1F5F9' : '#1E293B';
    const mutedColor = isDarkMode ? '#94A3B8' : '#64748B';
    const borderColor = isDarkMode ? '#334155' : '#E2E8F0';

    const generate = () => {
        setIsAnimating(true);
        if (mode === 'number') animateNumber();
        else if (mode === 'password') animatePassword();
        else if (mode === 'coin') animateCoin();
        else animateDice();
    };

    const animateNumber = () => {
        const minN = parseInt(min) || 0, maxN = parseInt(max) || 100;
        const finalResult = Math.floor(Math.random() * (maxN - minN + 1)) + minN;
        let count = 0;
        const interval = setInterval(() => {
            setSlotNumbers([
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10)
            ]);
            count++;
            if (count > 15) {
                clearInterval(interval);
                setResult(String(finalResult));
                setIsAnimating(false);
            }
        }, 80);
    };

    const animatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const finalPass = Array.from({ length: passLength }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        let revealed = 0;
        setMatrixChars(Array(passLength).fill(''));

        const interval = setInterval(() => {
            setMatrixChars(prev => prev.map((_, i) =>
                i < revealed ? finalPass[i] : chars[Math.floor(Math.random() * chars.length)]
            ));
            if (Math.random() > 0.7) revealed++;
            if (revealed >= passLength) {
                clearInterval(interval);
                setResult(finalPass);
                setIsAnimating(false);
            }
        }, 50);
    };

    const animateCoin = () => {
        const finalSide = Math.random() < 0.5 ? 'heads' : 'tails';
        let flips = 0;
        const interval = setInterval(() => {
            setCoinSide(prev => prev === 'heads' ? 'tails' : 'heads');
            flips++;
            if (flips > 10) {
                clearInterval(interval);
                setCoinSide(finalSide);
                setResult(finalSide === 'heads' ? '🪙 Heads' : '🪙 Tails');
                setIsAnimating(false);
            }
        }, 100);
    };

    const animateDice = () => {
        const finalValue = Math.floor(Math.random() * 6) + 1;
        let rolls = 0;
        const interval = setInterval(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
            rolls++;
            if (rolls > 12) {
                clearInterval(interval);
                setDiceValue(finalValue);
                setResult(`🎲 ${finalValue}`);
                setIsAnimating(false);
            }
        }, 80);
    };

    const diceDots: Record<number, number[][]> = {
        1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]],
        4: [[0, 0], [0, 2], [2, 0], [2, 2]], 5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
        6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
    };

    const styles = {
        container: { minHeight: '100vh', background: bgColor, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: cardBg, borderBottom: `1px solid ${borderColor}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: isDarkMode ? '#334155' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor },
        title: { fontSize: '18px', fontWeight: 700, color: textColor },
        content: { padding: '20px 16px' },
        modeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' },
        modeBtn: (active: boolean) => ({ padding: '14px 8px', borderRadius: '14px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : cardBg, color: active ? 'white' : mutedColor }),
        card: { background: cardBg, borderRadius: '20px', padding: '24px', marginBottom: '16px', border: `1px solid ${borderColor}` },
        label: { fontSize: '14px', fontWeight: 600, color: textColor, marginBottom: '8px', display: 'block' },
        inputRow: { display: 'flex', gap: '12px', marginBottom: '16px' },
        input: { flex: 1, padding: '14px', fontSize: '16px', background: isDarkMode ? '#334155' : '#F7F7F7', borderRadius: '12px', border: `1px solid ${borderColor}`, outline: 'none', textAlign: 'center' as const, color: textColor },
        genBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', color: 'white', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
        resultCard: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: '24px', padding: '32px', textAlign: 'center' as const, color: 'white', marginTop: '24px', minHeight: '120px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' },
        resultValue: { fontSize: mode === 'password' ? '16px' : '48px', fontWeight: 800, wordBreak: 'break-all' as const, fontFamily: mode === 'password' ? 'monospace' : 'inherit', letterSpacing: mode === 'password' ? '2px' : 'normal' },
        copyBtn: { marginTop: '16px', padding: '12px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' },
        // Coin styles
        coinContainer: { perspective: '1000px', margin: '20px auto' },
        coin: (isFlipping: boolean, side: string) => ({
            width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto',
            background: side === 'heads' ? 'linear-gradient(145deg, #FFD700, #FFA500)' : 'linear-gradient(145deg, #C0C0C0, #A0A0A0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 -5px 20px rgba(0,0,0,0.2)',
            transform: isFlipping ? 'rotateY(1800deg)' : 'rotateY(0deg)',
            transition: isFlipping ? 'transform 1s ease-out' : 'none',
            border: '4px solid rgba(255,255,255,0.3)'
        }),
        // Dice styles
        diceContainer: { perspective: '1000px', margin: '20px auto' },
        dice: (isRolling: boolean) => ({
            width: '100px', height: '100px', borderRadius: '16px', margin: '0 auto',
            background: 'white', position: 'relative' as const,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '4px', padding: '16px',
            transform: isRolling ? `rotate(${Math.random() * 360}deg)` : 'rotate(0deg)',
            transition: 'transform 0.08s ease-out'
        }),
        diceDot: { width: '16px', height: '16px', borderRadius: '50%', background: '#1E293B' },
        // Matrix password styles
        matrixContainer: { display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' as const, fontFamily: 'monospace' },
        matrixChar: (revealed: boolean) => ({
            width: '24px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 700, color: revealed ? '#00FF00' : '#00AA00',
            textShadow: revealed ? '0 0 10px #00FF00' : 'none',
            animation: revealed ? 'none' : 'matrixFlicker 0.1s infinite'
        }),
        // Slot number styles
        slotContainer: { display: 'flex', gap: '8px', justifyContent: 'center' },
        slotNumber: { width: '60px', height: '80px', borderRadius: '12px', background: isDarkMode ? '#0F172A' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 800, color: '#00FF00', fontFamily: 'monospace', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.4)' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Random Generator</span>
            </div>
            <div style={styles.content}>
                <div style={styles.modeGrid}>
                    <button style={styles.modeBtn(mode === 'number')} onClick={() => { setMode('number'); setResult(''); }}>Number</button>
                    <button style={styles.modeBtn(mode === 'password')} onClick={() => { setMode('password'); setResult(''); }}>Password</button>
                    <button style={styles.modeBtn(mode === 'coin')} onClick={() => { setMode('coin'); setResult(''); }}>Coin</button>
                    <button style={styles.modeBtn(mode === 'dice')} onClick={() => { setMode('dice'); setResult(''); }}>Dice</button>
                </div>

                <div style={styles.card}>
                    {mode === 'number' && (
                        <>
                            <label style={styles.label}>Range</label>
                            <div style={styles.inputRow}>
                                <input style={styles.input} type="number" value={min} onChange={e => setMin(e.target.value)} placeholder="Min" />
                                <span style={{ alignSelf: 'center', color: mutedColor }}>to</span>
                                <input style={styles.input} type="number" value={max} onChange={e => setMax(e.target.value)} placeholder="Max" />
                            </div>
                            {isAnimating && (
                                <div style={styles.slotContainer}>
                                    {slotNumbers.map((n, i) => <div key={i} style={styles.slotNumber}>{n}</div>)}
                                </div>
                            )}
                        </>
                    )}
                    {mode === 'password' && (
                        <>
                            <label style={styles.label}>Length: {passLength}</label>
                            <input style={{ ...styles.input, width: '100%' }} type="range" min={6} max={24} value={passLength} onChange={e => setPassLength(parseInt(e.target.value))} />
                            {isAnimating && (
                                <div style={{ ...styles.matrixContainer, marginTop: '20px', background: '#000', padding: '20px', borderRadius: '12px' }}>
                                    {matrixChars.map((c, i) => <span key={i} style={styles.matrixChar(result !== '' && i < result.length)}>{c}</span>)}
                                </div>
                            )}
                        </>
                    )}
                    {mode === 'coin' && (
                        <div style={styles.coinContainer}>
                            <div style={styles.coin(isAnimating, coinSide)}>
                                {coinSide === 'heads' ? '👑' : '🦅'}
                            </div>
                        </div>
                    )}
                    {mode === 'dice' && (
                        <div style={styles.diceContainer}>
                            <div style={styles.dice(isAnimating)}>
                                {Array.from({ length: 9 }).map((_, i) => {
                                    const row = Math.floor(i / 3), col = i % 3;
                                    const hasDot = diceDots[diceValue]?.some(([r, c]) => r === row && c === col);
                                    return <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{hasDot && <div style={styles.diceDot} />}</div>;
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <button style={styles.genBtn} onClick={generate} disabled={isAnimating}>
                    <MdShuffle size={20} style={{ animation: isAnimating ? 'spin 0.5s linear infinite' : 'none' }} />
                    {isAnimating ? 'Generating...' : 'Generate'}
                </button>

                {result && !isAnimating && (
                    <div style={styles.resultCard}>
                        <div style={styles.resultValue}>{result}</div>
                        {mode === 'password' && <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(result)}><MdContentCopy size={16} /> Copy</button>}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes matrixFlicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default RandomGenerator;
