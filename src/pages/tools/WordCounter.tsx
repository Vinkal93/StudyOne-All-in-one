import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdTextFields, MdContentCopy } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const WordCounter: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [text, setText] = useState('');

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const textColor = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200);

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: textColor },
        content: { padding: '20px 16px' },
        cardStyle: { background: card, borderRadius: '20px', padding: '20px', marginBottom: '16px', border: `1px solid ${border}` },
        textarea: { width: '100%', minHeight: '200px', padding: '16px', fontSize: '16px', background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: 1.6, color: textColor },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
        statCard: (color: string) => ({ background: isDarkMode ? `${color}20` : `${color}10`, borderRadius: '16px', padding: '18px', textAlign: 'center' as const, border: `1px solid ${color}30` }),
        statValue: (color: string) => ({ fontSize: '28px', fontWeight: 800, color }),
        statLabel: { fontSize: '12px', color: muted, marginTop: '4px' },
        readingCard: { background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: '20px', padding: '24px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Word Counter</span>
            </div>
            <div style={styles.content}>
                <div style={styles.cardStyle}>
                    <textarea style={styles.textarea} placeholder="Start typing or paste your text here..." value={text} onChange={e => setText(e.target.value)} />
                </div>
                <div style={styles.statsGrid}>
                    <div style={styles.statCard('#4F46E5')}><div style={styles.statValue('#4F46E5')}>{words}</div><div style={styles.statLabel}>Words</div></div>
                    <div style={styles.statCard('#10B981')}><div style={styles.statValue('#10B981')}>{chars}</div><div style={styles.statLabel}>Characters</div></div>
                    <div style={styles.statCard('#F59E0B')}><div style={styles.statValue('#F59E0B')}>{charsNoSpaces}</div><div style={styles.statLabel}>No Spaces</div></div>
                    <div style={styles.statCard('#EC4899')}><div style={styles.statValue('#EC4899')}>{sentences}</div><div style={styles.statLabel}>Sentences</div></div>
                    <div style={styles.statCard('#06B6D4')}><div style={styles.statValue('#06B6D4')}>{paragraphs}</div><div style={styles.statLabel}>Paragraphs</div></div>
                    <div style={styles.statCard('#8B5CF6')}><div style={styles.statValue('#8B5CF6')}>{readingTime}</div><div style={styles.statLabel}>Min Read</div></div>
                </div>
                <div style={styles.readingCard}>
                    <div><div style={{ fontSize: '14px', opacity: 0.9 }}>Reading Time</div><div style={{ fontSize: '24px', fontWeight: 700 }}>{readingTime} minute{readingTime !== 1 ? 's' : ''}</div></div>
                    <MdTextFields size={40} style={{ opacity: 0.8 }} />
                </div>
            </div>
        </div>
    );
};

export default WordCounter;
