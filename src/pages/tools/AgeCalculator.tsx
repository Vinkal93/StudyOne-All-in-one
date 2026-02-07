import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCake } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const AgeCalculator: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState<{ years: number; months: number; days: number; nextBirthday: number } | null>(null);

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    const calculate = () => {
        if (!birthDate) return;
        const birth = new Date(birthDate), today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();
        if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }
        const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
        setResult({ years, months, days, nextBirthday: Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) });
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        content: { padding: '20px 16px' },
        cardStyle: { background: card, borderRadius: '20px', padding: '24px', marginBottom: '16px', border: `1px solid ${border}` },
        label: { fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px', display: 'block' },
        input: { width: '100%', padding: '16px', fontSize: '16px', background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, outline: 'none', color: text },
        calcBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)', border: 'none', cursor: 'pointer', color: 'white', boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)', marginTop: '16px' },
        resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '24px' },
        statCard: (color: string) => ({ background: isDarkMode ? `${color}20` : `${color}10`, borderRadius: '18px', padding: '20px', textAlign: 'center' as const, border: `1px solid ${color}30` }),
        statValue: (color: string) => ({ fontSize: '32px', fontWeight: 800, color }),
        statLabel: { fontSize: '13px', color: muted, marginTop: '4px' },
        birthdayCard: { background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', borderRadius: '20px', padding: '24px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px', color: 'white' },
        birthdayIcon: { width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Age Calculator</span>
            </div>
            <div style={styles.content}>
                <div style={styles.cardStyle}>
                    <label style={styles.label}>Date of Birth</label>
                    <input style={styles.input} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                </div>
                <button style={styles.calcBtn} onClick={calculate}>Calculate Age</button>
                {result && (
                    <>
                        <div style={styles.resultsGrid}>
                            <div style={styles.statCard('#4F46E5')}><div style={styles.statValue('#4F46E5')}>{result.years}</div><div style={styles.statLabel}>Years</div></div>
                            <div style={styles.statCard('#10B981')}><div style={styles.statValue('#10B981')}>{result.months}</div><div style={styles.statLabel}>Months</div></div>
                            <div style={styles.statCard('#F59E0B')}><div style={styles.statValue('#F59E0B')}>{result.days}</div><div style={styles.statLabel}>Days</div></div>
                        </div>
                        <div style={styles.birthdayCard}>
                            <div style={styles.birthdayIcon}><MdCake size={28} /></div>
                            <div><div style={{ fontSize: '28px', fontWeight: 800 }}>{result.nextBirthday} days</div><div style={{ fontSize: '14px', opacity: 0.9 }}>until your next birthday 🎉</div></div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AgeCalculator;
