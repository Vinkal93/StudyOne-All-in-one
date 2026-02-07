import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdMenuBook, MdStickyNote2, MdQuiz, MdLocalFireDepartment,
    MdTimer, MdStyle, MdChecklist, MdArrowForward, MdTrendingUp, MdCheckCircle
} from 'react-icons/md';

const StudySection: React.FC = () => {
    const navigate = useNavigate();
    const [streak, setStreak] = useState(0);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [notes, setNotes] = useState(0);
    const [tasks, setTasks] = useState(0);

    useEffect(() => {
        const streakData = localStorage.getItem('study_streak');
        if (streakData) {
            const data = JSON.parse(streakData);
            setStreak(data.count || 0);
            setTodayCompleted(data.lastDate === new Date().toDateString());
        }
        const notesData = localStorage.getItem('studyone_notes');
        if (notesData) setNotes(JSON.parse(notesData).length);
        const tasksData = localStorage.getItem('studyone_tasks');
        if (tasksData) setTasks(JSON.parse(tasksData).filter((t: { completed: boolean }) => !t.completed).length);
    }, []);

    const mainTools = [
        { id: 'notes', name: 'Notes', subtitle: `${notes} notes`, icon: MdStickyNote2, color: '#4F46E5', bg: '#F0FFFF', path: '/study/notes' },
        { id: 'pomodoro', name: 'Pomodoro', subtitle: 'Focus timer', icon: MdTimer, color: '#DC2626', bg: '#FEF2F2', path: '/study/pomodoro' },
        { id: 'flashcards', name: 'Flashcards', subtitle: 'Study cards', icon: MdStyle, color: '#7C3AED', bg: '#F5F3FF', path: '/study/flashcards' },
        { id: 'tasks', name: 'Tasks', subtitle: `${tasks} pending`, icon: MdChecklist, color: '#059669', bg: '#F0FFF0', path: '/study/tasks' },
    ];

    const quickActions = [
        { id: 'streak', name: 'Streak', subtitle: `${streak} days`, icon: MdLocalFireDepartment, color: '#F59E0B', path: '/study/streak' },
        { id: 'quiz', name: 'Daily Quiz', subtitle: todayCompleted ? 'Done ✓' : 'Take quiz', icon: MdQuiz, color: '#10B981', path: '/study/daily-question' },
    ];

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '100px' },
        header: { background: 'linear-gradient(135deg, #F0FFF0 0%, #F0FFFF 100%)', padding: '24px 16px 32px', borderRadius: '0 0 32px 32px' },
        title: { fontSize: '28px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
        streakBanner: { background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)', borderRadius: '20px', padding: '20px', color: 'white', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' as const, overflow: 'hidden' as const },
        streakDecor: { position: 'absolute' as const, right: '-10px', top: '-10px', fontSize: '80px', opacity: 0.15 },
        streakRing: { width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, border: '3px solid rgba(255,255,255,0.5)', position: 'relative' as const, zIndex: 1 },
        streakInfo: { flex: 1, position: 'relative' as const, zIndex: 1 },
        streakNumber: { fontSize: '28px', fontWeight: 800, lineHeight: 1 },
        streakLabel: { fontSize: '14px', opacity: 0.9, marginTop: '4px' },
        streakStatus: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '10px', width: 'fit-content' },
        content: { padding: '20px 16px' },
        sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
        toolsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' },
        toolCard: (bg: string, i: number) => ({ background: bg, borderRadius: '20px', padding: '24px 20px', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.25s ease', animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }),
        toolIconContainer: (color: string) => ({ width: '52px', height: '52px', borderRadius: '16px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }),
        toolIcon: (color: string) => ({ color }),
        toolName: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' },
        toolSubtitle: { fontSize: '13px', color: '#64748B' },
        quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
        quickCard: (i: number) => ({ background: 'white', borderRadius: '18px', padding: '18px', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', animation: `fadeInUp 0.4s ease ${0.3 + i * 0.06}s both` }),
        quickIcon: (color: string) => ({ width: '44px', height: '44px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }),
        quickInfo: { flex: 1 },
        quickName: { fontSize: '14px', fontWeight: 700, color: '#1E293B' },
        quickSubtitle: { fontSize: '12px', color: '#64748B' },
        dailyCard: { background: 'white', borderRadius: '20px', padding: '20px', marginTop: '24px', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' },
        dailyContent: { display: 'flex', alignItems: 'center', gap: '16px' },
        dailyIcon: { width: '52px', height: '52px', borderRadius: '16px', background: '#10B98115', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' },
        dailyTitle: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '2px' },
        dailySubtitle: { fontSize: '13px', color: '#64748B' },
        dailyArrow: { width: '40px', height: '40px', borderRadius: '12px', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}><MdMenuBook style={{ color: '#4F46E5' }} />Study</h1>
                <div style={styles.streakBanner}>
                    <div style={styles.streakDecor}>🔥</div>
                    <div style={styles.streakRing}>{streak}</div>
                    <div style={styles.streakInfo}>
                        <div style={styles.streakNumber}>{streak} Days</div>
                        <div style={styles.streakLabel}>Study Streak</div>
                        <div style={styles.streakStatus}>{todayCompleted ? <><MdCheckCircle size={14} />Completed!</> : <><MdTrendingUp size={14} />Keep going</>}</div>
                    </div>
                </div>
            </div>

            <div style={styles.content}>
                <h2 style={styles.sectionTitle}><MdMenuBook style={{ color: '#4F46E5' }} />Study Tools</h2>
                <div style={styles.toolsGrid}>
                    {mainTools.map((tool, i) => {
                        const Icon = tool.icon;
                        return (
                            <div key={tool.id} style={styles.toolCard(tool.bg, i)} onClick={() => navigate(tool.path)}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${tool.color}25`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div style={styles.toolIconContainer(tool.color)}><Icon size={26} style={styles.toolIcon(tool.color)} /></div>
                                <div style={styles.toolName}>{tool.name}</div>
                                <div style={styles.toolSubtitle}>{tool.subtitle}</div>
                            </div>
                        );
                    })}
                </div>

                <h2 style={styles.sectionTitle}><MdLocalFireDepartment style={{ color: '#F59E0B' }} />Quick Access</h2>
                <div style={styles.quickGrid}>
                    {quickActions.map((tool, i) => {
                        const Icon = tool.icon;
                        return (
                            <div key={tool.id} style={styles.quickCard(i)} onClick={() => navigate(tool.path)}>
                                <div style={styles.quickIcon(tool.color)}><Icon size={22} /></div>
                                <div style={styles.quickInfo}><div style={styles.quickName}>{tool.name}</div><div style={styles.quickSubtitle}>{tool.subtitle}</div></div>
                            </div>
                        );
                    })}
                </div>

                {!todayCompleted && (
                    <div style={styles.dailyCard} onClick={() => navigate('/study/daily-question')}>
                        <div style={styles.dailyContent}>
                            <div style={styles.dailyIcon}><MdQuiz size={26} /></div>
                            <div><div style={styles.dailyTitle}>Daily Quiz</div><div style={styles.dailySubtitle}>Answer to maintain streak</div></div>
                        </div>
                        <div style={styles.dailyArrow}><MdArrowForward size={20} /></div>
                    </div>
                )}
            </div>

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default StudySection;
