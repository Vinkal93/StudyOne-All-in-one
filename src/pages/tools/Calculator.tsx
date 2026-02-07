import React, { useState, useCallback, useEffect } from 'react';
import { create, all } from 'mathjs';
import { MdHistory, MdBackspace, MdArrowBack, MdDeleteSweep } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const math = create(all);

const Calculator: React.FC = () => {
    const navigate = useNavigate();
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('0');
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [lastPressed, setLastPressed] = useState<string | null>(null);

    const buttons = [
        ['C', '⌫', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['±', '0', '.', '='],
    ];

    useEffect(() => {
        const savedHistory = localStorage.getItem('calculator_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    useEffect(() => {
        localStorage.setItem('calculator_history', JSON.stringify(history));
    }, [history]);

    const handleButtonClick = useCallback((value: string) => {
        setLastPressed(value);
        setTimeout(() => setLastPressed(null), 150);

        switch (value) {
            case 'C':
                setExpression('');
                setResult('0');
                break;
            case '⌫':
                setExpression((prev) => prev.slice(0, -1));
                break;
            case '=':
                calculate();
                break;
            case '±':
                if (expression.startsWith('-')) {
                    setExpression(expression.substring(1));
                } else if (expression) {
                    setExpression('-' + expression);
                }
                break;
            case '×':
                setExpression((prev) => prev + '*');
                break;
            case '÷':
                setExpression((prev) => prev + '/');
                break;
            default:
                setExpression((prev) => prev + value);
        }
    }, [expression]);

    const calculate = useCallback(() => {
        if (!expression) return;
        try {
            const evalResult = math.evaluate(expression);
            let formattedResult = Number.isInteger(evalResult)
                ? evalResult.toString()
                : evalResult.toFixed(8).replace(/\.?0+$/, '');
            setResult(formattedResult);
            const historyItem = `${expression} = ${formattedResult}`;
            setHistory(prev => [historyItem, ...prev].slice(0, 30));
            setExpression(formattedResult);
        } catch {
            setResult('Error');
        }
    }, [expression]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
            if (/^[0-9.]$/.test(key)) handleButtonClick(key);
            else if (key === '+') handleButtonClick('+');
            else if (key === '-') handleButtonClick('-');
            else if (key === '*') handleButtonClick('×');
            else if (key === '/') handleButtonClick('÷');
            else if (key === '%') handleButtonClick('%');
            else if (key === 'Enter' || key === '=') handleButtonClick('=');
            else if (key === 'Backspace') handleButtonClick('⌫');
            else if (key === 'Escape' || key === 'c' || key === 'C') handleButtonClick('C');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleButtonClick]);

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('calculator_history');
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)',
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
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
        },
        backBtn: {
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
        title: {
            fontSize: '18px',
            fontWeight: 700,
            color: '#1F2937',
        },
        historyBtn: (active: boolean) => ({
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
        displayCard: {
            margin: '0 16px',
            background: 'white',
            borderRadius: '28px',
            padding: '28px',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
        },
        expression: {
            fontSize: '20px',
            color: '#9CA3AF',
            marginBottom: '12px',
            wordBreak: 'break-all' as const,
            textAlign: 'right' as const,
            width: '100%',
            fontFamily: 'SF Mono, Consolas, monospace',
            minHeight: '28px',
            letterSpacing: '1px',
        },
        result: {
            fontSize: '52px',
            fontWeight: 700,
            color: '#1F2937',
            wordBreak: 'break-all' as const,
            textAlign: 'right' as const,
            width: '100%',
            fontFamily: 'SF Mono, Consolas, monospace',
            lineHeight: 1,
        },
        keypad: {
            margin: '20px 16px 0',
            background: 'white',
            borderRadius: '28px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        },
        btn: (type: string, pressed: boolean) => {
            const base = {
                height: '68px',
                borderRadius: '18px',
                fontSize: '24px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: pressed ? 'scale(0.92)' : 'scale(1)',
            };
            if (type === 'equals') {
                return { ...base, background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white', boxShadow: pressed ? 'none' : '0 6px 16px rgba(16, 185, 129, 0.4)' };
            } else if (type === 'operator') {
                return { ...base, background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', boxShadow: pressed ? 'none' : '0 6px 16px rgba(99, 102, 241, 0.35)' };
            } else if (type === 'function') {
                return { ...base, background: '#F3F4F6', color: '#6B7280' };
            } else {
                return { ...base, background: '#FAFAFA', color: '#1F2937', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' };
            }
        },
        historyContainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column' as const,
        },
        historyHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
        },
        historyTitle: {
            fontSize: '14px',
            fontWeight: 600,
            color: '#9CA3AF',
        },
        clearBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            color: '#EF4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        historyList: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column-reverse' as const,
            gap: '8px',
            overflowY: 'auto' as const,
        },
        historyItem: (i: number) => ({
            textAlign: 'right' as const,
            padding: '14px 18px',
            background: '#F9FAFB',
            borderRadius: '14px',
            fontSize: '15px',
            color: '#6B7280',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            animation: `fadeInUp 0.3s ease ${i * 0.03}s both`,
        }),
        emptyHistory: {
            textAlign: 'center' as const,
            padding: '40px 0',
            color: '#D1D5DB',
        },
    };

    const getButtonType = (btn: string) => {
        if (btn === '=') return 'equals';
        if (['÷', '×', '-', '+', '%'].includes(btn)) return 'operator';
        if (['C', '⌫', '±'].includes(btn)) return 'function';
        return 'number';
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate(-1)}>
                    <MdArrowBack size={22} />
                </button>
                <span style={styles.title}>Calculator</span>
                <button
                    style={styles.historyBtn(showHistory)}
                    onClick={() => setShowHistory(!showHistory)}
                >
                    <MdHistory size={22} />
                </button>
            </div>

            {/* Display */}
            <div style={styles.displayCard}>
                {showHistory ? (
                    <div style={styles.historyContainer}>
                        <div style={styles.historyHeader}>
                            <span style={styles.historyTitle}>History</span>
                            {history.length > 0 && (
                                <button style={styles.clearBtn} onClick={clearHistory}>
                                    <MdDeleteSweep size={18} />
                                    Clear
                                </button>
                            )}
                        </div>
                        <div style={styles.historyList}>
                            {history.length === 0 ? (
                                <div style={styles.emptyHistory}>
                                    <MdHistory size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                                    <p>No history yet</p>
                                </div>
                            ) : (
                                history.map((item, i) => (
                                    <div
                                        key={i}
                                        style={styles.historyItem(i)}
                                        onClick={() => {
                                            const parts = item.split(' = ');
                                            if (parts.length === 2) {
                                                setExpression(parts[1]);
                                                setResult(parts[1]);
                                                setShowHistory(false);
                                            }
                                        }}
                                    >
                                        {item}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={styles.expression}>
                            {expression.replace(/\*/g, '×').replace(/\//g, '÷') || ' '}
                        </div>
                        <div style={styles.result} key={result}>
                            {result}
                        </div>
                    </>
                )}
            </div>

            {/* Keypad */}
            <div style={styles.keypad}>
                {buttons.flat().map((btn) => (
                    <button
                        key={btn}
                        onClick={() => handleButtonClick(btn)}
                        style={styles.btn(getButtonType(btn), lastPressed === btn)}
                    >
                        {btn === '⌫' ? <MdBackspace size={24} /> : btn}
                    </button>
                ))}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Calculator;
