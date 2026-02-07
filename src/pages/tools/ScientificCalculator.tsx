import React, { useState, useCallback, useEffect } from 'react';
import { create, all } from 'mathjs';
import { MdArrowBack, MdHistory, MdDeleteSweep, MdBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const math = create(all);

const ScientificCalculator: React.FC = () => {
    const navigate = useNavigate();
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('0');
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [mode, setMode] = useState<'DEG' | 'RAD'>('DEG');
    const [memory, setMemory] = useState<number>(0);
    const [isSecond, setIsSecond] = useState(false);
    const [lastPressed, setLastPressed] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('scientific_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('scientific_history', JSON.stringify(history));
    }, [history]);

    const scientificButtons = [
        ['2nd', mode, 'MC', 'MR', 'M+', 'M-'],
        [isSecond ? 'sin⁻¹' : 'sin', isSecond ? 'cos⁻¹' : 'cos', isSecond ? 'tan⁻¹' : 'tan', 'ln', 'log', '√'],
        ['x²', 'x³', 'xʸ', 'eˣ', '10ˣ', '1/x'],
        ['(', ')', 'π', 'e', '!', '%'],
    ];

    const basicButtons = [
        ['C', '⌫', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['±', '0', '.', '='],
    ];

    const handleScientificClick = useCallback((btn: string) => {
        setLastPressed(btn);
        setTimeout(() => setLastPressed(null), 150);

        switch (btn) {
            case '2nd': setIsSecond(!isSecond); break;
            case 'DEG': case 'RAD': setMode(mode === 'DEG' ? 'RAD' : 'DEG'); break;
            case 'MC': setMemory(0); break;
            case 'MR': setExpression(prev => prev + memory.toString()); break;
            case 'M+': try { setMemory(memory + math.evaluate(expression)); } catch { } break;
            case 'M-': try { setMemory(memory - math.evaluate(expression)); } catch { } break;
            case 'sin': setExpression(prev => prev + 'sin('); break;
            case 'cos': setExpression(prev => prev + 'cos('); break;
            case 'tan': setExpression(prev => prev + 'tan('); break;
            case 'sin⁻¹': setExpression(prev => prev + 'asin('); break;
            case 'cos⁻¹': setExpression(prev => prev + 'acos('); break;
            case 'tan⁻¹': setExpression(prev => prev + 'atan('); break;
            case 'ln': setExpression(prev => prev + 'log('); break;
            case 'log': setExpression(prev => prev + 'log10('); break;
            case '√': setExpression(prev => prev + 'sqrt('); break;
            case 'x²': setExpression(prev => prev + '^2'); break;
            case 'x³': setExpression(prev => prev + '^3'); break;
            case 'xʸ': setExpression(prev => prev + '^'); break;
            case 'eˣ': setExpression(prev => prev + 'exp('); break;
            case '10ˣ': setExpression(prev => prev + '10^'); break;
            case '1/x': setExpression(prev => '1/(' + prev + ')'); break;
            case 'π': setExpression(prev => prev + 'pi'); break;
            case 'e': setExpression(prev => prev + 'e'); break;
            case '!': setExpression(prev => prev + '!'); break;
            case '(': case ')': case '%': setExpression(prev => prev + btn); break;
        }
    }, [mode, memory, isSecond, expression]);

    const handleBasicClick = useCallback((value: string) => {
        setLastPressed(value);
        setTimeout(() => setLastPressed(null), 150);

        switch (value) {
            case 'C': setExpression(''); setResult('0'); break;
            case '⌫': setExpression(prev => prev.slice(0, -1)); break;
            case '=': calculate(); break;
            case '±':
                if (expression.startsWith('-')) setExpression(expression.substring(1));
                else if (expression) setExpression('-' + expression);
                break;
            case '×': setExpression(prev => prev + '*'); break;
            case '÷': setExpression(prev => prev + '/'); break;
            default: setExpression(prev => prev + value);
        }
    }, [expression]);

    const calculate = useCallback(() => {
        if (!expression) return;
        try {
            let expr = expression;
            if (mode === 'DEG') {
                expr = expr.replace(/sin\(([^)]+)\)/g, (_, arg) => `sin(${arg} * pi / 180)`);
                expr = expr.replace(/cos\(([^)]+)\)/g, (_, arg) => `cos(${arg} * pi / 180)`);
                expr = expr.replace(/tan\(([^)]+)\)/g, (_, arg) => `tan(${arg} * pi / 180)`);
            }
            const evalResult = math.evaluate(expr);
            const formattedResult = Number.isInteger(evalResult)
                ? evalResult.toString()
                : Number(evalResult.toFixed(10)).toString();
            setResult(formattedResult);
            setHistory(prev => [`${expression} = ${formattedResult}`, ...prev].slice(0, 30));
            setExpression(formattedResult);
        } catch {
            setResult('Error');
        }
    }, [expression, mode]);

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EDE9FE 100%)',
            display: 'flex',
            flexDirection: 'column' as const,
            paddingBottom: '20px',
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
        title: { fontSize: '18px', fontWeight: 700, color: '#1F2937' },
        displayCard: {
            margin: '0 16px 16px',
            background: 'white',
            borderRadius: '24px',
            padding: '20px',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'flex-end',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        },
        modeRow: {
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
        },
        modeBadge: (active: boolean) => ({
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            background: active ? '#8B5CF6' : '#F3F4F6',
            color: active ? 'white' : '#9CA3AF',
        }),
        expression: {
            fontSize: '16px',
            color: '#9CA3AF',
            fontFamily: 'SF Mono, Consolas, monospace',
            wordBreak: 'break-all' as const,
            textAlign: 'right' as const,
            minHeight: '24px',
        },
        result: {
            fontSize: '40px',
            fontWeight: 700,
            color: '#1F2937',
            fontFamily: 'SF Mono, Consolas, monospace',
            textAlign: 'right' as const,
        },
        sciPad: {
            margin: '0 16px 12px',
            background: 'white',
            borderRadius: '20px',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        },
        sciBtn: (btn: string, pressed: boolean) => {
            const is2nd = btn === '2nd' && isSecond;
            const isMode = btn === 'DEG' || btn === 'RAD';
            const isMem = ['MC', 'MR', 'M+', 'M-'].includes(btn);
            return {
                height: '42px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                transform: pressed ? 'scale(0.92)' : 'scale(1)',
                background: is2nd ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' :
                    isMode ? '#EC4899' :
                        isMem ? '#F3F4F6' : '#FAFAFA',
                color: is2nd ? 'white' : isMode ? 'white' : isMem && memory !== 0 ? '#6366F1' : '#6366F1',
                boxShadow: is2nd ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
            };
        },
        basicPad: {
            margin: '0 16px',
            background: 'white',
            borderRadius: '24px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        },
        basicBtn: (type: string, pressed: boolean) => {
            const base = {
                height: '60px',
                borderRadius: '16px',
                fontSize: '22px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: pressed ? 'scale(0.92)' : 'scale(1)',
            };
            if (type === 'equals') return { ...base, background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white', boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)' };
            if (type === 'operator') return { ...base, background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)' };
            if (type === 'function') return { ...base, background: '#F3F4F6', color: '#6B7280' };
            return { ...base, background: '#FAFAFA', color: '#1F2937' };
        },
    };

    const getType = (btn: string) => {
        if (btn === '=') return 'equals';
        if (['÷', '×', '-', '+', '%'].includes(btn)) return 'operator';
        if (['C', '⌫', '±'].includes(btn)) return 'function';
        return 'number';
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn()} onClick={() => navigate(-1)}>
                    <MdArrowBack size={22} />
                </button>
                <span style={styles.title}>Scientific Calculator</span>
                <button style={styles.iconBtn(showHistory)} onClick={() => setShowHistory(!showHistory)}>
                    <MdHistory size={22} />
                </button>
            </div>

            <div style={styles.displayCard}>
                {showHistory ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#9CA3AF' }}>History</span>
                            {history.length > 0 && (
                                <button onClick={() => setHistory([])} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                                    <MdDeleteSweep size={18} />
                                </button>
                            )}
                        </div>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {history.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#D1D5DB', padding: '20px 0' }}>No history</p>
                            ) : history.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => { setExpression(item.split(' = ')[1]); setShowHistory(false); }}
                                    style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #F3F4F6', fontSize: '14px', color: '#6B7280', cursor: 'pointer' }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={styles.modeRow}>
                            <span style={styles.modeBadge(mode === 'DEG')}>{mode}</span>
                            {memory !== 0 && <span style={styles.modeBadge(true)}>M</span>}
                        </div>
                        <div style={styles.expression}>{expression || ' '}</div>
                        <div style={styles.result}>{result}</div>
                    </>
                )}
            </div>

            <div style={styles.sciPad}>
                {scientificButtons.flat().map(btn => (
                    <button key={btn} style={styles.sciBtn(btn, lastPressed === btn)} onClick={() => handleScientificClick(btn)}>
                        {btn}
                    </button>
                ))}
            </div>

            <div style={styles.basicPad}>
                {basicButtons.flat().map(btn => (
                    <button key={btn} style={styles.basicBtn(getType(btn), lastPressed === btn)} onClick={() => handleBasicClick(btn)}>
                        {btn === '⌫' ? <MdBackspace size={22} /> : btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ScientificCalculator;
