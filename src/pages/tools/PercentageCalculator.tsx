import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPercent, MdTrendingUp, MdTrendingDown, MdRestaurant } from 'react-icons/md';

type CalculatorMode = 'basic' | 'increase' | 'decrease' | 'tip';

const PercentageCalculator: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<CalculatorMode>('basic');

    const [percentage, setPercentage] = useState('');
    const [value, setValue] = useState('');
    const [basicResult, setBasicResult] = useState<number | null>(null);

    const [originalValue, setOriginalValue] = useState('');
    const [changePercent, setChangePercent] = useState('');
    const [changeResult, setChangeResult] = useState<number | null>(null);

    const [billAmount, setBillAmount] = useState('');
    const [tipPercent, setTipPercent] = useState('15');
    const [splitCount, setSplitCount] = useState('1');

    const calculateBasic = () => {
        const p = parseFloat(percentage);
        const v = parseFloat(value);
        if (!isNaN(p) && !isNaN(v)) setBasicResult((p / 100) * v);
    };

    const calculateChange = (isIncrease: boolean) => {
        const orig = parseFloat(originalValue);
        const pct = parseFloat(changePercent);
        if (!isNaN(orig) && !isNaN(pct)) {
            const change = (pct / 100) * orig;
            setChangeResult(isIncrease ? orig + change : orig - change);
        }
    };

    const tipAmount = () => {
        const bill = parseFloat(billAmount);
        const tip = parseFloat(tipPercent);
        return isNaN(bill) || isNaN(tip) ? 0 : (tip / 100) * bill;
    };

    const totalWithTip = () => parseFloat(billAmount) + tipAmount();
    const perPerson = () => totalWithTip() / (parseInt(splitCount) || 1);

    const modes = [
        { id: 'basic', label: 'Basic', icon: <MdPercent />, color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },
        { id: 'increase', label: 'Increase', icon: <MdTrendingUp />, color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
        { id: 'decrease', label: 'Decrease', icon: <MdTrendingDown />, color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' },
        { id: 'tip', label: 'Tip', icon: <MdRestaurant />, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' },
    ];

    const tipPresets = [10, 15, 18, 20, 25];

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EDE9FE 100%)',
            paddingBottom: '24px',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            position: 'sticky' as const,
            top: 0,
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
        },
        iconBtn: {
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        title: { fontSize: '18px', fontWeight: 700, color: '#1F2937' },
        content: { padding: '0 16px' },
        modeGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '24px',
        },
        modeBtn: (active: boolean, gradient: string, color: string) => ({
            padding: '16px 8px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: active ? gradient : 'white',
            color: active ? 'white' : '#6B7280',
            boxShadow: active ? `0 8px 24px ${color}40` : '0 2px 8px rgba(0, 0, 0, 0.04)',
            transform: active ? 'scale(1.02)' : 'scale(1)',
        }),
        modeIcon: { fontSize: '24px' },
        modeLabel: { fontSize: '12px', fontWeight: 600 },
        card: {
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            animation: 'fadeInUp 0.3s ease',
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#1F2937',
        },
        inputRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
        },
        input: {
            flex: 1,
            padding: '16px 20px',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'SF Mono, Consolas, monospace',
            background: '#F9FAFB',
            borderRadius: '16px',
            border: '2px solid transparent',
            outline: 'none',
            transition: 'all 0.2s ease',
        },
        inputSmall: {
            width: '90px',
            padding: '16px',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'SF Mono, Consolas, monospace',
            background: '#F9FAFB',
            borderRadius: '16px',
            border: '2px solid transparent',
            outline: 'none',
            textAlign: 'center' as const,
        },
        label: {
            fontSize: '12px',
            fontWeight: 600,
            color: '#9CA3AF',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            marginBottom: '8px',
            display: 'block',
        },
        calcBtn: (gradient: string, shadow: string) => ({
            width: '100%',
            padding: '18px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            background: gradient,
            boxShadow: shadow,
            transition: 'all 0.2s ease',
        }),
        resultCard: (color: string) => ({
            marginTop: '20px',
            padding: '24px',
            borderRadius: '20px',
            background: `${color}15`,
            textAlign: 'center' as const,
            animation: 'scaleIn 0.3s ease',
        }),
        resultLabel: { fontSize: '13px', color: '#9CA3AF', marginBottom: '4px' },
        resultValue: (color: string) => ({
            fontSize: '36px',
            fontWeight: 700,
            color: color,
            fontFamily: 'SF Mono, Consolas, monospace',
        }),
        tipPresets: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '16px' },
        tipBtn: (active: boolean) => ({
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: active ? '#F59E0B' : '#F9FAFB',
            color: active ? 'white' : '#6B7280',
            transition: 'all 0.2s ease',
        }),
        tipResults: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '20px',
        },
        tipResultCard: (color: string) => ({
            padding: '16px',
            borderRadius: '16px',
            background: `${color}15`,
            textAlign: 'center' as const,
        }),
        tipResultLabel: { fontSize: '12px', color: '#9CA3AF' },
        tipResultValue: (color: string) => ({
            fontSize: '20px',
            fontWeight: 700,
            color: color,
            marginTop: '4px',
        }),
    };

    const currentMode = modes.find(m => m.id === mode)!;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}>
                    <MdArrowBack size={22} />
                </button>
                <span style={styles.title}>Percentage Calculator</span>
                <div style={{ width: '44px' }} />
            </div>

            <div style={styles.content}>
                {/* Mode Selector */}
                <div style={styles.modeGrid}>
                    {modes.map(m => (
                        <button
                            key={m.id}
                            style={styles.modeBtn(mode === m.id, m.gradient, m.color)}
                            onClick={() => setMode(m.id as CalculatorMode)}
                        >
                            <span style={styles.modeIcon}>{m.icon}</span>
                            <span style={styles.modeLabel}>{m.label}</span>
                        </button>
                    ))}
                </div>

                {/* Basic */}
                {mode === 'basic' && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            <MdPercent style={{ color: '#6366F1' }} />
                            What is X% of Y?
                        </h3>
                        <div style={styles.inputRow}>
                            <input style={styles.inputSmall} type="number" value={percentage} onChange={e => setPercentage(e.target.value)} placeholder="X" />
                            <span style={{ fontSize: '24px', color: '#9CA3AF' }}>%</span>
                            <span style={{ color: '#6B7280' }}>of</span>
                            <input style={styles.input} type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Y" />
                        </div>
                        <button style={styles.calcBtn(currentMode.gradient, `0 8px 24px ${currentMode.color}40`)} onClick={calculateBasic}>
                            Calculate
                        </button>
                        {basicResult !== null && (
                            <div style={styles.resultCard(currentMode.color)}>
                                <div style={styles.resultLabel}>Result</div>
                                <div style={styles.resultValue(currentMode.color)}>{basicResult.toFixed(2)}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Increase */}
                {mode === 'increase' && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            <MdTrendingUp style={{ color: '#10B981' }} />
                            Increase by Percentage
                        </h3>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Original Value</label>
                            <input style={styles.input} type="number" value={originalValue} onChange={e => setOriginalValue(e.target.value)} placeholder="100" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Increase by (%)</label>
                            <input style={styles.input} type="number" value={changePercent} onChange={e => setChangePercent(e.target.value)} placeholder="10" />
                        </div>
                        <button style={styles.calcBtn(currentMode.gradient, `0 8px 24px ${currentMode.color}40`)} onClick={() => calculateChange(true)}>
                            Calculate Increase
                        </button>
                        {changeResult !== null && (
                            <div style={styles.resultCard(currentMode.color)}>
                                <div style={styles.resultLabel}>New Value</div>
                                <div style={styles.resultValue(currentMode.color)}>{changeResult.toFixed(2)}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Decrease */}
                {mode === 'decrease' && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            <MdTrendingDown style={{ color: '#EF4444' }} />
                            Decrease by Percentage
                        </h3>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Original Value</label>
                            <input style={styles.input} type="number" value={originalValue} onChange={e => setOriginalValue(e.target.value)} placeholder="100" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Decrease by (%)</label>
                            <input style={styles.input} type="number" value={changePercent} onChange={e => setChangePercent(e.target.value)} placeholder="10" />
                        </div>
                        <button style={styles.calcBtn(currentMode.gradient, `0 8px 24px ${currentMode.color}40`)} onClick={() => calculateChange(false)}>
                            Calculate Decrease
                        </button>
                        {changeResult !== null && (
                            <div style={styles.resultCard(currentMode.color)}>
                                <div style={styles.resultLabel}>New Value</div>
                                <div style={styles.resultValue(currentMode.color)}>{changeResult.toFixed(2)}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tip */}
                {mode === 'tip' && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            <MdRestaurant style={{ color: '#F59E0B' }} />
                            Tip Calculator
                        </h3>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Bill Amount</label>
                            <input style={styles.input} type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="0.00" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Tip Percentage</label>
                            <div style={styles.tipPresets}>
                                {tipPresets.map(t => (
                                    <button key={t} style={styles.tipBtn(tipPercent === t.toString())} onClick={() => setTipPercent(t.toString())}>
                                        {t}%
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Split Between</label>
                            <input style={styles.input} type="number" value={splitCount} onChange={e => setSplitCount(e.target.value)} min="1" placeholder="1" />
                        </div>
                        {billAmount && (
                            <div style={styles.tipResults}>
                                <div style={styles.tipResultCard('#F59E0B')}>
                                    <div style={styles.tipResultLabel}>Tip</div>
                                    <div style={styles.tipResultValue('#F59E0B')}>₹{tipAmount().toFixed(2)}</div>
                                </div>
                                <div style={styles.tipResultCard('#10B981')}>
                                    <div style={styles.tipResultLabel}>Total</div>
                                    <div style={styles.tipResultValue('#10B981')}>₹{totalWithTip().toFixed(2)}</div>
                                </div>
                                <div style={styles.tipResultCard('#6366F1')}>
                                    <div style={styles.tipResultLabel}>Per Person</div>
                                    <div style={styles.tipResultValue('#6366F1')}>₹{perPerson().toFixed(2)}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                input:focus { border-color: #6366F1 !important; background: white !important; }
            `}</style>
        </div>
    );
};

export default PercentageCalculator;
