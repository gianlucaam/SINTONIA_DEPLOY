import React, { useState, useEffect } from 'react';
import AdminPatientTable from '../components/AdminPatientTable';
import AdminPatientDetailModal from '../components/AdminPatientDetailModal';
import PageHeader from '../components/PageHeader';
import type { PatientData, LoadingState } from '../types/patient';
import { fetchPatients } from '../services/patient.service';
import { Users, User, Eye, LayoutGrid, List, Search, RotateCcw } from 'lucide-react';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles
import '../css/AdminPatientList.css';
import '../css/EmptyState.css';

const AdminPatientList: React.FC = () => {
    const [patientsState, setPatientsState] = useState<LoadingState<PatientData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [viewingPatient, setViewingPatient] = useState<PatientData | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Calcolo dinamico degli elementi per pagina
    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (viewMode === 'grid') {
                setItemsPerPage(8);
            } else {
                // List view: fixed 4 rows
                setItemsPerPage(4);
            }
        };

        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);

        return () => window.removeEventListener('resize', calculateItemsPerPage);
    }, [viewMode]);

    // Stati per la ricerca live
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);

    useEffect(() => {
        loadPatients();
    }, []);

    // Effetto per filtrare pazienti in tempo reale
    useEffect(() => {
        if (!patientsState.data) return;

        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            // Nessuna ricerca, mostra tutti
            setFilteredPatients(patientsState.data);
        } else {
            // Filtra per ID parziale (case insensitive)
            const filtered = patientsState.data.filter(patient =>
                patient.idPaziente.toLowerCase().includes(query)
            );
            setFilteredPatients(filtered);
        }

        // Reset alla prima pagina quando cambia il filtro
        setCurrentPage(1);
    }, [searchQuery, patientsState.data]);

    const loadPatients = async () => {
        setPatientsState({ data: null, loading: true, error: null });
        try {
            const data = await fetchPatients();
            setPatientsState({ data, loading: false, error: null });
            setFilteredPatients(data);
            setCurrentPage(1);
        } catch (error) {
            setPatientsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load patients',
            });
        }
    };


    const handleSelectPatient = (id: string) => {
        setSelectedPatientId(id);
    };

    const handleView = (id: string) => {
        const patient = patientsState.data?.find(p => p.idPaziente === id);
        if (patient) {
            setViewingPatient(patient);
        }
    };

    const handleCloseModal = () => {
        setViewingPatient(null);
    };

    // Gestione input ricerca (live)
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Reset ricerca
    const handleReset = () => {
        setSearchQuery('');
    };

    // Pagination logic sui pazienti filtrati
    const totalPatients = filteredPatients.length;
    const totalPages = Math.ceil(totalPatients / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPatients = filteredPatients.slice(startIndex, endIndex);

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
        <div className="content-panel">
            <PageHeader
                title="Gestione Pazienti"
                subtitle="Visualizza e gestisci tutti i pazienti del sistema"
                icon={<Users size={24} />}
            />

            {patientsState.loading && (
                <div className="loading-state">Caricamento pazienti...</div>
            )}

            {patientsState.error && (
                <div className="error-state">
                    <p>Errore: {patientsState.error}</p>
                    <button onClick={() => loadPatients()} className="retry-btn">
                        Riprova
                    </button>
                </div>
            )}

            {patientsState.data && !patientsState.loading && (
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
                                    <>Trovati: <strong style={{ color: '#0D475D' }}>{totalPatients}</strong> pazienti</>
                                ) : (
                                    <>Totale pazienti: <strong style={{ color: '#0D475D' }}>{totalPatients}</strong></>
                                )}
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
                                placeholder="Cerca per ID..."
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '2px solid #ddd',
                                    fontSize: '14px',
                                    width: '280px',
                                    transition: 'border-color 0.2s ease',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#83B9C1'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                            {searchQuery && (
                                <button onClick={handleReset} className="clear-filter-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Griglia pazienti o messaggio vuoto */}
                    {currentPatients.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="patient-grid">
                                    {currentPatients.map((patient) => (
                                        <div key={patient.idPaziente} className="patient-card">
                                            <div className="patient-avatar">
                                                <User size={32} />
                                            </div>
                                            <div className="patient-info">
                                                <h3 className="patient-name">{patient.nome} {patient.cognome}</h3>
                                            </div>
                                            <button
                                                className="profile-btn"
                                                onClick={() => handleView(patient.idPaziente)}
                                            >
                                                <Eye size={16} />
                                                Profilo
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <AdminPatientTable
                                        patients={currentPatients}
                                        selectedId={selectedPatientId}
                                        onSelect={handleSelectPatient}
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
                        <div className="unified-empty-state">
                            <div className="unified-empty-icon">
                                {searchQuery ? <Search size={48} /> : <Users size={48} />}
                            </div>
                            <h3 className="unified-empty-title">
                                {searchQuery ? 'Nessun Risultato' : 'Nessun Paziente'}
                            </h3>
                            <p className="unified-empty-message">
                                {searchQuery
                                    ? `Nessun paziente trovato con ID "${searchQuery}". Prova con un altro ID.`
                                    : 'Non sono presenti pazienti da visualizzare.'
                                }
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal for viewing patient details */}
            {viewingPatient && (
                <AdminPatientDetailModal
                    patient={viewingPatient}
                    onClose={handleCloseModal}
                    onUpdate={loadPatients}
                />
            )}
        </div>
    );
};

export default AdminPatientList;
