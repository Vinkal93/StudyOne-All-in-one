import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSecurity, MdPrivacyTip, MdStorage, MdShare, MdEmail } from 'react-icons/md';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: MdStorage,
            title: 'Data Storage',
            content: `All your data in StudyOne is stored locally on your device. We do NOT collect, store, or transmit any of your personal data to external servers. Your notes, tasks, exams, jobs, and all other information remain private and secure on your device only.`
        },
        {
            icon: MdPrivacyTip,
            title: 'What We Don\'t Collect',
            content: `We do NOT collect:
• Personal identification information
• Location data
• Contact information
• Browsing history
• Usage analytics
• Any data you enter in the app

Your privacy is our priority. Period.`
        },
        {
            icon: MdSecurity,
            title: 'Data Security',
            content: `Since all data is stored locally on your device, security depends on your device's security measures. We recommend:
• Using device lock (PIN, fingerprint, face ID)
• Keeping your device software updated
• Not sharing your device with untrusted individuals
• Regularly backing up your data`
        },
        {
            icon: MdShare,
            title: 'Third-Party Services',
            content: `StudyOne does NOT use any third-party analytics, advertising, or tracking services. We do not share any data with third parties because we don't collect any data in the first place.

The app works completely offline without requiring any internet connection.`
        },
    ];

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        hero: { background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '48px 24px', textAlign: 'center' as const, color: 'white' },
        heroIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
        heroTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '8px' },
        heroSubtitle: { fontSize: '15px', opacity: 0.9 },
        lastUpdated: { display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '13px', marginTop: '16px' },
        content: { padding: '24px 16px' },
        card: { background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '16px' },
        sectionHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
        sectionIcon: { width: '48px', height: '48px', borderRadius: '14px', background: '#10B98115', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' },
        sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        sectionContent: { fontSize: '15px', lineHeight: 1.8, color: '#475569', whiteSpace: 'pre-line' as const },
        summary: { background: 'linear-gradient(135deg, #F0FFF0 0%, #DCFCE7 100%)', borderRadius: '20px', padding: '24px', border: '1px solid #10B98130', marginBottom: '16px' },
        summaryTitle: { fontSize: '18px', fontWeight: 700, color: '#166534', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
        summaryText: { fontSize: '15px', lineHeight: 1.7, color: '#166534' },
        contact: { background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', textAlign: 'center' as const },
        contactTitle: { fontSize: '16px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' },
        contactText: { fontSize: '14px', color: '#64748B', marginBottom: '16px' },
        contactBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', borderRadius: '14px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>Privacy Policy</span>
            </div>

            <div style={styles.hero}>
                <div style={styles.heroIcon}><MdPrivacyTip size={36} /></div>
                <h1 style={styles.heroTitle}>Privacy Policy</h1>
                <p style={styles.heroSubtitle}>Your privacy matters to us</p>
                <span style={styles.lastUpdated}>Last Updated: February 2026</span>
            </div>

            <div style={styles.content}>
                <div style={styles.summary}>
                    <h2 style={styles.summaryTitle}>🛡️ TL;DR - The Short Version</h2>
                    <p style={styles.summaryText}>
                        <strong>StudyOne stores all your data locally on your device.</strong> We don't collect,
                        track, or share any of your personal information. Your data is 100% yours.
                    </p>
                </div>

                {sections.map(section => {
                    const Icon = section.icon;
                    return (
                        <div key={section.title} style={styles.card}>
                            <div style={styles.sectionHeader}>
                                <div style={styles.sectionIcon}><Icon size={24} /></div>
                                <h3 style={styles.sectionTitle}>{section.title}</h3>
                            </div>
                            <p style={styles.sectionContent}>{section.content}</p>
                        </div>
                    );
                })}

                <div style={styles.contact}>
                    <h3 style={styles.contactTitle}>Questions About Privacy?</h3>
                    <p style={styles.contactText}>If you have any questions or concerns about our privacy practices, feel free to reach out.</p>
                    <button style={styles.contactBtn}><MdEmail size={18} />Contact Developer</button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
