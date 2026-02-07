import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdSearch, MdFolder, MdPushPin, MdDelete, MdGridView, MdViewList, MdFilterList, MdClose, MdShare } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

interface Note { id: string; title: string; content: string; color: string; folder: string; pinned: boolean; tags: string[]; createdAt: string; updatedAt: string; }
interface Folder { id: string; name: string; color: string; }

const defaultFolders: Folder[] = [
    { id: 'all', name: 'All Notes', color: '#4F46E5' },
    { id: 'personal', name: 'Personal', color: '#10B981' },
    { id: 'study', name: 'Study', color: '#F59E0B' },
    { id: 'work', name: 'Work', color: '#EC4899' },
];

const noteColors = ['#F7F7F7', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#FCE7F3', '#F3E8FF', '#E0E7FF', '#CCFBF1'];

const templates = [
    { id: 'blank', name: 'Blank Note', icon: '📝', content: '' },
    { id: 'meeting', name: 'Meeting Notes', icon: '📅', content: '## Meeting Notes\n\n**Date:** \n**Attendees:** \n\n### Topics\n\n- \n\n### Action Items\n\n- [ ] \n\n### Notes\n\n' },
    { id: 'cornell', name: 'Cornell Notes', icon: '📚', content: '## Topic: \n\n---\n\n### Questions/Cues\n\n\n\n### Notes\n\n\n\n---\n\n### Summary\n\n' },
    { id: 'todo', name: 'To-Do List', icon: '✅', content: '## To-Do List\n\n### High Priority\n- [ ] \n\n### Medium Priority\n- [ ] \n\n### Low Priority\n- [ ] \n\n### Completed\n- [x] \n' },
];

const Notes: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [notes, setNotes] = useState<Note[]>([]);
    const [folders, setFolders] = useState<Folder[]>(defaultFolders);
    const [activeFolder, setActiveFolder] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showTemplates, setShowTemplates] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderColor, setNewFolderColor] = useState('#4F46E5');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { showToast } = useToast();

    const bg = isDarkMode ? '#0F172A' : '#F7F7F7';
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : '#F7F7F7';

    useEffect(() => {
        const saved = localStorage.getItem('studyone_notes');
        if (saved) setNotes(JSON.parse(saved));
        const savedFolders = localStorage.getItem('studyone_folders');
        if (savedFolders) setFolders([...defaultFolders, ...JSON.parse(savedFolders)]);
    }, []);

    const saveNotes = (n: Note[]) => { setNotes(n); localStorage.setItem('studyone_notes', JSON.stringify(n)); };

    const createNote = (template?: typeof templates[0]) => {
        const newNote: Note = {
            id: Date.now().toString(), title: template?.name || 'Untitled', content: template?.content || '',
            color: '#F7F7F7', folder: activeFolder === 'all' ? 'personal' : activeFolder, pinned: false,
            tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        saveNotes([newNote, ...notes]);
        setShowTemplates(false);
        navigate(`/study/notes/${newNote.id}`);
    };

    const togglePin = (id: string, e: React.MouseEvent) => { e.stopPropagation(); saveNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)); };

    const confirmDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteId(id);
    };

    const handleDelete = () => {
        if (deleteId) {
            saveNotes(notes.filter(n => n.id !== deleteId));
            setDeleteId(null);
            showToast('Note deleted successfully', 'success');
        }
    };

    const shareNote = async (note: Note, e: React.MouseEvent) => {
        e.stopPropagation();
        const noteText = `📝 ${note.title}\n\n${note.content}\n\n— Shared via StudyOne`;
        if (navigator.share) {
            try {
                await navigator.share({ title: note.title, text: noteText });
            } catch { }
        } else {
            await navigator.clipboard.writeText(noteText);
            showToast('Note copied to clipboard!', 'success');
        }
    };

    const addFolder = () => {
        if (!newFolderName.trim()) return;
        const newFolder: Folder = { id: Date.now().toString(), name: newFolderName, color: newFolderColor };
        const customFolders = folders.filter(f => !defaultFolders.find(d => d.id === f.id));
        localStorage.setItem('studyone_folders', JSON.stringify([...customFolders, newFolder]));
        setFolders([...folders, newFolder]);
        setShowFolderModal(false);
        setNewFolderName('');
    };

    const filteredNotes = notes
        .filter(n => activeFolder === 'all' || n.folder === activeFolder)
        .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const pinnedNotes = filteredNotes.filter(n => n.pinned);
    const otherNotes = filteredNotes.filter(n => !n.pinned);
    const getFolder = (id: string) => folders.find(f => f.id === id);
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const getPreview = (content: string) => content.replace(/[#*\-\[\]]/g, '').slice(0, 80) + (content.length > 80 ? '...' : '');

    const styles = {
        container: { minHeight: '100vh', background: bg, paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: card, borderBottom: `1px solid ${border}`, position: 'sticky' as const, top: 0, zIndex: 10 },
        iconBtn: (active?: boolean) => ({ width: '44px', height: '44px', borderRadius: '14px', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? 'white' : muted }),
        title: { fontSize: '18px', fontWeight: 700, color: text },
        searchBar: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: card, borderBottom: `1px solid ${border}` },
        searchInput: { flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: inputBg, borderRadius: '14px', padding: '12px 16px' },
        input: { flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: text, outline: 'none' },
        foldersScroll: { display: 'flex', gap: '8px', padding: '16px', overflowX: 'auto' as const },
        folderChip: (active: boolean, color: string) => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '14px', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' as const, border: 'none', cursor: 'pointer', background: active ? color : card, color: active ? 'white' : muted }),
        addFolderBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '14px', background: card, border: `2px dashed ${border}`, cursor: 'pointer', color: muted, flexShrink: 0 },
        content: { padding: '0 16px' },
        sectionTitle: { fontSize: '14px', fontWeight: 600, color: muted, marginBottom: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' },
        notesGrid: { display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(2, 1fr)' : '1fr', gap: '12px' },
        noteCard: (noteColor: string, i: number) => ({ background: isDarkMode ? card : noteColor, borderRadius: '18px', padding: '18px', border: `1px solid ${border}`, cursor: 'pointer', position: 'relative' as const }),
        noteTitle: { fontSize: '15px', fontWeight: 700, color: text, lineHeight: 1.3, marginBottom: '8px' },
        notePreview: { fontSize: '13px', color: muted, lineHeight: 1.5, marginBottom: '12px' },
        noteFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        noteDate: { fontSize: '12px', color: muted },
        noteActions: { display: 'flex', gap: '4px' },
        actionBtn: { width: '28px', height: '28px', borderRadius: '8px', background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        pinBadge: { position: 'absolute' as const, top: '10px', right: '10px', width: '24px', height: '24px', borderRadius: '8px', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
        emptyState: { background: card, borderRadius: '24px', padding: '48px 24px', textAlign: 'center' as const, border: `1px solid ${border}`, marginTop: '24px' },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: muted, marginBottom: '24px' },
        createBtn: { padding: '16px 32px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer' },
        fab: { position: 'fixed' as const, bottom: '110px', right: '20px', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)', zIndex: 50 },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: card, borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '420px', maxHeight: '80vh', overflowY: 'auto' as const },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: text },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: inputBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted },
        templateCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', border: `1px solid ${border}`, cursor: 'pointer', marginBottom: '12px' },
        templateIcon: { fontSize: '28px' },
        templateName: { fontSize: '15px', fontWeight: 600, color: text },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn()} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Notes</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={styles.iconBtn(viewMode === 'grid')} onClick={() => setViewMode('grid')}><MdGridView size={20} /></button>
                    <button style={styles.iconBtn(viewMode === 'list')} onClick={() => setViewMode('list')}><MdViewList size={20} /></button>
                </div>
            </div>

            <div style={styles.searchBar}>
                <div style={styles.searchInput}><MdSearch size={20} color={muted} /><input style={styles.input} placeholder="Search notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
            </div>

            <div style={styles.foldersScroll}>
                {folders.map(f => (<button key={f.id} style={styles.folderChip(activeFolder === f.id, f.color)} onClick={() => setActiveFolder(f.id)}><MdFolder size={16} />{f.name}</button>))}
                <button style={styles.addFolderBtn} onClick={() => setShowFolderModal(true)}><MdAdd size={20} /></button>
            </div>

            <div style={styles.content}>
                {filteredNotes.length === 0 ? (
                    <div style={styles.emptyState}><div style={styles.emptyIcon}>📝</div><div style={styles.emptyText}>No notes yet</div><button style={styles.createBtn} onClick={() => setShowTemplates(true)}>Create Your First Note</button></div>
                ) : (
                    <>
                        {pinnedNotes.length > 0 && (<><div style={styles.sectionTitle}><MdPushPin size={14} />Pinned</div><div style={styles.notesGrid}>{pinnedNotes.map((note, i) => (
                            <div key={note.id} style={styles.noteCard(note.color, i)} onClick={() => navigate(`/study/notes/${note.id}`)}>
                                <div style={styles.pinBadge}><MdPushPin size={12} /></div>
                                <div style={styles.noteTitle}>{note.title || 'Untitled'}</div>
                                <div style={styles.notePreview}>{getPreview(note.content)}</div>
                                <div style={styles.noteFooter}><span style={styles.noteDate}>{formatDate(note.updatedAt)}</span>
                                    <div style={styles.noteActions}>
                                        <button style={styles.actionBtn} onClick={e => togglePin(note.id, e)}><MdPushPin size={14} /></button>
                                        <button style={styles.actionBtn} onClick={e => confirmDelete(note.id, e)}><MdDelete size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}</div></>)}
                        {otherNotes.length > 0 && (<><div style={styles.sectionTitle}><MdFilterList size={14} />All Notes</div><div style={styles.notesGrid}>{otherNotes.map((note, i) => (
                            <div key={note.id} style={styles.noteCard(note.color, i)} onClick={() => navigate(`/study/notes/${note.id}`)}>
                                <div style={styles.noteTitle}>{note.title || 'Untitled'}</div>
                                <div style={styles.notePreview}>{getPreview(note.content)}</div>
                                <div style={styles.noteFooter}><span style={styles.noteDate}>{formatDate(note.updatedAt)}</span>
                                    <div style={styles.noteActions}>
                                        <button style={styles.actionBtn} onClick={e => togglePin(note.id, e)}><MdPushPin size={14} /></button>
                                        <button style={styles.actionBtn} onClick={e => confirmDelete(note.id, e)}><MdDelete size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}</div></>)}
                    </>
                )}
            </div>

            <button style={styles.fab} onClick={() => setShowTemplates(true)}><MdAdd size={28} /></button>

            {showTemplates && (
                <div style={styles.modal} onClick={() => setShowTemplates(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}><span style={styles.modalTitle}>New Note</span><button style={styles.closeBtn} onClick={() => setShowTemplates(false)}><MdClose size={20} /></button></div>
                        {templates.map(t => (<div key={t.id} style={styles.templateCard} onClick={() => createNote(t)}><span style={styles.templateIcon}>{t.icon}</span><span style={styles.templateName}>{t.name}</span></div>))}
                    </div>
                </div>
            )}

            {showFolderModal && (
                <div style={styles.modal} onClick={() => setShowFolderModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}><span style={styles.modalTitle}>New Folder</span><button style={styles.closeBtn} onClick={() => setShowFolderModal(false)}><MdClose size={20} /></button></div>
                        <input style={{ ...styles.input, background: inputBg, padding: '16px', borderRadius: '14px', width: '100%', marginBottom: '16px' }} placeholder="Folder name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'].map(c => (
                                <button key={c} onClick={() => setNewFolderColor(c)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: c, border: newFolderColor === c ? '3px solid white' : 'none', cursor: 'pointer' }} />
                            ))}
                        </div>
                        <button style={styles.createBtn} onClick={addFolder}>Create Folder</button>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action cannot be undone."
            />

        </div>
    );
};

export default Notes;
