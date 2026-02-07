import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdCalculate, MdMenuBook, MdTimer, MdWork, MdPerson, MdDashboard } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode } = useTheme();

    const navItems = [
        { label: 'Home', icon: MdDashboard, path: '/', color: '#4F46E5' },
        { label: 'Tools', icon: MdCalculate, path: '/tools', color: '#10B981' },
        { label: 'Study', icon: MdMenuBook, path: '/study', color: '#F59E0B' },
        { label: 'Exams', icon: MdTimer, path: '/exams', color: '#EC4899' },
        { label: 'Profile', icon: MdPerson, path: '/profile', color: '#7C3AED' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/tools');
        return location.pathname.startsWith(path);
    };

    const navBg = isDarkMode ? 'rgba(26, 35, 64, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const navBorder = isDarkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(226, 232, 240, 0.8)';
    const inactiveColor = isDarkMode ? '#64748B' : '#94A3B8';

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: navBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: `1px solid ${navBorder}`,
            paddingBottom: 'env(safe-area-inset-bottom)',
            boxShadow: isDarkMode ? '0 -4px 30px rgba(0,0,0,0.2)' : '0 -4px 30px rgba(0,0,0,0.05)',
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '64px',
                padding: '0 16px'
            }}>
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    const activeColor = item.color;

                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                                height: '100%',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.2s ease',
                                color: active ? activeColor : inactiveColor,
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                zIndex: 1,
                                transform: active ? 'translateY(-2px)' : 'translateY(0)',
                                transition: 'all 0.25s ease',
                            }}>
                                <Icon size={24} />
                            </div>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                marginTop: '4px',
                                opacity: active ? 1 : 0.7,
                                transition: 'all 0.2s ease',
                                transform: active ? 'translateY(-2px)' : 'translateY(0)',
                            }}>
                                {item.label}
                            </span>
                            {active && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    width: '40px',
                                    height: '3px',
                                    borderRadius: '0 0 4px 4px',
                                    background: activeColor,
                                    boxShadow: `0 2px 8px ${activeColor}80`
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
