import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdDateRange, MdSwapHoriz } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const DateCalculator: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [mode, setMode] = useState<'diff' | 'add'>('diff');
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [daysToAdd, setDaysToAdd] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    const calculate = () => {
        if (mode === 'diff') {
            if (!date1 || !date2) return;
            const d1 = new Date(date1), d2 = new Date(date2);
            const diff = Math.abs(d2.getTime() - d1.getTime());
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(days / 7), months = Math.floor(days / 30), years = Math.floor(days / 365);
            setResult(`${days} days (${weeks} weeks, ${months} months, ${years} years)`);
        } else {
            if (!date1 || !daysToAdd) return;
            const d = new Date(date1);
            d.setDate(d.getDate() + parseInt(daysToAdd));
            setResult(d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        }
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        content: { padding: '20px 16px' },
        cardStyle: { background: card, borderRadius: '20px', padding: '24px', marginBottom: '16px', border: `1px solid ${border}` },
        modeToggle: { display: 'flex', background: inputBg, borderRadius: '14px', padding: '4px', marginBottom: '20px' },
        modeBtn: (active: boolean) => ({ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent', color: active ? 'white' : muted }),
        label: { fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px', display: 'block' },
        input: { width: '100%', padding: '16px', fontSize: '16px', background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, outline: 'none', marginBottom: '16px', color: text },
        calcBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', border: 'none', cursor: 'pointer', color: 'white', boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)' },
        resultCard: { background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', borderRadius: '24px', padding: '32px', textAlign: 'center' as const, color: 'white', marginTop: '24px' },
        resultIcon: { fontSize: '48px', marginBottom: '16px' },
        resultText: { fontSize: '20px', fontWeight: 700, lineHeight: 1.5 },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Date Calculator</span>
            </div>
            <div style={styles.content}>
                <div style={styles.modeToggle}>
                    <button style={styles.modeBtn(mode === 'diff')} onClick={() => { setMode('diff'); setResult(null); }}>Date Difference</button>
                    <button style={styles.modeBtn(mode === 'add')} onClick={() => { setMode('add'); setResult(null); }}>Add Days</button>
                </div>
                <div style={styles.cardStyle}>
                    <label style={styles.label}>{mode === 'diff' ? 'Start Date' : 'Date'}</label>
                    <input style={styles.input} type="date" value={date1} onChange={e => setDate1(e.target.value)} />
                    {mode === 'diff' ? (<><label style={styles.label}>End Date</label><input style={styles.input} type="date" value={date2} onChange={e => setDate2(e.target.value)} /></>) : (<><label style={styles.label}>Days to Add</label><input style={styles.input} type="number" placeholder="Enter number of days" value={daysToAdd} onChange={e => setDaysToAdd(e.target.value)} /></>)}
                </div>
                <button style={styles.calcBtn} onClick={calculate}><MdDateRange size={20} style={{ marginRight: 8 }} /> Calculate</button>
                {result && (<div style={styles.resultCard}><div style={styles.resultIcon}>{mode === 'diff' ? '📊' : '📅'}</div><div style={styles.resultText}>{result}</div></div>)}
            </div>
        </div>
    );
};

export default DateCalculator;
