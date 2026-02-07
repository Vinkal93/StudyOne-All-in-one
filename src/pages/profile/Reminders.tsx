import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdNotifications, MdAlarm, MdCheck, MdInfo, MdAdd, MdDelete, MdClose, MdAccessTime } from 'react-icons/md';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { useTheme } from '../../context/ThemeContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

interface Reminder {
    id: string;
    type: 'daily_study' | 'streak' | 'exam' | 'custom';
    time: string;
    enabled: boolean;
    label: string;
    customTitle?: string;
    customMessage?: string;
    lastTriggered?: string;
}

const Reminders: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [reminders, setReminders] = useState<Reminder[]>([
        { id: '1', type: 'daily_study', time: '09:00', enabled: true, label: 'Daily Study Reminder' },
        { id: '2', type: 'streak', time: '20:00', enabled: true, label: 'Maintain Streak' },
        { id: '3', type: 'exam', time: '08:00', enabled: false, label: 'Exam Prep Reminder' },
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReminder, setNewReminder] = useState({ label: '', time: '12:00', title: '', message: '' });
    const [notification, setNotification] = useState<{ id: string; title: string; body: string; time: string } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const activeTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const dismissedToday = useRef<Set<string>>(new Set());
    const { showToast } = useToast();

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    useEffect(() => {
        const requestPermission = async () => {
            if (!Capacitor.isNativePlatform()) return;
            try { await LocalNotifications.requestPermissions(); } catch { }
        };
        requestPermission();
        const saved = localStorage.getItem('studyone_reminders');
        if (saved) {
            const loadedReminders = JSON.parse(saved);
            setReminders(loadedReminders);
            loadedReminders.forEach((r: Reminder) => { if (r.enabled) scheduleInAppReminder(r); });
        }

        // Load dismissed reminders for today
        const dismissed = localStorage.getItem('studyone_dismissed_reminders');
        if (dismissed) {
            const parsed = JSON.parse(dismissed);
            if (parsed.date === new Date().toDateString()) {
                dismissedToday.current = new Set(parsed.ids);
            }
        }

        return () => { activeTimeouts.current.forEach(t => clearTimeout(t)); };
    }, []);

    const scheduleInAppReminder = (reminder: Reminder) => {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        if (scheduledTime <= now) scheduledTime.setDate(scheduledTime.getDate() + 1);

        const delay = scheduledTime.getTime() - now.getTime();

        if (activeTimeouts.current.has(reminder.id)) {
            clearTimeout(activeTimeouts.current.get(reminder.id));
        }

        const timeout = setTimeout(() => {
            const todayKey = `${reminder.id}_${new Date().toDateString()}`;

            // Check if already dismissed today
            if (dismissedToday.current.has(todayKey)) {
                // Schedule for next day
                scheduleInAppReminder(reminder);
                return;
            }

            const title = reminder.customTitle || getNotificationTitle(reminder.type);
            const body = reminder.customMessage || getNotificationBody(reminder.type);
            const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            // Show in-app notification banner instead of alert
            setNotification({ id: reminder.id, title, body, time: timeStr });

            // Browser notification if available
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, { body, icon: '📚' });
            }

            // Schedule for next day after showing
            scheduleInAppReminder(reminder);
        }, delay);

        activeTimeouts.current.set(reminder.id, timeout);
    };

    const dismissNotification = () => {
        if (notification) {
            const todayKey = `${notification.id}_${new Date().toDateString()}`;
            dismissedToday.current.add(todayKey);
            localStorage.setItem('studyone_dismissed_reminders', JSON.stringify({
                date: new Date().toDateString(),
                ids: Array.from(dismissedToday.current)
            }));
        }
        setNotification(null);
    };

    const cancelInAppReminder = (id: string) => {
        if (activeTimeouts.current.has(id)) {
            clearTimeout(activeTimeouts.current.get(id));
            activeTimeouts.current.delete(id);
        }
    };

    const getNotificationTitle = (type: string) => {
        const titles: Record<string, string> = {
            daily_study: '📚 Time to Study!',
            streak: '🔥 Keep Your Streak!',
            exam: '📝 Exam Prep Time',
            custom: '⏰ Reminder',
        };
        return titles[type] || '⏰ Reminder';
    };

    const getNotificationBody = (type: string) => {
        const bodies: Record<string, string> = {
            daily_study: "Your daily study session is waiting. Let's learn something new!",
            streak: 'Complete today\'s quiz to maintain your streak!',
            exam: 'Time to prepare for your upcoming exams!',
            custom: 'Your scheduled reminder is now!',
        };
        return bodies[type] || 'Your scheduled reminder is now!';
    };

    const scheduleNativeNotification = async (reminder: Reminder) => {
        if (!Capacitor.isNativePlatform() || !reminder.enabled) return;
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        if (scheduledTime <= new Date()) scheduledTime.setDate(scheduledTime.getDate() + 1);

        try {
            await LocalNotifications.schedule({
                notifications: [{
                    id: parseInt(reminder.id),
                    title: reminder.customTitle || getNotificationTitle(reminder.type),
                    body: reminder.customMessage || getNotificationBody(reminder.type),
                    schedule: { at: scheduledTime, repeats: true, every: 'day' },
                    sound: 'default',
                    smallIcon: 'ic_launcher',
                    extra: { type: reminder.type }
                }]
            });
        } catch { }
    };

    const cancelNativeNotification = async (id: string) => {
        if (!Capacitor.isNativePlatform()) return;
        try { await LocalNotifications.cancel({ notifications: [{ id: parseInt(id) }] }); } catch { }
    };

    const saveReminders = (updated: Reminder[]) => {
        setReminders(updated);
        localStorage.setItem('studyone_reminders', JSON.stringify(updated));
    };

    const toggleReminder = async (id: string) => {
        const updated = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
        saveReminders(updated);
        const reminder = updated.find(r => r.id === id);
        if (reminder) {
            if (reminder.enabled) {
                scheduleInAppReminder(reminder);
                await scheduleNativeNotification(reminder);
                showToast('Reminder enabled', 'success');
            } else {
                cancelInAppReminder(id);
                await cancelNativeNotification(id);
                showToast('Reminder disabled', 'info');
            }
        }
    };

    const updateTime = async (id: string, time: string) => {
        const updated = reminders.map(r => r.id === id ? { ...r, time } : r);
        saveReminders(updated);
        const reminder = updated.find(r => r.id === id);
        if (reminder?.enabled) {
            cancelInAppReminder(id);
            await cancelNativeNotification(id);
            scheduleInAppReminder({ ...reminder, time });
            await scheduleNativeNotification({ ...reminder, time });
        }
    };

    const addCustomReminder = async () => {
        if (!newReminder.label.trim()) return;
        const customReminder: Reminder = {
            id: Date.now().toString(),
            type: 'custom',
            time: newReminder.time,
            enabled: true,
            label: newReminder.label,
            customTitle: newReminder.title || `⏰ ${newReminder.label}`,
            customMessage: newReminder.message || 'Your scheduled reminder is now!',
        };
        const updated = [...reminders, customReminder];
        saveReminders(updated);
        scheduleInAppReminder(customReminder);
        await scheduleNativeNotification(customReminder);
        setShowAddModal(false);
        setNewReminder({ label: '', time: '12:00', title: '', message: '' });

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const confirmDelete = (id: string) => setDeleteId(id);

    const handleDelete = async () => {
        if (deleteId) {
            cancelInAppReminder(deleteId);
            await cancelNativeNotification(deleteId);
            saveReminders(reminders.filter(r => r.id !== deleteId));
            setDeleteId(null);
            showToast('Reminder deleted', 'success');
        }
    };

    const reminderIcons: Record<string, string> = { daily_study: '📚', streak: '🔥', exam: '📝', custom: '⏰' };
    const reminderDescriptions: Record<string, string> = {
        daily_study: 'Daily study session reminder',
        streak: 'Keep your streak alive!',
        exam: 'Exam preparation reminder',
        custom: 'Custom reminder',
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '120px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}`, position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: text },
        hero: { background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', padding: '40px 24px', textAlign: 'center' as const, color: 'white' },
        heroIcon: { width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
        heroTitle: { fontSize: '24px', fontWeight: 800, marginBottom: '6px' },
        heroSubtitle: { fontSize: '14px', opacity: 0.9 },
        content: { padding: '20px 16px' },
        infoCard: { background: isDarkMode ? '#334155' : '#FEF3C7', borderRadius: '16px', padding: '16px', border: `1px solid ${isDarkMode ? border : '#FCD34D'}`, marginBottom: '20px' },
        infoTitle: { fontSize: '14px', fontWeight: 600, color: isDarkMode ? '#FCD34D' : '#92400E', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
        infoText: { fontSize: '13px', color: isDarkMode ? muted : '#A16207', lineHeight: 1.4 },
        reminderCard: { background: card, borderRadius: '18px', padding: '16px', border: `1px solid ${border}`, marginBottom: '12px' },
        reminderHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
        reminderIcon: { width: '44px', height: '44px', borderRadius: '12px', background: isDarkMode ? '#334155' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
        reminderInfo: { flex: 1, minWidth: 0 },
        reminderTitle: { fontSize: '15px', fontWeight: 700, color: text, marginBottom: '2px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' },
        reminderDesc: { fontSize: '12px', color: muted, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' },
        reminderActions: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
        toggle: (on: boolean) => ({ width: '48px', height: '26px', borderRadius: '13px', background: on ? '#F59E0B' : (isDarkMode ? '#475569' : '#E2E8F0'), position: 'relative' as const, cursor: 'pointer', border: 'none', flexShrink: 0, transition: 'background 0.2s' }),
        toggleDot: (on: boolean) => ({ position: 'absolute' as const, top: '2px', left: on ? '24px' : '2px', width: '22px', height: '22px', borderRadius: '50%', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s ease' }),
        timeRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${border}`, gap: '10px', flexWrap: 'wrap' as const },
        timeLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
        timeLabel: { fontSize: '13px', color: muted, display: 'flex', alignItems: 'center', gap: '4px' },
        timeInput: { padding: '8px 12px', background: inputBg, borderRadius: '10px', border: `1px solid ${border}`, fontSize: '15px', fontWeight: 600, color: text, cursor: 'pointer', width: '100px' },
        enabledBadge: (enabled: boolean) => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: enabled ? (isDarkMode ? '#166534' : '#DCFCE7') : inputBg, color: enabled ? (isDarkMode ? '#86EFAC' : '#166534') : muted }),
        deleteBtn: { width: '32px', height: '32px', borderRadius: '8px', background: isDarkMode ? '#7F1D1D' : '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 },
        fab: { position: 'fixed' as const, bottom: '100px', right: '20px', width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)', zIndex: 50 },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: card, borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '360px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        modalTitle: { fontSize: '18px', fontWeight: 700, color: text },
        closeBtn: { width: '32px', height: '32px', borderRadius: '8px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        input: { width: '100%', padding: '14px', background: inputBg, borderRadius: '12px', border: `1px solid ${border}`, fontSize: '15px', color: text, outline: 'none', marginBottom: '12px', boxSizing: 'border-box' as const },
        saveBtn: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' },
        notificationBanner: { position: 'fixed' as const, top: '16px', left: '16px', right: '16px', background: card, borderRadius: '16px', padding: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 300, border: `1px solid ${border}` },
        notificationHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
        notificationTitle: { fontSize: '16px', fontWeight: 700, color: text },
        notificationBody: { fontSize: '14px', color: muted, lineHeight: 1.4, marginBottom: '8px' },
        notificationTime: { fontSize: '12px', color: muted, display: 'flex', alignItems: 'center', gap: '4px' },
        dismissBtn: { padding: '8px 16px', borderRadius: '8px', background: '#F59E0B', border: 'none', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
    };

    return (
        <div style={styles.container}>
            {/* Notification Banner */}
            {notification && (
                <div style={styles.notificationBanner}>
                    <div style={styles.notificationHeader}>
                        <div style={styles.notificationTitle}>{notification.title}</div>
                        <button style={styles.closeBtn} onClick={dismissNotification}><MdClose size={16} /></button>
                    </div>
                    <div style={styles.notificationBody}>{notification.body}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={styles.notificationTime}><MdAccessTime size={14} />{notification.time}</span>
                        <button style={styles.dismissBtn} onClick={dismissNotification}>Dismiss</button>
                    </div>
                </div>
            )}

            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>Reminders</span>
            </div>

            <div style={styles.hero}>
                <div style={styles.heroIcon}><MdNotifications size={32} /></div>
                <h1 style={styles.heroTitle}>Study Reminders</h1>
                <p style={styles.heroSubtitle}>Never miss a study session</p>
            </div>

            <div style={styles.content}>
                <div style={styles.infoCard}>
                    <div style={styles.infoTitle}><MdInfo size={16} />How it works</div>
                    <p style={styles.infoText}>Set your preferred time and you'll receive a notification. Dismiss it once and it won't appear again until the next day.</p>
                </div>

                {reminders.map(reminder => (
                    <div key={reminder.id} style={styles.reminderCard}>
                        <div style={styles.reminderHeader}>
                            <div style={styles.reminderIcon}>{reminderIcons[reminder.type]}</div>
                            <div style={styles.reminderInfo}>
                                <div style={styles.reminderTitle}>{reminder.label}</div>
                                <div style={styles.reminderDesc}>{reminder.customMessage || reminderDescriptions[reminder.type]}</div>
                            </div>
                            <div style={styles.reminderActions}>
                                {reminder.type === 'custom' && (
                                    <button style={styles.deleteBtn} onClick={() => confirmDelete(reminder.id)}><MdDelete size={16} /></button>
                                )}
                                <button style={styles.toggle(reminder.enabled)} onClick={() => toggleReminder(reminder.id)}>
                                    <div style={styles.toggleDot(reminder.enabled)} />
                                </button>
                            </div>
                        </div>
                        <div style={styles.timeRow}>
                            <div style={styles.timeLeft}>
                                <span style={styles.timeLabel}><MdAlarm size={16} />Time:</span>
                                <input type="time" value={reminder.time} onChange={e => updateTime(reminder.id, e.target.value)} style={styles.timeInput} />
                            </div>
                            <span style={styles.enabledBadge(reminder.enabled)}>{reminder.enabled ? <><MdCheck size={12} />Active</> : 'Off'}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button style={styles.fab} onClick={() => setShowAddModal(true)}><MdAdd size={26} /></button>

            {showAddModal && (
                <div style={styles.modal} onClick={() => setShowAddModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>Add Reminder</span>
                            <button style={styles.closeBtn} onClick={() => setShowAddModal(false)}><MdClose size={18} /></button>
                        </div>
                        <input style={styles.input} placeholder="Reminder name *" value={newReminder.label} onChange={e => setNewReminder({ ...newReminder, label: e.target.value })} />
                        <input style={styles.input} placeholder="Title (optional)" value={newReminder.title} onChange={e => setNewReminder({ ...newReminder, title: e.target.value })} />
                        <input style={styles.input} placeholder="Message (optional)" value={newReminder.message} onChange={e => setNewReminder({ ...newReminder, message: e.target.value })} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ ...styles.timeLabel, flex: 0 }}><MdAlarm size={16} /></span>
                            <input type="time" value={newReminder.time} onChange={e => setNewReminder({ ...newReminder, time: e.target.value })} style={{ ...styles.timeInput, flex: 1 }} />
                        </div>
                        <button style={styles.saveBtn} onClick={addCustomReminder}>Add Reminder</button>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Reminder"
                message="Are you sure you want to delete this reminder?"
            />

        </div>
    );
};

export default Reminders;
