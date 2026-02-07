import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdDelete, MdEdit, MdSave, MdFunctions, MdClose } from 'react-icons/md';
import { create, all } from 'mathjs';

const math = create(all);

interface Formula {
    id: string;
    name: string;
    formula: string;
    variables: string[];
    category: string;
}

const defaultFormulas: Formula[] = [
    { id: '1', name: 'Area of Circle', formula: 'pi * r^2', variables: ['r'], category: 'Geometry' },
    { id: '2', name: 'Pythagorean', formula: 'sqrt(a^2 + b^2)', variables: ['a', 'b'], category: 'Geometry' },
    { id: '3', name: 'Compound Interest', formula: 'P * (1 + r/n)^(n*t)', variables: ['P', 'r', 'n', 't'], category: 'Finance' },
    { id: '4', name: 'BMI', formula: 'weight / (height^2)', variables: ['weight', 'height'], category: 'Health' },
    { id: '5', name: 'Speed', formula: 'distance / time', variables: ['distance', 'time'], category: 'Physics' },
];

const categories = ['All', 'Geometry', 'Finance', 'Health', 'Physics', 'Custom'];
const categoryColors: Record<string, string> = {
    'Geometry': '#6366F1',
    'Finance': '#10B981',
    'Health': '#EC4899',
    'Physics': '#F59E0B',
    'Custom': '#8B5CF6',
};

const CustomFormulas: React.FC = () => {
    const navigate = useNavigate();
    const [formulas, setFormulas] = useState<Formula[]>([]);
    const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});
    const [result, setResult] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
    const [newName, setNewName] = useState('');
    const [newFormula, setNewFormula] = useState('');
    const [newVariables, setNewVariables] = useState('');
    const [newCategory, setNewCategory] = useState('Custom');

    useEffect(() => {
        const saved = localStorage.getItem('custom_formulas');
        if (saved) setFormulas(JSON.parse(saved));
        else { setFormulas(defaultFormulas); localStorage.setItem('custom_formulas', JSON.stringify(defaultFormulas)); }
    }, []);

    const saveFormulas = (updated: Formula[]) => {
        setFormulas(updated);
        localStorage.setItem('custom_formulas', JSON.stringify(updated));
    };

    const selectFormula = (formula: Formula) => {
        setSelectedFormula(formula);
        setVariableValues({});
        setResult(null);
    };

    const calculateResult = () => {
        if (!selectedFormula) return;
        try {
            let expr = selectedFormula.formula;
            for (const v of selectedFormula.variables) {
                const val = variableValues[v];
                if (!val || isNaN(parseFloat(val))) { setResult('Fill all values'); return; }
                expr = expr.replace(new RegExp(`\\b${v}\\b`, 'g'), val);
            }
            const evalResult = math.evaluate(expr);
            setResult(typeof evalResult === 'number' ? evalResult.toFixed(6).replace(/\.?0+$/, '') : String(evalResult));
        } catch { setResult('Error'); }
    };

    const openModal = (formula?: Formula) => {
        if (formula) {
            setEditingFormula(formula);
            setNewName(formula.name);
            setNewFormula(formula.formula);
            setNewVariables(formula.variables.join(', '));
            setNewCategory(formula.category);
        } else {
            setEditingFormula(null);
            setNewName(''); setNewFormula(''); setNewVariables(''); setNewCategory('Custom');
        }
        setShowModal(true);
    };

    const saveNewFormula = () => {
        if (!newName.trim() || !newFormula.trim()) return;
        const variables = newVariables.split(',').map(v => v.trim()).filter(v => v);
        if (editingFormula) {
            saveFormulas(formulas.map(f => f.id === editingFormula.id
                ? { ...f, name: newName, formula: newFormula, variables, category: newCategory }
                : f));
        } else {
            saveFormulas([...formulas, { id: Date.now().toString(), name: newName, formula: newFormula, variables, category: newCategory }]);
        }
        setShowModal(false);
    };

    const deleteFormula = (id: string) => {
        if (confirm('Delete this formula?')) {
            saveFormulas(formulas.filter(f => f.id !== id));
            if (selectedFormula?.id === id) setSelectedFormula(null);
        }
    };

    const filteredFormulas = activeCategory === 'All' ? formulas : formulas.filter(f => f.category === activeCategory);

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
        iconBtn: (active?: boolean) => ({
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: active ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: active ? 'white' : '#6B7280',
            boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
        }),
        title: { fontSize: '18px', fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' },
        content: { padding: '0 16px' },
        categoryScroll: { display: 'flex', gap: '8px', overflowX: 'auto' as const, paddingBottom: '16px', marginBottom: '16px' },
        categoryChip: (active: boolean) => ({
            padding: '10px 18px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap' as const,
            border: 'none',
            cursor: 'pointer',
            background: active ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'white',
            color: active ? 'white' : '#6B7280',
            boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        }),
        formulaList: { display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '24px' },
        formulaCard: (selected: boolean, color: string) => ({
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: selected ? `2px solid ${color}` : '2px solid transparent',
            boxShadow: selected ? `0 8px 24px ${color}30` : '0 4px 16px rgba(0, 0, 0, 0.04)',
        }),
        formulaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
        categoryBadge: (color: string) => ({
            fontSize: '11px',
            fontWeight: 600,
            color: color,
            background: `${color}15`,
            padding: '4px 10px',
            borderRadius: '8px',
        }),
        formulaName: { fontSize: '16px', fontWeight: 700, color: '#1F2937', marginTop: '8px' },
        formulaExpr: { fontSize: '14px', color: '#9CA3AF', fontFamily: 'SF Mono, Consolas, monospace', marginTop: '4px' },
        variableTags: { display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' as const },
        variableTag: { fontSize: '12px', color: '#6B7280', background: '#F3F4F6', padding: '4px 10px', borderRadius: '8px' },
        actionBtns: { display: 'flex', gap: '4px' },
        actionBtn: (color: string) => ({
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#F9FAFB',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9CA3AF',
            transition: 'all 0.2s ease',
        }),
        calcCard: {
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        },
        input: {
            width: '100%',
            padding: '16px 20px',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'SF Mono, Consolas, monospace',
            background: '#F9FAFB',
            borderRadius: '14px',
            border: '2px solid transparent',
            outline: 'none',
        },
        calcBtn: {
            width: '100%',
            padding: '18px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            marginTop: '16px',
        },
        resultCard: {
            marginTop: '20px',
            padding: '24px',
            borderRadius: '20px',
            background: '#6366F115',
            textAlign: 'center' as const,
        },
        modal: {
            position: 'fixed' as const,
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '20px',
        },
        modalContent: {
            background: 'white',
            borderRadius: '24px',
            padding: '28px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '90vh',
            overflowY: 'auto' as const,
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
        },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1F2937' },
        closeBtn: {
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#F3F4F6',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
        },
        label: { fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' },
        select: {
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            background: '#F9FAFB',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
        },
        emptyState: { textAlign: 'center' as const, padding: '60px 20px', color: '#D1D5DB' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn()} onClick={() => navigate(-1)}>
                    <MdArrowBack size={22} />
                </button>
                <span style={styles.title}>
                    <MdFunctions style={{ color: '#6366F1' }} />
                    Custom Formulas
                </span>
                <button style={styles.iconBtn(true)} onClick={() => openModal()}>
                    <MdAdd size={22} />
                </button>
            </div>

            <div style={styles.content}>
                {/* Category Filter */}
                <div style={styles.categoryScroll}>
                    {categories.map(cat => (
                        <button key={cat} style={styles.categoryChip(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Formula List */}
                <div style={styles.formulaList}>
                    {filteredFormulas.length === 0 ? (
                        <div style={styles.emptyState}>
                            <MdFunctions size={56} style={{ opacity: 0.3, marginBottom: '12px' }} />
                            <p>No formulas here</p>
                        </div>
                    ) : filteredFormulas.map(f => {
                        const color = categoryColors[f.category] || '#6366F1';
                        return (
                            <div key={f.id} style={styles.formulaCard(selectedFormula?.id === f.id, color)} onClick={() => selectFormula(f)}>
                                <div style={styles.formulaHeader}>
                                    <span style={styles.categoryBadge(color)}>{f.category}</span>
                                    <div style={styles.actionBtns}>
                                        <button style={styles.actionBtn('#6366F1')} onClick={(e) => { e.stopPropagation(); openModal(f); }}><MdEdit size={16} /></button>
                                        <button style={styles.actionBtn('#EF4444')} onClick={(e) => { e.stopPropagation(); deleteFormula(f.id); }}><MdDelete size={16} /></button>
                                    </div>
                                </div>
                                <div style={styles.formulaName}>{f.name}</div>
                                <div style={styles.formulaExpr}>{f.formula}</div>
                                <div style={styles.variableTags}>
                                    {f.variables.map(v => <span key={v} style={styles.variableTag}>{v}</span>)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Calculator */}
                {selectedFormula && (
                    <div style={styles.calcCard}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{selectedFormula.name}</h3>
                        <p style={{ fontSize: '14px', color: '#9CA3AF', fontFamily: 'monospace', marginBottom: '20px' }}>{selectedFormula.formula}</p>
                        {selectedFormula.variables.map(v => (
                            <div key={v} style={{ marginBottom: '12px' }}>
                                <label style={styles.label}>{v}</label>
                                <input style={styles.input} type="number" value={variableValues[v] || ''} onChange={e => setVariableValues({ ...variableValues, [v]: e.target.value })} placeholder={`Enter ${v}`} />
                            </div>
                        ))}
                        <button style={styles.calcBtn} onClick={calculateResult}>Calculate</button>
                        {result && (
                            <div style={styles.resultCard}>
                                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Result</div>
                                <div style={{ fontSize: '36px', fontWeight: 700, color: '#6366F1', fontFamily: 'monospace' }}>{result}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>{editingFormula ? 'Edit Formula' : 'New Formula'}</span>
                            <button style={styles.closeBtn} onClick={() => setShowModal(false)}><MdClose size={20} /></button>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Name</label>
                            <input style={styles.input} type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Area of Triangle" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Formula</label>
                            <input style={{ ...styles.input, fontFamily: 'monospace' }} type="text" value={newFormula} onChange={e => setNewFormula(e.target.value)} placeholder="0.5 * base * height" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={styles.label}>Variables (comma separated)</label>
                            <input style={styles.input} type="text" value={newVariables} onChange={e => setNewVariables(e.target.value)} placeholder="base, height" />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={styles.label}>Category</label>
                            <select style={styles.select} value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button style={styles.calcBtn} onClick={saveNewFormula}>
                            <MdSave size={20} style={{ marginRight: '8px' }} />
                            {editingFormula ? 'Update' : 'Save'} Formula
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                input:focus { border-color: #6366F1 !important; background: white !important; }
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default CustomFormulas;
