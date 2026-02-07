import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdDelete, MdCheck, MdClose, MdFlag, MdCalendarToday } from 'react-icons/md';
import { format } from 'date-fns';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: string;
    dueDate?: string;
    createdAt: string;
}

const categories = [
    { id: 'study', name: 'Study', color: '#4F46E5', emoji: '📚' },
    { id: 'personal', name: 'Personal', color: '#10B981', emoji: '🏠' },
    { id: 'work', name: 'Work', color: '#F59E0B', emoji: '💼' },
    { id: 'health', name: 'Health', color: '#EC4899', emoji: '💪' },
];

const priorities = [
    { id: 'low', name: 'Low', color: '#10B981' },
    { id: 'medium', name: 'Medium', color: '#F59E0B' },
    { id: 'high', name: 'High', color: '#EF4444' },
];

const TaskManager: React.FC = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
    const [category, setCategory] = useState('study');
    const [dueDate, setDueDate] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => { const saved = localStorage.getItem('studyone_tasks'); if (saved) setTasks(JSON.parse(saved)); }, []);
    const saveTasks = (t: Task[]) => { setTasks(t); localStorage.setItem('studyone_tasks', JSON.stringify(t)); };

    const addTask = () => {
        if (!title.trim()) return;
        const newTask: Task = { id: Date.now().toString(), title: title.trim(), completed: false, priority, category, dueDate: dueDate || undefined, createdAt: new Date().toISOString() };
        saveTasks([newTask, ...tasks]);
        setShowModal(false);
        setTitle(''); setPriority('medium'); setCategory('study'); setDueDate('');
    };

    const toggleTask = (id: string) => { saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); };
    const confirmDelete = (id: string) => setDeleteId(id);
    const handleDelete = () => {
        if (deleteId) {
            saveTasks(tasks.filter(t => t.id !== deleteId));
            setDeleteId(null);
            showToast('Task deleted successfully', 'success');
        }
    };

    const filteredTasks = filter === 'all' ? tasks : filter === 'completed' ? tasks.filter(t => t.completed) : filter === 'pending' ? tasks.filter(t => !t.completed) : tasks.filter(t => t.category === filter);
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.filter(t => !t.completed).length;
    const todayTasks = tasks.filter(t => t.dueDate === format(new Date(), 'yyyy-MM-dd') && !t.completed);

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', borderBottom: '1px solid #E2E8F0' },
        iconBtn: (active?: boolean) => ({ width: '44px', height: '44px', borderRadius: '14px', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? 'white' : '#64748B', boxShadow: active ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none' }),
        title: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        content: { padding: '20px 16px' },
        statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' },
        statCard: (color: string) => ({ background: 'white', borderRadius: '18px', padding: '20px', textAlign: 'center' as const, border: '1px solid #E2E8F0' }),
        statValue: (color: string) => ({ fontSize: '28px', fontWeight: 700, color }),
        statLabel: { fontSize: '12px', color: '#64748B', marginTop: '4px' },
        todayBanner: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: '20px', padding: '20px', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' },
        todayIcon: { width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        todayText: { flex: 1 },
        todayTitle: { fontSize: '16px', fontWeight: 700, marginBottom: '4px' },
        todaySubtitle: { fontSize: '14px', opacity: 0.9 },
        filterScroll: { display: 'flex', gap: '8px', overflowX: 'auto' as const, marginBottom: '20px', paddingBottom: '8px' },
        filterBtn: (active: boolean) => ({ padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' as const, background: active ? '#1E293B' : 'white', color: active ? 'white' : '#64748B', boxShadow: active ? '0 4px 12px rgba(0,0,0,0.15)' : 'none' }),
        taskCard: (completed: boolean, i: number) => ({ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px', opacity: completed ? 0.6 : 1, animation: `fadeInUp 0.3s ease ${i * 0.03}s both` }),
        checkbox: (completed: boolean, color: string) => ({ width: '28px', height: '28px', borderRadius: '10px', border: `2px solid ${completed ? '#10B981' : color}`, background: completed ? '#10B981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }),
        taskContent: { flex: 1, minWidth: 0 },
        taskTitle: (completed: boolean) => ({ fontSize: '15px', fontWeight: 600, color: '#1E293B', textDecoration: completed ? 'line-through' : 'none' }),
        taskMeta: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' as const },
        categoryBadge: (color: string) => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: `${color}15`, color }),
        dateBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#64748B', background: '#F7F7F7' },
        deleteBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 },
        emptyState: { background: 'white', borderRadius: '24px', padding: '48px 24px', textAlign: 'center' as const, border: '1px solid #E2E8F0' },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#64748B', marginBottom: '24px' },
        createBtn: { padding: '16px 32px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
        fab: { position: 'fixed' as const, bottom: '110px', right: '20px', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)', zIndex: 50 },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: 'white', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '420px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1E293B' },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        label: { fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '8px', display: 'block' },
        input: { width: '100%', padding: '14px', fontSize: '16px', background: '#F7F7F7', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', marginBottom: '16px' },
        optionsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '16px' },
        optionBtn: (active: boolean, color: string) => ({ padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', background: active ? color : '#F7F7F7', color: active ? 'white' : '#64748B' }),
        saveBtn: { width: '100%', padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'white', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
    };

    const getCategoryInfo = (id: string) => categories.find(c => c.id === id) || categories[0];
    const getPriorityInfo = (id: string) => priorities.find(p => p.id === id) || priorities[1];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn()} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Tasks</span>
                <button style={styles.iconBtn(true)} onClick={() => setShowModal(true)}><MdAdd size={22} /></button>
            </div>

            <div style={styles.content}>
                <div style={styles.statsRow}>
                    <div style={styles.statCard('#4F46E5')}><div style={styles.statValue('#4F46E5')}>{tasks.length}</div><div style={styles.statLabel}>Total</div></div>
                    <div style={styles.statCard('#F59E0B')}><div style={styles.statValue('#F59E0B')}>{pendingCount}</div><div style={styles.statLabel}>Pending</div></div>
                    <div style={styles.statCard('#10B981')}><div style={styles.statValue('#10B981')}>{completedCount}</div><div style={styles.statLabel}>Done</div></div>
                </div>

                {todayTasks.length > 0 && (
                    <div style={styles.todayBanner}>
                        <div style={styles.todayIcon}><MdCalendarToday size={24} /></div>
                        <div style={styles.todayText}><div style={styles.todayTitle}>Today's Tasks</div><div style={styles.todaySubtitle}>{todayTasks.length} tasks due today</div></div>
                    </div>
                )}

                <div style={styles.filterScroll}>
                    {[{ id: 'all', name: 'All' }, { id: 'pending', name: 'Pending' }, { id: 'completed', name: 'Done' }, ...categories].map(f => (
                        <button key={f.id} style={styles.filterBtn(filter === f.id)} onClick={() => setFilter(f.id)}>{f.name}</button>
                    ))}
                </div>

                {filteredTasks.length === 0 ? (
                    <div style={styles.emptyState}><div style={styles.emptyIcon}>✅</div><div style={styles.emptyText}>No tasks yet</div><button style={styles.createBtn} onClick={() => setShowModal(true)}>Add Task</button></div>
                ) : (
                    filteredTasks.map((task, i) => {
                        const cat = getCategoryInfo(task.category);
                        const pri = getPriorityInfo(task.priority);
                        return (
                            <div key={task.id} style={styles.taskCard(task.completed, i)}>
                                <div style={styles.checkbox(task.completed, pri.color)} onClick={() => toggleTask(task.id)}>{task.completed && <MdCheck size={16} color="white" />}</div>
                                <div style={styles.taskContent}>
                                    <div style={styles.taskTitle(task.completed)}>{task.title}</div>
                                    <div style={styles.taskMeta}>
                                        <span style={styles.categoryBadge(cat.color)}>{cat.emoji} {cat.name}</span>
                                        <span style={styles.categoryBadge(pri.color)}><MdFlag size={12} />{pri.name}</span>
                                        {task.dueDate && <span style={styles.dateBadge}><MdCalendarToday size={12} />{format(new Date(task.dueDate), 'MMM d')}</span>}
                                    </div>
                                </div>
                                <button style={styles.deleteBtn} onClick={() => confirmDelete(task.id)}><MdDelete size={18} /></button>
                            </div>
                        );
                    })
                )}
            </div>

            <button style={styles.fab} onClick={() => setShowModal(true)}><MdAdd size={28} /></button>

            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}><span style={styles.modalTitle}>New Task</span><button style={styles.closeBtn} onClick={() => setShowModal(false)}><MdClose size={20} /></button></div>
                        <label style={styles.label}>Task Title</label><input style={styles.input} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" />
                        <label style={styles.label}>Category</label><div style={styles.optionsRow}>{categories.map(c => <button key={c.id} style={styles.optionBtn(category === c.id, c.color)} onClick={() => setCategory(c.id)}>{c.emoji} {c.name}</button>)}</div>
                        <label style={styles.label}>Priority</label><div style={styles.optionsRow}>{priorities.map(p => <button key={p.id} style={styles.optionBtn(priority === p.id, p.color)} onClick={() => setPriority(p.id as Task['priority'])}>{p.name}</button>)}</div>
                        <label style={styles.label}>Due Date (Optional)</label><input style={styles.input} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        <button style={styles.saveBtn} onClick={addTask}>Add Task</button>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } input:focus { border-color: #4F46E5 !important; } div::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
};

export default TaskManager;
