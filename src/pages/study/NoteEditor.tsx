import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdDelete, MdPushPin, MdCheck, MdFolder, MdColorLens, MdClose, MdFileDownload, MdShare } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

interface Note { id: string; title: string; content: string; color: string; folder: string; pinned: boolean; tags: string[]; createdAt: string; updatedAt: string; }
interface Block { id: string; type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'todo' | 'code' | 'quote' | 'divider'; content: string; checked?: boolean; }

const noteColors = ['#F7F7F7', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#FCE7F3', '#F3E8FF', '#E0E7FF', '#CCFBF1'];
const defaultFolders = [{ id: 'personal', name: 'Personal', color: '#10B981' }, { id: 'study', name: 'Study', color: '#F59E0B' }, { id: 'work', name: 'Work', color: '#EC4899' }];

const slashCommands = [
    { cmd: 'h1', label: 'Heading 1', icon: 'H1', type: 'h1' as const },
    { cmd: 'h2', label: 'Heading 2', icon: 'H2', type: 'h2' as const },
    { cmd: 'h3', label: 'Heading 3', icon: 'H3', type: 'h3' as const },
    { cmd: 'p', label: 'Paragraph', icon: '¶', type: 'paragraph' as const },
    { cmd: 'bullet', label: 'Bullet List', icon: '•', type: 'bullet' as const },
    { cmd: 'numbered', label: 'Numbered List', icon: '1.', type: 'numbered' as const },
    { cmd: 'todo', label: 'To-Do', icon: '☐', type: 'todo' as const },
    { cmd: 'code', label: 'Code Block', icon: '</>', type: 'code' as const },
    { cmd: 'quote', label: 'Quote', icon: '"', type: 'quote' as const },
    { cmd: 'divider', label: 'Divider', icon: '—', type: 'divider' as const },
];

const NoteEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { isDarkMode } = useTheme();

    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<Block[]>([{ id: '1', type: 'paragraph', content: '' }]);
    const [color, setColor] = useState('#F7F7F7');
    const [folder, setFolder] = useState('personal');
    const [pinned, setPinned] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFolderPicker, setShowFolderPicker] = useState(false);
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashFilter, setSlashFilter] = useState('');
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [saved, setSaved] = useState(false);
    const [folders, setFolders] = useState(defaultFolders);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { showToast } = useToast();

    const bg = isDarkMode ? '#0F172A' : color;
    const card = isDarkMode ? '#1E293B' : 'white';
    const text = isDarkMode ? '#F1F5F9' : '#1E293B';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const border = isDarkMode ? '#334155' : '#E2E8F0';
    const inputBg = isDarkMode ? '#334155' : 'rgba(255,255,255,0.5)';

    useEffect(() => {
        const savedFolders = localStorage.getItem('studyone_folders');
        if (savedFolders) setFolders([...defaultFolders, ...JSON.parse(savedFolders)]);
        if (id && id !== 'new') {
            const savedNotes = localStorage.getItem('studyone_notes');
            if (savedNotes) {
                const notes: Note[] = JSON.parse(savedNotes);
                const found = notes.find(n => n.id === id);
                if (found) {
                    setNote(found); setTitle(found.title); setColor(found.color);
                    setFolder(found.folder); setPinned(found.pinned);
                    const lines = found.content.split('\n');
                    const parsedBlocks: Block[] = lines.map((line, i) => {
                        if (line.startsWith('# ')) return { id: String(i), type: 'h1', content: line.slice(2) };
                        if (line.startsWith('## ')) return { id: String(i), type: 'h2', content: line.slice(3) };
                        if (line.startsWith('### ')) return { id: String(i), type: 'h3', content: line.slice(4) };
                        if (line.startsWith('- [ ] ')) return { id: String(i), type: 'todo', content: line.slice(6), checked: false };
                        if (line.startsWith('- [x] ')) return { id: String(i), type: 'todo', content: line.slice(6), checked: true };
                        if (line.startsWith('- ')) return { id: String(i), type: 'bullet', content: line.slice(2) };
                        if (/^\d+\. /.test(line)) return { id: String(i), type: 'numbered', content: line.replace(/^\d+\. /, '') };
                        if (line.startsWith('> ')) return { id: String(i), type: 'quote', content: line.slice(2) };
                        if (line.startsWith('```')) return { id: String(i), type: 'code', content: line.slice(3) };
                        if (line === '---') return { id: String(i), type: 'divider', content: '' };
                        return { id: String(i), type: 'paragraph', content: line };
                    });
                    setBlocks(parsedBlocks.length > 0 ? parsedBlocks : [{ id: '1', type: 'paragraph', content: '' }]);
                }
            }
        }
    }, [id]);

    const blocksToMarkdown = useCallback(() => {
        return blocks.map((b, i) => {
            switch (b.type) {
                case 'h1': return `# ${b.content}`;
                case 'h2': return `## ${b.content}`;
                case 'h3': return `### ${b.content}`;
                case 'bullet': return `- ${b.content}`;
                case 'numbered': return `${i + 1}. ${b.content}`;
                case 'todo': return `- [${b.checked ? 'x' : ' '}] ${b.content}`;
                case 'code': return '```' + b.content;
                case 'quote': return `> ${b.content}`;
                case 'divider': return '---';
                default: return b.content;
            }
        }).join('\n');
    }, [blocks]);

    const saveNote = useCallback(() => {
        const content = blocksToMarkdown();
        const savedNotes = localStorage.getItem('studyone_notes');
        const notes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
        const updatedNote: Note = {
            id: note?.id || Date.now().toString(), title: title || 'Untitled', content, color, folder, pinned,
            tags: note?.tags || [], createdAt: note?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        if (note) { const index = notes.findIndex(n => n.id === note.id); if (index !== -1) notes[index] = updatedNote; }
        else notes.unshift(updatedNote);
        localStorage.setItem('studyone_notes', JSON.stringify(notes));
        setSaved(true); setTimeout(() => setSaved(false), 1500);
    }, [title, blocks, color, folder, pinned, note, blocksToMarkdown]);

    useEffect(() => { const timer = setTimeout(() => { if (title || blocks.some(b => b.content)) saveNote(); }, 1000); return () => clearTimeout(timer); }, [title, blocks, color, folder, pinned, saveNote]);

    const updateBlock = (blockId: string, content: string) => {
        if (content.startsWith('/')) { setSlashFilter(content.slice(1)); setShowSlashMenu(true); setActiveBlockId(blockId); }
        else { setShowSlashMenu(false); }
        setBlocks(blocks.map(b => b.id === blockId ? { ...b, content } : b));
    };

    const addBlock = (afterId: string, type: Block['type'] = 'paragraph') => {
        const newBlock: Block = { id: Date.now().toString(), type, content: '', checked: type === 'todo' ? false : undefined };
        const idx = blocks.findIndex(b => b.id === afterId);
        setBlocks([...blocks.slice(0, idx + 1), newBlock, ...blocks.slice(idx + 1)]);
        setShowSlashMenu(false);
        setTimeout(() => document.getElementById(`block-${newBlock.id}`)?.focus(), 50);
    };

    const deleteBlock = (blockId: string) => {
        if (blocks.length === 1) { setBlocks([{ id: '1', type: 'paragraph', content: '' }]); return; }
        const idx = blocks.findIndex(b => b.id === blockId);
        setBlocks(blocks.filter(b => b.id !== blockId));
        setTimeout(() => document.getElementById(`block-${blocks[Math.max(0, idx - 1)]?.id}`)?.focus(), 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent, block: Block) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addBlock(block.id, block.type === 'bullet' || block.type === 'numbered' ? block.type : 'paragraph'); }
        if (e.key === 'Backspace' && block.content === '') { e.preventDefault(); deleteBlock(block.id); }
    };

    const applySlashCommand = (type: Block['type']) => {
        if (!activeBlockId) return;
        setBlocks(blocks.map(b => b.id === activeBlockId ? { ...b, type, content: '' } : b));
        setShowSlashMenu(false);
        setTimeout(() => document.getElementById(`block-${activeBlockId}`)?.focus(), 50);
    };

    const toggleTodo = (blockId: string) => setBlocks(blocks.map(b => b.id === blockId ? { ...b, checked: !b.checked } : b));

    const exportNote = (format: 'txt' | 'md' | 'pdf') => {
        const content = format === 'md' ? blocksToMarkdown() : blocks.map(b => b.content).join('\n');
        if (format === 'pdf') { window.print(); return; }
        const blob = new Blob([`# ${title}\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${title || 'note'}.${format}`; a.click();
        setShowExportMenu(false);
    };



    const handleDelete = () => {
        if (note) {
            const savedNotes = localStorage.getItem('studyone_notes');
            if (savedNotes) {
                const notes = JSON.parse(savedNotes);
                const updated = notes.filter((n: Note) => n.id !== note.id);
                localStorage.setItem('studyone_notes', JSON.stringify(updated));
            }
            showToast('Note deleted', 'success');
            navigate(-1);
        }
    };

    const wordCount = blocks.reduce((acc, b) => acc + (b.content.split(/\s+/).filter(w => w).length), 0);
    const currentFolder = folders.find(f => f.id === folder);
    const filteredCommands = slashCommands.filter(c => c.cmd.includes(slashFilter.toLowerCase()) || c.label.toLowerCase().includes(slashFilter.toLowerCase()));

    const getBlockStyle = (type: Block['type']) => {
        const base = { width: '100%', border: 'none', outline: 'none', background: 'transparent', color: text, fontFamily: 'inherit', resize: 'none' as const, lineHeight: 1.6, padding: '8px 12px', borderRadius: '8px' };
        switch (type) {
            case 'h1': return { ...base, fontSize: '32px', fontWeight: 700 };
            case 'h2': return { ...base, fontSize: '24px', fontWeight: 700 };
            case 'h3': return { ...base, fontSize: '20px', fontWeight: 600 };
            case 'code': return { ...base, fontFamily: 'monospace', fontSize: '14px', background: isDarkMode ? '#0F172A' : '#F1F5F9', borderRadius: '12px', padding: '16px' };
            case 'quote': return { ...base, fontStyle: 'italic', borderLeft: '4px solid #4F46E5', paddingLeft: '16px', color: muted };
            default: return { ...base, fontSize: '16px' };
        }
    };

    const styles = {
        container: { minHeight: '100vh', background: bg, transition: 'background 0.3s ease', paddingBottom: '80px' }, // Matched App padding
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', position: 'sticky' as const, top: 0, zIndex: 50, borderBottom: `1px solid ${border}` },
        iconBtn: (active?: boolean) => ({ width: '40px', height: '40px', borderRadius: '12px', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? 'white' : muted, transition: 'all 0.2s' }),
        headerActions: { display: 'flex', gap: '4px' },
        savedBadge: { display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '10px', background: '#10B981', color: 'white', fontSize: '12px', fontWeight: 600, marginRight: '8px' },
        content: { padding: '20px 16px', maxWidth: '850px', margin: '0 auto' },
        titleInput: { width: '100%', fontSize: '28px', fontWeight: 800, color: text, background: 'transparent', border: 'none', outline: 'none', marginBottom: '16px', lineHeight: 1.2, fontFamily: 'inherit' },
        metaRow: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' as const },
        metaChip: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px', background: card, border: `1px solid ${border}`, fontSize: '13px', fontWeight: 500, color: text, cursor: 'pointer', transition: 'all 0.2s' },
        metaDot: (c: string) => ({ width: '8px', height: '8px', borderRadius: '50%', background: c }),
        blocksContainer: { minHeight: '50vh' },
        blockWrapper: { display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '2px', position: 'relative' as const, paddingLeft: '4px' },
        blockHandle: { width: '20px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, opacity: 0, cursor: 'grab', fontSize: '14px', marginTop: '4px', position: 'absolute' as const, left: '-20px' },
        todoCheck: (checked: boolean) => ({ width: '20px', height: '20px', borderRadius: '6px', border: checked ? 'none' : `2px solid ${border}`, background: checked ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: '6px', flexShrink: 0, transition: 'all 0.2s' }),
        dividerBlock: { height: '1px', background: border, margin: '16px 0', width: '100%' },
        slashMenu: { position: 'absolute' as const, top: '100%', left: '0', background: card, borderRadius: '14px', padding: '6px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: `1px solid ${border}`, zIndex: 100, minWidth: '180px', maxHeight: '300px', overflowY: 'auto' as const },
        slashItem: (active: boolean) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: active ? (isDarkMode ? '#334155' : '#F1F5F9') : 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left' as const, color: text, transition: 'background 0.1s' }),
        slashIcon: { width: '28px', height: '28px', borderRadius: '8px', background: isDarkMode ? '#0F172A' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: muted },
        slashLabel: { fontSize: '13px', fontWeight: 600 },
        footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', padding: '12px', borderTop: `1px solid ${border}`, fontSize: '12px', color: muted },
        exportMenu: { position: 'absolute' as const, top: '100%', right: 0, marginTop: '8px', background: card, borderRadius: '14px', padding: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: `1px solid ${border}`, zIndex: 100, minWidth: '160px' },
        exportItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: text, width: '100%', textAlign: 'left' as const },
        picker: { position: 'absolute' as const, top: '100%', left: 0, marginTop: '8px', background: card, borderRadius: '16px', padding: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: `1px solid ${border}`, zIndex: 100 },
        colorGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
        colorBtn: (c: string, selected: boolean) => ({ width: '36px', height: '36px', borderRadius: '10px', background: c, border: selected ? '3px solid #4F46E5' : `1px solid ${border}`, cursor: 'pointer' }),
        folderList: { display: 'flex', flexDirection: 'column' as const, gap: '4px', minWidth: '180px' },
        folderItem: (active: boolean) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: active ? (isDarkMode ? '#334155' : '#F0F0FF') : 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: text, width: '100%', textAlign: 'left' as const }),
        hint: { fontSize: '12px', color: muted, marginTop: '20px', textAlign: 'center' as const, opacity: 0.7 },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn()} onClick={() => navigate(-1)}><MdArrowBack size={20} /></button>
                <div style={styles.headerActions}>
                    {saved && <div style={styles.savedBadge}><MdCheck size={14} />Saved</div>}
                    <div style={{ position: 'relative' }}>
                        <button style={styles.iconBtn()} onClick={() => setShowExportMenu(!showExportMenu)}><MdFileDownload size={20} /></button>
                        {showExportMenu && (
                            <div style={styles.exportMenu}>
                                <button style={styles.exportItem} onClick={() => exportNote('txt')}>📄 Text File</button>
                                <button style={styles.exportItem} onClick={() => exportNote('md')}>📝 Markdown</button>
                                <button style={styles.exportItem} onClick={() => exportNote('pdf')}>🖨️ Print / PDF</button>
                            </div>
                        )}
                    </div>
                    <button style={styles.iconBtn(pinned)} onClick={() => setPinned(!pinned)}><MdPushPin size={20} /></button>
                    <button style={styles.iconBtn()} onClick={() => setShowDeleteModal(true)}><MdDelete size={20} /></button>
                </div>
            </div>

            <div style={styles.content}>
                <input style={styles.titleInput} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Untitled Note" />
                <div style={styles.metaRow}>
                    <div style={{ position: 'relative' }}>
                        <button style={styles.metaChip} onClick={() => { setShowColorPicker(!showColorPicker); setShowFolderPicker(false); }}>
                            <MdColorLens size={16} /><span style={styles.metaDot(color)} />Color
                        </button>
                        {showColorPicker && (<div style={styles.picker}><div style={styles.colorGrid}>{noteColors.map(c => <button key={c} style={styles.colorBtn(c, color === c)} onClick={() => { setColor(c); setShowColorPicker(false); }} />)}</div></div>)}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button style={styles.metaChip} onClick={() => { setShowFolderPicker(!showFolderPicker); setShowColorPicker(false); }}>
                            <MdFolder size={16} color={currentFolder?.color} />{currentFolder?.name}
                        </button>
                        {showFolderPicker && (<div style={styles.picker}><div style={styles.folderList}>{folders.map(f => (<button key={f.id} style={styles.folderItem(folder === f.id)} onClick={() => { setFolder(f.id); setShowFolderPicker(false); }}><span style={styles.metaDot(f.color)} />{f.name}</button>))}</div></div>)}
                    </div>
                </div>

                <div style={styles.blocksContainer}>
                    {blocks.map((block, idx) => (
                        <div key={block.id} style={styles.blockWrapper}>
                            <div style={styles.blockHandle}>⋮⋮</div>
                            {block.type === 'todo' && (<button style={styles.todoCheck(!!block.checked)} onClick={() => toggleTodo(block.id)}>{block.checked && <MdCheck size={14} />}</button>)}
                            {block.type === 'bullet' && <span style={{ marginTop: '10px', color: muted, fontSize: '20px' }}>•</span>}
                            {block.type === 'numbered' && <span style={{ marginTop: '10px', color: muted, fontSize: '14px', fontWeight: 600, minWidth: '24px' }}>{idx + 1}.</span>}
                            {block.type === 'divider' ? (<div style={styles.dividerBlock} />) : (
                                <textarea
                                    id={`block-${block.id}`}
                                    style={{ ...getBlockStyle(block.type), flex: 1, textDecoration: block.type === 'todo' && block.checked ? 'line-through' : 'none', opacity: block.type === 'todo' && block.checked ? 0.6 : 1 }}
                                    value={block.content}
                                    onChange={e => updateBlock(block.id, e.target.value)}
                                    onKeyDown={e => handleKeyDown(e, block)}
                                    onFocus={() => setActiveBlockId(block.id)}
                                    placeholder={block.type === 'paragraph' ? "Type '/' for commands..." : ''}
                                    rows={1}
                                />
                            )}
                            {showSlashMenu && activeBlockId === block.id && filteredCommands.length > 0 && (
                                <div style={styles.slashMenu}>
                                    {filteredCommands.map((cmd, i) => (<button key={cmd.cmd} style={styles.slashItem(i === 0)} onClick={() => applySlashCommand(cmd.type)}><div style={styles.slashIcon}>{cmd.icon}</div><span style={styles.slashLabel}>{cmd.label}</span></button>))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <p style={styles.hint}>💡 Type <strong>/</strong> for commands • Press <strong>Enter</strong> for new line</p>
                <div style={styles.footer}><span>{wordCount} words • {blocks.length} blocks</span><span>Auto-saved</span></div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action cannot be undone."
            />
        </div >
    );
};

export default NoteEditor;
