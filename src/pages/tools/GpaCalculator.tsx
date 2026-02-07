import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdDelete, MdCalculate } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

interface Subject { name: string; grade: string; credits: number; }
const gradePoints: Record<string, number> = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0 };

const GpaCalculator: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [subjects, setSubjects] = useState<Subject[]>([{ name: '', grade: 'A', credits: 3 }]);
    const [gpa, setGpa] = useState<number | null>(null);

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    const addSubject = () => setSubjects([...subjects, { name: '', grade: 'A', credits: 3 }]);
    const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));
    const updateSubject = (i: number, field: keyof Subject, value: string | number) => {
        const updated = [...subjects]; updated[i] = { ...updated[i], [field]: value }; setSubjects(updated);
    };
    const calculate = () => {
        let totalPoints = 0, totalCredits = 0;
        subjects.forEach(s => { totalPoints += gradePoints[s.grade] * s.credits; totalCredits += s.credits; });
        setGpa(totalCredits > 0 ? totalPoints / totalCredits : 0);
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '40px' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: card, borderBottom: `1px solid ${border}` },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        title: { fontSize: '18px', fontWeight: 700, color: text },
        content: { padding: '20px 16px' },
        card: { background: card, borderRadius: '20px', padding: '20px', marginBottom: '16px', border: `1px solid ${border}` },
        row: { display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' },
        input: { flex: 1, padding: '14px', fontSize: '15px', background: inputBg, borderRadius: '12px', border: `1px solid ${border}`, outline: 'none', color: text },
        select: { padding: '14px', fontSize: '15px', background: inputBg, borderRadius: '12px', border: `1px solid ${border}`, outline: 'none', minWidth: '80px', color: text },
        creditInput: { width: '60px', padding: '14px', fontSize: '15px', background: inputBg, borderRadius: '12px', border: `1px solid ${border}`, outline: 'none', textAlign: 'center' as const, color: text },
        deleteBtn: { width: '40px', height: '40px', borderRadius: '10px', background: isDarkMode ? '#7F1D1D' : '#FEE2E2', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        addBtn: { width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 600, background: inputBg, border: `2px dashed ${border}`, cursor: 'pointer', color: muted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
        calcBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', color: 'white', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)', marginTop: '16px' },
        result: { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: '24px', padding: '32px', textAlign: 'center' as const, color: 'white', marginTop: '24px' },
        gpaValue: { fontSize: '56px', fontWeight: 800 },
        gpaLabel: { fontSize: '16px', opacity: 0.9, marginTop: '8px' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>GPA Calculator</span>
            </div>
            <div style={styles.content}>
                <div style={styles.card}>
                    {subjects.map((s, i) => (
                        <div key={i} style={styles.row}>
                            <input style={styles.input} placeholder="Subject name" value={s.name} onChange={e => updateSubject(i, 'name', e.target.value)} />
                            <select style={styles.select} value={s.grade} onChange={e => updateSubject(i, 'grade', e.target.value)}>
                                {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <input style={styles.creditInput} type="number" min={1} max={6} value={s.credits} onChange={e => updateSubject(i, 'credits', parseInt(e.target.value) || 1)} />
                            {subjects.length > 1 && <button style={styles.deleteBtn} onClick={() => removeSubject(i)}><MdDelete size={18} /></button>}
                        </div>
                    ))}
                    <button style={styles.addBtn} onClick={addSubject}><MdAdd size={20} /> Add Subject</button>
                </div>
                <button style={styles.calcBtn} onClick={calculate}><MdCalculate size={20} style={{ marginRight: 8 }} /> Calculate GPA</button>
                {gpa !== null && (<div style={styles.result}><div style={styles.gpaValue}>{gpa.toFixed(2)}</div><div style={styles.gpaLabel}>Your GPA</div></div>)}
            </div>
        </div>
    );
};

export default GpaCalculator;
