import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdDarkMode, MdLightMode, MdNotifications, MdBrush, MdInfo,
    MdShare, MdChevronRight, MdEdit, MdStar, MdLocalFireDepartment,
    MdNoteAlt, MdWork, MdSchool, MdSettings, MdPerson, MdBackup, MdClose,
    MdPrivacyTip, MdGavel, MdAssignment, MdStyle
} from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

interface StatDetail {
    type: string;
    items: { title: string; subtitle: string; pending?: boolean }[];
}

const ProfileSection: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [username, setUsername] = useState('Student');
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [streak, setStreak] = useState(0);
    const [notes, setNotes] = useState(0);
    const [exams, setExams] = useState(0);
    const [jobs, setJobs] = useState(0);
    const [tasks, setTasks] = useState(0);
    const [flashcards, setFlashcards] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [selectedStat, setSelectedStat] = useState<StatDetail | null>(null);

    useEffect(() => {
        const savedName = localStorage.getItem('studyone_username');
        if (savedName) setUsername(savedName);
        const streakData = localStorage.getItem('study_streak');
        if (streakData) setStreak(JSON.parse(streakData).count || 0);
        const notesData = localStorage.getItem('studyone_notes');
        if (notesData) setNotes(JSON.parse(notesData).length);
        const examsData = localStorage.getItem('studyone_exams');
        if (examsData) setExams(JSON.parse(examsData).length);
        const jobsData = localStorage.getItem('studyone_jobs');
        if (jobsData) setJobs(JSON.parse(jobsData).length);
        const tasksData = localStorage.getItem('studyone_tasks');
        if (tasksData) {
            const tasksList = JSON.parse(tasksData);
            setTasks(tasksList.length);
            setPendingTasks(tasksList.filter((t: any) => !t.completed).length);
        }
        const flashcardsData = localStorage.getItem('studyone_flashcards');
        if (flashcardsData) setFlashcards(JSON.parse(flashcardsData).length);
    }, []);

    const handleStatClick = (statLabel: string) => {
        const statDetails: Record<string, () => StatDetail> = {
            'Streak': () => ({ type: 'Streak', items: [{ title: `${streak} Day Streak`, subtitle: 'Complete daily quiz to maintain!' }] }),
            'Notes': () => {
                const data = JSON.parse(localStorage.getItem('studyone_notes') || '[]');
                return { type: 'Notes', items: data.slice(0, 5).map((n: any) => ({ title: n.title || 'Untitled', subtitle: new Date(n.updatedAt || Date.now()).toLocaleDateString() })) };
            },
            'Exams': () => {
                const data = JSON.parse(localStorage.getItem('studyone_exams') || '[]');
                return { type: 'Exams', items: data.slice(0, 5).map((e: any) => ({ title: e.name, subtitle: e.date, pending: new Date(e.date) > new Date() })) };
            },
            'Jobs': () => {
                const data = JSON.parse(localStorage.getItem('studyone_jobs') || '[]');
                return { type: 'Jobs', items: data.slice(0, 5).map((j: any) => ({ title: j.title || j.company, subtitle: j.status || 'Applied' })) };
            },
            'Tasks': () => {
                const data = JSON.parse(localStorage.getItem('studyone_tasks') || '[]');
                const pending = data.filter((t: any) => !t.completed);
                return { type: 'Tasks', items: pending.slice(0, 5).map((t: any) => ({ title: t.title, subtitle: t.priority || 'Normal', pending: true })) };
            },
            'Cards': () => {
                const data = JSON.parse(localStorage.getItem('studyone_flashcards') || '[]');
                return { type: 'Flashcards', items: data.slice(0, 5).map((f: any) => ({ title: f.question?.substring(0, 30) + '...' || 'Card', subtitle: f.deck || 'Default Deck' })) };
            },
        };
        const details = statDetails[statLabel]?.();
        if (details) setSelectedStat(details);
    };

    const handleSaveName = () => {
        if (editName.trim()) {
            setUsername(editName.trim());
            localStorage.setItem('studyone_username', editName.trim());
        }
        setIsEditing(false);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'StudyOne - All-in-One Study App',
            text: 'Check out StudyOne - a FREE all-in-one study companion with notes, flashcards, pomodoro timer, task manager, and more! 📚🔥',
            url: window.location.origin,
        };
        try {
            if (navigator.share) await navigator.share(shareData);
            else { navigator.clipboard.writeText(shareData.text + ' ' + shareData.url); alert('Link copied to clipboard!'); }
        } catch { console.log('Share cancelled'); }
    };

    const stats = [
        { icon: MdLocalFireDepartment, value: streak, label: 'Streak', color: '#F59E0B' },
        { icon: MdNoteAlt, value: notes, label: 'Notes', color: '#4F46E5' },
        { icon: MdAssignment, value: tasks, label: 'Tasks', color: '#10B981', badge: pendingTasks > 0 ? pendingTasks : undefined },
        { icon: MdStyle, value: flashcards, label: 'Cards', color: '#EC4899' },
        { icon: MdSchool, value: exams, label: 'Exams', color: '#8B5CF6' },
        { icon: MdWork, value: jobs, label: 'Jobs', color: '#06B6D4' },
    ];

    const achievements = [
        { icon: '🔥', title: 'On Fire', desc: '7 day streak', unlocked: streak >= 7 },
        { icon: '📚', title: 'Note Taker', desc: '10+ notes', unlocked: notes >= 10 },
        { icon: '🎯', title: 'Focused', desc: '30 day streak', unlocked: streak >= 30 },
        { icon: '✅', title: 'Task Master', desc: '20+ tasks', unlocked: tasks >= 20 },
    ];

    interface SettingsItem {
        icon: any;
        title: string;
        subtitle: string;
        path?: string;
        action?: () => void;
        toggle?: boolean;
        toggled?: boolean;
    }

    const settingsGroups: { title: string; items: SettingsItem[] }[] = [
        {
            title: 'Appearance',
            items: [
                { icon: isDarkMode ? MdLightMode : MdDarkMode, title: isDarkMode ? 'Light Mode' : 'Dark Mode', subtitle: 'Toggle theme', action: toggleTheme, toggle: true, toggled: isDarkMode },
                { icon: MdBrush, title: 'Customize', subtitle: 'Themes & fonts', path: '/profile/customize' },
            ]
        },
        {
            title: 'Data',
            items: [
                { icon: MdBackup, title: 'Backup & Restore', subtitle: 'Export/import data', path: '/profile/backup' },
                { icon: MdNotifications, title: 'Reminders', subtitle: 'Study notifications', path: '/profile/reminders' },
            ]
        },
        {
            title: 'About',
            items: [
                { icon: MdShare, title: 'Share App', subtitle: 'Tell your friends', action: handleShare },
                { icon: MdInfo, title: 'About StudyOne', subtitle: 'App info & features', path: '/profile/about' },
            ]
        },
        {
            title: 'Legal',
            items: [
                { icon: MdPrivacyTip, title: 'Privacy Policy', subtitle: 'How we protect you', path: '/privacy' },
                { icon: MdGavel, title: 'Terms of Service', subtitle: 'Usage terms', path: '/terms' },
                { icon: MdPerson, title: 'About Developer', subtitle: 'Meet Vinkal Prajapati', path: '/profile/developer' },
            ]
        }
    ];

    const bgColor = isDarkMode ? '#0F172A' : '#F7F7F7';
    const cardBg = isDarkMode ? '#1E293B' : 'white';
    const textColor = isDarkMode ? '#F1F5F9' : '#1E293B';
    const mutedColor = isDarkMode ? '#94A3B8' : '#64748B';
    const borderColor = isDarkMode ? '#334155' : '#E2E8F0';

    const styles = {
        container: { minHeight: '100vh', background: bgColor, paddingBottom: '100px' },
        header: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '32px 20px 80px', position: 'relative' as const },
        headerContent: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        headerTitle: { fontSize: '24px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' },
        profileCard: { background: cardBg, borderRadius: '24px', padding: '24px', margin: '-48px 16px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: `1px solid ${borderColor}`, position: 'relative' as const, zIndex: 10 },
        avatarRow: { display: 'flex', alignItems: 'center', gap: '16px' },
        avatar: { width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: 'white', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' },
        profileInfo: { flex: 1 },
        profileName: { fontSize: '22px', fontWeight: 700, color: textColor },
        profileLabel: { fontSize: '14px', color: mutedColor, marginTop: '2px' },
        editBtn: { width: '44px', height: '44px', borderRadius: '14px', background: isDarkMode ? '#334155' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '0 16px 24px' },
        statCard: { background: cardBg, borderRadius: '18px', padding: '18px 12px', textAlign: 'center' as const, border: `1px solid ${borderColor}` },
        statIcon: (color: string) => ({ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color }),
        statValue: { fontSize: '22px', fontWeight: 700, color: textColor, lineHeight: 1 },
        statLabel: { fontSize: '11px', color: mutedColor, marginTop: '4px' },
        section: { margin: '0 16px 24px' },
        sectionTitle: { fontSize: '16px', fontWeight: 700, color: textColor, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
        achievementsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
        achievementCard: (unlocked: boolean) => ({ background: cardBg, borderRadius: '18px', padding: '18px 12px', textAlign: 'center' as const, border: `1px solid ${borderColor}`, opacity: unlocked ? 1 : 0.4, filter: unlocked ? 'none' : 'grayscale(100%)' }),
        achievementIcon: { fontSize: '28px', marginBottom: '8px' },
        achievementTitle: { fontSize: '11px', fontWeight: 600, color: textColor },
        settingsCard: { background: cardBg, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${borderColor}` },
        settingsItem: (isLast: boolean) => ({ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: isLast ? 'none' : `1px solid ${borderColor}`, cursor: 'pointer' }),
        settingsIcon: (color: string) => ({ width: '44px', height: '44px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }),
        settingsInfo: { flex: 1 },
        settingsTitle: { fontSize: '15px', fontWeight: 600, color: textColor },
        settingsSubtitle: { fontSize: '13px', color: mutedColor, marginTop: '2px' },
        toggle: (on: boolean) => ({ width: '52px', height: '28px', borderRadius: '14px', background: on ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : '#E2E8F0', position: 'relative' as const, cursor: 'pointer', border: 'none' }),
        toggleDot: (on: boolean) => ({ position: 'absolute' as const, top: '3px', left: on ? '26px' : '3px', width: '22px', height: '22px', borderRadius: '50%', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 0.3s ease' }),
        versionCard: { background: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}`, textAlign: 'center' as const, margin: '0 16px' },
        versionText: { fontSize: '14px', color: mutedColor },
        versionNumber: { fontSize: '16px', fontWeight: 700, color: textColor, marginTop: '4px' },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: cardBg, borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '400px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: textColor },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: isDarkMode ? '#334155' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor },
        input: { width: '100%', padding: '16px', background: isDarkMode ? '#334155' : '#F7F7F7', borderRadius: '14px', border: `1px solid ${borderColor}`, fontSize: '16px', color: textColor, outline: 'none' },
        modalBtns: { display: 'flex', gap: '12px', marginTop: '20px' },
        cancelBtn: { flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: isDarkMode ? '#334155' : '#F3F4F6', color: mutedColor, fontSize: '15px', fontWeight: 600, cursor: 'pointer' },
        saveBtn: { flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.headerTitle}><MdPerson />Profile</h1>
                </div>
            </div>

            <div style={styles.profileCard}>
                <div style={styles.avatarRow}>
                    <div style={styles.avatar}>{username.charAt(0).toUpperCase()}</div>
                    <div style={styles.profileInfo}>
                        <div style={styles.profileName}>{username}</div>
                        <div style={styles.profileLabel}>StudyOne Member</div>
                    </div>
                    <button style={styles.editBtn} onClick={() => { setEditName(username); setIsEditing(true); }}><MdEdit size={20} /></button>
                </div>
            </div>

            <div style={styles.statsGrid}>
                {stats.map(stat => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            style={{ ...styles.statCard, cursor: 'pointer', transition: 'transform 0.2s ease' }}
                            onClick={() => handleStatClick(stat.label)}
                        >
                            <div style={{ position: 'relative' as const }}>
                                <div style={styles.statIcon(stat.color)}><Icon size={20} /></div>
                                {(stat as any).badge && (
                                    <div style={{ position: 'absolute' as const, top: '-4px', right: 'calc(50% - 28px)', background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {(stat as any).badge}
                                    </div>
                                )}
                            </div>
                            <div style={styles.statValue}>{stat.value}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}><MdStar style={{ color: '#F59E0B' }} />Achievements</h2>
                    <span onClick={() => navigate('/profile/achievements')} style={{ fontSize: '13px', color: '#4F46E5', fontWeight: 600, cursor: 'pointer' }}>View All</span>
                </div>
                <div style={styles.achievementsGrid}>
                    {achievements.map(ach => (
                        <div key={ach.title} style={styles.achievementCard(ach.unlocked)}>
                            <div style={styles.achievementIcon}>{ach.icon}</div>
                            <div style={styles.achievementTitle}>{ach.title}</div>
                        </div>
                    ))}
                </div>
            </div>

            {settingsGroups.map(group => (
                <div key={group.title} style={styles.section}>
                    <h2 style={styles.sectionTitle}><MdSettings style={{ color: '#4F46E5' }} />{group.title}</h2>
                    <div style={styles.settingsCard}>
                        {group.items.map((item, i) => {
                            const Icon = item.icon;
                            const isLast = i === group.items.length - 1;
                            return (
                                <div
                                    key={item.title}
                                    style={styles.settingsItem(isLast)}
                                    onClick={() => {
                                        if (item.action) item.action();
                                        else if (item.path) navigate(item.path);
                                    }}
                                >
                                    <div style={styles.settingsIcon('#4F46E5')}><Icon size={22} /></div>
                                    <div style={styles.settingsInfo}>
                                        <div style={styles.settingsTitle}>{item.title}</div>
                                        <div style={styles.settingsSubtitle}>{item.subtitle}</div>
                                    </div>
                                    {item.toggle ? (
                                        <div style={styles.toggle(item.toggled || false)}><div style={styles.toggleDot(item.toggled || false)} /></div>
                                    ) : (
                                        <MdChevronRight size={22} color={mutedColor} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div style={styles.versionCard}>
                <div style={styles.versionText}>StudyOne</div>
                <div style={styles.versionNumber}>Version 2.0.0</div>
            </div>

            {isEditing && (
                <div style={styles.modal} onClick={() => setIsEditing(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>Edit Name</span>
                            <button style={styles.closeBtn} onClick={() => setIsEditing(false)}><MdClose size={20} /></button>
                        </div>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Enter your name" style={styles.input} autoFocus />
                        <div style={styles.modalBtns}>
                            <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                            <button style={styles.saveBtn} onClick={handleSaveName}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedStat && (
                <div style={styles.modal} onClick={() => setSelectedStat(null)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>{selectedStat.type}</span>
                            <button style={styles.closeBtn} onClick={() => setSelectedStat(null)}><MdClose size={20} /></button>
                        </div>
                        {selectedStat.items.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedStat.items.map((item, idx) => (
                                    <div key={idx} style={{ background: isDarkMode ? '#334155' : '#F7F7F7', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontSize: '14px' }}>{item.title}</div>
                                            <div style={{ fontSize: '12px', color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: '2px' }}>{item.subtitle}</div>
                                        </div>
                                        {item.pending && <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '10px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px' }}>Pending</span>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '24px', color: isDarkMode ? '#94A3B8' : '#64748B' }}>No items yet</div>
                        )}
                        <button
                            style={{ ...styles.saveBtn, width: '100%', marginTop: '20px' }}
                            onClick={() => { setSelectedStat(null); navigate(selectedStat.type === 'Tasks' ? '/study/tasks' : selectedStat.type === 'Notes' ? '/study/notes' : selectedStat.type === 'Exams' ? '/exams' : selectedStat.type === 'Jobs' ? '/jobs' : selectedStat.type === 'Flashcards' ? '/study/flashcards' : '/study/streak'); }}
                        >
                            View All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSection;
