import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdMenuBook, MdCheckCircle, MdSchool, MdStyle, MdArrowForward, MdClose } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

interface SearchResult {
    id: string;
    type: 'note' | 'task' | 'exam' | 'deck';
    title: string;
    subtitle: string;
    path: string;
}

const CommandPalette: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Toggle on Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery(''); // Reset query when closed to ensure fresh search next time
        }
    }, [isOpen]);

    // Search logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchTerm = query.toLowerCase();
        const allResults: SearchResult[] = [];

        // Search Notes
        const notes = JSON.parse(localStorage.getItem('studyone_notes') || '[]');
        notes.forEach((note: any) => {
            if (note.title.toLowerCase().includes(searchTerm) || note.content.toLowerCase().includes(searchTerm)) {
                allResults.push({
                    id: note.id,
                    type: 'note',
                    title: note.title || 'Untitled Note',
                    subtitle: 'Note',
                    path: `/study/notes/${note.id}`
                });
            }
        });

        // Search Tasks
        const tasks = JSON.parse(localStorage.getItem('studyone_tasks') || '[]');
        tasks.forEach((task: any) => {
            if (task.text.toLowerCase().includes(searchTerm)) {
                allResults.push({
                    id: task.id,
                    type: 'task',
                    title: task.text,
                    subtitle: task.list || 'Task',
                    path: '/study/tasks'
                });
            }
        });

        // Search Exams
        const exams = JSON.parse(localStorage.getItem('studyone_exams') || '[]');
        exams.forEach((exam: any) => {
            if (exam.name.toLowerCase().includes(searchTerm) || exam.subject.toLowerCase().includes(searchTerm)) {
                allResults.push({
                    id: exam.id,
                    type: 'exam',
                    title: exam.name,
                    subtitle: `Exam • ${exam.subject}`,
                    path: '/exams'
                });
            }
        });

        // Search Decks
        const decks = JSON.parse(localStorage.getItem('studyone_flashcard_decks') || '[]');
        decks.forEach((deck: any) => {
            if (deck.name.toLowerCase().includes(searchTerm)) {
                allResults.push({
                    id: deck.id,
                    type: 'deck',
                    title: deck.name,
                    subtitle: 'Flashcard Deck',
                    path: '/study/flashcards'
                });
            }
        });

        setResults(allResults.slice(0, 5));
        setSelectedIndex(0);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        navigate(result.path);
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results.length > 0) {
            handleSelect(results[selectedIndex]);
        }
    };

    // Custom Event Listener
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-search', handleOpen);
        return () => window.removeEventListener('open-search', handleOpen);
    }, []);

    if (!isOpen) return null;

    const bg = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const hover = isDarkMode ? '#334155' : '#F1F5F9';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '15vh'
        }} onClick={() => setIsOpen(false)}>
            <div style={{
                width: '90%',
                maxWidth: '600px',
                background: bg,
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                border: `1px solid ${border}`
            }} onClick={e => e.stopPropagation()}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: `1px solid ${border}`
                }}>
                    <MdSearch size={24} style={{ color: muted, marginRight: '12px' }} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search notes, tasks, exams..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            fontSize: '18px',
                            color: text
                        }}
                    />
                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
                        <MdClose size={20} />
                    </button>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
                    {results.length > 0 ? (
                        results.map((result, index) => (
                            <div
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleSelect(result)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: index === selectedIndex ? hover : 'transparent',
                                    transition: 'background 0.1s'
                                }}
                            >
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    background: result.type === 'note' ? '#E0E7FF' : result.type === 'task' ? '#DCFCE7' : result.type === 'exam' ? '#FEF3C7' : '#FCE7F3',
                                    color: result.type === 'note' ? '#4F46E5' : result.type === 'task' ? '#10B981' : result.type === 'exam' ? '#F59E0B' : '#EC4899'
                                }}>
                                    {result.type === 'note' && <MdMenuBook size={20} />}
                                    {result.type === 'task' && <MdCheckCircle size={20} />}
                                    {result.type === 'exam' && <MdSchool size={20} />}
                                    {result.type === 'deck' && <MdStyle size={20} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: text }}>{result.title}</div>
                                    <div style={{ fontSize: '13px', color: muted }}>{result.subtitle}</div>
                                </div>
                                {index === selectedIndex && <MdArrowForward style={{ color: muted }} />}
                            </div>
                        ))
                    ) : query ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: muted }}>
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: muted }}>
                            Type to search...
                        </div>
                    )}
                </div>
                <div style={{ padding: '8px 16px', background: isDarkMode ? '#0F172A' : '#F8FAFC', borderTop: `1px solid ${border}`, fontSize: '12px', color: muted, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Use arrow keys to navigate</span>
                    <span>Press Enter to select</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
