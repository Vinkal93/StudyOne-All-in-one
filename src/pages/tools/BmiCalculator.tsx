import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFitnessCenter } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const BmiCalculator: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
    const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    const calculate = () => {
        const w = parseFloat(weight), h = parseFloat(height);
        if (!w || !h) return;
        let bmi = unit === 'metric' ? w / ((h / 100) ** 2) : (w / (h ** 2)) * 703;
        let category = '', color = '';
        if (bmi < 18.5) { category = 'Underweight'; color = '#3B82F6'; }
        else if (bmi < 25) { category = 'Normal'; color = '#10B981'; }
        else if (bmi < 30) { category = 'Overweight'; color = '#F59E0B'; }
        else { category = 'Obese'; color = '#EF4444'; }
        setResult({ bmi, category, color });
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        content: { padding: '20px 16px' },
        cardStyle: { background: card, borderRadius: '20px', padding: '24px', marginBottom: '16px', border: `1px solid ${border}` },
        unitToggle: { display: 'flex', background: inputBg, borderRadius: '14px', padding: '4px', marginBottom: '20px' },
        unitBtn: (active: boolean) => ({ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: active ? card : 'transparent', color: active ? '#4F46E5' : muted, boxShadow: active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }),
        label: { fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px', display: 'block' },
        inputRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
        input: { flex: 1, padding: '16px', fontSize: '16px', background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, outline: 'none', color: text },
        inputLabel: { fontSize: '14px', color: muted, minWidth: '40px' },
        calcBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', border: 'none', cursor: 'pointer', color: 'white', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' },
        resultCard: (color: string) => ({ background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`, borderRadius: '24px', padding: '32px', textAlign: 'center' as const, color: 'white', marginTop: '24px' }),
        bmiValue: { fontSize: '56px', fontWeight: 800 },
        bmiCategory: { fontSize: '20px', fontWeight: 600, marginTop: '8px', opacity: 0.95 },
        scale: { display: 'flex', borderRadius: '12px', overflow: 'hidden', marginTop: '24px', height: '12px' },
        scaleSegment: (color: string, width: string) => ({ background: color, width, height: '100%' }),
        scaleLabels: { display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.8)' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>BMI Calculator</span>
            </div>
            <div style={styles.content}>
                <div style={styles.cardStyle}>
                    <div style={styles.unitToggle}>
                        <button style={styles.unitBtn(unit === 'metric')} onClick={() => setUnit('metric')}>Metric (kg/cm)</button>
                        <button style={styles.unitBtn(unit === 'imperial')} onClick={() => setUnit('imperial')}>Imperial (lb/in)</button>
                    </div>
                    <label style={styles.label}>Weight</label>
                    <div style={styles.inputRow}>
                        <input style={styles.input} type="number" placeholder="Enter weight" value={weight} onChange={e => setWeight(e.target.value)} />
                        <span style={styles.inputLabel}>{unit === 'metric' ? 'kg' : 'lb'}</span>
                    </div>
                    <label style={styles.label}>Height</label>
                    <div style={styles.inputRow}>
                        <input style={styles.input} type="number" placeholder="Enter height" value={height} onChange={e => setHeight(e.target.value)} />
                        <span style={styles.inputLabel}>{unit === 'metric' ? 'cm' : 'in'}</span>
                    </div>
                </div>
                <button style={styles.calcBtn} onClick={calculate}><MdFitnessCenter size={20} style={{ marginRight: 8 }} /> Calculate BMI</button>
                {result && (
                    <div style={styles.resultCard(result.color)}>
                        <div style={styles.bmiValue}>{result.bmi.toFixed(1)}</div>
                        <div style={styles.bmiCategory}>{result.category}</div>
                        <div style={styles.scale}>
                            <div style={styles.scaleSegment('#3B82F6', '25%')} />
                            <div style={styles.scaleSegment('#10B981', '25%')} />
                            <div style={styles.scaleSegment('#F59E0B', '25%')} />
                            <div style={styles.scaleSegment('#EF4444', '25%')} />
                        </div>
                        <div style={styles.scaleLabels}><span>Under</span><span>Normal</span><span>Over</span><span>Obese</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BmiCalculator;
