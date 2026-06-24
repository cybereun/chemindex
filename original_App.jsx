import { useState } from 'react';
import { Search, Loader2, TestTube, Activity, FileText, AlertCircle } from 'lucide-react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pubchemData, setPubchemData] = useState(null);
  const [chemblData, setChemblData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setPubchemData(null);
    setChemblData(null);

    try {
      // 1. PubChem Search (gets CID and basic properties)
      const pubchemRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchTerm)}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IUPACName,XLogP/JSON`);
      
      if (!pubchemRes.ok) {
        throw new Error('PubChem에서 해당 물질을 찾을 수 없습니다. 이름이나 CAS 번호를 정확히 확인해주세요.');
      }
      
      const pubchemJson = await pubchemRes.json();
      const props = pubchemJson.PropertyTable.Properties[0];
      const cid = props.CID;
      
      // 2. PubChem View API (for physicochemical properties)
      let extraProps = {};
      try {
        const viewRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON/`);
        if (viewRes.ok) {
          const viewJson = await viewRes.json();
          const sections = viewJson.Record.Section || [];
          const chemPhysical = sections.find(s => s.TOCHeading === 'Chemical and Physical Properties');
          
          if (chemPhysical) {
             const experimental = chemPhysical.Section?.find(s => s.TOCHeading === 'Experimental Properties');
             if (experimental) {
                experimental.Section?.forEach(prop => {
                   if (['Melting Point', 'Boiling Point', 'Density', 'Solubility', 'Color/Form'].includes(prop.TOCHeading)) {
                      extraProps[prop.TOCHeading] = prop.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String || 'N/A';
                   }
                });
             }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch extra properties from PubChem View', err);
      }

      setPubchemData({ ...props, extraProps });

      // 3. ChEMBL API Search
      try {
        const chemblRes = await fetch(`https://www.ebi.ac.uk/chembl/api/data/molecule/search?q=${encodeURIComponent(searchTerm)}&format=json`);
        if (chemblRes.ok) {
          const chemblJson = await chemblRes.json();
          if (chemblJson.molecules && chemblJson.molecules.length > 0) {
            const bestMatch = chemblJson.molecules[0];
            setChemblData({
               maxPhase: bestMatch.max_phase,
               prefName: bestMatch.pref_name,
               moleculeType: bestMatch.molecule_type,
               therapeuticFlag: bestMatch.therapeutic_flag,
               atcClassifications: bestMatch.atc_classifications || [],
               indicationClass: bestMatch.indication_class
            });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch ChEMBL data', err);
      }

    } catch (err) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <h1>ChemSearch</h1>
        <p>Merck Index 스타일의 화학물질 및 의약품 정보 검색기</p>
      </header>

      <section className="search-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="화학물질명(예: Aspirin) 또는 CAS 번호(예: 50-78-2)를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            <span>검색</span>
          </button>
        </form>
      </section>

      {error && (
        <div className="error-container animate-fade-in">
          <AlertCircle size={24} style={{ margin: '0 auto 0.5rem auto' }} />
          <p>{error}</p>
        </div>
      )}

      {loading && !error && (
        <div className="loading-container animate-fade-in">
          <Loader2 className="animate-spin" size={48} />
          <p>데이터베이스를 조회 중입니다...</p>
        </div>
      )}

      {pubchemData && !loading && (
        <main className="results-grid animate-fade-in">
          {/* Left Column: Basic Info & Structure */}
          <div className="card glass-panel">
            <h2 className="card-title">
              <TestTube size={24} />
              기본 정보 및 구조
            </h2>
            
            <div className="structure-img-container">
              <img 
                src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubchemData.CID}/PNG?record_type=2d&image_size=large`} 
                alt={`${searchTerm} 2D Structure`} 
                className="structure-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <ul className="info-list">
              <li className="info-item">
                <span className="label">IUPAC Name</span>
                <span className="value">{pubchemData.IUPACName || 'N/A'}</span>
              </li>
              <li className="info-item">
                <span className="label">Molecular Formula</span>
                <span className="value">{pubchemData.MolecularFormula || 'N/A'}</span>
              </li>
              <li className="info-item">
                <span className="label">Molecular Weight</span>
                <span className="value">{pubchemData.MolecularWeight ? `${pubchemData.MolecularWeight} g/mol` : 'N/A'}</span>
              </li>
              <li className="info-item">
                <span className="label">Canonical SMILES</span>
                <span className="value" style={{ fontSize: '0.9rem' }}>{pubchemData.CanonicalSMILES || 'N/A'}</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Properties & Pharmacology */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card glass-panel">
              <h2 className="card-title">
                <FileText size={24} />
                물리화학적 특성
              </h2>
              <div className="properties-grid">
                <div className="property-box">
                  <div className="label">XLogP (분배계수)</div>
                  <div className="value">{pubchemData.XLogP !== undefined ? pubchemData.XLogP : 'N/A'}</div>
                </div>
                <div className="property-box">
                  <div className="label">Color / Form (외관)</div>
                  <div className="value">{pubchemData.extraProps?.['Color/Form'] || 'N/A'}</div>
                </div>
                <div className="property-box">
                  <div className="label">Melting Point (녹는점)</div>
                  <div className="value">{pubchemData.extraProps?.['Melting Point'] || 'N/A'}</div>
                </div>
                <div className="property-box">
                  <div className="label">Boiling Point (끓는점)</div>
                  <div className="value">{pubchemData.extraProps?.['Boiling Point'] || 'N/A'}</div>
                </div>
                <div className="property-box">
                  <div className="label">Density (밀도)</div>
                  <div className="value">{pubchemData.extraProps?.['Density'] || 'N/A'}</div>
                </div>
                <div className="property-box">
                  <div className="label">Solubility (용해도)</div>
                  <div className="value">{pubchemData.extraProps?.['Solubility'] || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="card glass-panel">
              <h2 className="card-title">
                <Activity size={24} />
                약리 작용 및 효능 (ChEMBL)
              </h2>
              {chemblData ? (
                <div className="pharmacology-section">
                  <div>
                    <span className="label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ChEMBL Preferred Name</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{chemblData.prefName || 'N/A'}</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="property-box" style={{ flex: 1 }}>
                      <div className="label">Max Clinical Phase (임상 단계)</div>
                      <div className="value">Phase {chemblData.maxPhase || 0}</div>
                    </div>
                    <div className="property-box" style={{ flex: 1 }}>
                      <div className="label">Molecule Type (물질 타입)</div>
                      <div className="value">{chemblData.moleculeType || 'N/A'}</div>
                    </div>
                  </div>

                  <div>
                    <span className="label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Therapeutic Flag</span>
                    <div>
                      {chemblData.therapeuticFlag ? 
                        <span className="badge" style={{ backgroundColor: '#10b981' }}>의약품 승인됨</span> : 
                        <span className="badge" style={{ backgroundColor: '#6b7280' }}>치료 목적 아님</span>
                      }
                    </div>
                  </div>

                  {chemblData.indicationClass && (
                    <div>
                      <span className="label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Indication Class (적응증)</span>
                      <div className="value">{chemblData.indicationClass}</div>
                    </div>
                  )}

                  {chemblData.atcClassifications?.length > 0 && (
                    <div>
                      <span className="label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>ATC Classifications</span>
                      <div>
                        {chemblData.atcClassifications.map(atc => (
                          <span key={atc} className="badge" style={{ backgroundColor: '#8b5cf6' }}>{atc}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                  <p>이 화합물에 대한 ChEMBL 약리 데이터가 존재하지 않습니다.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {!pubchemData && !loading && !error && (
        <div className="empty-state animate-fade-in">
          <TestTube size={64} opacity={0.5} />
          <h2>화학물질 데이터베이스에 접속해보세요</h2>
          <p>이름(Aspirin, Caffeine)이나 CAS 번호(50-78-2)를 검색하면<br/>PubChem과 ChEMBL의 통합 데이터를 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}

export default App;
