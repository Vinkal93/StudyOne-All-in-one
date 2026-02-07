import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdCheck, MdClose, MdEdit, MdDelete, MdCheckCircle, MdAssignment } from 'react-icons/md';
import { format } from 'date-fns';

interface FormItem {
    id: string;
    name: string;
    deadline: string;
    completed: boolean;
    steps: { id: string; name: string; completed: boolean; }[];
    notes?: string;
}

const FormTracker: React.FC = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState<FormItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingForm, setEditingForm] = useState<FormItem | null>(null);
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [steps, setSteps] = useState<string[]>(['']);

    useEffect(() => { const saved = localStorage.getItem('studyone_forms'); if (saved) setForms(JSON.parse(saved)); }, []);

    const saveForms = (updated: FormItem[]) => { setForms(updated); localStorage.setItem('studyone_forms', JSON.stringify(updated)); };

    const openModal = (form?: FormItem) => {
        if (form) { setEditingForm(form); setName(form.name); setDeadline(form.deadline); setSteps(form.steps.map(s => s.name)); }
        else { setEditingForm(null); setName(''); setDeadline(''); setSteps(['']); }
        setShowModal(true);
    };

    const saveForm = () => {
        if (!name.trim()) return;
        const formSteps = steps.filter(s => s.trim()).map((s, i) => ({ id: `step-${i}`, name: s.trim(), completed: editingForm?.steps[i]?.completed || false }));
        if (editingForm) saveForms(forms.map(f => f.id === editingForm.id ? { ...f, name, deadline, steps: formSteps } : f));
        else saveForms([...forms, { id: Date.now().toString(), name, deadline, completed: false, steps: formSteps }]);
        setShowModal(false);
    };

    const toggleStep = (formId: string, stepId: string) => {
        saveForms(forms.map(form => {
            if (form.id !== formId) return form;
            const updatedSteps = form.steps.map(step => step.id === stepId ? { ...step, completed: !step.completed } : step);
            return { ...form, steps: updatedSteps, completed: updatedSteps.every(s => s.completed) };
        }));
    };

    const deleteForm = (id: string) => { if (confirm('Delete this form?')) saveForms(forms.filter(f => f.id !== id)); };

    const getProgress = (form: FormItem) => form.steps.length === 0 ? 0 : Math.round((form.steps.filter(s => s.completed).length / form.steps.length) * 100);

    const styles = {
        container: { minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFC 0%, #DBEAFE 100%)', paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', position: 'sticky' as const, top: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)' },
        iconBtn: (active?: boolean) => ({ width: '44px', height: '44px', borderRadius: '14px', background: active ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? 'white' : '#6B7280', boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)' }),
        title: { fontSize: '18px', fontWeight: 700, color: '#1F2937' },
        content: { padding: '0 16px' },
        statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' },
        statCard: { background: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center' as const, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' },
        statValue: (color: string) => ({ fontSize: '32px', fontWeight: 700, color }),
        statLabel: { fontSize: '12px', color: '#9CA3AF', marginTop: '4px' },
        emptyState: { background: 'white', borderRadius: '24px', padding: '48px 24px', textAlign: 'center' as const, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#9CA3AF', marginBottom: '24px' },
        createBtn: { padding: '16px 32px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' },
        formCard: (completed: boolean, i: number) => ({ background: 'white', borderRadius: '20px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)', border: completed ? '2px solid #10B981' : '2px solid transparent', animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }),
        formHeader: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
        formTitle: (completed: boolean) => ({ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: 700, color: completed ? '#10B981' : '#1F2937' }),
        formDeadline: { fontSize: '12px', color: '#9CA3AF', marginTop: '4px' },
        actionBtns: { display: 'flex', gap: '4px' },
        actionBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#F9FAFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' },
        progressBar: { padding: '0 20px 12px' },
        progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF', marginBottom: '6px' },
        progressTrack: { height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' },
        progressFill: (progress: number) => ({ height: '100%', borderRadius: '4px', background: progress === 100 ? '#10B981' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', width: `${progress}%`, transition: 'width 0.5s ease' }),
        stepsContainer: { padding: '0 20px 20px' },
        stepBtn: (completed: boolean) => ({ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginBottom: '8px', background: completed ? '#10B98115' : '#F9FAFB', color: completed ? '#10B981' : '#6B7280' }),
        stepCheckbox: (completed: boolean) => ({ width: '24px', height: '24px', borderRadius: '8px', border: completed ? 'none' : '2px solid #D1D5DB', background: completed ? '#10B981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
        stepText: (completed: boolean) => ({ fontSize: '15px', fontWeight: 600, textDecoration: completed ? 'line-through' : 'none' }),
        fab: { position: 'fixed' as const, bottom: '100px', right: '20px', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)', zIndex: 50 },
        modal: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: 'white', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto' as const },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1F2937' },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' },
        label: { fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' },
        input: { width: '100%', padding: '16px', fontSize: '16px', background: '#F9FAFB', borderRadius: '14px', border: '2px solid transparent', outline: 'none', marginBottom: '16px' },
        stepInputRow: { display: 'flex', gap: '8px', marginBottom: '8px' },
        addStepBtn: { width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 600, border: '2px dashed #E5E7EB', background: 'transparent', color: '#9CA3AF', cursor: 'pointer', marginBottom: '16px' },
        saveBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'white', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' },
    };

    const pendingForms = forms.filter(f => !f.completed).length;
    const completedForms = forms.filter(f => f.completed).length;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn()} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Form Tracker</span>
                <button style={styles.iconBtn(true)} onClick={() => openModal()}><MdAdd size={22} /></button>
            </div>

            <div style={styles.content}>
                <div style={styles.statsRow}>
                    <div style={styles.statCard}><div style={styles.statValue('#F59E0B')}>{pendingForms}</div><div style={styles.statLabel}>In Progress</div></div>
                    <div style={styles.statCard}><div style={styles.statValue('#10B981')}>{completedForms}</div><div style={styles.statLabel}>Completed</div></div>
                </div>

                {forms.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📝</div>
                        <div style={styles.emptyText}>No forms being tracked</div>
                        <button style={styles.createBtn} onClick={() => openModal()}>Add Form</button>
                    </div>
                ) : forms.map((form, i) => (
                    <div key={form.id} style={styles.formCard(form.completed, i)}>
                        <div style={styles.formHeader}>
                            <div>
                                <div style={styles.formTitle(form.completed)}>{form.completed && <MdCheckCircle size={20} />}{form.name}</div>
                                {form.deadline && <div style={styles.formDeadline}>Deadline: {format(new Date(form.deadline), 'MMM d, yyyy')}</div>}
                            </div>
                            <div style={styles.actionBtns}>
                                <button style={styles.actionBtn} onClick={() => openModal(form)}><MdEdit size={16} /></button>
                                <button style={styles.actionBtn} onClick={() => deleteForm(form.id)}><MdDelete size={16} /></button>
                            </div>
                        </div>
                        <div style={styles.progressBar}>
                            <div style={styles.progressLabel}><span>Progress</span><span style={{ color: getProgress(form) === 100 ? '#10B981' : '#6B7280', fontWeight: 600 }}>{getProgress(form)}%</span></div>
                            <div style={styles.progressTrack}><div style={styles.progressFill(getProgress(form))} /></div>
                        </div>
                        {form.steps.length > 0 && (
                            <div style={styles.stepsContainer}>
                                {form.steps.map(step => (
                                    <button key={step.id} style={styles.stepBtn(step.completed)} onClick={() => toggleStep(form.id, step.id)}>
                                        <div style={styles.stepCheckbox(step.completed)}>{step.completed && <MdCheck size={14} color="white" />}</div>
                                        <span style={styles.stepText(step.completed)}>{step.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button style={styles.fab} onClick={() => openModal()}><MdAdd size={28} /></button>

            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>{editingForm ? 'Edit Form' : 'New Form'}</span>
                            <button style={styles.closeBtn} onClick={() => setShowModal(false)}><MdClose size={20} /></button>
                        </div>
                        <label style={styles.label}>Form Name</label>
                        <input style={styles.input} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., GATE Application" />
                        <label style={styles.label}>Deadline</label>
                        <input style={styles.input} type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                        <label style={styles.label}>Steps / Checklist</label>
                        {steps.map((step, i) => (
                            <div key={i} style={styles.stepInputRow}>
                                <input style={{ ...styles.input, marginBottom: 0, flex: 1 }} type="text" value={step} onChange={e => { const u = [...steps]; u[i] = e.target.value; setSteps(u); }} placeholder={`Step ${i + 1}`} />
                                {steps.length > 1 && <button style={styles.closeBtn} onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}><MdClose size={18} /></button>}
                            </div>
                        ))}
                        <button style={styles.addStepBtn} onClick={() => setSteps([...steps, ''])}>+ Add Step</button>
                        <button style={styles.saveBtn} onClick={saveForm}>{editingForm ? 'Update Form' : 'Add Form'}</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                input:focus { border-color: #6366F1 !important; }
            `}</style>
        </div>
    );
};

export default FormTracker;
