import React, { useState, useEffect } from 'react';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setFadeOut(true), 1800);
        const timer2 = setTimeout(() => onFinish(), 2200);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, [onFinish]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: fadeOut ? 0 : 1, transition: 'opacity 0.4s ease-out'
        }}>
            {/* Animated Logo */}
            <div style={{
                width: '120px', height: '120px', borderRadius: '32px',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                animation: 'logoFloat 2s ease-in-out infinite, logoAppear 0.8s ease-out'
            }}>
                <span style={{ fontSize: '56px' }}>📚</span>
            </div>

            {/* App Name */}
            <h1 style={{
                fontSize: '36px', fontWeight: 800, color: 'white',
                marginTop: '24px', letterSpacing: '-1px',
                animation: 'textSlideUp 0.6s ease-out 0.3s both'
            }}>
                Study<span style={{ opacity: 0.9 }}>One</span>
            </h1>

            <p style={{
                fontSize: '15px', color: 'rgba(255,255,255,0.9)',
                marginTop: '8px', animation: 'textSlideUp 0.6s ease-out 0.5s both'
            }}>
                All-in-One Study Companion
            </p>

            {/* Loading Dots */}
            <div style={{
                display: 'flex', gap: '8px', marginTop: '48px',
                animation: 'textSlideUp 0.6s ease-out 0.7s both'
            }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.8)',
                        animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`
                    }} />
                ))}
            </div>

            {/* Developer Credit */}
            <p style={{
                position: 'absolute', bottom: '40px',
                fontSize: '13px', color: 'rgba(255,255,255,0.7)',
                animation: 'textSlideUp 0.6s ease-out 0.9s both'
            }}>
                Made with ❤️ by Vinkal
            </p>

            <style>{`
                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes logoAppear {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes textSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes dotPulse {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
