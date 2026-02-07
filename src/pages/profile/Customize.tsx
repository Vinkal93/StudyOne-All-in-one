import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPalette, MdDarkMode, MdLightMode, MdCheck, MdBrush, MdFormatSize, MdContrast } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

interface ThemePreset {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    preview: string;
}

const Customize: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState('indigo');
    const [fontSize, setFontSize] = useState('medium');
    const [contrast, setContrast] = useState('normal');

    useEffect(() => {
        const saved = localStorage.getItem('studyone_theme_preset');
        if (saved) setSelectedTheme(saved);
        const savedFontSize = localStorage.getItem('studyone_font_size');
        if (savedFontSize) setFontSize(savedFontSize);
    }, []);

    const themePresets: ThemePreset[] = [
        { id: 'indigo', name: 'Indigo', primary: '#4F46E5', secondary: '#7C3AED', accent: '#A855F7', preview: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' },
        { id: 'emerald', name: 'Emerald', primary: '#10B981', secondary: '#059669', accent: '#34D399', preview: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
        { id: 'rose', name: 'Rose', primary: '#F43F5E', secondary: '#E11D48', accent: '#FB7185', preview: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' },
        { id: 'amber', name: 'Amber', primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24', preview: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
        { id: 'sky', name: 'Sky', primary: '#0EA5E9', secondary: '#0284C7', accent: '#38BDF8', preview: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' },
        { id: 'violet', name: 'Violet', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA', preview: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
        // Dark Gradient Themes
        { id: 'amoled', name: 'AMOLED', primary: '#00FF88', secondary: '#00CC6A', accent: '#00FF88', preview: 'linear-gradient(135deg, #000000 0%, #1A1A2E 50%, #00FF88 100%)' },
        { id: 'midnight', name: 'Midnight', primary: '#1E3A8A', secondary: '#1E40AF', accent: '#3B82F6', preview: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #3B82F6 100%)' },
        { id: 'cyber', name: 'Cyber', primary: '#A855F7', secondary: '#7C3AED', accent: '#E879F9', preview: 'linear-gradient(135deg, #1A0B2E 0%, #7C3AED 50%, #E879F9 100%)' },
        { id: 'forest', name: 'Forest', primary: '#059669', secondary: '#047857', accent: '#34D399', preview: 'linear-gradient(135deg, #052E16 0%, #059669 50%, #34D399 100%)' },
    ];

    const fontSizes = [
        { id: 'small', name: 'Small', size: '14px' },
        { id: 'medium', name: 'Medium', size: '16px' },
        { id: 'large', name: 'Large', size: '18px' },
    ];

    const selectTheme = (themeId: string) => {
        setSelectedTheme(themeId);
        localStorage.setItem('studyone_theme_preset', themeId);
        const theme = themePresets.find(t => t.id === themeId);
        if (theme) {
            document.documentElement.style.setProperty('--color-primary', theme.primary);
            document.documentElement.style.setProperty('--color-secondary', theme.secondary);
        }
    };

    const selectFontSize = (sizeId: string) => {
        setFontSize(sizeId);
        localStorage.setItem('studyone_font_size', sizeId);
        const size = fontSizes.find(s => s.id === sizeId);
        if (size) document.documentElement.style.setProperty('--font-size-base', size.size);
    };

    const bgColor = isDarkMode ? '#0F172A' : '#F7F7F7';
    const cardBg = isDarkMode ? '#1E293B' : 'white';
    const textColor = isDarkMode ? '#F1F5F9' : '#1E293B';
    const mutedColor = isDarkMode ? '#94A3B8' : '#64748B';
    const borderColor = isDarkMode ? '#334155' : '#E2E8F0';

    const styles = {
        container: { minHeight: '100vh', background: bgColor, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: cardBg, borderBottom: `1px solid ${borderColor}`, position: 'sticky' as const, top: 0, zIndex: 10 },
        backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: isDarkMode ? '#334155' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: textColor },
        hero: { background: themePresets.find(t => t.id === selectedTheme)?.preview || themePresets[0].preview, padding: '48px 24px', textAlign: 'center' as const, color: 'white' },
        heroIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backdropFilter: 'blur(8px)' },
        heroTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '8px' },
        heroSubtitle: { fontSize: '15px', opacity: 0.9 },
        content: { padding: '24px 16px' },
        section: { marginBottom: '32px' },
        sectionTitle: { fontSize: '16px', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
        card: { background: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}`, marginBottom: '12px' },
        modeToggle: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: cardBg, borderRadius: '18px', border: `1px solid ${borderColor}` },
        modeInfo: { display: 'flex', alignItems: 'center', gap: '14px' },
        modeIcon: (active: boolean) => ({ width: '48px', height: '48px', borderRadius: '14px', background: active ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }),
        modeTitle: { fontSize: '16px', fontWeight: 700, color: textColor },
        modeSubtitle: { fontSize: '13px', color: mutedColor, marginTop: '2px' },
        toggle: (on: boolean) => ({ width: '56px', height: '30px', borderRadius: '15px', background: on ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : '#E2E8F0', position: 'relative' as const, cursor: 'pointer', border: 'none', transition: 'all 0.3s ease' }),
        toggleDot: (on: boolean) => ({ position: 'absolute' as const, top: '3px', left: on ? '28px' : '3px', width: '24px', height: '24px', borderRadius: '50%', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 0.3s ease' }),
        themesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
        themeCard: (selected: boolean, preview: string) => ({ background: preview, borderRadius: '16px', padding: '20px 16px', textAlign: 'center' as const, color: 'white', cursor: 'pointer', border: selected ? '3px solid white' : '3px solid transparent', boxShadow: selected ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)', transform: selected ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s ease', position: 'relative' as const }),
        themeName: { fontSize: '13px', fontWeight: 700, marginTop: '8px' },
        checkBadge: { position: 'absolute' as const, top: '8px', right: '8px', width: '22px', height: '22px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        fontSizeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
        fontCard: (selected: boolean) => ({ background: cardBg, borderRadius: '16px', padding: '20px', textAlign: 'center' as const, border: selected ? `2px solid ${themePresets.find(t => t.id === selectedTheme)?.primary || '#4F46E5'}` : `1px solid ${borderColor}`, cursor: 'pointer' }),
        fontPreview: (size: string) => ({ fontSize: size, fontWeight: 700, color: textColor, marginBottom: '8px' }),
        fontName: { fontSize: '13px', color: mutedColor },
        previewCard: { background: cardBg, borderRadius: '20px', padding: '24px', border: `1px solid ${borderColor}` },
        previewTitle: { fontSize: '18px', fontWeight: 700, color: textColor, marginBottom: '12px' },
        previewText: { fontSize: '15px', color: mutedColor, lineHeight: 1.6, marginBottom: '16px' },
        previewBtn: { padding: '12px 24px', borderRadius: '12px', background: themePresets.find(t => t.id === selectedTheme)?.preview || themePresets[0].preview, color: 'white', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' },
    };

    const currentTheme = themePresets.find(t => t.id === selectedTheme) || themePresets[0];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.headerTitle}>Customize</span>
            </div>

            <div style={styles.hero}>
                <div style={styles.heroIcon}><MdPalette size={36} /></div>
                <h1 style={styles.heroTitle}>Make It Yours</h1>
                <p style={styles.heroSubtitle}>Personalize your StudyOne experience</p>
            </div>

            <div style={styles.content}>
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}><MdContrast style={{ color: currentTheme.primary }} />Appearance</h2>
                    <div style={styles.modeToggle}>
                        <div style={styles.modeInfo}>
                            <div style={styles.modeIcon(isDarkMode)}>{isDarkMode ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}</div>
                            <div>
                                <div style={styles.modeTitle}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</div>
                                <div style={styles.modeSubtitle}>{isDarkMode ? 'Easy on the eyes' : 'Bright and clear'}</div>
                            </div>
                        </div>
                        <button style={styles.toggle(isDarkMode)} onClick={toggleTheme}><div style={styles.toggleDot(isDarkMode)} /></button>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}><MdBrush style={{ color: currentTheme.primary }} />Color Theme</h2>
                    <div style={styles.themesGrid}>
                        {themePresets.map(theme => (
                            <div key={theme.id} style={styles.themeCard(selectedTheme === theme.id, theme.preview)} onClick={() => selectTheme(theme.id)}>
                                {selectedTheme === theme.id && (
                                    <div style={styles.checkBadge}><MdCheck size={14} color={theme.primary} /></div>
                                )}
                                <MdPalette size={24} />
                                <div style={styles.themeName}>{theme.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}><MdFormatSize style={{ color: currentTheme.primary }} />Font Size</h2>
                    <div style={styles.fontSizeGrid}>
                        {fontSizes.map(size => (
                            <div key={size.id} style={styles.fontCard(fontSize === size.id)} onClick={() => selectFontSize(size.id)}>
                                <div style={styles.fontPreview(size.size)}>Aa</div>
                                <div style={styles.fontName}>{size.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}><MdCheck style={{ color: currentTheme.primary }} />Preview</h2>
                    <div style={styles.previewCard}>
                        <div style={styles.previewTitle}>How it looks</div>
                        <p style={styles.previewText}>This is how your app will look with the current settings. Explore different themes to find your perfect style!</p>
                        <button style={styles.previewBtn}>Sample Button</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customize;
