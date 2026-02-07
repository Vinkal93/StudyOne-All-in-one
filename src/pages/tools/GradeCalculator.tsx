import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSchool } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const GradeCalculator: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [marks, setMarks] = useState('');
    const [total, setTotal] = useState('100');
    const [result, setResult] = useState<{ percent: number; grade: string; color: string; emoji: string } | null>(null);

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    const calculate = () => {
        const m = parseFloat(marks), t = parseFloat(total);
        if (!m || !t || t === 0) return;
        const percent = (m / t) * 100;
        let grade = '', color = '', emoji = '';
        if (percent >= 90) { grade = 'A+'; color = '#10B981'; emoji = '🏆'; }
        else if (percent >= 80) { grade = 'A'; color = '#10B981'; emoji = '⭐'; }
        else if (percent >= 70) { grade = 'B'; color = '#3B82F6'; emoji = '👍'; }
        else if (percent >= 60) { grade = 'C'; color = '#F59E0B'; emoji = '📚'; }
        else if (percent >= 50) { grade = 'D'; color = '#F97316'; emoji = '💪'; }
        else { grade = 'F'; color = '#EF4444'; emoji = '📖'; }
        setResult({ percent, grade, color, emoji });
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        content: { padding: '20px 16px' },
        cardStyle: { background: card, borderRadius: '20px', padding: '24px', marginBottom: '16px', border: `1px solid ${border}` },
        label: { fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px', display: 'block' },
        inputRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' },
        input: { flex: 1, padding: '16px', fontSize: '18px', background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, outline: 'none', textAlign: 'center' as const, fontWeight: 600, color: text },
        divider: { fontSize: '24px', fontWeight: 700, color: muted },
        calcBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', color: 'white', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
        resultCard: (color: string) => ({ background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`, borderRadius: '28px', padding: '40px', textAlign: 'center' as const, color: 'white', marginTop: '24px' }),
        emoji: { fontSize: '64px', marginBottom: '16px' },
        gradeValue: { fontSize: '72px', fontWeight: 900, textShadow: '0 4px 20px rgba(0,0,0,0.2)' },
        percentValue: { fontSize: '24px', fontWeight: 600, opacity: 0.95, marginTop: '8px' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Grade Calculator</span>
            </div>
            <div style={styles.content}>
                <div style={styles.cardStyle}>
                    <label style={styles.label}>Enter your score</label>
                    <div style={styles.inputRow}>
                        <input style={styles.input} type="number" placeholder="Marks" value={marks} onChange={e => setMarks(e.target.value)} />
                        <span style={styles.divider}>/</span>
                        <input style={styles.input} type="number" placeholder="Total" value={total} onChange={e => setTotal(e.target.value)} />
                    </div>
                </div>
                <button style={styles.calcBtn} onClick={calculate}><MdSchool size={20} style={{ marginRight: 8 }} /> Calculate Grade</button>
                {result && (<div style={styles.resultCard(result.color)}><div style={styles.emoji}>{result.emoji}</div><div style={styles.gradeValue}>Grade {result.grade}</div><div style={styles.percentValue}>{result.percent.toFixed(1)}%</div></div>)}
            </div>
        </div>
    );
};

export default GradeCalculator;
