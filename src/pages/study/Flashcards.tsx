import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdDelete, MdEdit, MdClose, MdShuffle, MdPlayArrow, MdShare } from 'react-icons/md';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

interface Card { id: string; front: string; back: string; }
interface Deck { id: string; name: string; color: string; cards: Card[]; }

const deckColors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];

const Flashcards: React.FC = () => {
    const navigate = useNavigate();
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [studyMode, setStudyMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showDeckModal, setShowDeckModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [deckName, setDeckName] = useState('');
    const [deckColor, setDeckColor] = useState(deckColors[0]);
    const [cardFront, setCardFront] = useState('');
    const [cardBack, setCardBack] = useState('');
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [deleteInfo, setDeleteInfo] = useState<{ type: 'deck' | 'card', id: string } | null>(null);
    const { showToast } = useToast();

    useEffect(() => { const saved = localStorage.getItem('flashcard_decks'); if (saved) setDecks(JSON.parse(saved)); }, []);
    const saveDecks = (d: Deck[]) => { setDecks(d); localStorage.setItem('flashcard_decks', JSON.stringify(d)); };

    const openDeckModal = (deck?: Deck) => {
        if (deck) { setEditingDeck(deck); setDeckName(deck.name); setDeckColor(deck.color); }
        else { setEditingDeck(null); setDeckName(''); setDeckColor(deckColors[Math.floor(Math.random() * deckColors.length)]); }
        setShowDeckModal(true);
    };

    const saveDeck = () => {
        if (!deckName.trim()) return;
        if (editingDeck) saveDecks(decks.map(d => d.id === editingDeck.id ? { ...d, name: deckName, color: deckColor } : d));
        else saveDecks([...decks, { id: Date.now().toString(), name: deckName, color: deckColor, cards: [] }]);
        setShowDeckModal(false);
    };

    const confirmDeleteDeck = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setDeleteInfo({ type: 'deck', id });
    };

    const confirmDeleteCard = (id: string) => {
        setDeleteInfo({ type: 'card', id });
    };

    const handleDelete = () => {
        if (!deleteInfo) return;

        if (deleteInfo.type === 'deck') {
            saveDecks(decks.filter(d => d.id !== deleteInfo.id));
            if (selectedDeck?.id === deleteInfo.id) setSelectedDeck(null);
            showToast('Deck deleted', 'success');
        } else if (deleteInfo.type === 'card' && selectedDeck) {
            const updated = decks.map(d => d.id === selectedDeck.id ? { ...d, cards: d.cards.filter(c => c.id !== deleteInfo.id) } : d);
            saveDecks(updated);
            setSelectedDeck(updated.find(d => d.id === selectedDeck.id) || null);
            showToast('Card deleted', 'success');
        }
        setDeleteInfo(null);
    };

    const openCardModal = (card?: Card) => {
        if (card) { setEditingCard(card); setCardFront(card.front); setCardBack(card.back); }
        else { setEditingCard(null); setCardFront(''); setCardBack(''); }
        setShowCardModal(true);
    };

    const saveCard = () => {
        if (!cardFront.trim() || !cardBack.trim() || !selectedDeck) return;
        const updated = decks.map(d => {
            if (d.id !== selectedDeck.id) return d;
            if (editingCard) return { ...d, cards: d.cards.map(c => c.id === editingCard.id ? { ...c, front: cardFront, back: cardBack } : c) };
            return { ...d, cards: [...d.cards, { id: Date.now().toString(), front: cardFront, back: cardBack }] };
        });
        saveDecks(updated);
        setSelectedDeck(updated.find(d => d.id === selectedDeck.id) || null);
        setShowCardModal(false);
    };

    const deleteCard = (cardId: string) => {
        if (!selectedDeck) return;
        const updated = decks.map(d => d.id === selectedDeck.id ? { ...d, cards: d.cards.filter(c => c.id !== cardId) } : d);
        saveDecks(updated);
        setSelectedDeck(updated.find(d => d.id === selectedDeck.id) || null);
    };

    const startStudy = () => { if (selectedDeck && selectedDeck.cards.length > 0) { setStudyMode(true); setCurrentIndex(0); setIsFlipped(false); } };
    const shuffleCards = () => { if (selectedDeck) { const shuffled = [...selectedDeck.cards].sort(() => Math.random() - 0.5); setSelectedDeck({ ...selectedDeck, cards: shuffled }); } };
    const nextCard = () => { if (selectedDeck && currentIndex < selectedDeck.cards.length - 1) { setCurrentIndex(i => i + 1); setIsFlipped(false); } };
    const prevCard = () => { if (currentIndex > 0) { setCurrentIndex(i => i - 1); setIsFlipped(false); } };

    const shareDeck = async (deck: Deck) => {
        const cardsText = deck.cards.map((c, i) => `${i + 1}. Q: ${c.front}\n   A: ${c.back}`).join('\n\n');
        const text = `📚 ${deck.name}\n\n${cardsText}\n\n— Shared via StudyOne`;
        if (navigator.share) {
            try { await navigator.share({ title: deck.name, text }); }
            catch (err) { console.log('Share cancelled'); }
        } else {
            await navigator.clipboard.writeText(text);
            showToast('Deck copied to clipboard!', 'success');
        }
    };

    const styles = {
        container: { minHeight: '100vh', background: '#F7F7F7', paddingBottom: '100px' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', borderBottom: '1px solid #E2E8F0' },
        iconBtn: (active?: boolean) => ({ width: '44px', height: '44px', borderRadius: '14px', background: active ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? 'white' : '#64748B', boxShadow: active ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none' }),
        title: { fontSize: '18px', fontWeight: 700, color: '#1E293B' },
        content: { padding: '20px 16px' },
        emptyState: { background: 'white', borderRadius: '24px', padding: '48px 24px', textAlign: 'center' as const, border: '1px solid #E2E8F0' },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#64748B', marginBottom: '24px' },
        createBtn: { padding: '16px 32px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
        decksGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
        deckCard: (color: string, i: number) => ({ background: 'white', borderRadius: '20px', padding: '24px 20px', border: '1px solid #E2E8F0', borderTop: `4px solid ${color}`, cursor: 'pointer', animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }),
        deckName: { fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' },
        deckCount: { fontSize: '14px', color: '#64748B' },
        deckActions: { display: 'flex', gap: '8px', marginTop: '12px' },
        smallBtn: { padding: '8px', borderRadius: '8px', background: '#F7F7F7', border: 'none', cursor: 'pointer', color: '#64748B' },
        // Deck View
        deckHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
        backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: '#64748B' },
        deckTitle: { fontSize: '24px', fontWeight: 700, color: '#1E293B' },
        actionRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
        actionBtn: (color: string) => ({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '14px', background: color, color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }),
        cardItem: { background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        cardText: { fontSize: '15px', color: '#1E293B', fontWeight: 600 },
        cardBack: { fontSize: '13px', color: '#64748B', marginTop: '4px' },
        // Study Mode
        studyContainer: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '24px' },
        progressText: { fontSize: '14px', color: '#64748B', marginBottom: '24px' },
        flashcard: (color: string, flipped: boolean) => ({ width: '100%', maxWidth: '360px', height: '280px', perspective: '1000px', cursor: 'pointer' }),
        cardInner: (flipped: boolean) => ({ width: '100%', height: '100%', position: 'relative' as const, transformStyle: 'preserve-3d' as const, transition: 'transform 0.6s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }),
        cardFace: (color: string, isBack: boolean) => ({ position: 'absolute' as const, width: '100%', height: '100%', backfaceVisibility: 'hidden' as const, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' as const, fontSize: '20px', fontWeight: 600, color: isBack ? 'white' : '#1E293B', background: isBack ? color : 'white', border: isBack ? 'none' : '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', transform: isBack ? 'rotateY(180deg)' : 'rotateY(0)' }),
        navBtns: { display: 'flex', gap: '16px', marginTop: '32px' },
        navBtn: (disabled: boolean) => ({ padding: '14px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: 600, background: disabled ? '#E2E8F0' : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: disabled ? '#94A3B8' : 'white', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer' }),
        fab: { position: 'fixed' as const, bottom: '100px', right: '20px', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)', zIndex: 50 },
        modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
        modalContent: { background: 'white', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '400px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1E293B' },
        closeBtn: { width: '36px', height: '36px', borderRadius: '10px', background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' },
        label: { fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '8px', display: 'block' },
        input: { width: '100%', padding: '14px', fontSize: '16px', background: '#F7F7F7', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', marginBottom: '16px' },
        textarea: { width: '100%', padding: '14px', fontSize: '15px', background: '#F7F7F7', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', resize: 'none' as const, minHeight: '100px', marginBottom: '16px' },
        colorPicker: { display: 'flex', gap: '10px', marginBottom: '16px' },
        colorBtn: (c: string, selected: boolean) => ({ width: '36px', height: '36px', borderRadius: '50%', background: c, border: 'none', cursor: 'pointer', transform: selected ? 'scale(1.2)' : 'scale(1)', boxShadow: selected ? `0 4px 12px ${c}50` : 'none' }),
        saveBtn: { width: '100%', padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'white', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' },
    };

    if (studyMode && selectedDeck) {
        const card = selectedDeck.cards[currentIndex];
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <button style={styles.iconBtn()} onClick={() => setStudyMode(false)}><MdClose size={22} /></button>
                    <span style={styles.title}>Study Mode</span>
                    <div style={{ width: 44 }} />
                </div>
                <div style={styles.studyContainer}>
                    <div style={styles.progressText}>{currentIndex + 1} / {selectedDeck.cards.length}</div>
                    <div style={styles.flashcard(selectedDeck.color, isFlipped)} onClick={() => setIsFlipped(!isFlipped)}>
                        <div style={styles.cardInner(isFlipped)}>
                            <div style={styles.cardFace(selectedDeck.color, false)}>{card.front}</div>
                            <div style={styles.cardFace(selectedDeck.color, true)}>{card.back}</div>
                        </div>
                    </div>
                    <div style={styles.navBtns}>
                        <button style={styles.navBtn(currentIndex === 0)} onClick={prevCard} disabled={currentIndex === 0}>Previous</button>
                        <button style={styles.navBtn(currentIndex === selectedDeck.cards.length - 1)} onClick={nextCard} disabled={currentIndex === selectedDeck.cards.length - 1}>Next</button>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedDeck) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <button style={styles.iconBtn()} onClick={() => setSelectedDeck(null)}><MdArrowBack size={22} /></button>
                    <span style={styles.title}>{selectedDeck.name}</span>
                    <button style={styles.iconBtn(true)} onClick={() => openCardModal()}><MdAdd size={22} /></button>
                </div>
                <div style={styles.content}>
                    <div style={styles.actionRow}>
                        <button style={styles.actionBtn('#4F46E5')} onClick={startStudy} disabled={selectedDeck.cards.length === 0}><MdPlayArrow size={20} />Study</button>
                        <button style={styles.actionBtn('#10B981')} onClick={shuffleCards}><MdShuffle size={20} />Shuffle</button>
                        <button style={styles.actionBtn('#EC4899')} onClick={() => shareDeck(selectedDeck)}><MdShare size={20} />Share</button>
                    </div>
                    {selectedDeck.cards.length === 0 ? (
                        <div style={styles.emptyState}><div style={styles.emptyIcon}>📇</div><div style={styles.emptyText}>No cards yet</div><button style={styles.createBtn} onClick={() => openCardModal()}>Add Card</button></div>
                    ) : (
                        selectedDeck.cards.map(card => (
                            <div key={card.id} style={styles.cardItem}>
                                <div><div style={styles.cardText}>{card.front}</div><div style={styles.cardBack}>{card.back}</div></div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button style={styles.smallBtn} onClick={() => openCardModal(card)}><MdEdit size={16} /></button>
                                    <button style={styles.smallBtn} onClick={() => confirmDeleteCard(card.id)}><MdDelete size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {showCardModal && (
                    <div style={styles.modal} onClick={() => setShowCardModal(false)}>
                        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div style={styles.modalHeader}><span style={styles.modalTitle}>{editingCard ? 'Edit Card' : 'New Card'}</span><button style={styles.closeBtn} onClick={() => setShowCardModal(false)}><MdClose size={20} /></button></div>
                            <label style={styles.label}>Front (Question)</label><textarea style={styles.textarea} value={cardFront} onChange={e => setCardFront(e.target.value)} placeholder="Enter question..." />
                            <label style={styles.label}>Back (Answer)</label><textarea style={styles.textarea} value={cardBack} onChange={e => setCardBack(e.target.value)} placeholder="Enter answer..." />
                            <button style={styles.saveBtn} onClick={saveCard}>{editingCard ? 'Update' : 'Add Card'}</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.iconBtn()} onClick={() => navigate(-1)}><MdArrowBack size={22} /></button>
                <span style={styles.title}>Flashcards</span>
                <button style={styles.iconBtn(true)} onClick={() => openDeckModal()}><MdAdd size={22} /></button>
            </div>
            <div style={styles.content}>
                {decks.length === 0 ? (
                    <div style={styles.emptyState}><div style={styles.emptyIcon}>📚</div><div style={styles.emptyText}>No decks yet</div><button style={styles.createBtn} onClick={() => openDeckModal()}>Create Deck</button></div>
                ) : (
                    <div style={styles.decksGrid}>
                        {decks.map((deck, i) => (
                            <div key={deck.id} style={styles.deckCard(deck.color, i)} onClick={() => setSelectedDeck(deck)}>
                                <div style={styles.deckName}>{deck.name}</div>
                                <div style={styles.deckCount}>{deck.cards.length} cards</div>
                                <div style={styles.deckActions}>
                                    <button style={styles.smallBtn} onClick={e => { e.stopPropagation(); openDeckModal(deck); }}><MdEdit size={14} /></button>
                                    <button style={styles.smallBtn} onClick={e => confirmDeleteDeck(deck.id, e)}><MdDelete size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button style={styles.fab} onClick={() => openDeckModal()}><MdAdd size={28} /></button>
            {showDeckModal && (
                <div style={styles.modal} onClick={() => setShowDeckModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}><span style={styles.modalTitle}>{editingDeck ? 'Edit Deck' : 'New Deck'}</span><button style={styles.closeBtn} onClick={() => setShowDeckModal(false)}><MdClose size={20} /></button></div>
                        <label style={styles.label}>Deck Name</label><input style={styles.input} type="text" value={deckName} onChange={e => setDeckName(e.target.value)} placeholder="e.g., Biology Chapter 1" />
                        <label style={styles.label}>Color</label><div style={styles.colorPicker}>{deckColors.map(c => <button key={c} style={styles.colorBtn(c, deckColor === c)} onClick={() => setDeckColor(c)} />)}</div>
                        <button style={styles.saveBtn} onClick={saveDeck}>{editingDeck ? 'Update' : 'Create Deck'}</button>
                    </div>
                </div>
            )}
            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } input:focus, textarea:focus { border-color: #4F46E5 !important; }`}</style>

            <ConfirmationModal
                isOpen={!!deleteInfo}
                onClose={() => setDeleteInfo(null)}
                onConfirm={handleDelete}
                title={deleteInfo?.type === 'deck' ? 'Delete Deck' : 'Delete Card'}
                message={`Are you sure you want to delete this ${deleteInfo?.type}? This action cannot be undone.`}
            />
        </div>
    );
};

export default Flashcards;
