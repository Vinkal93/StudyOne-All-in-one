import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheck, MdClose, MdEmojiEvents } from 'react-icons/md';

interface Question {
    id: number;
    category: string;
    question: string;
    answer: string;
    options: string[];
}

const questionBank: Question[] = [
    { id: 1, category: 'GK', question: 'What is the capital of Australia?', answer: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'] },
    { id: 2, category: 'Science', question: 'What is the chemical symbol for Gold?', answer: 'Au', options: ['Ag', 'Au', 'Fe', 'Cu'] },
    { id: 3, category: 'History', question: 'In which year did India gain independence?', answer: '1947', options: ['1945', '1946', '1947', '1948'] },
    { id: 4, category: 'Math', question: 'What is the value of Pi (π) to 2 decimal places?', answer: '3.14', options: ['3.12', '3.14', '3.16', '3.18'] },
    { id: 5, category: 'Geography', question: 'Which is the largest ocean?', answer: 'Pacific Ocean', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'] },
    { id: 6, category: 'Science', question: 'Which planet is known as the Red Planet?', answer: 'Mars', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'] },
    { id: 7, category: 'GK', question: 'Who wrote Romeo and Juliet?', answer: 'William Shakespeare', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'] },
    { id: 8, category: 'Math', question: 'What is 15% of 200?', answer: '30', options: ['20', '25', '30', '35'] },
    { id: 9, category: 'Geography', question: 'Which is the longest river in the world?', answer: 'Nile', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'] },
    { id: 10, category: 'History', question: 'Who was the first President of USA?', answer: 'George Washington', options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'] },
];

const categoryColors: Record<string, string> = {
    'GK': '#6366F1',
    'Science': '#10B981',
    'History': '#F59E0B',
    'Math': '#EC4899',
    'Geography': '#8B5CF6',
};

const DailyQuestion: React.FC = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [streak, setStreak] = useState(0);

    useEffect(() => { loadDailyQuestion(); loadStreak(); }, []);

    const loadDailyQuestion = () => {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('daily_question');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.date === today) {
                setQuestion(data.question);
                if (data.answered) { setIsAnswered(true); setSelectedAnswer(data.selectedAnswer); setIsCorrect(data.isCorrect); }
                return;
            }
        }
        const randomQ = questionBank[Math.floor(Math.random() * questionBank.length)];
        setQuestion(randomQ);
        localStorage.setItem('daily_question', JSON.stringify({ date: today, question: randomQ, answered: false }));
    };

    const loadStreak = () => {
        const saved = localStorage.getItem('study_streak');
        if (saved) setStreak(JSON.parse(saved).count || 0);
    };

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        const correct = answer === question?.answer;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        setIsCorrect(correct);
        const today = new Date().toDateString();
        localStorage.setItem('daily_question', JSON.stringify({ date: today, question, answered: true, selectedAnswer: answer, isCorrect: correct }));
        if (correct) {
            const saved = localStorage.getItem('study_streak');
            let newStreak = 1;
            if (saved) {
                const data = JSON.parse(saved);
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                if (data.lastDate === today) newStreak = data.count;
                else if (data.lastDate === yesterday) newStreak = data.count + 1;
            }
            localStorage.setItem('study_streak', JSON.stringify({ count: newStreak, lastDate: today, history: [...(JSON.parse(localStorage.getItem('study_streak') || '{}').history || []), today] }));
            setStreak(newStreak);
        }
    };

    const styles = {
        container: { minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFC 0%, #EDE9FE 100%)', paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', position: 'sticky' as const, top: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)' },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' },
        title: { fontSize: '18px', fontWeight: 700, color: '#1F2937' },
        content: { padding: '0 16px' },
        streakBadge: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
        streakPill: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '16px', background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white', fontWeight: 700, fontSize: '15px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' },
        questionCard: { background: 'white', borderRadius: '28px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)' },
        categoryBadge: (color: string) => ({ display: 'inline-block', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, background: `${color}15`, color: color, marginBottom: '20px' }),
        questionText: { fontSize: '22px', fontWeight: 700, color: '#1F2937', lineHeight: 1.4, marginBottom: '28px' },
        optionsGrid: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
        optionBtn: (isSelected: boolean, isCorrectOption: boolean, isWrong: boolean) => ({
            padding: '20px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 600,
            border: '2px solid',
            background: isCorrectOption ? '#10B98115' : isWrong ? '#EF444415' : 'white',
            borderColor: isCorrectOption ? '#10B981' : isWrong ? '#EF4444' : '#E5E7EB',
            color: isCorrectOption ? '#10B981' : isWrong ? '#EF4444' : '#1F2937',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease',
            opacity: isSelected || isCorrectOption ? 1 : 0.6,
        }),
        resultCard: (correct: boolean) => ({
            background: correct ? 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' : '#EF4444',
            borderRadius: '28px',
            padding: '32px',
            textAlign: 'center' as const,
            color: 'white',
            boxShadow: correct ? '0 12px 32px rgba(16, 185, 129, 0.4)' : '0 12px 32px rgba(239, 68, 68, 0.4)',
        }),
        resultEmoji: { fontSize: '64px', marginBottom: '16px' },
        resultTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '8px' },
        resultText: { fontSize: '15px', opacity: 0.9, marginBottom: '24px' },
        badgeUnlock: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.2)', fontWeight: 600, marginBottom: '20px' },
        backBtn: { width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, background: 'white', color: '#1F2937', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' },
        loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        spinner: { width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #E5E7EB', borderTopColor: '#6366F1', animation: 'spin 1s linear infinite' },
    };

    if (!question) return <div style={styles.loading}><div style={styles.spinner} /></div>;

    const categoryColor = categoryColors[question.category] || '#6366F1';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Daily Question</span>
                <div style={{ width: '44px' }} />
            </div>

            <div style={styles.content}>
                <div style={styles.streakBadge}>
                    <div style={styles.streakPill}>🔥 {streak} Day Streak</div>
                </div>

                <div style={styles.questionCard}>
                    <span style={styles.categoryBadge(categoryColor)}>{question.category}</span>
                    <div style={styles.questionText}>{question.question}</div>
                    <div style={styles.optionsGrid}>
                        {question.options.map((option, i) => {
                            const isCorrectOption = isAnswered && option === question.answer;
                            const isWrong = isAnswered && option === selectedAnswer && !isCorrect;
                            return (
                                <button key={i} style={styles.optionBtn(option === selectedAnswer, isCorrectOption, isWrong)} onClick={() => handleAnswer(option)} disabled={isAnswered}>
                                    {option}
                                    {isCorrectOption && <MdCheck size={24} />}
                                    {isWrong && <MdClose size={24} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {isAnswered && (
                    <div style={styles.resultCard(isCorrect)}>
                        <div style={styles.resultEmoji}>{isCorrect ? '🎉' : '😔'}</div>
                        <div style={styles.resultTitle}>{isCorrect ? 'Correct!' : 'Incorrect'}</div>
                        <div style={styles.resultText}>{isCorrect ? `Your streak is now ${streak} days!` : `The answer was: ${question.answer}`}</div>
                        {isCorrect && streak >= 7 && <div style={styles.badgeUnlock}><MdEmojiEvents size={20} />New Badge Unlocked! ⚡</div>}
                        <button style={styles.backBtn} onClick={() => navigate('/study')}>Back to Study</button>
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default DailyQuestion;
