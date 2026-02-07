import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

interface Exam {
    id: string;
    name: string;
    subject: string;
    date: string;
    time: string;
    color: string;
}

const Calendar: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('studyone_exams');
        if (saved) setExams(JSON.parse(saved));
    }, []);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPadding = monthStart.getDay();
    const paddingDays = Array(startPadding).fill(null);

    const getExamsForDate = (date: Date) => exams.filter(exam => isSameDay(new Date(exam.date), date));
    const selectedExams = selectedDate ? getExamsForDate(selectedDate) : [];

    const bgColor = isDarkMode ? '#0F172A' : '#F7F7F7';
    const cardBg = isDarkMode ? '#1E293B' : 'white';
    const textColor = isDarkMode ? '#F1F5F9' : '#1E293B';
    const mutedColor = isDarkMode ? '#94A3B8' : '#64748B';
    const borderColor = isDarkMode ? '#334155' : '#E2E8F0';

    const styles = {
        container: { minHeight: '100vh', background: bgColor, paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: cardBg, borderBottom: `1px solid ${borderColor}`, position: 'sticky' as const, top: 0, zIndex: 10 },
        iconBtn: { width: '44px', height: '44px', borderRadius: '14px', background: isDarkMode ? '#334155' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor },
        headerTitle: { fontSize: '18px', fontWeight: 700, color: textColor },
        content: { padding: '16px' },
        monthNav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
        monthTitle: { fontSize: '20px', fontWeight: 700, color: textColor },
        calendarCard: { background: cardBg, borderRadius: '20px', padding: '16px', border: `1px solid ${borderColor}`, marginBottom: '20px' },
        daysHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' },
        dayLabel: { textAlign: 'center' as const, fontSize: '12px', fontWeight: 600, color: mutedColor, padding: '8px 0' },
        daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' },
        dayCell: (isToday: boolean, isSelected: boolean, hasExams: boolean) => ({
            aspectRatio: '1', borderRadius: '12px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
            background: isSelected ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent',
            border: isToday && !isSelected ? '2px solid #4F46E5' : 'none',
            cursor: 'pointer', transition: 'all 0.2s ease'
        }),
        dayNumber: (isSelected: boolean) => ({ fontSize: '14px', fontWeight: 600, color: isSelected ? 'white' : textColor }),
        examDots: { display: 'flex', gap: '2px', marginTop: '4px' },
        examDot: (color: string, isSelected: boolean) => ({ width: '6px', height: '6px', borderRadius: '50%', background: isSelected ? 'white' : color }),
        emptyDay: { aspectRatio: '1' },
        selectedSection: { marginTop: '8px' },
        selectedTitle: { fontSize: '16px', fontWeight: 700, color: textColor, marginBottom: '12px' },
        noExams: { background: cardBg, borderRadius: '16px', padding: '24px', textAlign: 'center' as const, border: `1px solid ${borderColor}`, color: mutedColor },
        examCard: (color: string) => ({ background: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '12px', border: `1px solid ${borderColor}`, borderLeft: `4px solid ${color}` }),
        examName: { fontSize: '16px', fontWeight: 700, color: textColor },
        examSubject: { fontSize: '14px', color: mutedColor, marginTop: '4px' },
        examTime: { fontSize: '13px', color: mutedColor },
        legend: { display: 'flex', gap: '16px', marginTop: '16px', fontSize: '12px', color: mutedColor },
        legendItem: { display: 'flex', alignItems: 'center', gap: '6px' },
        legendDot: (color: string) => ({ width: '8px', height: '8px', borderRadius: '50%', background: color }),
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn} onClick={() => navigate(-1)}><MdKeyboardArrowLeft size={24} /></button>
                <span style={styles.headerTitle}>Exam Calendar</span>
                <div style={{ width: 44 }} />
            </div>

            <div style={styles.content}>
                <div style={styles.monthNav}>
                    <button style={styles.iconBtn} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <MdChevronLeft size={24} />
                    </button>
                    <span style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy')}</span>
                    <button style={styles.iconBtn} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <MdChevronRight size={24} />
                    </button>
                </div>

                <div style={styles.calendarCard}>
                    <div style={styles.daysHeader}>
                        {daysOfWeek.map(day => <div key={day} style={styles.dayLabel}>{day}</div>)}
                    </div>
                    <div style={styles.daysGrid}>
                        {paddingDays.map((_, i) => <div key={`pad-${i}`} style={styles.emptyDay} />)}
                        {monthDays.map((day) => {
                            const dayExams = getExamsForDate(day);
                            const hasExams = dayExams.length > 0;
                            const isSelectedDay = selectedDate && isSameDay(day, selectedDate);
                            const isTodayDay = isToday(day);

                            return (
                                <div key={day.toString()} style={styles.dayCell(isTodayDay, !!isSelectedDay, hasExams)} onClick={() => setSelectedDate(day)}>
                                    <span style={styles.dayNumber(!!isSelectedDay)}>{format(day, 'd')}</span>
                                    {hasExams && (
                                        <div style={styles.examDots}>
                                            {dayExams.slice(0, 3).map((exam, idx) => (
                                                <span key={idx} style={styles.examDot(exam.color, !!isSelectedDay)} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedDate && (
                    <div style={styles.selectedSection}>
                        <h3 style={styles.selectedTitle}>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
                        {selectedExams.length === 0 ? (
                            <div style={styles.noExams}>No exams on this date</div>
                        ) : (
                            selectedExams.map(exam => (
                                <div key={exam.id} style={styles.examCard(exam.color)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={styles.examName}>{exam.name}</div>
                                            <div style={styles.examSubject}>{exam.subject}</div>
                                        </div>
                                        <span style={styles.examTime}>{exam.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div style={styles.legend}>
                    <div style={styles.legendItem}>
                        <span style={styles.legendDot('#4F46E5')} />Today
                    </div>
                    <div style={styles.legendItem}>
                        <span style={styles.legendDot('#F59E0B')} />Has Exams
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
