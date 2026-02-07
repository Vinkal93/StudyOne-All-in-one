import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdRestaurant, MdPeople } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const tipPresets = [10, 15, 18, 20, 25];

const TipCalculator: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [bill, setBill] = useState('');
    const [tipPercent, setTipPercent] = useState(18);
    const [people, setPeople] = useState(1);

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    const billAmount = parseFloat(bill) || 0;
    const tipAmount = billAmount * (tipPercent / 100);
    const totalAmount = billAmount + tipAmount;
    const perPerson = totalAmount / people;

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        content: { padding: '20px 16px' },
        cardStyle: { background: card, borderRadius: '20px', padding: '24px', marginBottom: '16px', border: `1px solid ${border}` },
        label: { fontSize: '14px', fontWeight: 600, color: text, marginBottom: '12px', display: 'block' },
        input: { width: '100%', padding: '18px', fontSize: '24px', background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, outline: 'none', textAlign: 'center' as const, fontWeight: 700, marginBottom: '20px', color: text },
        tipGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' },
        tipBtn: (active: boolean) => ({ padding: '14px 8px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', background: active ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : inputBg, color: active ? 'white' : muted }),
        peopleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' },
        peopleBtn: { width: '48px', height: '48px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', fontSize: '24px', fontWeight: 700, color: text },
        peopleValue: { fontSize: '28px', fontWeight: 800, color: text, minWidth: '60px', textAlign: 'center' as const },
        resultsCard: { background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '24px', padding: '28px', color: 'white' },
        resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
        resultLabel: { fontSize: '15px', opacity: 0.9 },
        resultValue: { fontSize: '24px', fontWeight: 700 },
        divider: { height: '1px', background: 'rgba(255,255,255,0.2)', margin: '16px 0' },
        totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        totalLabel: { fontSize: '18px', fontWeight: 600 },
        totalValue: { fontSize: '36px', fontWeight: 800 },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Tip Calculator</span>
            </div>
            <div style={styles.content}>
                <div style={styles.cardStyle}>
                    <label style={styles.label}>Bill Amount</label>
                    <input style={styles.input} type="number" placeholder="$0.00" value={bill} onChange={e => setBill(e.target.value)} />
                    <label style={styles.label}>Tip Percentage</label>
                    <div style={styles.tipGrid}>
                        {tipPresets.map(t => (<button key={t} style={styles.tipBtn(tipPercent === t)} onClick={() => setTipPercent(t)}>{t}%</button>))}
                    </div>
                    <label style={styles.label}><MdPeople style={{ verticalAlign: 'middle', marginRight: 8 }} />Split Between</label>
                    <div style={styles.peopleRow}>
                        <button style={styles.peopleBtn} onClick={() => setPeople(Math.max(1, people - 1))}>−</button>
                        <span style={styles.peopleValue}>{people}</span>
                        <button style={styles.peopleBtn} onClick={() => setPeople(people + 1)}>+</button>
                    </div>
                </div>
                <div style={styles.resultsCard}>
                    <div style={styles.resultRow}><span style={styles.resultLabel}>Tip Amount</span><span style={styles.resultValue}>${tipAmount.toFixed(2)}</span></div>
                    <div style={styles.resultRow}><span style={styles.resultLabel}>Total with Tip</span><span style={styles.resultValue}>${totalAmount.toFixed(2)}</span></div>
                    <div style={styles.divider} />
                    <div style={styles.totalRow}><span style={styles.totalLabel}>Per Person</span><span style={styles.totalValue}>${perPerson.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    );
};

export default TipCalculator;
