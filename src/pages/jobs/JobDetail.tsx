import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdDelete, MdOpenInNew, MdLocationOn, MdAccessTime, MdAttachMoney, MdNotes, MdClose } from 'react-icons/md';
import { format, differenceInDays } from 'date-fns';

interface Job {
    id: string;
    company: string;
    position: string;
    location: string;
    dateApplied: string;
    status: 'applied' | 'interview' | 'offer' | 'rejected' | 'pending';
    salary?: string;
    notes?: string;
    url?: string;
}

const statusConfig: Record<string, { label: string; color: string; gradient: string }> = {
    applied: { label: 'Applied', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
    interview: { label: 'Interview', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' },
    offer: { label: 'Offer', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
    rejected: { label: 'Rejected', color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' },
    pending: { label: 'Pending', color: '#6B7280', gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)' },
};

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editStatus, setEditStatus] = useState<Job['status']>('applied');
    const [editNotes, setEditNotes] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('studyone_jobs');
        if (saved) {
            const found = JSON.parse(saved).find((j: Job) => j.id === id);
            if (found) { setJob(found); setEditStatus(found.status); setEditNotes(found.notes || ''); }
        }
    }, [id]);

    const updateJob = () => {
        if (!job) return;
        const saved = localStorage.getItem('studyone_jobs');
        if (saved) {
            const jobs: Job[] = JSON.parse(saved);
            localStorage.setItem('studyone_jobs', JSON.stringify(jobs.map(j => j.id === id ? { ...j, status: editStatus, notes: editNotes } : j)));
            setJob({ ...job, status: editStatus, notes: editNotes });
        }
        setShowModal(false);
    };

    const deleteJob = () => {
        if (confirm('Delete this job application?')) {
            const saved = localStorage.getItem('studyone_jobs');
            if (saved) localStorage.setItem('studyone_jobs', JSON.stringify(JSON.parse(saved).filter((j: Job) => j.id !== id)));
            navigate('/jobs');
        }
    };

    const styles = {
        container: { minHeight: '100vh', background: '#F8FAFC', paddingBottom: '100px' },
        header: (gradient: string) => ({ padding: '20px 16px 80px', background: gradient }),
        headerNav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
        actionBtns: { display: 'flex', gap: '8px' },
        headerContent: { textAlign: 'center' as const, color: 'white' },
        avatar: { width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, margin: '0 auto 16px' },
        position: { fontSize: '26px', fontWeight: 700, marginBottom: '4px' },
        company: { fontSize: '16px', opacity: 0.9 },
        contentCard: { margin: '-48px 16px 0', background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' },
        statusBadge: (color: string) => ({ display: 'flex', justifyContent: 'center', marginTop: '-44px', marginBottom: '20px' }),
        badge: (color: string) => ({ padding: '10px 24px', borderRadius: '14px', fontSize: '14px', fontWeight: 700, color: 'white', background: color, boxShadow: `0 8px 24px ${color}40` }),
        detailRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#F9FAFB', borderRadius: '16px', marginBottom: '12px' },
        detailIcon: (color: string) => ({ width: '48px', height: '48px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
        detailLabel: { fontSize: '12px', color: '#9CA3AF' },
        detailValue: { fontSize: '15px', fontWeight: 600, color: '#1F2937' },
        linkBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: '#6366F115', borderRadius: '16px', fontSize: '15px', fontWeight: 600, color: '#6366F1', textDecoration: 'none' },
        timelineSection: { marginTop: '32px', padding: '0 16px' },
        timelineTitle: { fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '20px' },
        timeline: { position: 'relative' as const, paddingLeft: '28px', borderLeft: '2px solid #E5E7EB' },
        timelineItem: { position: 'relative' as const, marginBottom: '16px' },
        timelineDot: (color: string) => ({ position: 'absolute' as const, left: '-35px', width: '16px', height: '16px', borderRadius: '50%', background: color }),
        timelineCard: { background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' },
        timelineCardTitle: { fontSize: '15px', fontWeight: 700, color: '#1F2937' },
        timelineCardDate: { fontSize: '12px', color: '#9CA3AF', marginTop: '4px' },
        modal: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: 'white', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '420px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1F2937' },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' },
        label: { fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' },
        select: { width: '100%', padding: '16px', fontSize: '16px', background: '#F9FAFB', borderRadius: '14px', border: 'none', cursor: 'pointer', marginBottom: '16px' },
        textarea: { width: '100%', padding: '16px', fontSize: '15px', background: '#F9FAFB', borderRadius: '14px', border: 'none', outline: 'none', resize: 'none' as const, height: '100px', marginBottom: '16px' },
        saveBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'white', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' },
        loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        spinner: { width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #E5E7EB', borderTopColor: '#6366F1', animation: 'spin 1s linear infinite' },
    };

    if (!job) return <div style={styles.loading}><div style={styles.spinner} /></div>;

    const statusInfo = statusConfig[job.status];
    const daysAgo = differenceInDays(new Date(), new Date(job.dateApplied));

    return (
        <div style={styles.container}>
            <div style={styles.header(statusInfo.gradient)}>
                <div style={styles.headerNav}>
                    <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                    <div style={styles.actionBtns}>
                        <button style={styles.iconBtn} onClick={() => setShowModal(true)}><MdEdit size={20} /></button>
                        <button style={styles.iconBtn} onClick={deleteJob}><MdDelete size={20} /></button>
                    </div>
                </div>
                <div style={styles.headerContent}>
                    <div style={styles.avatar}>{job.company.charAt(0).toUpperCase()}</div>
                    <div style={styles.position}>{job.position}</div>
                    <div style={styles.company}>{job.company}</div>
                </div>
            </div>

            <div style={styles.contentCard}>
                <div style={styles.statusBadge(statusInfo.color)}><span style={styles.badge(statusInfo.color)}>{statusInfo.label}</span></div>

                {job.location && (
                    <div style={styles.detailRow}>
                        <div style={styles.detailIcon('#6366F1')}><MdLocationOn size={24} color="#6366F1" /></div>
                        <div><div style={styles.detailLabel}>Location</div><div style={styles.detailValue}>{job.location}</div></div>
                    </div>
                )}
                <div style={styles.detailRow}>
                    <div style={styles.detailIcon('#F59E0B')}><MdAccessTime size={24} color="#F59E0B" /></div>
                    <div><div style={styles.detailLabel}>Applied</div><div style={styles.detailValue}>{format(new Date(job.dateApplied), 'MMMM d, yyyy')} ({daysAgo === 0 ? 'Today' : `${daysAgo}d ago`})</div></div>
                </div>
                {job.salary && (
                    <div style={styles.detailRow}>
                        <div style={styles.detailIcon('#10B981')}><MdAttachMoney size={24} color="#10B981" /></div>
                        <div><div style={styles.detailLabel}>Salary</div><div style={styles.detailValue}>{job.salary}</div></div>
                    </div>
                )}
                {job.notes && (
                    <div style={styles.detailRow}>
                        <div style={styles.detailIcon('#8B5CF6')}><MdNotes size={24} color="#8B5CF6" /></div>
                        <div><div style={styles.detailLabel}>Notes</div><div style={styles.detailValue}>{job.notes}</div></div>
                    </div>
                )}
                {job.url && <a href={job.url} target="_blank" rel="noopener noreferrer" style={styles.linkBtn}><MdOpenInNew size={20} />View Job Posting</a>}
            </div>

            <div style={styles.timelineSection}>
                <div style={styles.timelineTitle}>Application Timeline</div>
                <div style={styles.timeline}>
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineDot('#6366F1')} />
                        <div style={styles.timelineCard}><div style={styles.timelineCardTitle}>Application Submitted</div><div style={styles.timelineCardDate}>{format(new Date(job.dateApplied), 'MMM d, yyyy')}</div></div>
                    </div>
                    {job.status !== 'applied' && (
                        <div style={styles.timelineItem}>
                            <div style={styles.timelineDot(statusInfo.color)} />
                            <div style={styles.timelineCard}><div style={styles.timelineCardTitle}>Status: {statusInfo.label}</div><div style={styles.timelineCardDate}>Current status</div></div>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>Update Application</span>
                            <button style={styles.closeBtn} onClick={() => setShowModal(false)}><MdClose size={20} /></button>
                        </div>
                        <label style={styles.label}>Status</label>
                        <select style={styles.select} value={editStatus} onChange={e => setEditStatus(e.target.value as Job['status'])}>
                            {Object.entries(statusConfig).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                        </select>
                        <label style={styles.label}>Notes</label>
                        <textarea style={styles.textarea} value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Add notes..." />
                        <button style={styles.saveBtn} onClick={updateJob}>Save Changes</button>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default JobDetail;
