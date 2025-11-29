import React, { useState, useEffect } from 'react';
import AdminPsychologistTable from '../components/AdminPsychologistTable';
import AdminPsychologistDetailModal from '../components/AdminPsychologistDetailModal';
import { User, Eye, LayoutGrid, List } from 'lucide-react';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles
import '../css/AdminPsychologistList.css';

interface PsychologistData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Disattivato';
}

// Mock data per psicologi - corrispondente ai campi database
const MOCK_PSYCHOLOGISTS: PsychologistData[] = [
    {
        codiceFiscale: 'RSSMRA80A01H501U',
        nome: 'Mario',
        cognome: 'Rossi',
        aslAppartenenza: 'ASL Roma 1',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'VRDLRA85M15F205Z',
        nome: 'Laura',
        cognome: 'Verdi',
        aslAppartenenza: 'ASL Milano 2',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'BNCGVN78C10D612W',
        nome: 'Giovanni',
        cognome: 'Bianchi',
        aslAppartenenza: 'ASL Napoli 1',
        stato: 'Disattivato'
    },
    {
        codiceFiscale: 'FRRSFN90L20H501X',
        nome: 'Stefania',
        cognome: 'Ferrari',
        aslAppartenenza: 'ASL Torino 3',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'MRTNDR82D15A783Y',
        nome: 'Andrea',
        cognome: 'Martini',
        aslAppartenenza: 'ASL Bologna',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'GLLFNC88H25L219V',
        nome: 'Francesca',
        cognome: 'Galli',
        aslAppartenenza: 'ASL Firenze',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'RCCMRC75B12F839K',
        nome: 'Marco',
        cognome: 'Ricci',
        aslAppartenenza: 'ASL Genova',
        stato: 'Disattivato'
    },
    {
        codiceFiscale: 'CSTCHR92E18D969L',
        nome: 'Chiara',
        cognome: 'Castelli',
        aslAppartenenza: 'ASL Venezia',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'BRBLCU83T05B791M',
        nome: 'Luca',
        cognome: 'Barbieri',
        aslAppartenenza: 'ASL Verona',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'PLLELN87A42C351N',
        nome: 'Elena',
        cognome: 'Pellegrini',
        aslAppartenenza: 'ASL Palermo 1',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'CRBPLO79M08G224P',
        nome: 'Paolo',
        cognome: 'Colombo',
        aslAppartenenza: 'ASL Bari',
        stato: 'Attivo'
    },
    {
        codiceFiscale: 'MNTSRT91P48H703Q',
        nome: 'Sara',
        cognome: 'Monti',
        aslAppartenenza: 'ASL Catania',
        stato: 'Disattivato'
    }
];

const AdminPsychologistList: React.FC = () => {
    const [psychologists] = useState<PsychologistData[]>(MOCK_PSYCHOLOGISTS);
    const [loading] = useState(false);
    const [viewingPsychologist, setViewingPsychologist] = useState<PsychologistData | null>(null);
    const [selectedPsychologistId, setSelectedPsychologistId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Calcolo dinamico degli elementi per pagina
    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (viewMode === 'grid') {
                setItemsPerPage(8);
            } else {
                // List view calculation
                const headerHeight = 80; // Navbar
                const titleSearchHeight = 140; // Title + Search bar
                const paginationHeight = 80; // Pagination controls
                const padding = 40; // Container padding

                const availableHeight = window.innerHeight - (headerHeight + titleSearchHeight + paginationHeight + padding);
                const rowHeight = 60; // Approximate height of a table row
                const tableHeaderHeight = 50;
                const listAvailableHeight = availableHeight - tableHeaderHeight;

                const rows = Math.max(5, Math.floor(listAvailableHeight / rowHeight));
                setItemsPerPage(rows);
            }
        };

        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);

        return () => window.removeEventListener('resize', calculateItemsPerPage);
    }, [viewMode]);

    // Stati per la ricerca live
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredPsychologists, setFilteredPsychologists] = useState<PsychologistData[]>(MOCK_PSYCHOLOGISTS);

    useEffect(() => {
        setFilteredPsychologists(psychologists);
    }, [psychologists]);

    // Effetto per filtrare psicologi in tempo reale
    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            // Nessuna ricerca, mostra tutti
            setFilteredPsychologists(psychologists);
        } else {
            // Filtra per Codice Fiscale, Nome o Cognome
            const filtered = psychologists.filter(psy =>
                psy.codiceFiscale.toLowerCase().includes(query) ||
                psy.nome.toLowerCase().includes(query) ||
                psy.cognome.toLowerCase().includes(query)
            );
            setFilteredPsychologists(filtered);
        }

        // Reset alla prima pagina quando cambia il filtro
        setCurrentPage(1);
    }, [searchQuery, psychologists]);

    const handleSelectPsychologist = (id: string) => {
        setSelectedPsychologistId(id);
    };

    const handleView = (id: string) => {
        const psychologist = psychologists.find(p => p.codiceFiscale === id);
        if (psychologist) {
            setViewingPsychologist(psychologist);
        }
    };

    const handleCloseModal = () => {
        setViewingPsychologist(null);
    };

    // Gestione input ricerca (live)
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Reset ricerca
    const handleReset = () => {
        setSearchQuery('');
    };

    // Pagination logic sui psicologi filtrati
    const totalPsychologists = filteredPsychologists.length;
    const totalPages = Math.ceil(totalPsychologists / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPsychologists = filteredPsychologists.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="content-panel-flex">
            <h2 className="panel-title">Gestione Psicologi</h2>

            {loading && (
                <div className="loading-state">Caricamento psicologi...</div>
            )}

            {!loading && (
                <>
                    {/* Barra di ricerca compatta - sopra la tabella a destra */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        gap: '16px'
                    }}>
                        <div className="filter-controls" style={{ margin: 0 }}>
                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                                {searchQuery ? (
                                    <>Trovati: {totalPsychologists} psicologi</>
                                ) : (
                                    <>Totale psicologi: {totalPsychologists}</>
                                )}
                                {totalPages > 1 && <> | Pagina {currentPage} di {totalPages}</>}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="view-toggle">
                                <button
                                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Vista Griglia"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    title="Vista Lista"
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                placeholder="🔍 Cerca per CF, nome o cognome..."
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '2px solid #ddd',
                                    fontSize: '14px',
                                    width: '300px',
                                    transition: 'border-color 0.2s ease',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#83B9C1'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                            {searchQuery && (
                                <button onClick={handleReset} className="clear-filter-btn">
                                    ↺ Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Griglia psicologi o messaggio vuoto */}
                    {currentPsychologists.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="psychologist-grid">
                                    {currentPsychologists.map((psychologist) => (
                                        <div key={psychologist.codiceFiscale} className="psychologist-card">
                                            <div className="psychologist-avatar">
                                                <User size={32} />
                                            </div>
                                            <div className="psychologist-info">
                                                <h3 className="psychologist-name">{psychologist.nome} {psychologist.cognome}</h3>
                                                <p className="psychologist-specialization">{psychologist.aslAppartenenza}</p>
                                            </div>
                                            <button
                                                className="profile-btn"
                                                onClick={() => handleView(psychologist.codiceFiscale)}
                                            >
                                                <Eye size={16} />
                                                Profilo
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <AdminPsychologistTable
                                        psychologists={currentPsychologists}
                                        selectedId={selectedPsychologistId}
                                        onSelect={handleSelectPsychologist}
                                        onView={handleView}
                                    />
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '0',
                                    padding: '16px'
                                }}>
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            background: currentPage === 1 ? '#f5f5f5' : '#fff',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        ← Precedente
                                    </button>

                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} style={{ padding: '0 8px' }}>...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageClick(page as number)}
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    background: currentPage === page ? '#0D475D' : '#fff',
                                                    color: currentPage === page ? '#fff' : '#333',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: currentPage === page ? 'bold' : 'normal'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}

                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Successiva →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <p style={{
                                fontSize: '16px',
                                color: '#666',
                                margin: 0
                            }}>
                                🔍 Nessuno psicologo trovato con "<strong>{searchQuery}</strong>"
                            </p>
                            <p style={{
                                fontSize: '14px',
                                color: '#999',
                                marginTop: '8px'
                            }}>
                                Prova con un altro termine o clicca Reset
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal for viewing psychologist details */}
            {viewingPsychologist && (
                <AdminPsychologistDetailModal
                    psychologist={viewingPsychologist}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default AdminPsychologistList;
