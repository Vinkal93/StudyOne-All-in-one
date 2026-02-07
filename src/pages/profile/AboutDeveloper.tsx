import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEmail, MdCode, MdSchool, MdOpenInNew, MdVerified, MdLocationOn, MdWork, MdStar, MdLaunch } from 'react-icons/md';
import { FaYoutube, FaLinkedin, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import devImage from '../../assets/Vinkal prajapati.jpg';

const AboutDeveloper: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const projects = [
        { name: 'Typing Master', url: 'https://typingmaster2.vercel.app/', icon: '⌨️', desc: 'Learn typing fast', color: '#4F46E5' },
        { name: 'Design Forge', url: 'https://designforge12.vercel.app/', icon: '🎨', desc: 'Design tools suite', color: '#EC4899' },
        { name: 'Web Forge', url: 'https://webforge1.vercel.app/', icon: '🌐', desc: 'Web development', color: '#10B981' },
        { name: 'Colors Tool', url: 'https://colors12.vercel.app/', icon: '🎯', desc: 'Color palettes', color: '#F59E0B' },
        { name: 'Insuite Edu', url: 'https://insuiteedu.vercel.app/', icon: '📚', desc: 'Learning platform', color: '#8B5CF6' },
        { name: 'StudyOne', url: '#', icon: '📖', desc: 'This app!', color: '#06B6D4' },
    ];

    const skills = [
        { name: 'React', level: 95 },
        { name: 'JavaScript', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'Android', level: 80 },
        { name: 'Python', level: 75 },
        { name: 'UI/UX Design', level: 88 },
    ];

    const stats = [
        { value: '50+', label: 'Projects', icon: '🚀' },
        { value: '1000+', label: 'Students', icon: '🎓' },
        { value: '5+', label: 'Years Exp', icon: '⏱️' },
        { value: '10+', label: 'Technologies', icon: '💻' },
    ];

    const socials = [
        { icon: FaYoutube, color: '#FF0000', label: 'YouTube', url: 'https://www.youtube.com/@vinkal041' },
        { icon: FaLinkedin, color: '#0A66C2', label: 'LinkedIn', url: 'https://in.linkedin.com/in/vinkal041' },
        { icon: FaGithub, color: isDarkMode ? '#fff' : '#333', label: 'GitHub', url: 'https://github.com/Vinkal93' },
        { icon: FaTwitter, color: '#1DA1F2', label: 'Twitter', url: 'https://x.com/vinkal041' },
        { icon: FaInstagram, color: '#E4405F', label: 'Instagram', url: 'https://instagram.com/vinkal041' },
    ];

    const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F1F5F9';

    const contactDeveloper = () => {
        window.location.href = 'mailto:vinkal93041@gmail.com?subject=Hello%20Vinkal%20-%20From%20StudyOne%20App';
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: isDarkMode ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: text },

        // Hero Section
        hero: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6B8DD6 100%)', padding: '40px 20px 60px', position: 'relative' as const, overflow: 'hidden' },
        heroPattern: { position: 'absolute' as const, inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%)' },
        heroContent: { position: 'relative' as const, zIndex: 1 },
        avatarContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
        avatarWrapper: { position: 'relative' as const },
        avatar: { width: '130px', height: '130px', borderRadius: '50%', border: '4px solid white', objectFit: 'cover' as const, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
        badge: { position: 'absolute' as const, bottom: '8px', right: '8px', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '3px solid white', boxShadow: '0 4px 12px rgba(16,185,129,0.4)' },
        heroName: { fontSize: '28px', fontWeight: 800, color: 'white', textAlign: 'center' as const, marginBottom: '6px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' },
        heroRole: { fontSize: '15px', color: 'rgba(255,255,255,0.9)', textAlign: 'center' as const, marginBottom: '12px' },
        heroLocation: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' },

        // Stats Section
        statsCard: { display: 'flex', justifyContent: 'space-around', background: card, borderRadius: '24px', padding: '24px 16px', margin: '-40px 16px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: `1px solid ${border}`, position: 'relative' as const, zIndex: 2 },
        statItem: { textAlign: 'center' as const },
        statIcon: { fontSize: '24px', marginBottom: '8px' },
        statValue: { fontSize: '22px', fontWeight: 800, color: text, lineHeight: 1 },
        statLabel: { fontSize: '11px', color: muted, marginTop: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },

        content: { padding: '0 16px' },
        section: { marginBottom: '28px' },
        sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
        sectionIcon: { width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
        sectionTitle: { fontSize: '18px', fontWeight: 700, color: text },

        // Bio Card
        bioCard: { background: card, borderRadius: '20px', padding: '24px', border: `1px solid ${border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' },
        bioText: { fontSize: '15px', lineHeight: 1.8, color: muted, marginBottom: '16px' },
        bioHighlight: { color: '#6366F1', fontWeight: 600 },

        // Skills
        skillsGrid: { background: card, borderRadius: '20px', padding: '20px', border: `1px solid ${border}` },
        skillItem: { marginBottom: '16px' },
        skillHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
        skillName: { fontSize: '14px', fontWeight: 600, color: text },
        skillPercent: { fontSize: '14px', fontWeight: 700, color: '#6366F1' },
        skillBar: { height: '8px', background: inputBg, borderRadius: '4px', overflow: 'hidden' },
        skillProgress: (level: number, color: string) => ({ height: '100%', width: `${level}%`, background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`, borderRadius: '4px', transition: 'width 1s ease' }),

        // Projects Grid
        projectsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
        projectCard: (color: string) => ({ background: card, borderRadius: '16px', padding: '16px', border: `1px solid ${border}`, cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' as const, overflow: 'hidden' }),
        projectGlow: (color: string) => ({ position: 'absolute' as const, top: 0, right: 0, width: '60px', height: '60px', background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, transform: 'translate(20px, -20px)' }),
        projectIcon: { fontSize: '32px', marginBottom: '12px' },
        projectName: { fontSize: '14px', fontWeight: 700, color: text, marginBottom: '4px' },
        projectDesc: { fontSize: '12px', color: muted },
        projectLink: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6366F1', marginTop: '10px', fontWeight: 600 },

        // Quantum Card
        quantumCard: { background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', borderRadius: '24px', padding: '28px', position: 'relative' as const, overflow: 'hidden' },
        quantumPattern: { position: 'absolute' as const, inset: 0, backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(99,102,241,0.3) 0%, transparent 50%)' },
        quantumContent: { position: 'relative' as const, zIndex: 1 },
        quantumHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
        quantumLogo: { width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        quantumTitle: { fontSize: '22px', fontWeight: 800, color: 'white' },
        quantumSubtitle: { fontSize: '13px', color: 'rgba(255,255,255,0.7)' },
        quantumDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '20px' },
        coursesGrid: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px' },
        courseTag: { padding: '8px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', fontSize: '12px', fontWeight: 600, color: 'white', backdropFilter: 'blur(10px)' },

        // Socials
        socialsCard: { background: card, borderRadius: '20px', padding: '20px', border: `1px solid ${border}` },
        socialsGrid: { display: 'flex', justifyContent: 'space-around', gap: '10px' },
        socialBtn: (color: string) => ({ width: '52px', height: '52px', borderRadius: '16px', background: `${color}15`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }),

        // Contact
        contactCard: { background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '24px', padding: '28px', textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden' },
        contactPattern: { position: 'absolute' as const, inset: 0, backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(255,255,255,0.1) 0%, transparent 40%)' },
        contactContent: { position: 'relative' as const, zIndex: 1 },
        contactTitle: { fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '8px' },
        contactSubtitle: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '20px' },
        contactBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', background: 'white', borderRadius: '16px', border: 'none', color: '#6366F1', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },

        footer: { textAlign: 'center' as const, marginTop: '32px', color: muted, fontSize: '13px' },
    };

    const skillColors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>About Developer</span>
            </div>

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroPattern} />
                <div style={styles.heroContent}>
                    <div style={styles.avatarContainer}>
                        <div style={styles.avatarWrapper}>
                            <img src={devImage} alt="Vinkal Prajapati" style={styles.avatar} />
                            <div style={styles.badge}><MdVerified size={20} /></div>
                        </div>
                    </div>
                    <h1 style={styles.heroName}>Vinkal Prajapati</h1>
                    <p style={styles.heroRole}>Full Stack Developer • Educator • Entrepreneur</p>
                    <div style={styles.heroLocation}>
                        <MdLocationOn size={14} />
                        <span>India 🇮🇳</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={styles.statsCard}>
                {stats.map(stat => (
                    <div key={stat.label} style={styles.statItem}>
                        <div style={styles.statIcon}>{stat.icon}</div>
                        <div style={styles.statValue}>{stat.value}</div>
                        <div style={styles.statLabel}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={styles.content}>
                {/* About Me */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <div style={{ ...styles.sectionIcon, background: '#EEF2FF' }}><MdCode style={{ color: '#6366F1' }} /></div>
                        <span style={styles.sectionTitle}>About Me</span>
                    </div>
                    <div style={styles.bioCard}>
                        <p style={styles.bioText}>
                            I'm a passionate <span style={styles.bioHighlight}>Full Stack Developer</span>, Educator, and Digital Product Builder
                            focused on creating practical, user-friendly, and future-ready solutions. As the founder of
                            <span style={styles.bioHighlight}> Quantum Institute</span>, I train students in real-world computer skills
                            using a hands-on, project-based approach.
                        </p>
                        <p style={styles.bioText}>
                            With expertise in <span style={styles.bioHighlight}>Web Development, App Development, Excel Analytics, Automation,
                                and AI-powered systems</span>, I bridge the gap between learning and implementation. I believe technology
                            should not just look good—it should solve real problems efficiently.
                        </p>
                        <p style={{ ...styles.bioText, marginBottom: 0 }}>
                            Over the years, I've built interactive websites, Android apps with clean UI/UX, Excel dashboards,
                            AI chatbots, SEO tools, calculators, and productivity apps. My mission is to <span style={styles.bioHighlight}>teach skills
                                that actually work in the real world</span>.
                        </p>
                    </div>
                </div>

                {/* Skills */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <div style={{ ...styles.sectionIcon, background: '#FDF4FF' }}><MdStar style={{ color: '#EC4899' }} /></div>
                        <span style={styles.sectionTitle}>Skills</span>
                    </div>
                    <div style={styles.skillsGrid}>
                        {skills.map((skill, i) => (
                            <div key={skill.name} style={styles.skillItem}>
                                <div style={styles.skillHeader}>
                                    <span style={styles.skillName}>{skill.name}</span>
                                    <span style={styles.skillPercent}>{skill.level}%</span>
                                </div>
                                <div style={styles.skillBar}>
                                    <div style={styles.skillProgress(skill.level, skillColors[i % skillColors.length])} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Projects */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <div style={{ ...styles.sectionIcon, background: '#F0FDF4' }}><MdWork style={{ color: '#10B981' }} /></div>
                        <span style={styles.sectionTitle}>My Projects</span>
                    </div>
                    <div style={styles.projectsGrid}>
                        {projects.map(project => (
                            <div key={project.name} style={styles.projectCard(project.color)} onClick={() => project.url !== '#' && window.open(project.url, '_blank')}>
                                <div style={styles.projectGlow(project.color)} />
                                <div style={styles.projectIcon}>{project.icon}</div>
                                <div style={styles.projectName}>{project.name}</div>
                                <div style={styles.projectDesc}>{project.desc}</div>
                                {project.url !== '#' && (
                                    <div style={styles.projectLink}><MdLaunch size={12} />Visit</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quantum Institute */}
                <div style={styles.section}>
                    <div style={styles.quantumCard}>
                        <div style={styles.quantumPattern} />
                        <div style={styles.quantumContent}>
                            <div style={styles.quantumHeader}>
                                <div style={styles.quantumLogo}><MdSchool size={28} color="white" /></div>
                                <div>
                                    <div style={styles.quantumTitle}>Quantum Institute</div>
                                    <div style={styles.quantumSubtitle}>Where Learning Meets Reality</div>
                                </div>
                            </div>
                            <p style={styles.quantumDesc}>
                                As an educator, my mission is simple: teach skills that actually work in the real world.
                                I focus on clarity, logic-building, and confidence—so students don't just learn tools,
                                they learn how to think like professionals.
                            </p>
                            <div style={styles.coursesGrid}>
                                {['Computer Basics', 'Excel Mastery', 'Web Dev', 'App Dev', 'Hindi Typing', 'Programming', 'AI Tools'].map(c => (
                                    <span key={c} style={styles.courseTag}>{c}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <div style={{ ...styles.sectionIcon, background: '#FEF3C7' }}>🌐</div>
                        <span style={styles.sectionTitle}>Connect With Me</span>
                    </div>
                    <div style={styles.socialsCard}>
                        <div style={styles.socialsGrid}>
                            {socials.map(social => (
                                <button key={social.label} style={styles.socialBtn(social.color)} onClick={() => window.open(social.url, '_blank')}>
                                    <social.icon size={24} color={social.color} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div style={styles.section}>
                    <div style={styles.contactCard}>
                        <div style={styles.contactPattern} />
                        <div style={styles.contactContent}>
                            <h3 style={styles.contactTitle}>Let's Work Together!</h3>
                            <p style={styles.contactSubtitle}>Have a project in mind or want to collaborate?</p>
                            <button style={styles.contactBtn} onClick={contactDeveloper}>
                                <MdEmail size={20} />
                                vinkal93041@gmail.com
                            </button>
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <p>Crafted with ❤️ by Vinkal Prajapati</p>
                    <p>© 2024-2026 All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
};

export default AboutDeveloper;
