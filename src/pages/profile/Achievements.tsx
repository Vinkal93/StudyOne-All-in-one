import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEmojiEvents, MdCheckCircle, MdLock, MdStar, MdMenuBook, MdTimer, MdLocalFireDepartment } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    condition: (data: any) => boolean;
    color: string;
}

const Achievements: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const [progress, setProgress] = useState<any>({});

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const cardBg = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';

    useEffect(() => {
        const notes = JSON.parse(localStorage.getItem('studyone_notes') || '[]');
        const tasks = JSON.parse(localStorage.getItem('studyone_tasks') || '[]');
        const exams = JSON.parse(localStorage.getItem('studyone_exams') || '[]');
        const streak = JSON.parse(localStorage.getItem('study_streak') || '{"current":0}').current || 0;
        const decks = JSON.parse(localStorage.getItem('studyone_flashcard_decks') || '[]');

        const currentData = {
            notesCount: notes.length,
            tasksCount: tasks.filter((t: any) => t.completed).length,
            examsCount: exams.length,
            streakCount: streak,
            decksCount: decks.length,
        };

        setProgress(currentData);

        const newUnlocked: string[] = [];
        achievementsList.forEach(ach => {
            if (ach.condition(currentData)) {
                newUnlocked.push(ach.id);
            }
        });
        setUnlocked(newUnlocked);
    }, []);

    const achievementsList: Achievement[] = [
        {
            id: 'first_note',
            title: 'First Thought',
            description: 'Create your first note',
            icon: MdMenuBook,
            condition: (data) => data.notesCount >= 1,
            color: '#4F46E5'
        },
        {
            id: 'note_taker',
            title: 'Prolific Writer',
            description: 'Create 10 or more notes',
            icon: MdMenuBook,
            condition: (data) => data.notesCount >= 10,
            color: '#3B82F6'
        },
        {
            id: 'task_master',
            title: 'Task Master',
            description: 'Complete 25 tasks',
            icon: MdCheckCircle,
            condition: (data) => data.tasksCount >= 25,
            color: '#10B981'
        },
        {
            id: 'streak_week',
            title: 'On Fire',
            description: 'Reach a 7-day study streak',
            icon: MdLocalFireDepartment,
            condition: (data) => data.streakCount >= 7,
            color: '#F59E0B'
        },
        {
            id: 'streak_month',
            title: 'Unstoppable',
            description: 'Reach a 30-day study streak',
            icon: MdLocalFireDepartment,
            condition: (data) => data.streakCount >= 30,
            color: '#EF4444'
        },
        {
            id: 'exam_ready',
            title: 'Exam Ready',
            description: 'Add 5 upcoming exams',
            icon: MdTimer,
            condition: (data) => data.examsCount >= 5,
            color: '#8B5CF6'
        },
        {
            id: 'flashcard_pro',
            title: 'Flashcard Pro',
            description: 'Create 5 flashcard decks',
            icon: MdStar,
            condition: (data) => data.decksCount >= 5,
            color: '#EC4899'
        }
    ];

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: cardBg, borderBottom: `1px solid ${border}`, position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: isDarkMode ? '#334155' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: text },
        hero: { background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', padding: '48px 24px', textAlign: 'center' as const, color: 'white' },
        heroIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backdropFilter: 'blur(8px)' },
        heroTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '8px' },
        heroSubtitle: { fontSize: '15px', opacity: 0.9 },
        content: { padding: '24px 16px' },
        grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px' },
        card: (isUnlocked: boolean) => ({
            background: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${border}`,
            display: 'flex', alignItems: 'center', gap: '20px',
            opacity: isUnlocked ? 1 : 0.6,
            filter: isUnlocked ? 'none' : 'grayscale(100%)',
            transition: 'all 0.3s ease'
        }),
        iconBox: (color: string, isUnlocked: boolean) => ({
            width: '60px', height: '60px', borderRadius: '18px',
            background: isUnlocked ? `${color}15` : isDarkMode ? '#334155' : '#F1F5F9',
            color: isUnlocked ? color : muted,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }),
        info: { flex: 1 },
        title: { fontSize: '16px', fontWeight: 700, color: text, marginBottom: '4px' },
        desc: { fontSize: '13px', color: muted },
        status: { fontSize: '12px', fontWeight: 600, color: text, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>Achievements</span>
            </div>

            <div style={styles.hero}>
                <div style={styles.heroIcon}><MdEmojiEvents size={36} /></div>
                <h1 style={styles.heroTitle}>Your Trophies</h1>
                <p style={styles.heroSubtitle}>{unlocked.length} of {achievementsList.length} unlocked</p>
            </div>

            <div style={styles.content}>
                <div style={styles.grid}>
                    {achievementsList.map(item => {
                        const isUnlocked = unlocked.includes(item.id);
                        return (
                            <div key={item.id} style={styles.card(isUnlocked)}>
                                <div style={styles.iconBox(item.color, isUnlocked)}>
                                    <item.icon size={28} />
                                </div>
                                <div style={styles.info}>
                                    <div style={styles.title}>{item.title}</div>
                                    <div style={styles.desc}>{item.description}</div>
                                    <div style={{ ...styles.status, color: isUnlocked ? item.color : muted }}>
                                        {isUnlocked ? <><MdCheckCircle /> Unlocked</> : <><MdLock /> Locked</>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Achievements;
