import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCode, MdSchool, MdRocketLaunch, MdFavorite, MdEmail, MdLanguage, MdStar, MdCheckCircle, MdLightbulb, MdPeople } from 'react-icons/md';

const About: React.FC = () => {
    const navigate = useNavigate();

    const appFeatures = [
        { icon: '📚', title: 'Smart Notes', desc: 'Notion-like notes with folders, templates, and organization' },
        { icon: '🍅', title: 'Pomodoro Timer', desc: 'Focus sessions with breaks to boost productivity' },
        { icon: '🎴', title: 'Flashcards', desc: 'Create and study with interactive flip cards' },
        { icon: '✅', title: 'Task Manager', desc: 'Track tasks with priorities and deadlines' },
        { icon: '📅', title: 'Exam Tracker', desc: 'Never miss an exam with countdown reminders' },
        { icon: '💼', title: 'Job Tracker', desc: 'Manage job applications and interviews' },
        { icon: '🔢', title: 'Calculators', desc: 'Scientific, percentage, and unit converters' },
        { icon: '🔥', title: 'Study Streak', desc: 'Stay motivated with daily streaks' },
    ];

    const benefits = [
        'All-in-one study companion - no need for multiple apps',
        'Works offline - study anywhere without internet',
        'Beautiful, distraction-free interface',
        'Track your progress and stay motivated',
        'Designed specifically for Indian students',
        'Free to use with no ads',
    ];

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        hero: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '48px 24px', textAlign: 'center' as const, color: 'white' },
        appIcon: { width: '80px', height: '80px', borderRadius: '24px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
        appName: { fontSize: '32px', fontWeight: 800, marginBottom: '8px' },
        appTagline: { fontSize: '16px', opacity: 0.9, marginBottom: '16px' },
        version: { display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '14px', fontWeight: 600 },
        section: { padding: '24px 16px' },
        sectionTitle: { fontSize: '20px', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
        card: { background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '16px' },
        whyText: { fontSize: '15px', lineHeight: 1.8, color: '#475569', marginBottom: '20px' },
        featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
        featureCard: { background: '#F7F7F7', borderRadius: '16px', padding: '16px', textAlign: 'center' as const },
        featureIcon: { fontSize: '32px', marginBottom: '10px' },
        featureTitle: { fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' },
        featureDesc: { fontSize: '12px', color: '#64748B', lineHeight: 1.4 },
        benefitsList: { listStyle: 'none', padding: 0, margin: 0 },
        benefitItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' },
        benefitIcon: { width: '24px', height: '24px', borderRadius: '50%', background: '#10B98120', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: '2px' },
        benefitText: { fontSize: '15px', color: '#475569', lineHeight: 1.5 },
        devCard: { background: 'linear-gradient(135deg, #F0FFF0 0%, #F0FFFF 100%)', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0' },
        devHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
        devAvatar: { width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: 700, boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' },
        devName: { fontSize: '22px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' },
        devRole: { fontSize: '14px', color: '#4F46E5', fontWeight: 600 },
        devBio: { fontSize: '15px', lineHeight: 1.8, color: '#475569', marginBottom: '20px' },
        devSkills: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginBottom: '20px' },
        skillTag: { padding: '8px 14px', borderRadius: '10px', background: 'white', fontSize: '13px', fontWeight: 600, color: '#4F46E5', border: '1px solid #E0E7FF' },
        devHighlights: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
        highlightCard: { background: 'white', borderRadius: '14px', padding: '16px', textAlign: 'center' as const },
        highlightIcon: { fontSize: '24px', marginBottom: '8px' },
        highlightTitle: { fontSize: '13px', fontWeight: 600, color: '#1E293B' },
        quantumCard: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: '20px', padding: '24px', color: 'white', marginTop: '16px' },
        quantumTitle: { fontSize: '18px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
        quantumDesc: { fontSize: '14px', opacity: 0.9, lineHeight: 1.6, marginBottom: '16px' },
        quantumCourses: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px' },
        courseTag: { padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 600 },
        footer: { textAlign: 'center' as const, padding: '32px 24px', color: '#64748B', fontSize: '13px' },
        footerLink: { color: '#4F46E5', textDecoration: 'none', fontWeight: 600 },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>About</span>
            </div>

            <div style={styles.hero}>
                <div style={styles.appIcon}>📚</div>
                <h1 style={styles.appName}>StudyOne</h1>
                <p style={styles.appTagline}>Your All-in-One Study Companion</p>
                <span style={styles.version}>Version 2.0.0</span>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}><MdLightbulb style={{ color: '#F59E0B' }} />Why StudyOne?</h2>
                <div style={styles.card}>
                    <p style={styles.whyText}>
                        As a teacher and developer, I noticed that students struggle to stay organized with their studies.
                        They use multiple apps for notes, timers, flashcards, and task management - which creates chaos and distractions.
                    </p>
                    <p style={styles.whyText}>
                        <strong>StudyOne</strong> was created to solve this problem. It combines everything a student needs into
                        one beautiful, distraction-free app. Whether you're preparing for board exams, competitive exams,
                        or college studies - StudyOne helps you stay focused and organized.
                    </p>
                    <p style={{ ...styles.whyText, marginBottom: 0, fontWeight: 600, color: '#4F46E5' }}>
                        "One App. All Your Study Needs. Zero Distractions."
                    </p>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}><MdStar style={{ color: '#F59E0B' }} />Features</h2>
                <div style={styles.featuresGrid}>
                    {appFeatures.map(feature => (
                        <div key={feature.title} style={styles.featureCard}>
                            <div style={styles.featureIcon}>{feature.icon}</div>
                            <div style={styles.featureTitle}>{feature.title}</div>
                            <div style={styles.featureDesc}>{feature.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}><MdCheckCircle style={{ color: '#10B981' }} />Benefits for You</h2>
                <div style={styles.card}>
                    <ul style={styles.benefitsList}>
                        {benefits.map((benefit, i) => (
                            <li key={i} style={styles.benefitItem}>
                                <div style={styles.benefitIcon}><MdCheckCircle size={14} /></div>
                                <span style={styles.benefitText}>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}><MdCode style={{ color: '#4F46E5' }} />About Developer</h2>
                <div style={styles.devCard}>
                    <div style={styles.devHeader}>
                        <div style={styles.devAvatar}>VP</div>
                        <div>
                            <div style={styles.devName}>Vinkal Prajapati</div>
                            <div style={styles.devRole}>Web & App Developer | Trainer | Entrepreneur</div>
                        </div>
                    </div>
                    <p style={styles.devBio}>
                        I am a passionate developer and educator dedicated to making technology accessible to everyone.
                        With expertise in web development, mobile apps, and training, I believe in practical,
                        project-based learning that empowers students to build real-world skills.
                    </p>
                    <p style={styles.devBio}>
                        My teaching philosophy is simple: <strong>"Complex concepts, explained simply."</strong> I use
                        step-by-step explanations, real-world examples, and hands-on projects to help students
                        understand and apply what they learn.
                    </p>
                    <div style={styles.devSkills}>
                        {['React', 'JavaScript', 'Android', 'HTML/CSS', 'Python', 'Excel Automation', 'AI Tools'].map(skill => (
                            <span key={skill} style={styles.skillTag}>{skill}</span>
                        ))}
                    </div>
                    <div style={styles.devHighlights}>
                        <div style={styles.highlightCard}><div style={styles.highlightIcon}>🎓</div><div style={styles.highlightTitle}>Educator</div></div>
                        <div style={styles.highlightCard}><div style={styles.highlightIcon}>💻</div><div style={styles.highlightTitle}>Developer</div></div>
                        <div style={styles.highlightCard}><div style={styles.highlightIcon}>🚀</div><div style={styles.highlightTitle}>Entrepreneur</div></div>
                        <div style={styles.highlightCard}><div style={styles.highlightIcon}>🎯</div><div style={styles.highlightTitle}>Mentor</div></div>
                    </div>

                    <div style={styles.quantumCard}>
                        <div style={styles.quantumTitle}><MdSchool />Quantum Institute</div>
                        <p style={styles.quantumDesc}>
                            I am the founder of Quantum Institute, where I teach students from basic to advanced levels
                            with a focus on practical, project-based learning.
                        </p>
                        <div style={styles.quantumCourses}>
                            {['Computer Basics', 'Excel (Basic to Advanced)', 'Web Development', 'App Development', 'Hindi Typing', 'Programming'].map(course => (
                                <span key={course} style={styles.courseTag}>{course}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}><MdFavorite style={{ color: '#EC4899' }} />Made with Love</h2>
                <div style={styles.card}>
                    <p style={styles.whyText}>
                        StudyOne is crafted with care for students who want to succeed. Every feature is designed
                        to help you study smarter, not harder.
                    </p>
                    <p style={{ ...styles.whyText, marginBottom: 0 }}>
                        Have suggestions or feedback? I'd love to hear from you! Your input helps make StudyOne
                        better for everyone.
                    </p>
                </div>
            </div>

            <div style={styles.footer}>
                <p>© 2024-2026 StudyOne by Vinkal Prajapati</p>
                <p>Made in India 🇮🇳 with ❤️</p>
                <p style={{ marginTop: '16px' }}>
                    <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>
                    {' • '}
                    <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a>
                </p>
            </div>
        </div>
    );
};

export default About;
