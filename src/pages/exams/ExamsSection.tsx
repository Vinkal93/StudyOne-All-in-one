import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdCalendarToday, MdTimer, MdDelete, MdEdit, MdSchool, MdClose, MdCheckCircle, MdRadioButtonUnchecked, MdArrowForward, MdMenuBook } from 'react-icons/md';
import { format, differenceInDays, isPast, isToday } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

interface SyllabusItem { id: string; topic: string; completed: boolean; }
interface Exam {
    id: string;
    name: string;
    subject: string;
    date: string;
    time: string;
    color: string;
    notes?: string;
    syllabus?: SyllabusItem[];
}

const examColors = ['#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#06B6D4'];

const ExamsSection: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [exams, setExams] = useState<Exam[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showSyllabusModal, setShowSyllabusModal] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [activeExam, setActiveExam] = useState<Exam | null>(null);

    // Form States
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');
    const [color, setColor] = useState(examColors[0]);
    const [notes, setNotes] = useState('');
    const [newTopic, setNewTopic] = useState('');

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    useEffect(() => { const saved = localStorage.getItem('studyone_exams'); if (saved) setExams(JSON.parse(saved)); }, []);

    const saveExams = (updated: Exam[]) => {
        setExams(updated);
        localStorage.setItem('studyone_exams', JSON.stringify(updated));
    };

    const openModal = (exam?: Exam) => {
        if (exam) { setEditingExam(exam); setName(exam.name); setSubject(exam.subject); setDate(exam.date); setTime(exam.time); setColor(exam.color); setNotes(exam.notes || ''); }
        else { setEditingExam(null); setName(''); setSubject(''); setDate(''); setTime('09:00'); setColor(examColors[Math.floor(Math.random() * examColors.length)]); setNotes(''); }
        setShowModal(true);
    };

    const openSyllabus = (exam: Exam) => {
        setActiveExam(exam);
        setShowSyllabusModal(true);
    };

    const saveExam = () => {
        if (!name.trim() || !date) return;
        const syllabus = editingExam?.syllabus || [];
        if (editingExam) saveExams(exams.map(e => e.id === editingExam.id ? { ...e, name, subject, date, time, color, notes, syllabus } : e));
        else saveExams([...exams, { id: Date.now().toString(), name, subject, date, time, color, notes, syllabus: [] }]);
        setShowModal(false);
    };

    const deleteExam = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this exam?')) {
            const updated = exams.filter(exam => exam.id !== id);
            saveExams(updated);
        }
    };

    const addTopic = () => {
        if (!newTopic.trim() || !activeExam) return;
        const updatedSyllabus = [...(activeExam.syllabus || []), { id: Date.now().toString(), topic: newTopic, completed: false }];
        const updatedExams = exams.map(e => e.id === activeExam.id ? { ...e, syllabus: updatedSyllabus } : e);
        saveExams(updatedExams);
        setActiveExam({ ...activeExam, syllabus: updatedSyllabus });
        setNewTopic('');
    };

    const toggleTopic = (topicId: string) => {
        if (!activeExam) return;
        const updatedSyllabus = (activeExam.syllabus || []).map(t => t.id === topicId ? { ...t, completed: !t.completed } : t);
        const updatedExams = exams.map(e => e.id === activeExam.id ? { ...e, syllabus: updatedSyllabus } : e);
        saveExams(updatedExams);
        setActiveExam({ ...activeExam, syllabus: updatedSyllabus });
    };

    const deleteTopic = (topicId: string) => {
        if (!activeExam) return;
        const updatedSyllabus = (activeExam.syllabus || []).filter(t => t.id !== topicId);
        const updatedExams = exams.map(e => e.id === activeExam.id ? { ...e, syllabus: updatedSyllabus } : e);
        saveExams(updatedExams);
        setActiveExam({ ...activeExam, syllabus: updatedSyllabus });
    };

    const getProgress = (syllabus: SyllabusItem[] = []) => {
        if (syllabus.length === 0) return 0;
        const completed = syllabus.filter(i => i.completed).length;
        return Math.round((completed / syllabus.length) * 100);
    };

    const getCountdown = (examDate: string, examTime: string) => {
        const exam = new Date(`${examDate}T${examTime}`);
        const days = differenceInDays(exam, new Date());
        if (isPast(exam)) return { text: 'Done', status: 'past' };
        if (isToday(exam)) return { text: 'Today!', status: 'today' };
        if (days === 1) return { text: 'Tomorrow', status: 'soon' };
        if (days <= 7) return { text: `${days}d left`, status: 'soon' };
        return { text: `${days}d left`, status: 'normal' };
    };

    const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const upcomingExams = sortedExams.filter(e => !isPast(new Date(`${e.date}T${e.time}`)));
    const pastExams = sortedExams.filter(e => isPast(new Date(`${e.date}T${e.time}`)));

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '100px' },
        header: { background: isDarkMode ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' : 'linear-gradient(135deg, #F0FFF0 0%, #F7F7F7 100%)', padding: '24px 16px 32px', borderRadius: '0 0 32px 32px' },
        title: { fontSize: '28px', fontWeight: 800, color: text, display: 'flex', alignItems: 'center', gap: '12px' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '20px 16px' },
        statCard: { background: card, borderRadius: '18px', padding: '20px 16px', textAlign: 'center' as const, border: `1px solid ${border}` },
        statNumber: (color: string) => ({ fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }),
        statLabel: { fontSize: '12px', color: muted, marginTop: '6px', fontWeight: 500 },
        content: { padding: '0 16px' },
        sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
        sectionTitle: { fontSize: '18px', fontWeight: 700, color: text, display: 'flex', alignItems: 'center', gap: '8px' },
        calendarBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' },
        emptyCard: { background: card, borderRadius: '24px', padding: '48px 24px', textAlign: 'center' as const, border: `1px solid ${border}` },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { color: muted, marginBottom: '20px', fontSize: '15px' },
        addBtn: { padding: '14px 32px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', borderRadius: '16px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
        examCard: (color: string, i: number) => ({ background: card, borderRadius: '18px', padding: '18px', marginBottom: '12px', border: `1px solid ${border}`, borderLeft: `4px solid ${color}`, animation: `fadeInUp 0.4s ease ${i * 0.05}s both`, cursor: 'pointer' }),
        examHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
        examName: { fontSize: '16px', fontWeight: 700, color: text, marginBottom: '4px' },
        examSubject: { fontSize: '14px', color: muted },
        badge: (status: string) => {
            const colors: Record<string, { bg: string; text: string }> = {
                today: { bg: isDarkMode ? '#7F1D1D' : '#FEE2E2', text: '#EF4444' },
                soon: { bg: isDarkMode ? '#78350F' : '#FEF3C7', text: '#F59E0B' },
                normal: { bg: isDarkMode ? '#312E81' : '#E0E7FF', text: '#4F46E5' },
                past: { bg: isDarkMode ? '#374151' : '#F3F4F6', text: muted }
            };
            const c = colors[status] || colors.normal;
            return { padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, background: c.bg, color: c.text };
        },
        examFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' },
        examDate: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: muted },
        progressBar: { width: '100%', height: '6px', background: isDarkMode ? '#334155' : '#E2E8F0', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' },
        progressFill: (p: number, c: string) => ({ width: `${p}%`, height: '100%', background: c, transition: 'width 0.5s ease', borderRadius: '3px' }),
        progressText: { fontSize: '12px', color: muted, marginTop: '4px', textAlign: 'right' as const },
        actionBtns: { display: 'flex', gap: '4px' },
        iconBtn: { padding: '8px', borderRadius: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: muted },
        fab: { position: 'fixed' as const, bottom: '110px', right: '20px', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px', backdropFilter: 'blur(4px)' },
        modalContent: { background: card, borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto' as const, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: text },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        label: { display: 'block', fontSize: '12px', fontWeight: 600, color: muted, marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
        input: { width: '100%', padding: '14px', background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, fontSize: '15px', outline: 'none', marginBottom: '16px', color: text, boxSizing: 'border-box' as const },
        colorPicker: { display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '16px' },
        colorBtn: (c: string, selected: boolean) => ({ width: '36px', height: '36px', borderRadius: '50%', background: c, border: 'none', cursor: 'pointer', transform: selected ? 'scale(1.2)' : 'scale(1)', boxShadow: selected ? `0 4px 12px ${c}50` : 'none' }),
        submitBtn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', borderRadius: '16px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
        syllabusList: { marginTop: '16px' },
        syllabusItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: inputBg, marginBottom: '8px', cursor: 'pointer' },
        topicText: (completed: boolean) => ({ flex: 1, fontSize: '15px', color: text, textDecoration: completed ? 'line-through' : 'none', opacity: completed ? 0.6 : 1 }),
        addTopicBox: { display: 'flex', gap: '8px', marginTop: '16px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}><h1 style={styles.title}><MdSchool style={{ color: '#4F46E5' }} />Exams</h1></div>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}><div style={styles.statNumber('#4F46E5')}>{upcomingExams.length}</div><div style={styles.statLabel}>Upcoming</div></div>
                <div style={styles.statCard}><div style={styles.statNumber('#F59E0B')}>{upcomingExams.filter(e => getCountdown(e.date, e.time).status === 'soon').length}</div><div style={styles.statLabel}>This Week</div></div>
                <div style={styles.statCard}><div style={styles.statNumber('#10B981')}>{pastExams.length}</div><div style={styles.statLabel}>Completed</div></div>
            </div>

            <div style={styles.content}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}><MdTimer style={{ color: '#4F46E5' }} />Upcoming Exams</h2>
                    <button style={styles.calendarBtn} onClick={() => navigate('/exams/calendar')}><MdCalendarToday size={16} />Calendar</button>
                </div>

                {upcomingExams.length === 0 ? (
                    <div style={styles.emptyCard}><div style={styles.emptyIcon}>📚</div><p style={styles.emptyText}>No upcoming exams</p><button style={styles.addBtn} onClick={() => openModal()}>Add Your First Exam</button></div>
                ) : (
                    upcomingExams.map((exam, i) => {
                        const countdown = getCountdown(exam.date, exam.time);
                        const progress = getProgress(exam.syllabus);
                        return (
                            <div key={exam.id} style={styles.examCard(exam.color, i)} onClick={() => openSyllabus(exam)}>
                                <div style={styles.examHeader}>
                                    <div><h3 style={styles.examName}>{exam.name}</h3><p style={styles.examSubject}>{exam.subject}</p></div>
                                    <span style={styles.badge(countdown.status)}>{countdown.text}</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div style={styles.progressFill(progress, exam.color)} />
                                </div>
                                <div style={styles.progressText}>{progress}% Syllabus Complete</div>

                                <div style={styles.examFooter}>
                                    <div style={styles.examDate}><MdCalendarToday size={14} />{format(new Date(exam.date), 'MMM d, yyyy')} • {exam.time}</div>
                                    <div style={styles.actionBtns}>
                                        <button style={styles.iconBtn} onClick={(e) => { e.stopPropagation(); openModal(exam); }}><MdEdit size={18} /></button>
                                        <button style={styles.iconBtn} onClick={(e) => deleteExam(exam.id, e)}><MdDelete size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {pastExams.length > 0 && (
                    <div style={{ marginTop: '32px', opacity: 0.7 }}>
                        <h2 style={{ ...styles.sectionTitle, color: muted }}>Completed</h2>
                        {pastExams.slice(0, 3).map((exam, i) => (
                            <div key={exam.id} style={{ ...styles.examCard(exam.color, 0), opacity: 0.6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ ...styles.examName, textDecoration: 'line-through' }}>{exam.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={styles.badge('past')}>✓ Done</span>
                                        <button style={styles.iconBtn} onClick={(e) => deleteExam(exam.id, e)}><MdDelete size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button style={styles.fab} onClick={() => openModal()}><MdAdd size={28} /></button>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}><span style={styles.modalTitle}>{editingExam ? 'Edit Exam' : 'Add Exam'}</span><button style={styles.closeBtn} onClick={() => setShowModal(false)}><MdClose size={20} /></button></div>
                        <label style={styles.label}>Exam Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Final Exam" style={styles.input} />
                        <label style={styles.label}>Subject</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Mathematics" style={styles.input} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div><label style={styles.label}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} /></div>
                            <div><label style={styles.label}>Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} style={styles.input} /></div>
                        </div>
                        <label style={styles.label}>Color</label><div style={styles.colorPicker}>{examColors.map(c => <button key={c} onClick={() => setColor(c)} style={styles.colorBtn(c, color === c)} />)}</div>
                        <label style={styles.label}>Notes (Optional)</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes..." style={{ ...styles.input, minHeight: '80px', resize: 'none' }} />
                        <button onClick={saveExam} style={styles.submitBtn}>{editingExam ? 'Update' : 'Add Exam'}</button>
                    </div>
                </div>
            )}

            {/* Syllabus Modal */}
            {showSyllabusModal && activeExam && (
                <div style={styles.modal} onClick={() => setShowSyllabusModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                <span style={styles.modalTitle}>Syllabus Tracker</span>
                                <div style={{ fontSize: '14px', color: muted }}>{activeExam.name}</div>
                            </div>
                            <button style={styles.closeBtn} onClick={() => setShowSyllabusModal(false)}><MdClose size={20} /></button>
                        </div>

                        <div style={styles.progressBar}>
                            <div style={styles.progressFill(getProgress(activeExam.syllabus), activeExam.color)} />
                        </div>
                        <div style={{ ...styles.progressText, textAlign: 'center', marginBottom: '24px' }}>
                            {getProgress(activeExam.syllabus)}% Completed
                        </div>

                        <div style={styles.addTopicBox}>
                            <input
                                type="text"
                                value={newTopic}
                                onChange={e => setNewTopic(e.target.value)}
                                placeholder="Add topic (e.g., Algebra Ch.1)"
                                onKeyDown={e => e.key === 'Enter' && addTopic()}
                                style={{ ...styles.input, marginBottom: 0 }}
                            />
                            <button onClick={addTopic} style={{ ...styles.submitBtn, width: 'auto', padding: '14px' }}><MdAdd size={20} /></button>
                        </div>

                        <div style={styles.syllabusList}>
                            {(activeExam.syllabus || []).length === 0 ? (
                                <div style={{ textAlign: 'center', color: muted, padding: '20px' }}>No topics added yet.</div>
                            ) : (
                                (activeExam.syllabus || []).map(topic => (
                                    <div key={topic.id} style={styles.syllabusItem} onClick={() => toggleTopic(topic.id)}>
                                        {topic.completed ? <MdCheckCircle color={activeExam.color} size={22} /> : <MdRadioButtonUnchecked color={muted} size={22} />}
                                        <span style={styles.topicText(topic.completed)}>{topic.topic}</span>
                                        <button style={{ ...styles.iconBtn, color: '#EF4444' }} onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}>
                                            <MdClose size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } input:focus, textarea:focus { border-color: #4F46E5 !important; }`}</style>
        </div>
    );
};

export default ExamsSection;

