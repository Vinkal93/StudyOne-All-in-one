import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdGavel, MdCheckCircle, MdBlock, MdUpdate, MdEmail } from 'react-icons/md';

const TermsOfService: React.FC = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: MdCheckCircle,
            title: 'Acceptance of Terms',
            content: `By downloading, installing, or using StudyOne, you agree to these Terms of Service. If you do not agree to these terms, please do not use the app.

StudyOne is designed for educational purposes to help students organize their studies effectively.`
        },
        {
            icon: MdCheckCircle,
            title: 'License to Use',
            content: `StudyOne grants you a personal, non-exclusive, non-transferable, revocable license to use the app for your personal, non-commercial educational purposes.

You may:
• Use the app for personal study and organization
• Create and store notes, tasks, and other study materials
• Use all features available in the app

You may not:
• Modify, reverse engineer, or decompile the app
• Use the app for any illegal purposes
• Redistribute or sell the app`
        },
        {
            icon: MdBlock,
            title: 'User Responsibilities',
            content: `You are responsible for:
• All data you create and store in the app
• Backing up your important data regularly
• Using the app in compliance with local laws
• Maintaining the security of your device

We recommend regularly exporting or backing up your notes and important data, as data stored locally may be lost if you uninstall the app or reset your device.`
        },
        {
            icon: MdGavel,
            title: 'Disclaimer of Warranties',
            content: `StudyOne is provided "as is" without any warranties, express or implied. We do not guarantee that:
• The app will be error-free or uninterrupted
• The app will meet all your specific requirements
• Any errors in the app will be corrected

We strive to provide the best possible experience, but cannot guarantee perfection.`
        },
        {
            icon: MdBlock,
            title: 'Limitation of Liability',
            content: `To the maximum extent permitted by law, StudyOne and its developer shall not be liable for any:
• Loss of data
• Indirect, incidental, or consequential damages
• Damages arising from your use or inability to use the app

Your use of the app is at your own risk.`
        },
        {
            icon: MdUpdate,
            title: 'Updates and Changes',
            content: `We may update these Terms of Service from time to time. We will notify users of significant changes through the app.

We may also update the app to:
• Add new features
• Fix bugs and improve performance
• Enhance security
• Improve user experience

Continued use of the app after updates constitutes acceptance of the modified terms.`
        },
    ];

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        hero: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '48px 24px', textAlign: 'center' as const, color: 'white' },
        heroIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
        heroTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '8px' },
        heroSubtitle: { fontSize: '15px', opacity: 0.9 },
        lastUpdated: { display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '13px', marginTop: '16px' },
        content: { padding: '24px 16px' },
        card: { background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '16px' },
        sectionHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
        sectionIcon: { width: '48px', height: '48px', borderRadius: '14px', background: '#4F46E515', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' },
        sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        sectionContent: { fontSize: '15px', lineHeight: 1.8, color: '#475569', whiteSpace: 'pre-line' as const },
        summary: { background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)', borderRadius: '20px', padding: '24px', border: '1px solid #4F46E530', marginBottom: '16px' },
        summaryTitle: { fontSize: '18px', fontWeight: 700, color: '#3730A3', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
        summaryText: { fontSize: '15px', lineHeight: 1.7, color: '#3730A3' },
        contact: { background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', textAlign: 'center' as const },
        contactTitle: { fontSize: '16px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' },
        contactText: { fontSize: '14px', color: '#64748B', marginBottom: '16px' },
        contactBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', borderRadius: '14px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>Terms of Service</span>
            </div>

            <div style={styles.hero}>
                <div style={styles.heroIcon}><MdGavel size={36} /></div>
                <h1 style={styles.heroTitle}>Terms of Service</h1>
                <p style={styles.heroSubtitle}>Please read these terms carefully</p>
                <span style={styles.lastUpdated}>Last Updated: February 2026</span>
            </div>

            <div style={styles.content}>
                <div style={styles.summary}>
                    <h2 style={styles.summaryTitle}>📋 Summary</h2>
                    <p style={styles.summaryText}>
                        StudyOne is a free educational app for personal use. Use it responsibly,
                        back up your data, and enjoy learning!
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
                    <h3 style={styles.contactTitle}>Questions?</h3>
                    <p style={styles.contactText}>If you have any questions about these terms, please contact us.</p>
                    <button style={styles.contactBtn}><MdEmail size={18} />Contact Developer</button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
