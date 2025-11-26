import { startSPIDLogin } from '../services/spid-auth.service';
import '../css/SPIDInfo.css';

const SPIDInfo = () => {
    return (
        <div className="spid-info-container">
            <div className="spid-info-card">
                <img src="/sintonia-logo-new.jpg" alt="Sintonia" style={{ width: '150px' }} />
                <h1 className="spid-title">
                    Accedi all'area riservata
                </h1>

                <p className="spid-description">
                    SPID, il Sistema Pubblico di Identità Digitale, è il sistema di accesso che consente di utilizzare, con un'identità digitale unica, i servizi online della Pubblica Amministrazione e dei privati accreditati. Se sei già in possesso di un'identità digitale, accedi con le credenziali del tuo gestore. Se non hai ancora un'identità digitale, richiedila ad uno dei gestori.
                </p>

                <div className="spid-links">
                    <a href="https://www.spid.gov.it" target="_blank" rel="noopener noreferrer">
                        Maggiori informazioni su SPID
                    </a>
                    <a href="https://www.spid.gov.it/richiedi-spid" target="_blank" rel="noopener noreferrer">
                        Non hai SPID?
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Servizio aiuto'); }}>
                        Serve aiuto?
                    </a>
                </div>

                <button className="spid-login-btn" onClick={startSPIDLogin}>
                    <span className="spid-icon">🔐</span>
                    Entra con SPID
                </button>

                <div className="spid-logos">
                    <img src="/spid-agid-footer.png" alt="SPID AgID" style={{ height: '30px', width: 'auto', opacity: 1 }} />
                </div>
            </div>
        </div>
    );
};

export default SPIDInfo;
