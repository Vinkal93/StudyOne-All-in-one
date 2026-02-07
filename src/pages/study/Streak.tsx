import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocalFireDepartment, MdEmojiEvents, MdCalendarToday } from 'react-icons/md';

interface StreakData {
    count: number;
    lastDate: string;
    history: string[];
}

const badges = [
    { emoji: '🌱', name: 'Beginner', requirement: 1, description: '1 day streak' },
    { emoji: '🔥', name: 'On Fire', requirement: 3, description: '3 day streak' },
    { emoji: '⚡', name: 'Lightning', requirement: 7, description: '7 day streak' },
    { emoji: '🏆', name: 'Champion', requirement: 14, description: '14 day streak' },
    { emoji: '💎', name: 'Diamond', requirement: 30, description: '30 day streak' },
    { emoji: '👑', name: 'Legend', requirement: 60, description: '60 day streak' },
    { emoji: '🌟', name: 'Superstar', requirement: 100, description: '100 day streak' },
];

const Streak: React.FC = () => {
    const navigate = useNavigate();
    const [streak, setStreak] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [longestStreak, setLongestStreak] = useState(0);

    useEffect(() => { loadStreakData(); }, []);

    const loadStreakData = () => {
        const saved = localStorage.getItem('study_streak');
        if (saved) {
            const data: StreakData = JSON.parse(saved);
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (data.lastDate === today || data.lastDate === yesterday) setStreak(data.count);
            else setStreak(0);
            setHistory(data.history || []);
            const longest = parseInt(localStorage.getItem('longest_streak') || '0');
            setLongestStreak(Math.max(longest, data.count));
        }
    };

    const getCalendarDays = () => {
        const days = [];
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDay = startOfMonth.getDay();
        for (let i = 0; i < startDay; i++) days.push({ date: null, isActive: false });
        for (let d = 1; d <= endOfMonth.getDate(); d++) {
            const date = new Date(today.getFullYear(), today.getMonth(), d);
            const dateStr = date.toDateString();
            days.push({ date: d, isActive: history.includes(dateStr), isToday: dateStr === today.toDateString(), isFuture: date > today });
        }
        return days;
    };

    const earnedBadges = badges.filter(b => streak >= b.requirement);
    const nextBadge = badges.find(b => streak < b.requirement);
    const progressToNext = nextBadge ? Math.round((streak / nextBadge.requirement) * 100) : 100;

    const styles = {
        container: { minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFC 0%, #DCFCE7 100%)', paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', position: 'sticky' as const, top: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)' },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' },
        title: { fontSize: '18px', fontWeight: 700, color: '#1F2937' },
        content: { padding: '0 16px' },
        mainCard: { background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', borderRadius: '28px', padding: '32px', textAlign: 'center' as const, color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)' },
        ringContainer: { position: 'relative' as const, display: 'inline-block', marginBottom: '20px' },
        ringCenter: { position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' },
        streakNum: { fontSize: '48px', fontWeight: 800, lineHeight: 1 },
        streakLabel: { fontSize: '14px', opacity: 0.8 },
        mainTitle: { fontSize: '24px', fontWeight: 700, marginBottom: '8px' },
        mainSubtitle: { fontSize: '14px', opacity: 0.85 },
        statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' },
        statCard: { background: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center' as const, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' },
        statIcon: (color: string) => ({ width: '48px', height: '48px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }),
        statValue: { fontSize: '28px', fontWeight: 700, color: '#1F2937' },
        statLabel: { fontSize: '12px', color: '#9CA3AF', marginTop: '4px' },
        calendarCard: { background: 'white', borderRadius: '24px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' },
        calendarTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' },
        calendarWeek: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' as const, marginBottom: '8px' },
        weekDay: { fontSize: '12px', color: '#9CA3AF', fontWeight: 600, padding: '8px 0' },
        calendarDays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' },
        day: (active: boolean, today: boolean, future: boolean) => ({
            aspectRatio: '1',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            background: active ? '#10B981' : '#F9FAFB',
            color: active ? 'white' : future ? '#D1D5DB' : '#6B7280',
            border: today ? '2px solid #6366F1' : 'none',
        }),
        badgesTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' },
        badgesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
        badgeCard: (earned: boolean) => ({
            background: 'white',
            borderRadius: '18px',
            padding: '16px 12px',
            textAlign: 'center' as const,
            boxShadow: earned ? '0 8px 24px rgba(245, 158, 11, 0.25)' : '0 4px 16px rgba(0, 0, 0, 0.04)',
            border: earned ? '2px solid #F59E0B' : '2px solid transparent',
            opacity: earned ? 1 : 0.5,
            filter: earned ? 'none' : 'grayscale(100%)',
        }),
        badgeEmoji: { fontSize: '32px', marginBottom: '8px' },
        badgeName: { fontSize: '12px', fontWeight: 700, color: '#1F2937' },
        badgeDesc: { fontSize: '10px', color: '#9CA3AF', marginTop: '2px' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Study Streak</span>
                <div style={{ width: '44px' }} />
            </div>

            <div style={styles.content}>
                {/* Main Card */}
                <div style={styles.mainCard}>
                    <div style={styles.ringContainer}>
                        <svg width="140" height="140" viewBox="0 0 140 140">
                            <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                            <circle cx="70" cy="70" r="60" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round"
                                strokeDasharray={`${(progressToNext / 100) * 377} 377`} transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 1s ease' }} />
                        </svg>
                        <div style={styles.ringCenter}>
                            <span style={styles.streakNum}>{streak}</span>
                            <span style={styles.streakLabel}>days</span>
                        </div>
                    </div>
                    <div style={styles.mainTitle}>{streak === 0 ? 'Start Your Streak!' : `${streak} Day Streak! 🔥`}</div>
                    <div style={styles.mainSubtitle}>{nextBadge ? `${nextBadge.requirement - streak} more days to unlock ${nextBadge.emoji} ${nextBadge.name}` : 'All badges unlocked!'}</div>
                </div>

                {/* Stats */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#F59E0B')}><MdLocalFireDepartment size={24} color="#F59E0B" /></div>
                        <div style={styles.statValue}>{streak}</div>
                        <div style={styles.statLabel}>Current Streak</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#6366F1')}><MdEmojiEvents size={24} color="#6366F1" /></div>
                        <div style={styles.statValue}>{longestStreak}</div>
                        <div style={styles.statLabel}>Longest Streak</div>
                    </div>
                </div>

                {/* Calendar */}
                <div style={styles.calendarCard}>
                    <div style={styles.calendarTitle}><MdCalendarToday color="#6366F1" />{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                    <div style={styles.calendarWeek}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} style={styles.weekDay}>{d}</span>)}</div>
                    <div style={styles.calendarDays}>
                        {getCalendarDays().map((day, i) => <div key={i} style={styles.day(day.isActive || false, day.isToday || false, day.isFuture || false)}>{day.date}</div>)}
                    </div>
                </div>

                {/* Badges */}
                <div style={styles.badgesTitle}><MdEmojiEvents color="#F59E0B" />Badges Collection</div>
                <div style={styles.badgesGrid}>
                    {badges.map((badge, i) => (
                        <div key={i} style={styles.badgeCard(earnedBadges.includes(badge))}>
                            <div style={styles.badgeEmoji}>{badge.emoji}</div>
                            <div style={styles.badgeName}>{badge.name}</div>
                            <div style={styles.badgeDesc}>{badge.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Streak;
