import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdBackup, MdCloudDownload, MdCloudUpload, MdDelete, MdCheck, MdWarning, MdInfo } from 'react-icons/md';

const Backup: React.FC = () => {
    const navigate = useNavigate();
    const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const getAllData = () => {
        const keys = ['studyone_notes', 'studyone_tasks', 'studyone_exams', 'studyone_jobs', 'studyone_folders', 'studyone_flashcard_decks', 'study_streak', 'studyone_username', 'studyone_theme_preset', 'studyone_font_size', 'pomodoro_settings'];
        const data: Record<string, unknown> = {};
        keys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try { data[key] = JSON.parse(value); }
                catch { data[key] = value; }
            }
        });
        return data;
    };

    const exportData = () => {
        try {
            const data = getAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `studyone_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setExportStatus('success');
            setTimeout(() => setExportStatus('idle'), 3000);
        } catch {
            setExportStatus('error');
            setTimeout(() => setExportStatus('idle'), 3000);
        }
    };

    const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                Object.entries(data).forEach(([key, value]) => {
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                });
                setImportStatus('success');
                setTimeout(() => { setImportStatus('idle'); window.location.reload(); }, 1500);
            } catch {
                setImportStatus('error');
                setTimeout(() => setImportStatus('idle'), 3000);
            }
        };
        reader.readAsText(file);
    };

    const clearAllData = () => {
        if (confirm('⚠️ This will delete ALL your data including notes, tasks, exams, and settings. This cannot be undone!\n\nAre you sure you want to continue?')) {
            if (confirm('Final confirmation: Delete everything?')) {
                const keys = ['studyone_notes', 'studyone_tasks', 'studyone_exams', 'studyone_jobs', 'studyone_folders', 'studyone_flashcard_decks', 'study_streak', 'studyone_username'];
                keys.forEach(key => localStorage.removeItem(key));
                window.location.reload();
            }
        }
    };

    const dataStats = {
        notes: JSON.parse(localStorage.getItem('studyone_notes') || '[]').length,
        tasks: JSON.parse(localStorage.getItem('studyone_tasks') || '[]').length,
        exams: JSON.parse(localStorage.getItem('studyone_exams') || '[]').length,
        jobs: JSON.parse(localStorage.getItem('studyone_jobs') || '[]').length,
        decks: JSON.parse(localStorage.getItem('studyone_flashcard_decks') || '[]').length,
    };

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        hero: { background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', padding: '48px 24px', textAlign: 'center' as const, color: 'white' },
        heroIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
        heroTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '8px' },
        heroSubtitle: { fontSize: '15px', opacity: 0.9 },
        content: { padding: '24px 16px' },
        statsCard: { background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px' },
        statsTitle: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' },
        statItem: { textAlign: 'center' as const, padding: '12px 8px', background: '#F7F7F7', borderRadius: '14px' },
        statNumber: { fontSize: '24px', fontWeight: 700, color: '#3B82F6' },
        statLabel: { fontSize: '11px', color: '#64748B', marginTop: '4px' },
        section: { marginBottom: '24px' },
        sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' },
        actionCard: { background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', marginBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' },
        actionIcon: (color: string) => ({ width: '52px', height: '52px', borderRadius: '16px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }),
        actionInfo: { flex: 1 },
        actionTitle: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' },
        actionDesc: { fontSize: '13px', color: '#64748B', lineHeight: 1.4 },
        statusBadge: (status: 'success' | 'error') => ({ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: status === 'success' ? '#DCFCE7' : '#FEE2E2', color: status === 'success' ? '#166534' : '#DC2626' }),
        dangerCard: { background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', borderRadius: '20px', padding: '20px', border: '1px solid #FECACA' },
        dangerTitle: { fontSize: '16px', fontWeight: 700, color: '#DC2626', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
        dangerDesc: { fontSize: '14px', color: '#991B1B', lineHeight: 1.5, marginBottom: '16px' },
        dangerBtn: { padding: '14px 24px', borderRadius: '14px', background: '#DC2626', color: 'white', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
        infoCard: { background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '20px', padding: '20px', border: '1px solid #93C5FD', marginBottom: '24px' },
        infoTitle: { fontSize: '15px', fontWeight: 600, color: '#1D4ED8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
        infoText: { fontSize: '14px', color: '#1E40AF', lineHeight: 1.5 },
        hiddenInput: { display: 'none' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>Backup & Data</span>
            </div>

            <div style={styles.hero}>
                <div style={styles.heroIcon}><MdBackup size={36} /></div>
                <h1 style={styles.heroTitle}>Backup & Restore</h1>
                <p style={styles.heroSubtitle}>Keep your data safe</p>
            </div>

            <div style={styles.content}>
                <div style={styles.statsCard}>
                    <h3 style={styles.statsTitle}><MdInfo style={{ color: '#3B82F6' }} />Your Data</h3>
                    <div style={styles.statsGrid}>
                        <div style={styles.statItem}><div style={styles.statNumber}>{dataStats.notes}</div><div style={styles.statLabel}>Notes</div></div>
                        <div style={styles.statItem}><div style={styles.statNumber}>{dataStats.tasks}</div><div style={styles.statLabel}>Tasks</div></div>
                        <div style={styles.statItem}><div style={styles.statNumber}>{dataStats.exams}</div><div style={styles.statLabel}>Exams</div></div>
                        <div style={styles.statItem}><div style={styles.statNumber}>{dataStats.jobs}</div><div style={styles.statLabel}>Jobs</div></div>
                        <div style={styles.statItem}><div style={styles.statNumber}>{dataStats.decks}</div><div style={styles.statLabel}>Decks</div></div>
                    </div>
                </div>

                <div style={styles.infoCard}>
                    <div style={styles.infoTitle}><MdInfo size={18} />Pro Tip</div>
                    <p style={styles.infoText}>Regularly backup your data to avoid losing important notes and progress. Export your data before uninstalling or updating the app.</p>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Export</h3>
                    <div style={styles.actionCard} onClick={exportData}>
                        <div style={styles.actionIcon('#10B981')}><MdCloudUpload size={26} /></div>
                        <div style={styles.actionInfo}>
                            <div style={styles.actionTitle}>Export All Data</div>
                            <div style={styles.actionDesc}>Download a backup file containing all your notes, tasks, exams, and settings</div>
                        </div>
                        {exportStatus !== 'idle' && <span style={styles.statusBadge(exportStatus)}>{exportStatus === 'success' ? <><MdCheck size={16} />Exported!</> : 'Failed'}</span>}
                    </div>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Import</h3>
                    <label>
                        <div style={styles.actionCard}>
                            <div style={styles.actionIcon('#3B82F6')}><MdCloudDownload size={26} /></div>
                            <div style={styles.actionInfo}>
                                <div style={styles.actionTitle}>Import Backup</div>
                                <div style={styles.actionDesc}>Restore your data from a previously exported backup file</div>
                            </div>
                            {importStatus !== 'idle' && <span style={styles.statusBadge(importStatus)}>{importStatus === 'success' ? <><MdCheck size={16} />Imported!</> : 'Failed'}</span>}
                        </div>
                        <input type="file" accept=".json" onChange={importData} style={styles.hiddenInput} />
                    </label>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Danger Zone</h3>
                    <div style={styles.dangerCard}>
                        <div style={styles.dangerTitle}><MdWarning />Clear All Data</div>
                        <p style={styles.dangerDesc}>This will permanently delete all your notes, tasks, exams, jobs, and settings. This action cannot be undone.</p>
                        <button style={styles.dangerBtn} onClick={clearAllData}><MdDelete size={18} />Delete Everything</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Backup;
