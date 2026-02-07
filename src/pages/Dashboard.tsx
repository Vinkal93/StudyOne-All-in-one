import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdWavingHand, MdTimer, MdMenuBook, MdCheckCircle, MdTrendingUp, MdArrowForward, MdCalculate, MdSearch } from 'react-icons/md';
import { format, isToday, isFuture, differenceInDays } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [userName, setUserName] = useState('Student');
    const [streak, setStreak] = useState(0);
    const [tasks, setTasks] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);

    useEffect(() => {
        const savedName = localStorage.getItem('studyone_username');
        if (savedName) setUserName(savedName);

        const savedStreak = localStorage.getItem('study_streak');
        if (savedStreak) setStreak(JSON.parse(savedStreak).current || 0);

        const savedTasks = localStorage.getItem('studyone_tasks');
        if (savedTasks) setTasks(JSON.parse(savedTasks));

        const savedExams = localStorage.getItem('studyone_exams');
        if (savedExams) setExams(JSON.parse(savedExams));

        const savedNotes = localStorage.getItem('studyone_notes');
        if (savedNotes) setNotes(JSON.parse(savedNotes));
    }, []);

    const todayTasks = tasks.filter(t => !t.completed && t.dueDate && isToday(new Date(t.dueDate)));
    const upcomingExams = exams
        .filter(e => isFuture(new Date(e.date)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 2);

    const recentNotes = notes.slice(0, 4);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const cardBg = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '120px', padding: '24px 20px', fontFamily: '"Inter", sans-serif' },
        header: { marginBottom: '28px' },
        greeting: { fontSize: '26px', fontWeight: 800, color: text, display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' },
        subtitle: { fontSize: '15px', color: muted, marginTop: '6px', fontWeight: 500 },
        card: { background: cardBg, borderRadius: '24px', padding: '24px', border: `1px solid ${border}`, marginBottom: '20px', boxShadow: isDarkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.02)' },
        sectionTitle: { fontSize: '19px', fontWeight: 700, color: text, marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '-0.3px' },
        streakCard: { background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', borderRadius: '24px', padding: '28px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', boxShadow: '0 12px 30px rgba(245, 158, 11, 0.25)', position: 'relative' as const, overflow: 'hidden' },
        streakInfo: { flex: 1, position: 'relative' as const, zIndex: 2 },
        streakCount: { fontSize: '42px', fontWeight: 800, lineHeight: 1, letterSpacing: '-1px', marginBottom: '4px' },
        streakLabel: { fontSize: '15px', opacity: 0.95, fontWeight: 600 },
        taskItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '16px', background: isDarkMode ? '#0F172A' : '#F8FAFC', marginBottom: '10px', transition: 'transform 0.2s', cursor: 'pointer' },
        taskText: { fontSize: '15px', color: text, fontWeight: 500 },
        examItem: { display: 'flex', alignItems: 'center', gap: '18px', padding: '18px', borderRadius: '20px', background: isDarkMode ? '#0F172A' : '#F8FAFC', marginBottom: '14px', borderLeft: '5px solid #4F46E5', cursor: 'pointer' },
        examDate: { textAlign: 'center' as const, minWidth: '50px', background: isDarkMode ? '#1E293B' : 'white', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
        examDay: { fontSize: '20px', fontWeight: 700, color: '#4F46E5', lineHeight: 1, marginBottom: '2px' },
        examMonth: { fontSize: '12px', color: muted, fontWeight: 700, textTransform: 'uppercase' as const },
        noteGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
        noteCard: { background: isDarkMode ? '#0F172A' : '#F8FAFC', padding: '18px', borderRadius: '20px', display: 'flex', flexDirection: 'column' as const, gap: '12px', cursor: 'pointer', border: `1px solid ${isDarkMode ? '#334155' : 'transparent'}` },
        noteIcon: { width: '38px', height: '38px', borderRadius: '12px', background: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        noteTitle: { fontSize: '15px', fontWeight: 600, color: text, lineHeight: 1.4 },
        emptyState: { textAlign: 'center' as const, padding: '24px', color: muted, fontSize: '15px', background: isDarkMode ? '#0F172A' : '#F8FAFC', borderRadius: '16px' },
        viewAll: { fontSize: '14px', color: '#4F46E5', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', background: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : '#EEF2FF' },

        // Quick Tools Grid
        quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' },
        quickBtn: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer' },
        quickIcon: (color: string) => ({ width: '56px', height: '56px', borderRadius: '22px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDarkMode ? 'none' : `0 4px 12px ${color}15`, transition: 'transform 0.2s' }),
        quickLabel: { fontSize: '12px', fontWeight: 600, color: text, textAlign: 'center' as const }
    };

    const tools = [
        { icon: MdTimer, label: 'Pomodoro', color: '#EF4444', path: '/study/pomodoro' },
        { icon: MdCalculate, label: 'Calculator', color: '#10B981', path: '/tools/calculator' },
        { icon: MdTimer, label: 'Converter', color: '#F59E0B', path: '/tools/converter/length' }, // Updated default path
        { icon: MdMenuBook, label: 'Flashcards', color: '#EC4899', path: '/study/flashcards' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={styles.greeting}>{getGreeting()}, {userName} <MdWavingHand style={{ color: '#F59E0B' }} /></h1>
                        <p style={styles.subtitle}>Let's make today productive!</p>
                    </div>
                    <button
                        onClick={() => window.dispatchEvent(new Event('open-search'))}
                        style={{
                            width: '44px', height: '44px', borderRadius: '14px',
                            background: isDarkMode ? '#1E293B' : 'white',
                            border: `1px solid ${border}`,
                            color: text, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <MdSearch size={24} />
                    </button>
                </div>
            </div>

            <div style={styles.quickGrid}>
                {tools.map(tool => {
                    const Icon = tool.icon;
                    return (
                        <button key={tool.label} style={styles.quickBtn} onClick={() => navigate(tool.path)}>
                            <div style={styles.quickIcon(tool.color)}><Icon size={26} /></div>
                            <span style={styles.quickLabel}>{tool.label}</span>
                        </button>
                    )
                })}
            </div>

            <div style={styles.streakCard} onClick={() => navigate('/study/streak')}>
                <div style={styles.streakInfo}>
                    <div style={styles.streakCount}>{streak}</div>
                    <div style={styles.streakLabel}>Day Streak 🔥</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                    <MdTrendingUp size={36} />
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.sectionTitle}>
                    <span>Today's Focus</span>
                    <span style={styles.viewAll} onClick={() => navigate('/study/tasks')}>View All <MdArrowForward size={16} /></span>
                </div>
                {todayTasks.length > 0 ? (
                    todayTasks.map((task: any) => (
                        <div key={task.id} style={styles.taskItem}>
                            <MdCheckCircle color={isDarkMode ? '#334155' : '#CBD5E1'} size={22} />
                            <span style={styles.taskText}>{task.text}</span>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyState}>No tasks for today. Relax! 🎉</div>
                )}
            </div>

            <div style={styles.card}>
                <div style={styles.sectionTitle}>
                    <span>Upcoming Exams</span>
                    <span style={styles.viewAll} onClick={() => navigate('/exams')}>Calendar <MdArrowForward size={16} /></span>
                </div>
                {upcomingExams.length > 0 ? (
                    upcomingExams.map((exam: any) => (
                        <div key={exam.id} style={styles.examItem}>
                            <div style={styles.examDate}>
                                <div style={styles.examDay}>{format(new Date(exam.date), 'd')}</div>
                                <div style={styles.examMonth}>{format(new Date(exam.date), 'MMM')}</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, color: text, fontSize: '16px' }}>{exam.name}</div>
                                <div style={{ fontSize: '13px', color: muted, marginTop: '2px' }}>{exam.subject} • {format(new Date(exam.date), 'EEEE')}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyState}>No upcoming exams. Keep studying! 📚</div>
                )}
            </div>

            <div style={styles.card}>
                <div style={styles.sectionTitle}>
                    <span>Recent Notes</span>
                    <span style={styles.viewAll} onClick={() => navigate('/study/notes')}>All Notes <MdArrowForward size={16} /></span>
                </div>
                {recentNotes.length > 0 ? (
                    <div style={styles.noteGrid}>
                        {recentNotes.map((note: any) => (
                            <div key={note.id} style={styles.noteCard} onClick={() => navigate(`/study/notes/${note.id}`)}>
                                <div style={styles.noteIcon}><MdMenuBook size={20} /></div>
                                <div style={styles.noteTitle}>{note.title || 'Untitled'}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>Start writing your first note! 📝</div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
