import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { create, all } from 'mathjs';
import { MdArrowBack, MdSwapVert, MdContentCopy, MdCheck } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const math = create(all);

const categories: Record<string, { units: string[]; labels: Record<string, string>; icon: string }> = {
    length: { units: ['mm', 'cm', 'm', 'km', 'inch', 'foot', 'yard', 'mile'], labels: { mm: 'Millimeter', cm: 'Centimeter', m: 'Meter', km: 'Kilometer', inch: 'Inch', foot: 'Foot', yard: 'Yard', mile: 'Mile' }, icon: '📏' },
    weight: { units: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'], labels: { mg: 'Milligram', g: 'Gram', kg: 'Kilogram', oz: 'Ounce', lb: 'Pound', ton: 'Ton' }, icon: '⚖️' },
    time: { units: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'], labels: { second: 'Second', minute: 'Minute', hour: 'Hour', day: 'Day', week: 'Week', month: 'Month', year: 'Year' }, icon: '⏱️' },
    temperature: { units: ['degC', 'degF', 'K'], labels: { degC: 'Celsius (°C)', degF: 'Fahrenheit (°F)', K: 'Kelvin (K)' }, icon: '🌡️' },
    speed: { units: ['m/s', 'km/h', 'mph'], labels: { 'm/s': 'Meters/sec', 'km/h': 'Km/hour', 'mph': 'Miles/hour' }, icon: '🚀' },
    volume: { units: ['ml', 'l', 'cup', 'pint', 'quart', 'gallon'], labels: { ml: 'Milliliter', l: 'Liter', cup: 'Cup', pint: 'Pint', quart: 'Quart', gallon: 'Gallon' }, icon: '🧪' },
    area: { units: ['mm2', 'cm2', 'm2', 'km2', 'sqft', 'acre', 'hectare'], labels: { mm2: 'sq mm', cm2: 'sq cm', m2: 'sq m', km2: 'sq km', sqft: 'sq ft', acre: 'Acre', hectare: 'Hectare' }, icon: '📐' },
    data: { units: ['bit', 'byte', 'kB', 'MB', 'GB', 'TB'], labels: { bit: 'Bit', byte: 'Byte', kB: 'Kilobyte', MB: 'Megabyte', GB: 'Gigabyte', TB: 'Terabyte' }, icon: '💾' },
};

const categoryList = Object.keys(categories);

const UnitConverter: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const category = type?.toLowerCase() || 'length';

    const config = categories[category] || categories.length;
    const units = config.units;
    const labels = config.labels;

    const [fromUnit, setFromUnit] = useState(units[0]);
    const [toUnit, setToUnit] = useState(units[1]);
    const [fromValue, setFromValue] = useState('1');
    const [toValue, setToValue] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);
    const [copied, setCopied] = useState(false);

    const bg = isDarkMode ? '#0F172A' : 'linear-gradient(180deg, #F8FAFC 0%, #E0F2FE 100%)';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#6B7280';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F9FAFB';

    useEffect(() => {
        if (units.length > 0) {
            setFromUnit(units[0]);
            setToUnit(units[1]);
            convert('1', units[0], units[1]);
        }
    }, [category]);

    const convert = (val: string, from: string, to: string) => {
        setFromValue(val);
        if (!val || isNaN(parseFloat(val))) { setToValue(''); return; }
        try {
            let fromFixed = from === 'km/h' ? 'km/hour' : from;
            let toFixed = to === 'km/h' ? 'km/hour' : to;

            // Handle data units manually (mathjs doesn't support these well)
            if (category === 'data') {
                const dataFactors: Record<string, number> = { bit: 1, byte: 8, kB: 8000, MB: 8000000, GB: 8000000000, TB: 8000000000000 };
                const bits = parseFloat(val) * dataFactors[from];
                const result = bits / dataFactors[to];
                setToValue(formatResult(result));
                return;
            }

            const result = math.unit(parseFloat(val), fromFixed).to(toFixed).toNumber();
            setToValue(formatResult(result));
        } catch { setToValue('Error'); }
    };

    const formatResult = (result: number) => {
        if (Number.isInteger(result)) return result.toString();
        if (Math.abs(result) >= 1) return result.toFixed(4).replace(/\.?0+$/, '');
        return result.toPrecision(6).replace(/\.?0+$/, '');
    };

    const handleSwap = () => {
        setIsSwapping(true);
        setTimeout(() => {
            const tempUnit = fromUnit;
            const tempValue = toValue;
            setFromUnit(toUnit);
            setToUnit(tempUnit);
            convert(tempValue, toUnit, tempUnit);
            setIsSwapping(false);
        }, 200);
    };

    const copyResult = () => {
        navigator.clipboard.writeText(`${fromValue} ${labels[fromUnit]} = ${toValue} ${labels[toUnit]}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', position: 'sticky' as const, top: 0, zIndex: 10, background: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)' },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: card, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.06)' },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        categoryScroll: { display: 'flex', gap: '10px', padding: '0 16px 20px', overflowX: 'auto' as const },
        categoryChip: (active: boolean) => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderRadius: '16px', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' as const, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : card, color: active ? 'white' : muted, boxShadow: active ? '0 4px 12px rgba(79, 70, 229, 0.35)' : (isDarkMode ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)') }),
        converterCard: { margin: '0 16px', background: card, borderRadius: '28px', padding: '24px', boxShadow: isDarkMode ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.06)', border: `1px solid ${border}` },
        unitBlock: { marginBottom: '12px' },
        unitLabel: { fontSize: '12px', fontWeight: 600, color: muted, textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '10px' },
        inputRow: { display: 'flex', gap: '12px', alignItems: 'center' },
        input: { flex: 1, padding: '18px 20px', fontSize: '24px', fontWeight: 700, fontFamily: 'SF Mono, Consolas, monospace', background: inputBg, borderRadius: '18px', border: `2px solid ${border}`, outline: 'none', transition: 'all 0.2s ease', color: text },
        select: { padding: '16px 14px', fontSize: '13px', fontWeight: 600, background: inputBg, borderRadius: '14px', border: `1px solid ${border}`, cursor: 'pointer', minWidth: '110px', color: text },
        swapBtn: { width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)', margin: '16px auto', transition: 'all 0.3s ease', transform: isSwapping ? 'rotate(180deg)' : 'rotate(0deg)' },
        resultBlock: { background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', borderRadius: '20px', padding: '24px', color: 'white', textAlign: 'center' as const, position: 'relative' as const },
        resultLabel: { fontSize: '14px', opacity: 0.85, marginBottom: '8px' },
        resultValue: { fontSize: '36px', fontWeight: 700, fontFamily: 'SF Mono, Consolas, monospace' },
        resultUnit: { fontSize: '14px', opacity: 0.85, marginTop: '4px' },
        copyBtn: { position: 'absolute' as const, top: '12px', right: '12px', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
        quickConversions: { margin: '24px 16px 0', background: card, borderRadius: '20px', padding: '20px', border: `1px solid ${border}` },
        quickTitle: { fontSize: '14px', fontWeight: 600, color: muted, marginBottom: '16px' },
        quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' },
        quickCard: { background: inputBg, borderRadius: '14px', padding: '14px', textAlign: 'center' as const, cursor: 'pointer' },
        quickValue: { fontSize: '16px', fontWeight: 700, color: text },
        quickLabel: { fontSize: '11px', color: muted, marginTop: '4px' },
    };

    // Quick conversions for the current category
    const getQuickConversions = () => {
        const val = parseFloat(fromValue);
        if (isNaN(val)) return [];
        return units.slice(0, 4).map(u => {
            try {
                let fromFixed = fromUnit === 'km/h' ? 'km/hour' : fromUnit;
                let toFixed = u === 'km/h' ? 'km/hour' : u;
                if (category === 'data') {
                    const dataFactors: Record<string, number> = { bit: 1, byte: 8, kB: 8000, MB: 8000000, GB: 8000000000, TB: 8000000000000 };
                    const bits = val * dataFactors[fromUnit];
                    return { unit: u, value: formatResult(bits / dataFactors[u]), label: labels[u] };
                }
                const result = math.unit(val, fromFixed).to(toFixed).toNumber();
                return { unit: u, value: formatResult(result), label: labels[u] };
            } catch { return { unit: u, value: '—', label: labels[u] }; }
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Unit Converter</span>
                <div style={{ width: '44px' }} />
            </div>

            <div style={styles.categoryScroll}>
                {categoryList.map(cat => (
                    <button key={cat} style={styles.categoryChip(cat === category)} onClick={() => navigate(`/tools/converter/${cat}`)}>
                        <span>{categories[cat].icon}</span>
                        <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                    </button>
                ))}
            </div>

            <div style={styles.converterCard}>
                <div style={styles.unitBlock}>
                    <div style={styles.unitLabel}>From</div>
                    <div style={styles.inputRow}>
                        <input type="number" value={fromValue} onChange={(e) => convert(e.target.value, fromUnit, toUnit)} style={styles.input} placeholder="0" />
                        <select value={fromUnit} onChange={(e) => { setFromUnit(e.target.value); convert(fromValue, e.target.value, toUnit); }} style={styles.select}>
                            {units.map(u => <option key={u} value={u}>{labels[u]}</option>)}
                        </select>
                    </div>
                </div>

                <button style={styles.swapBtn} onClick={handleSwap}><MdSwapVert size={28} /></button>

                <div style={styles.unitBlock}>
                    <div style={styles.unitLabel}>To</div>
                    <div style={styles.inputRow}>
                        <select value={toUnit} onChange={(e) => { setToUnit(e.target.value); convert(fromValue, fromUnit, e.target.value); }} style={styles.select}>
                            {units.map(u => <option key={u} value={u}>{labels[u]}</option>)}
                        </select>
                    </div>
                </div>

                <div style={styles.resultBlock}>
                    <button style={styles.copyBtn} onClick={copyResult}>{copied ? <MdCheck size={18} /> : <MdContentCopy size={18} />}</button>
                    <div style={styles.resultLabel}>Result</div>
                    <div style={styles.resultValue}>{toValue || '0'}</div>
                    <div style={styles.resultUnit}>{labels[toUnit]}</div>
                </div>
            </div>

            <div style={styles.quickConversions}>
                <div style={styles.quickTitle}>Quick Reference</div>
                <div style={styles.quickGrid}>
                    {getQuickConversions().map(q => (
                        <div key={q.unit} style={styles.quickCard} onClick={() => { setToUnit(q.unit); convert(fromValue, fromUnit, q.unit); }}>
                            <div style={styles.quickValue}>{q.value}</div>
                            <div style={styles.quickLabel}>{q.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                input:focus { border-color: #4F46E5 !important; }
                select:focus { border-color: #4F46E5 !important; outline: none; }
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default UnitConverter;
