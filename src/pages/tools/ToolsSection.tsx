import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdCalculate, MdFunctions, MdSwapHoriz, MdPercent, MdOutlineScience,
    MdStar, MdTrendingUp, MdAutoGraph, MdSchool, MdCake, MdFitnessCenter,
    MdCalendarToday, MdTextFields, MdAssignment, MdRestaurant, MdTimer, MdShuffle
} from 'react-icons/md';

const ToolsSection: React.FC = () => {
    const navigate = useNavigate();
    const [streak, setStreak] = useState(0);
    const [greeting, setGreeting] = useState('');
    const [username, setUsername] = useState('Student');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else if (hour < 21) setGreeting('Good Evening');
        else setGreeting('Good Night');

        const streakData = localStorage.getItem('study_streak');
        if (streakData) setStreak(JSON.parse(streakData).count || 0);
        const savedName = localStorage.getItem('studyone_username');
        if (savedName) setUsername(savedName);
    }, []);

    const tools = [
        { id: 'calculator', name: 'Calculator', subtitle: 'Basic math', icon: MdCalculate, color: '#4F46E5', bg: '#EEF2FF', path: '/tools/calculator' },
        { id: 'scientific', name: 'Scientific', subtitle: 'Advanced', icon: MdFunctions, color: '#EC4899', bg: '#FDF2F8', path: '/tools/scientific' },
        { id: 'converter', name: 'Converter', subtitle: 'Units', icon: MdSwapHoriz, color: '#059669', bg: '#ECFDF5', path: '/tools/converter/length' },
        { id: 'percentage', name: 'Percentage', subtitle: 'Calculate %', icon: MdPercent, color: '#F59E0B', bg: '#FFFBEB', path: '/tools/percentage' },
        { id: 'gpa', name: 'GPA', subtitle: 'Calculator', icon: MdSchool, color: '#8B5CF6', bg: '#F5F3FF', path: '/tools/gpa' },
        { id: 'grade', name: 'Grade', subtitle: 'Calculator', icon: MdAssignment, color: '#06B6D4', bg: '#ECFEFF', path: '/tools/grade' },
        { id: 'age', name: 'Age', subtitle: 'Calculator', icon: MdCake, color: '#F43F5E', bg: '#FFF1F2', path: '/tools/age' },
        { id: 'bmi', name: 'BMI', subtitle: 'Calculator', icon: MdFitnessCenter, color: '#10B981', bg: '#ECFDF5', path: '/tools/bmi' },
        { id: 'date', name: 'Date', subtitle: 'Calculator', icon: MdCalendarToday, color: '#6366F1', bg: '#EEF2FF', path: '/tools/date' },
        { id: 'words', name: 'Words', subtitle: 'Counter', icon: MdTextFields, color: '#0EA5E9', bg: '#F0F9FF', path: '/tools/words' },
        { id: 'tip', name: 'Tip', subtitle: 'Split bill', icon: MdRestaurant, color: '#22C55E', bg: '#F0FDF4', path: '/tools/tip' },
        { id: 'stopwatch', name: 'Timer', subtitle: 'Stopwatch', icon: MdTimer, color: '#EF4444', bg: '#FEF2F2', path: '/tools/stopwatch' },
        { id: 'random', name: 'Random', subtitle: 'Generator', icon: MdShuffle, color: '#A855F7', bg: '#FAF5FF', path: '/tools/random' },
        { id: 'formulas', name: 'Formulas', subtitle: 'Custom', icon: MdOutlineScience, color: '#3B82F6', bg: '#EFF6FF', path: '/tools/formulas' },
    ];

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '100px' },
        header: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '24px 16px 40px', borderRadius: '0 0 32px 32px' },
        greeting: { fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' },
        title: { fontSize: '28px', fontWeight: 800, color: 'white' },
        statsCard: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '16px 20px', margin: '16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' },
        streakIcon: { width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
        streakInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
        streakNumber: { fontSize: '24px', fontWeight: 800 },
        streakLabel: { fontSize: '13px', opacity: 0.9 },
        content: { padding: '24px 16px' },
        sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
        toolsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
        toolCard: (bg: string, i: number) => ({ background: bg, borderRadius: '18px', padding: '18px 14px', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.25s ease', animation: `fadeInUp 0.4s ease ${i * 0.03}s both` }),
        toolIconContainer: (color: string) => ({ width: '44px', height: '44px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }),
        toolName: { fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '2px' },
        toolSubtitle: { fontSize: '11px', color: '#64748B' },
        featuredCard: { gridColumn: '1 / -1', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: '20px', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginTop: '8px' },
        featuredContent: { display: 'flex', alignItems: 'center', gap: '14px' },
        featuredIcon: { width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        featuredTitle: { fontSize: '16px', fontWeight: 700 },
        featuredSubtitle: { fontSize: '13px', opacity: 0.9, marginTop: '2px' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <p style={styles.greeting}>{greeting}, {username} 👋</p>
                <h1 style={styles.title}>StudyOne Tools</h1>
                <div style={styles.statsCard}>
                    <div style={styles.streakInfo}><div style={styles.streakIcon}>🔥</div><div><div style={styles.streakNumber}>{streak}</div><div style={styles.streakLabel}>Day Streak</div></div></div>
                    <MdTrendingUp size={24} style={{ opacity: 0.7 }} />
                </div>
            </div>

            <div style={styles.content}>
                <h2 style={styles.sectionTitle}><MdAutoGraph style={{ color: '#4F46E5' }} /> Quick Tools</h2>
                <div style={styles.toolsGrid}>
                    {tools.map((tool, i) => {
                        const Icon = tool.icon;
                        return (
                            <div key={tool.id} style={styles.toolCard(tool.bg, i)} onClick={() => navigate(tool.path)}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${tool.color}20`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div style={styles.toolIconContainer(tool.color)}><Icon size={22} style={{ color: tool.color }} /></div>
                                <div style={styles.toolName}>{tool.name}</div>
                                <div style={styles.toolSubtitle}>{tool.subtitle}</div>
                            </div>
                        );
                    })}
                    <div style={styles.featuredCard} onClick={() => navigate('/tools/formulas')}>
                        <div style={styles.featuredContent}><div style={styles.featuredIcon}><MdStar size={24} /></div><div><div style={styles.featuredTitle}>Custom Formulas</div><div style={styles.featuredSubtitle}>Save your own</div></div></div>
                        <span style={{ fontSize: '20px', opacity: 0.8 }}>→</span>
                    </div>
                </div>
            </div>

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default ToolsSection;
