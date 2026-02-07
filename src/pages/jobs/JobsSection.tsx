import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdWork, MdAdd, MdAccessTime, MdLocationOn, MdDescription, MdChevronRight, MdClose } from 'react-icons/md';
import { differenceInDays } from 'date-fns';

interface Job { id: string; company: string; position: string; location: string; dateApplied: string; status: 'applied' | 'interview' | 'offer' | 'rejected' | 'pending'; salary?: string; notes?: string; url?: string; }

const statusConfig = {
    applied: { label: 'Applied', color: '#3B82F6', bg: '#DBEAFE' },
    interview: { label: 'Interview', color: '#F59E0B', bg: '#FEF3C7' },
    offer: { label: 'Offer', color: '#10B981', bg: '#D1FAE5' },
    rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEE2E2' },
    pending: { label: 'Pending', color: '#6B7280', bg: '#F3F4F6' },
};

const JobsSection: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<Job['status']>('applied');
    const [salary, setSalary] = useState('');

    useEffect(() => { const saved = localStorage.getItem('studyone_jobs'); if (saved) setJobs(JSON.parse(saved)); }, []);
    const saveJobs = (updated: Job[]) => { setJobs(updated); localStorage.setItem('studyone_jobs', JSON.stringify(updated)); };

    const addJob = () => {
        if (!company.trim() || !position.trim()) return;
        saveJobs([{ id: Date.now().toString(), company, position, location, dateApplied: new Date().toISOString(), status, salary }, ...jobs]);
        setShowModal(false);
        setCompany(''); setPosition(''); setLocation(''); setStatus('applied'); setSalary('');
    };

    const filteredJobs = activeFilter === 'all' ? jobs : jobs.filter(j => j.status === activeFilter);
    const stats = { total: jobs.length, applied: jobs.filter(j => j.status === 'applied').length, interviews: jobs.filter(j => j.status === 'interview').length, offers: jobs.filter(j => j.status === 'offer').length };
    const filters = [{ id: 'all', label: 'All', count: stats.total }, { id: 'applied', label: 'Applied', count: stats.applied }, { id: 'interview', label: 'Interviews', count: stats.interviews }, { id: 'offer', label: 'Offers', count: stats.offers }];

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '100px' },
        header: { background: 'linear-gradient(135deg, #F0FFFF 0%, #F7F7F7 100%)', padding: '24px 16px 32px', borderRadius: '0 0 32px 32px' },
        title: { fontSize: '28px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '12px' },
        statsCard: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: '20px', padding: '24px', margin: '20px 16px', color: 'white', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
        statItem: { textAlign: 'center' as const },
        statNumber: { fontSize: '24px', fontWeight: 700, lineHeight: 1 },
        statLabel: { fontSize: '11px', opacity: 0.9, marginTop: '4px', fontWeight: 500, textTransform: 'uppercase' as const },
        content: { padding: '0 16px' },
        quickActions: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' },
        actionCard: (color: string) => ({ background: 'white', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }),
        actionIcon: (color: string) => ({ width: '48px', height: '48px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }),
        actionTitle: { fontSize: '14px', fontWeight: 700, color: '#1E293B' },
        actionSubtitle: { fontSize: '12px', color: '#64748B' },
        filterScroll: { display: 'flex', gap: '8px', overflowX: 'auto' as const, marginBottom: '20px', paddingBottom: '8px' },
        filterBtn: (active: boolean) => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '14px', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' as const, border: 'none', cursor: 'pointer', background: active ? '#1E293B' : 'white', color: active ? 'white' : '#64748B', boxShadow: active ? '0 4px 12px rgba(0,0,0,0.15)' : 'none' }),
        filterCount: (active: boolean) => ({ padding: '2px 8px', borderRadius: '8px', fontSize: '12px', background: active ? 'rgba(255,255,255,0.2)' : '#F3F4F6' }),
        emptyCard: { background: 'white', borderRadius: '24px', padding: '48px 24px', textAlign: 'center' as const, border: '1px solid #E2E8F0' },
        emptyIcon: { width: '72px', height: '72px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#94A3B8' },
        emptyText: { color: '#64748B', marginBottom: '20px', fontSize: '15px' },
        addBtn: { padding: '14px 32px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', borderRadius: '16px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
        jobCard: (i: number) => ({ background: 'white', borderRadius: '18px', padding: '18px', marginBottom: '12px', border: '1px solid #E2E8F0', cursor: 'pointer', animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }),
        jobHeader: { display: 'flex', gap: '14px', alignItems: 'flex-start' },
        companyAvatar: (color: string) => ({ width: '48px', height: '48px', borderRadius: '14px', background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 700, flexShrink: 0 }),
        jobInfo: { flex: 1, minWidth: 0 },
        jobPosition: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '2px' },
        jobCompany: { fontSize: '14px', color: '#64748B' },
        jobFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F3F4F6' },
        jobMeta: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748B' },
        metaItem: { display: 'flex', alignItems: 'center', gap: '4px' },
        statusBadge: (status: keyof typeof statusConfig) => ({ padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, background: statusConfig[status].bg, color: statusConfig[status].color }),
        fab: { position: 'fixed' as const, bottom: '100px', right: '20px', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: 'white', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '420px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1E293B' },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
        input: { width: '100%', padding: '14px', background: '#F7F7F7', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none', marginBottom: '16px' },
        submitBtn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', borderRadius: '16px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}><h1 style={styles.title}><MdWork style={{ color: '#4F46E5' }} />Jobs</h1></div>

            <div style={styles.statsCard}>
                <div style={styles.statsGrid}>
                    <div style={styles.statItem}><div style={styles.statNumber}>{stats.total}</div><div style={styles.statLabel}>Total</div></div>
                    <div style={styles.statItem}><div style={styles.statNumber}>{stats.applied}</div><div style={styles.statLabel}>Applied</div></div>
                    <div style={styles.statItem}><div style={styles.statNumber}>{stats.interviews}</div><div style={styles.statLabel}>Interviews</div></div>
                    <div style={styles.statItem}><div style={styles.statNumber}>{stats.offers}</div><div style={styles.statLabel}>Offers</div></div>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.quickActions}>
                    <div style={styles.actionCard('#7C3AED')} onClick={() => navigate('/jobs/form-tracker')}>
                        <div style={styles.actionIcon('#7C3AED')}><MdDescription size={22} /></div>
                        <div><div style={styles.actionTitle}>Form Tracker</div><div style={styles.actionSubtitle}>Track applications</div></div>
                    </div>
                    <div style={styles.actionCard('#10B981')} onClick={() => setShowModal(true)}>
                        <div style={styles.actionIcon('#10B981')}><MdAdd size={22} /></div>
                        <div><div style={styles.actionTitle}>Add Job</div><div style={styles.actionSubtitle}>New application</div></div>
                    </div>
                </div>

                <div style={styles.filterScroll}>
                    {filters.map(f => <button key={f.id} onClick={() => setActiveFilter(f.id)} style={styles.filterBtn(activeFilter === f.id)}>{f.label}<span style={styles.filterCount(activeFilter === f.id)}>{f.count}</span></button>)}
                </div>

                {filteredJobs.length === 0 ? (
                    <div style={styles.emptyCard}><div style={styles.emptyIcon}><MdWork size={32} /></div><p style={styles.emptyText}>{activeFilter === 'all' ? 'No jobs tracked yet' : `No ${activeFilter} jobs`}</p><button style={styles.addBtn} onClick={() => setShowModal(true)}>Add Your First Job</button></div>
                ) : (
                    filteredJobs.map((job, i) => {
                        const daysAgo = differenceInDays(new Date(), new Date(job.dateApplied));
                        const statusInfo = statusConfig[job.status];
                        return (
                            <div key={job.id} style={styles.jobCard(i)} onClick={() => navigate(`/jobs/${job.id}`)}>
                                <div style={styles.jobHeader}>
                                    <div style={styles.companyAvatar(statusInfo.color)}>{job.company.charAt(0).toUpperCase()}</div>
                                    <div style={styles.jobInfo}><div style={styles.jobPosition}>{job.position}</div><div style={styles.jobCompany}>{job.company}</div></div>
                                    <MdChevronRight size={20} color="#D1D5DB" />
                                </div>
                                <div style={styles.jobFooter}>
                                    <div style={styles.jobMeta}>
                                        {job.location && <div style={styles.metaItem}><MdLocationOn size={14} />{job.location}</div>}
                                        <div style={styles.metaItem}><MdAccessTime size={14} />{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</div>
                                    </div>
                                    <span style={styles.statusBadge(job.status)}>{statusInfo.label}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <button style={styles.fab} onClick={() => setShowModal(true)}><MdAdd size={28} /></button>

            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}><span style={styles.modalTitle}>Add New Job</span><button style={styles.closeBtn} onClick={() => setShowModal(false)}><MdClose size={20} /></button></div>
                        <label style={styles.label}>Company</label><input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g., Google" style={styles.input} />
                        <label style={styles.label}>Position</label><input type="text" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g., Software Engineer" style={styles.input} />
                        <label style={styles.label}>Location</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Remote, New York" style={styles.input} />
                        <label style={styles.label}>Status</label><select value={status} onChange={e => setStatus(e.target.value as Job['status'])} style={styles.input}>{Object.entries(statusConfig).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}</select>
                        <label style={styles.label}>Salary (Optional)</label><input type="text" value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g., ₹10-15 LPA" style={styles.input} />
                        <button onClick={addJob} style={styles.submitBtn}>Add Job</button>
                    </div>
                </div>
            )}

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } input:focus, select:focus { border-color: #4F46E5 !important; } div::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
};

export default JobsSection;
