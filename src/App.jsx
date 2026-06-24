import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, TestTube, Activity, FileText, AlertCircle, Maximize2, ShieldAlert, Hexagon, List, Star, BookOpen, AlertTriangle, Plus, Copy, RefreshCw, Clock, ArrowRight, X, Info } from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const GHSHazardKo = {
  "H200": "불안정한 폭발성 물질", "H201": "폭발성 물질; 대량 폭발 위험성", "H202": "폭발성 물질; 심각한 비산 위험성", "H203": "폭발성 물질; 화재, 폭풍 또는 비산 위험성", "H204": "화재 또는 비산 위험성",
  "H220": "극인화성 가스", "H221": "인화성 가스", "H222": "극인화성 에어로졸", "H223": "인화성 에어로졸", "H224": "극인화성 액체 및 증기", "H225": "고인화성 액체 및 증기", "H226": "인화성 액체 및 증기", "H227": "가연성 액체", "H228": "인화성 고체",
  "H240": "가열하면 폭발할 수 있음", "H241": "가열하면 화재 또는 폭발할 수 있음", "H242": "가열하면 화재를 일으킬 수 있음", "H250": "공기에 노출되면 스스로 발화함", "H260": "물과 접촉하면 자연발화성 인화성 가스를 발생시킴",
  "H270": "화재를 일으키거나 강렬하게 함; 산화제", "H271": "화재 또는 폭발을 일으킬 수 있음; 강산화제", "H272": "화재를 크게 할 수 있음; 산화제", "H290": "금속을 부식시킬 수 있음",
  "H300": "삼키면 치명적임", "H301": "삼키면 유독함", "H302": "삼키면 유해함", "H303": "삼키면 유해할 수 있음", "H304": "삼켜서 기도로 유입되면 치명적일 수 있음",
  "H310": "피부와 접촉하면 치명적임", "H311": "피부와 접촉하면 유독함", "H312": "피부와 접촉하면 유해함", "H313": "피부와 접촉하면 유해할 수 있음", "H314": "피부에 심한 화상과 눈에 손상을 일으킴", "H315": "피부에 자극을 일으킴", "H317": "알레르기성 피부 반응을 일으킬 수 있음", "H318": "눈에 심한 손상을 일으킴", "H319": "눈에 심한 자극을 일으킴", "H320": "눈에 자극을 일으킴",
  "H330": "흡입하면 치명적임", "H331": "흡입하면 유독함", "H332": "흡입하면 유해함", "H333": "흡입하면 유해할 수 있음", "H334": "흡입 시 알레르기성 반응, 천식 또는 호흡 곤란을 일으킬 수 있음", "H335": "호흡기계 자극을 일으킬 수 있음", "H336": "졸음 또는 현기증을 일으킬 수 있음",
  "H340": "유전적인 결함을 일으킬 수 있음", "H341": "유전적인 결함을 일으킬 것으로 의심됨", "H350": "암을 일으킬 수 있음", "H351": "암을 일으킬 것으로 의심됨", "H360": "태아 또는 생식능력에 손상을 일으킬 수 있음", "H361": "태아 또는 생식능력에 손상을 일으킬 것으로 의심됨", "H362": "모유를 먹는 아이에게 유해할 수 있음",
  "H370": "신체 기관에 손상을 일으킴", "H371": "신체 기관에 손상을 일으킬 수 있음", "H372": "장기간 또는 반복 노출되면 장기에 손상을 일으킴", "H373": "장기간 또는 반복 노출되면 장기에 손상을 일으킬 수 있음",
  "H400": "수생생물에 매우 유독함", "H401": "수생생물에 유독함", "H410": "장기적 영향에 의해 수생생물에 매우 유독함", "H411": "장기적 영향에 의해 수생생물에 유독함", "H412": "장기적 영향에 의해 수생생물에 유해함", "H413": "수생생물에게 장기적인 유해한 영향을 일으킬 수 있음", "H420": "오존층을 파괴하여 공중보건 및 환경에 유해함"
};

const GHSPrecautionKo = {
  "P201": "사용 전 취급 설명서를 확보하시오", "P202": "안전 예방조치 문구를 읽고 이해하기 전에는 취급하지 마시오", "P210": "열·스파크·화염·고열로부터 멀리하시오", "P211": "스프레이나 다른 발화원 등에 분사하지 마시오", "P220": "의복 또는 가연성 물질로부터 격리·보관하시오", "P230": "습윤 상태를 유지하시오", "P233": "용기를 단단히 밀폐하시오", "P234": "원래의 용기에만 보관하시오", "P240": "용기와 수용설비를 접지·접합시키시오", "P241": "폭발 방지용 전기·환기·조명 장비를 사용하시오", "P242": "스파크가 발생하지 않는 도구를 사용하시오", "P243": "정전기 방지 조치를 취하시오", "P260": "분진·미스트·증기·스프레이를 흡입하지 마시오", "P261": "분진·미스트·증기·스프레이의 흡입을 피하시오", "P262": "눈, 피부, 의복에 묻지 않도록 하시오", "P264": "취급 후에는 취급 부위를 철저히 씻으시오", "P270": "제품 사용할 때에는 식음 및 흡연을 금하시오", "P271": "옥외나 환기가 잘 되는 곳에서만 취급하시오", "P272": "작업장 밖으로 오염된 의복을 반출하지 마시오", "P273": "환경으로 배출하지 마시오", "P280": "보호장갑·보호의·보안경·안면보호구를 착용하시오", "P284": "호흡기 보호구를 착용하시오",
  "P301": "삼켰을 경우", "P302": "피부에 묻었을 경우", "P303": "피부(또는 머리카락)에 묻었을 경우", "P304": "흡입하면", "P305": "눈에 묻으면", "P308": "노출되거나 우려되면", "P310": "즉시 의료기관의 진찰을 받으시오", "P311": "의료기관의 진찰을 받으시오", "P312": "불편함을 느끼면 의료기관의 진찰을 받으시오", "P313": "의학적인 조치·조언을 구하시오", "P314": "불편함을 느끼면 의학적인 조치·조언을 구하시오", "P330": "입을 씻어내시오", "P331": "토하게 하지 마시오", "P332": "피부 자극이 생기면", "P333": "피부 자극/홍반이 생기면", "P337": "눈에 자극이 지속되면", "P338": "콘택트렌즈를 뺄 수 있으면 빼시오", "P362": "오염된 의복을 벗고 다시 사용 전 세탁하시오", "P363": "다시 사용 전 오염된 의복을 세탁하시오", "P370": "화재 시", "P378": "적절한 소화기를 사용하시오", "P381": "안전하게 처리할 수 있으면 누출을 방지하시오",
  "P403": "환기가 잘 되는 곳에 보관하시오", "P405": "밀봉하여 보관하시오",
  "P501": "관련 법규에 따라 내용물과 용기를 폐기하시오"
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data States
  const [activeCompound, setActiveCompound] = useState(null);
  const [current3DStyle, setCurrent3DStyle] = useState('stick');
  const [toastMsg, setToastMsg] = useState(null);

  const [searchHistory, setSearchHistory] = useState([]);
  const [comparisonDeck, setComparisonDeck] = useState([]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const [rdkitStatus, setRdkitStatus] = useState({ loading: true, active: false });
  const [rdkitSvg, setRdkitSvg] = useState('');
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Initialize RDKit
  useEffect(() => {
    if (window.initRDKitModule) {
      window.initRDKitModule().then((instance) => {
        window.RDKitModule = instance;
        setRdkitStatus({ loading: false, active: true });
        showToast('RDKit.js 엔진이 안정적으로 마운트되었습니다.', 'success');
      }).catch(err => {
        setRdkitStatus({ loading: false, active: false });
      });
    } else {
      setRdkitStatus({ loading: false, active: false });
    }
  }, []);

  const showToast = (message, type = 'info') => {
    setToastMsg({ message, type, id: Date.now() });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const containsKorean = (text) => /[\uac00-\ud7a3]/.test(text);

  const translateKoToEn = async (text) => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|en`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let translated = data.responseData.translatedText;
        if (translated) return translated.replace(/[.]/g, '').trim();
      }
    } catch (e) {
      console.warn("Translation offline.");
    }
    return text;
  };

  const translateEnToKo = async (text) => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ko`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let translated = data.responseData.translatedText;
        if (translated) return translated.trim();
      }
    } catch (e) {
      console.warn("EN->KO Translation offline.");
    }
    return text;
  };

  const renderFormula = (formula) => {
    if (!formula) return null;
    const parts = formula.split(/(\d+)/);
    return parts.map((part, i) => {
      if (/\d+/.test(part)) {
        return <sub key={i}>{part}</sub>;
      }
      return part;
    });
  };

  const parseGHSFromPubChem = (json) => {
    const results = { pictograms: [], hazardStatements: [], precautionaryStatements: [], signalWord: null };
    const picSet = new Set();
    const hazardSet = new Set();
    const precSet = new Set();

    const traverse = (node) => {
      if (Array.isArray(node)) {
        node.forEach(traverse);
      } else if (node && typeof node === 'object') {
        if (node.Name === "Pictogram(s)" || node.Name === "GHS Pictograms") {
          const markup = node.Value?.StringWithMarkup?.[0]?.Markup || [];
          markup.forEach(m => {
            if (m.Type === "URL" && !picSet.has(m.URL)) {
              results.pictograms.push(m.URL);
              picSet.add(m.URL);
            }
          });
        }
        if (node.Name === "Signal") {
          const signal = node.Value?.StringWithMarkup?.[0]?.String;
          if (signal) {
            if (!results.signalWord) results.signalWord = signal;
            else if (signal.toLowerCase() === "danger") results.signalWord = "Danger";
          }
        }
        if (node.Name === "GHS Hazard Statements" || node.Name === "Hazard Statements") {
          const strings = node.Value?.StringWithMarkup || [];
          strings.forEach(item => {
            if (item.String && !hazardSet.has(item.String)) {
              results.hazardStatements.push(item.String);
              hazardSet.add(item.String);
            }
          });
        }
        if (node.Name === "Precautionary Statement Codes" || node.Name === "Precautionary Statements") {
          const strings = node.Value?.StringWithMarkup || [];
          strings.forEach(item => {
            if (item.String && !precSet.has(item.String)) {
              results.precautionaryStatements.push(item.String);
              precSet.add(item.String);
            }
          });
        }
        
        for (const key in node) {
          traverse(node[key]);
        }
      }
    };

    traverse(json);
    return results;
  };

  const handleSearch = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    const q = directQuery || searchTerm.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setActiveCompound(null);

    let finalQuery = q;
    try {
      if (containsKorean(q)) {
        const translated = await translateKoToEn(q);
        if (translated && translated.toLowerCase() !== q.toLowerCase()) {
          finalQuery = translated;
          showToast(`한글명 '${q}'을(를) '${finalQuery}'(으)로 번역하여 검색합니다.`, 'success');
        }
      }

      // 1. PubChem Basic
      const pubchemRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(finalQuery)}/property/Title,MolecularFormula,ExactMass,MolecularWeight,CanonicalSMILES,IUPACName,XLogP,HBondDonorCount,HBondAcceptorCount,Charge/JSON`);
      if (!pubchemRes.ok) throw new Error(`'${finalQuery}'에 대한 검색 결과를 찾을 수 없습니다. 이름이나 CAS 번호를 확인해주세요.`);
      
      const pubchemJson = await pubchemRes.json();
      const props = pubchemJson.PropertyTable.Properties[0];
      const cid = props.CID;

      // 2. PubChem View (Experimental Props & GHS)
      let extraProps = {};
      let ghsData = { pictograms: [], hazardStatements: [] };
      try {
        const viewRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON/`);
        if (viewRes.ok) {
          const viewJson = await viewRes.json();
          // Extra Props
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
          // Description
          const namesSection = sections.find(s => s.TOCHeading === 'Names and Identifiers');
          if (namesSection) {
            const descSection = namesSection.Section?.find(s => s.TOCHeading === 'Record Description');
            if (descSection && descSection.Information && descSection.Information.length > 0) {
              const engDesc = descSection.Information[0].Value?.StringWithMarkup?.[0]?.String;
              if (engDesc) {
                extraProps.description = await translateEnToKo(engDesc);
              }
            }
          }
          // GHS
          const safetySection = sections.find(s => s.TOCHeading === 'Safety and Hazards');
          if (safetySection) {
            ghsData = parseGHSFromPubChem({ Record: { Section: [safetySection] } });
          }
        }
      } catch (err) { console.warn('Extra properties fetch failed', err); }

      // 3. 3D SDF Data
      let sdf3D = null;
      try {
        const sdfRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`);
        if (sdfRes.ok) sdf3D = await sdfRes.text();
      } catch (err) {}

      // 4. ChEMBL API
      let chemblData = null;
      try {
        const chemblRes = await fetch(`https://www.ebi.ac.uk/chembl/api/data/molecule/search?q=${encodeURIComponent(finalQuery)}&format=json`);
        if (chemblRes.ok) {
          const chemblJson = await chemblRes.json();
          if (chemblJson.molecules && chemblJson.molecules.length > 0) {
            const bestMatch = chemblJson.molecules[0];
            chemblData = {
               chemblId: bestMatch.molecule_chembl_id,
               maxPhase: bestMatch.max_phase,
               prefName: bestMatch.pref_name,
               moleculeType: bestMatch.molecule_type,
               therapeuticFlag: bestMatch.therapeutic_flag,
               atcClassifications: bestMatch.atc_classifications || [],
               indicationClass: bestMatch.indication_class,
               bioactivities: []
            };

            // Fetch bioactivities
            try {
               const actRes = await fetch(`https://www.ebi.ac.uk/chembl/api/data/activity?molecule_chembl_id=${bestMatch.molecule_chembl_id}&pchembl_value__isnull=false&format=json&limit=4`);
               if (actRes.ok) {
                   const actJson = await actRes.json();
                   chemblData.bioactivities = actJson.activities.map(a => ({
                       targetId: a.target_chembl_id,
                       targetName: a.target_pref_name,
                       type: a.standard_type,
                       value: a.standard_value,
                       units: a.standard_units
                   }));
               }
            } catch(e) {}
          }
        }
      } catch (err) {}

      setActiveCompound({
        cid,
        title: props.Title || q,
        formula: props.MolecularFormula,
        exactMass: props.ExactMass,
        mw: parseFloat(props.MolecularWeight) || 0,
        smiles: props.CanonicalSMILES || '',
        iupac: props.IUPACName || 'N/A',
        logp: props.XLogP !== undefined ? parseFloat(props.XLogP) : 0.0,
        donor: props.HBondDonorCount !== undefined ? parseInt(props.HBondDonorCount) : 0,
        acceptor: props.HBondAcceptorCount !== undefined ? parseInt(props.HBondAcceptorCount) : 0,
        charge: props.Charge !== undefined ? parseInt(props.Charge) : 0,
        ghs: ghsData,
        extraProps,
        description: extraProps.description,
        chembl: chemblData,
        sdf3D
      });
      setSearchTerm(finalQuery);
      setSearchHistory(prev => {
        const queryToSave = props.Title || finalQuery;
        return [queryToSave, ...prev.filter(item => item !== queryToSave)].slice(0, 10);
      });

    } catch (err) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const copySMILES = async () => {
    if (activeCompound && activeCompound.smiles) {
      try {
        await navigator.clipboard.writeText(activeCompound.smiles);
        showToast('SMILES가 클립보드에 복사되었습니다.', 'success');
      } catch (err) {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = activeCompound.smiles;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
          showToast('SMILES가 클립보드에 복사되었습니다.', 'success');
        } catch (e) {
          showToast('복사에 실패했습니다. 브라우저 설정을 확인해주세요.', 'error');
        }
      }
    }
  };

  const addToDeck = () => {
    if (!activeCompound) return;
    setComparisonDeck(prev => {
      if (prev.find(item => item.cid === activeCompound.cid)) {
        showToast('이미 비교 데크에 존재하는 물질입니다.', 'info');
        return prev;
      }
      if (prev.length >= 2) {
        showToast('비교 데크에는 최대 2개까지만 담을 수 있습니다.', 'error');
        return prev;
      }
      showToast(`${activeCompound.title}이(가) 비교 데크에 추가되었습니다.`, 'success');
      return [...prev, activeCompound];
    });
    setIsLeftSidebarOpen(true);
  };

  // 3D Rendering Effect
  useEffect(() => {
    if (activeCompound && activeCompound.sdf3D && viewerRef.current && window.$3Dmol) {
      viewerRef.current.innerHTML = '';
      try {
        let viewer = window.$3Dmol.createViewer(viewerRef.current, { backgroundColor: '#ffffff' });
        viewerInstanceRef.current = viewer;
        viewer.addModel(activeCompound.sdf3D, "sdf");
        viewer.setStyle({}, { stick: { radius: 0.18 }, sphere: { scale: 0.25 } });
        viewer.zoomTo();
        viewer.render();
        setCurrent3DStyle('stick');
      } catch(e) {}
    }
  }, [activeCompound]);

  const apply3DStyle = (style) => {
    setCurrent3DStyle(style);
    if (!viewerInstanceRef.current) return;
    const viewer = viewerInstanceRef.current;
    viewer.setStyle({}, {});
    if (style === 'stick') viewer.setStyle({}, { stick: { radius: 0.18 }, sphere: { scale: 0.25 } });
    else if (style === 'sphere') viewer.setStyle({}, { sphere: { radius: 0.6 } });
    else if (style === 'line') viewer.setStyle({}, { line: {} });
    viewer.render();
  };

  // 2D RDKit Rendering Effect
  useEffect(() => {
    if (activeCompound && window.RDKitModule && activeCompound.smiles) {
      try {
        const mol = window.RDKitModule.get_mol(activeCompound.smiles);
        if (mol) {
          let svg = mol.get_svg(JSON.stringify({ width: 500, height: 500, bondLineWidth: 2, clearBackground: false }));
          // Remove explicit pixel dimensions so CSS can scale it
          svg = svg.replace(/width='[0-9.]+px'/g, "width='100%'").replace(/height='[0-9.]+px'/g, "height='100%'");
          setRdkitSvg(svg);
          mol.delete();
        } else {
          setRdkitSvg('');
        }
      } catch(e) {
        console.error("RDKit rendering error", e);
        setRdkitSvg('');
      }
    } else {
      setRdkitSvg('');
    }
  }, [activeCompound, rdkitStatus.active]);

  // Lipinski Chart
  const getLipinskiData = () => {
    if (!activeCompound) return null;
    const { mw, logp, donor, acceptor } = activeCompound;
    let score = 0;
    if (mw <= 500) score++;
    if (logp <= 5) score++;
    if (donor <= 5) score++;
    if (acceptor <= 10) score++;

    return {
      data: {
        labels: ['분자량 (≤500)', '지용성/LogP (≤5)', '수소결합 주개 (≤5)', '수소결합 받개 (≤10)'],
        datasets: [{
          label: '현재 화합물',
          data: [
            Math.min((mw / 500) * 100, 150),
            Math.min((Math.max(logp, 0) / 5) * 100, 150),
            Math.min((donor / 5) * 100, 150),
            Math.min((acceptor / 10) * 100, 150)
          ],
          backgroundColor: 'rgba(5, 150, 105, 0.2)',
          borderColor: 'rgba(5, 150, 105, 1)',
          borderWidth: 2,
        },
        {
          label: '리핀스키 기준선 (100%)',
          data: [100, 100, 100, 100],
          backgroundColor: 'transparent',
          borderColor: 'rgba(217, 119, 6, 0.5)',
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { r: { ticks: { display: false, max: 120 } } } },
      score
    };
  };

  const lipinskiChart = getLipinskiData();

  // "Search Engine" Initial Layout
  if (!activeCompound && !loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf6ee] text-[#332f2b]">
        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto -mt-20">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="bg-gradient-to-tr from-amber-700 to-emerald-700 p-4 rounded-2xl shadow-xl shadow-amber-700/20 mb-6">
              <TestTube size={48} className="text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-amber-800 to-emerald-800 bg-clip-text text-transparent mb-4 tracking-tight">ChemIndex</h1>
            <p className="text-stone-500 text-lg">Merck Index 스타일의 정밀 화학 데이터 검색 엔진</p>
          </div>
          
          <form onSubmit={handleSearch} className="w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="text-stone-400 group-focus-within:text-amber-700 transition-colors" size={24} />
            </div>
            <input
              type="text"
              className="w-full bg-white border-2 border-stone-200/80 rounded-full py-5 pl-14 pr-36 text-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 shadow-lg transition-all"
              placeholder="화학물질명(예: Aspirin, 카페인) 또는 CAS 번호를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-3 bottom-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-950 text-white px-8 rounded-full font-semibold transition-all shadow-md">
              조회
            </button>
          </form>

          {error && (
            <div className="mt-8 bg-rose-50 text-rose-700 px-6 py-4 rounded-2xl border border-rose-200 flex items-center gap-3 w-full animate-fade-in shadow-sm">
              <AlertCircle size={20} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {['카페인', '아스피린', '메트포르민', '니코틴'].map(item => (
              <button 
                key={item} 
                onClick={() => { setSearchTerm(item); handleSearch(null, item); }} 
                className="text-sm bg-white hover:bg-stone-100 border border-stone-200 px-4 py-2 rounded-full text-stone-600 font-medium transition-all shadow-sm hover:shadow">
                #{item}
              </button>
            ))}
          </div>
        </main>
        
        <footer className="py-6 text-center text-sm text-stone-400">
          2026 © 개발자 Cybereun | ChemIndex Enterprise. All scientific rights reserved.
        </footer>
      </div>
    );
  }

  // "Results Dashboard" Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#faf6ee] text-[#332f2b]">
      {/* Top Header */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm gap-6">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { setActiveCompound(null); setSearchTerm(''); }}
        >
          <div className="bg-gradient-to-tr from-amber-700 to-emerald-700 p-2 rounded-lg shadow-md group-hover:scale-105 transition-transform">
            <TestTube size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-800 to-emerald-800 bg-clip-text text-transparent hidden sm:block">ChemIndex</h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-stone-400" size={18} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="w-full bg-stone-50 border border-stone-200/80 rounded-full py-2.5 pl-11 pr-24 text-sm text-stone-800 focus:outline-none focus:border-amber-700 focus:bg-white transition-all"
            placeholder="새로운 물질 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onMouseEnter={() => {
              setSearchTerm('');
              searchInputRef.current?.focus();
            }}
          />
          <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-amber-700 hover:bg-amber-800 text-white px-5 rounded-full text-xs font-semibold transition-colors">
            검색
          </button>
        </form>
      </header>

      <div className="flex flex-1 w-full overflow-hidden relative">
        {/* Left Sidebar (Comparison Deck) */}
        <aside className={`border-r border-stone-200 bg-[#fdfcf8] transition-all duration-300 flex flex-col z-40 overflow-hidden ${isLeftSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'} flex-shrink-0`}>
          <div className="p-5 flex flex-col h-full w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-600 flex items-center gap-2">
                <RefreshCw size={16} className="text-emerald-600" /> 물질 비교 데크 (최대 2개)
              </h3>
              {comparisonDeck.length > 0 && (
                <button onClick={() => setComparisonDeck([])} className="text-rose-600 text-sm hover:text-rose-700 font-semibold transition-colors px-2 py-1">
                  비우기
                </button>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto border-2 border-dashed border-stone-200 rounded-2xl p-4 bg-white/50">
              {comparisonDeck.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <Copy size={32} className="text-stone-300 mb-3" />
                  <p className="text-xs text-stone-400">상세 정보 화면에서<br/>"비교 데크 추가" 버튼을 눌러 물질을 비교해 보세요.</p>
                </div>
              ) : (
                comparisonDeck.map((c, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm relative group">
                    <button onClick={() => setComparisonDeck(prev => prev.filter(x => x.cid !== c.cid))} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-stone-100 rounded-full text-stone-400 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                      &times;
                    </button>
                    <div className="font-bold text-sm text-stone-800 truncate pr-6 mb-1">{c.title}</div>
                    <div className="text-xs text-amber-700 font-mono mb-2">{c.formula}</div>
                    <img src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${c.cid}/PNG?record_type=2d&image_size=small`} className="w-full h-24 object-contain" alt="" />
                  </div>
                ))
              )}
            </div>
            {isLeftSidebarOpen && (
              <div className="flex flex-col gap-2 mt-4">
                {comparisonDeck.length === 2 && (
                  <button 
                    onClick={() => setShowComparisonModal(true)} 
                    className="w-full py-3 bg-gradient-to-r from-amber-700 to-emerald-700 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md text-sm"
                  >
                    정밀 비교 시작
                  </button>
                )}
                <button onClick={() => setIsLeftSidebarOpen(false)} className="w-full py-2 bg-stone-100 text-stone-600 text-sm rounded-lg hover:bg-stone-200 transition-colors font-semibold">
                  사이드바 닫기
                </button>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 w-full p-4 lg:p-8 flex flex-col gap-8 overflow-y-auto h-[calc(100vh-80px)]">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-amber-700 mb-4" size={48} />
            <h3 className="text-xl font-bold text-stone-800">화학 데이터베이스 탐색 중...</h3>
            <p className="text-stone-500 mt-2">PubChem 및 ChEMBL 데이터를 동기화하고 있습니다.</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl border border-rose-200 flex items-center gap-4 w-full shadow-sm">
            <AlertCircle size={28} />
            <p className="font-semibold text-lg">{error}</p>
          </div>
        ) : activeCompound && (
          <div className="animate-fade-in flex flex-col gap-8">
            
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-stone-200/80 pb-6">
              <div>
                <h2 className="text-4xl font-extrabold text-stone-900 mb-2">{activeCompound.title}</h2>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-stone-500 text-sm font-mono bg-stone-100 px-3 py-1.5 rounded-lg inline-block border border-stone-200">
                    {activeCompound.iupac}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-sm font-bold tracking-wider flex items-baseline">
                      분자식: <span className="ml-1">{renderFormula(activeCompound.formula)}</span>
                    </span>
                    {activeCompound.exactMass && (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-sm font-bold tracking-wider">
                        Exact Mass: {activeCompound.exactMass}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <button onClick={addToDeck} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm">
                  <Plus size={16} /> 비교 데크 추가
                </button>
                <button onClick={copySMILES} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#f5f5f5] hover:bg-stone-200 text-stone-700 border border-stone-200 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm">
                  <Copy size={16} className="text-stone-500" /> SMILES 복사
                </button>
              </div>
            </div>

            {/* 2D & 3D Viewers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 2D View */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                  <Hexagon size={18} className="text-amber-700" /> 2D 화학 구조식 시각화
                </h3>
                <div className="flex-1 bg-[#fcfcf9] border border-stone-200 rounded-xl relative flex items-center justify-center overflow-hidden p-4 shadow-inner">
                  <img 
                    src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${activeCompound.cid}/PNG?record_type=2d&image_size=large`} 
                    className={`max-h-full max-w-full object-contain absolute z-10 scale-[1.3] transition-all duration-300 ${rdkitStatus.active && rdkitSvg ? 'opacity-0' : 'opacity-100'}`} 
                    alt="Static preview" 
                  />
                  {rdkitStatus.active && rdkitSvg && (
                    <div 
                      className="max-h-full max-w-full flex items-center justify-center absolute z-20 scale-[1.3] transition-opacity duration-300 w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain" 
                      dangerouslySetInnerHTML={{ __html: rdkitSvg }} 
                    />
                  )}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-2">
                  <span>Engine: <span className="font-medium text-amber-700">{rdkitStatus.active ? "RDKit.js Wasm" : "PubChem API"}</span></span>
                  <span className="truncate max-w-[300px] font-mono bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/60 text-stone-700">{activeCompound.smiles}</span>
                </div>
              </div>

              {/* 3D View */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                    <Maximize2 size={18} className="text-emerald-700" /> 3D 분자 상호작용 모델
                  </h3>
                  <div className="flex gap-1.5">
                    {['stick', 'sphere', 'line'].map(style => (
                      <button key={style} onClick={() => apply3DStyle(style)} className={`text-[10px] px-2.5 py-1 rounded-md font-bold border ${current3DStyle === style ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'}`}>
                        {style.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 bg-[#fdfcf8] rounded-xl border border-stone-200 relative overflow-hidden shadow-inner">
                  <div ref={viewerRef} className="w-full h-full"></div>
                  {!activeCompound.sdf3D && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-stone-400 text-sm">
                      <AlertCircle size={24} className="mb-2" />
                      3D 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Physicochemical & Lipinski */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                  <List size={18} className="text-amber-700" /> 화학적·물리적 세부 프로필 (MERCK 규격)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#fcfcf9] p-5 rounded-xl border border-stone-200/60 flex flex-col justify-between shadow-sm">
                    <div className="text-[13px] text-stone-500 mb-2">분자량 (Molecular Weight)</div>
                    <div className="text-xl font-extrabold text-stone-800">{activeCompound.mw.toFixed(2)} g/mol</div>
                  </div>
                  <div className="bg-[#fcfcf9] p-5 rounded-xl border border-stone-200/60 flex flex-col justify-between shadow-sm">
                    <div className="text-[13px] text-stone-500 mb-2">옥탄올-물 분배계수 (XLogP3)</div>
                    <div className="text-xl font-extrabold text-stone-800">{activeCompound.logp.toFixed(2)}</div>
                  </div>
                  <div className="bg-[#fcfcf9] p-5 rounded-xl border border-stone-200/60 flex flex-col justify-between shadow-sm">
                    <div className="text-[13px] text-stone-500 mb-2">수소결합 주개 (H-Bond Donor)</div>
                    <div className="text-xl font-extrabold text-stone-800">{activeCompound.donor} 개</div>
                  </div>
                  <div className="bg-[#fcfcf9] p-5 rounded-xl border border-stone-200/60 flex flex-col justify-between shadow-sm">
                    <div className="text-[13px] text-stone-500 mb-2">수소결합 받개 (H-Bond Acceptor)</div>
                    <div className="text-xl font-extrabold text-stone-800">{activeCompound.acceptor} 개</div>
                  </div>
                  <div className="bg-[#fcfcf9] p-5 rounded-xl border border-stone-200/60 flex flex-col justify-between shadow-sm">
                    <div className="text-[13px] text-stone-500 mb-2">정전기적 전하량 (Formal Charge)</div>
                    <div className="text-xl font-extrabold text-stone-800">{activeCompound.charge}</div>
                  </div>
                  <div className="bg-[#fcfcf9] p-5 rounded-xl border border-stone-200/60 flex flex-col justify-between shadow-sm">
                    <div className="text-[13px] text-stone-500 mb-2">PubChem CID 고유식별자</div>
                    <div className="text-xl font-extrabold text-amber-700">{activeCompound.cid}</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                    <TestTube size={18} className="text-emerald-700" /> 리핀스키 법칙 (의약품 유사성 평가)
                  </h3>
                  <div className="relative group flex items-center">
                    <Info size={16} className="text-stone-400 cursor-help hover:text-stone-600 transition-colors" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-stone-800 text-stone-100 text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                      <div className="font-bold mb-1.5 text-white text-[13px]">리핀스키의 법칙 (Lipinski's Rule of 5)</div>
                      <p className="text-stone-300 leading-relaxed mb-1">
                        경구 투여용 약물로서 체내 흡수가 잘 되기 위한 물리화학적 4가지 조건입니다.
                      </p>
                      <ul className="text-stone-300 leading-relaxed list-disc list-inside">
                        <li>분자량 ≤ 500</li>
                        <li>지용성(LogP) ≤ 5</li>
                        <li>수소결합 주개 ≤ 5개</li>
                        <li>수소결합 받개 ≤ 10개</li>
                      </ul>
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-stone-800"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#fcfcf9] border border-stone-200/80 rounded-xl px-4 py-3 flex justify-between items-center mb-4 shadow-sm">
                  <span className="text-[13px] font-medium text-stone-600">합격 기준 부합도:</span>
                  <span className={`text-sm font-bold tracking-wide ${lipinskiChart?.score >= 3 ? 'text-teal-700' : 'text-amber-600'}`}>
                    {lipinskiChart?.score} / 4 {lipinskiChart?.score === 4 ? 'PASS (합격 기준 전원 부합)' : lipinskiChart?.score === 3 ? 'PASS (조건부 부합)' : 'FAIL (기준 미달)'}
                  </span>
                </div>
                <div className="flex-1 relative flex items-center justify-center min-h-[180px]">
                  {lipinskiChart && <Radar data={lipinskiChart.data} options={lipinskiChart.options} />}
                </div>
              </div>
            </div>

            {/* Description Section */}
            {activeCompound.description && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-700" /> 화합물 설명 (Description)
                </h3>
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {activeCompound.description}
                </p>
              </div>
            )}

            {/* Third Grid: ChEMBL & Bioactivity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ChEMBL Data */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-700" /> 임상 및 약리 데이터 (ChEMBL)
                </h3>
                {activeCompound.chembl ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl">
                        <div className="text-xs text-stone-500">Max Clinical Phase</div>
                        <div className="font-bold text-stone-800">Phase {activeCompound.chembl.maxPhase || 0}</div>
                      </div>
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl">
                        <div className="text-xs text-stone-500">Molecule Type</div>
                        <div className="font-bold text-stone-800">{activeCompound.chembl.moleculeType || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500">Therapeutic Status:</span>
                      {activeCompound.chembl.therapeuticFlag ? 
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">의약품 승인 (Therapeutic)</span> : 
                        <span className="bg-stone-100 text-stone-600 border border-stone-200 px-3 py-1 rounded-full text-xs font-bold">치료 목적 아님</span>
                      }
                    </div>

                    {activeCompound.chembl.indicationClass && (
                      <div>
                        <div className="text-xs text-stone-500 mb-1">Indication Class (적응증)</div>
                        <div className="text-sm font-medium text-stone-800">{activeCompound.chembl.indicationClass}</div>
                      </div>
                    )}

                    {activeCompound.chembl.atcClassifications?.length > 0 && (
                      <div>
                        <div className="text-xs text-stone-500 mb-1.5">ATC Classifications</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCompound.chembl.atcClassifications.map(atc => (
                            <span key={atc} className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">{atc}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-stone-50 p-4 rounded-xl border border-stone-100 text-stone-400 text-sm text-center">
                    이 화합물에 대한 ChEMBL 임상 약리 데이터가 존재하지 않습니다.
                  </div>
                )}
              </div>

              {/* Bioactivity */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                  <Star size={18} className="text-emerald-700" /> 생물학적 활성 (CHEMBL BIOACTIVITY PROFILES)
                </h3>
                {activeCompound.chembl && activeCompound.chembl.bioactivities?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="text-stone-500 border-b border-stone-200">
                          <th className="pb-3 font-semibold">CHEMBL ID / ASSAY ID</th>
                          <th className="pb-3 font-semibold px-4">표적 단백질 (TARGET NAME)</th>
                          <th className="pb-3 font-semibold px-4">측정 유형 (TYPE)</th>
                          <th className="pb-3 font-semibold px-4">활성 정량치 (VALUE)</th>
                          <th className="pb-3 font-semibold">기준 규격</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {activeCompound.chembl.bioactivities.map((act, i) => (
                          <tr key={i} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3 font-medium text-amber-700">{act.targetId}</td>
                            <td className="py-3 px-4 text-stone-700">{act.targetName || 'Unknown Target'}</td>
                            <td className="py-3 px-4 text-stone-600">{act.type}</td>
                            <td className="py-3 px-4 font-bold text-teal-700">{act.value}</td>
                            <td className="py-3 text-stone-400">{act.units || 'nM'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-stone-50 p-4 rounded-xl border border-stone-100 text-stone-400 text-sm text-center">
                    생물학적 활성 프로필 데이터가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: MSDS Data */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-amber-700" /> 물질안전보건자료 (MSDS) 및 국제 물질분류기준 (GHS / 안전·독성 정보)
              </h3>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2 bg-stone-50 p-4 rounded-xl border border-stone-200 min-w-[120px]">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {activeCompound.ghs.pictograms.length > 0 ? (
                      activeCompound.ghs.pictograms.map((url, i) => <img key={i} src={url} alt="GHS" className="w-14 h-14 object-contain mix-blend-multiply" />)
                    ) : activeCompound.ghs.signalWord || activeCompound.ghs.hazardStatements.length > 0 ? (
                      <div className="flex flex-col items-center text-amber-600 py-2">
                        <AlertTriangle size={36} className="mb-2" />
                        <span className="text-xs font-bold">주의 요망</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-stone-300 py-2">
                        <ShieldAlert size={36} className="mb-2" />
                        <span className="text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                  {activeCompound.ghs.signalWord && (
                    <div className={`mt-2 font-black text-center text-sm w-full px-3 py-1 rounded ${activeCompound.ghs.signalWord.toLowerCase() === 'danger' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {activeCompound.ghs.signalWord.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full flex flex-col gap-4">
                  {/* Hazard Statements */}
                  {activeCompound.ghs.hazardStatements.length > 0 ? (
                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 max-h-80 overflow-y-auto">
                      <h4 className="text-sm font-bold text-rose-800 mb-2 flex items-center gap-2"><ShieldAlert size={16} /> 유해/위험 문구 (Hazard Statements)</h4>
                      <ul className="text-sm text-rose-700 flex flex-col gap-3 list-disc list-inside">
                        {activeCompound.ghs.hazardStatements.map((h, i) => (
                          <li key={i} className="leading-relaxed">
                            {(() => {
                              const codeMatch = h.match(/(H\d{3})/);
                              if (codeMatch) {
                                const code = codeMatch[1];
                                const ko = GHSHazardKo[code];
                                if (ko) {
                                  return <span><strong className="text-rose-900">{code}: {ko}</strong> <span className="text-rose-500 text-xs ml-1 block mt-0.5 opacity-80">{h}</span></span>;
                                }
                              }
                              return h;
                            })()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 text-center flex flex-col items-center justify-center">
                      <ShieldAlert size={28} className="text-stone-300 mb-2" />
                      <p className="text-sm text-stone-500">등록된 GHS 유해성 및 MSDS 정보가 없습니다.</p>
                    </div>
                  )}

                  {/* Precautionary Statements */}
                  {activeCompound.ghs.precautionaryStatements?.length > 0 && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 max-h-80 overflow-y-auto">
                      <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><AlertCircle size={16} /> 예방조치 문구 (Precautionary Statements)</h4>
                      <ul className="text-sm text-blue-700 flex flex-col gap-3 list-disc list-inside">
                        {activeCompound.ghs.precautionaryStatements.map((p, i) => (
                          <li key={i} className="leading-relaxed">
                            {(() => {
                              const codes = [...p.matchAll(/P\d{3}/g)].map(m => m[0]);
                              if (codes.length > 0) {
                                const koList = [...new Set(codes)].map(c => GHSPrecautionKo[c]).filter(Boolean);
                                if (koList.length > 0) {
                                   return <span><strong className="text-blue-900">{koList.join(" / ")}</strong> <span className="text-blue-500 text-xs ml-1 block mt-0.5 opacity-80">{p}</span></span>;
                                }
                              }
                              return p;
                            })()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 mb-4 border-t border-stone-200/60 pt-6 text-center text-[13px] text-stone-500">
              2026 &copy; 개발자 Cybereun | ChemIndex Enterprise. All scientific rights reserved.
            </footer>
          </div>
        )}
        </main>

        {/* Right Sidebar (History) */}
        <aside className="w-72 border-l border-stone-200 bg-[#fdfcf8] flex flex-col overflow-y-auto h-[calc(100vh-80px)] p-5 flex-shrink-0">
          <h3 className="text-sm font-bold text-stone-600 flex items-center gap-2 mb-4">
            <Clock size={16} className="text-stone-400" /> 최근 검색 기록
          </h3>
          <div className="flex flex-col gap-2">
            {searchHistory.length === 0 ? (
              <div className="text-xs text-stone-400 text-center py-4">기록이 없습니다.</div>
            ) : (
              searchHistory.map((item, i) => (
                <button key={i} onClick={() => { setSearchTerm(item); handleSearch(null, item); }} className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-4 py-3 hover:bg-stone-50 transition-colors shadow-sm group text-left">
                  <span className="text-sm font-bold text-stone-700 truncate mr-2">{item}</span>
                  <ArrowRight size={14} className="text-stone-300 group-hover:text-amber-700 transition-colors flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
          <div className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl transition-all duration-300 bg-white text-sm max-w-sm text-stone-800 ${toastMsg.type === 'success' ? 'border-emerald-200' : 'border-stone-200'}`}>
            <span className="text-stone-700 font-medium">{toastMsg.message}</span>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && comparisonDeck.length === 2 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100 bg-white shadow-sm z-10">
              <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                <BookOpen className="text-amber-700" size={20} /> 화합물 맞춤형 정밀 비교 분석
              </h2>
              <button onClick={() => setShowComparisonModal(false)} className="px-4 py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-sm border border-stone-200 transition-colors">
                대시보드로 돌아가기
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="border border-stone-100 rounded-2xl p-6 bg-white grid grid-cols-2 gap-8 shadow-sm">
                {comparisonDeck.map((c, i) => {
                  const getProp = (name) => c.props?.find(p => p.urn?.label === name)?.value?.fval ?? c.props?.find(p => p.urn?.label === name)?.value?.ival ?? '-';
                  const logP = getProp('XLogP3') !== '-' ? getProp('XLogP3') : getProp('XLogP3-AA');
                  const hbd = getProp('Hydrogen Bond Donor');
                  const hba = getProp('Hydrogen Bond Acceptor');
                  const charge = c.charge ?? 0;

                  return (
                    <div key={i} className="flex flex-col border border-stone-200 rounded-2xl p-6 shadow-sm">
                      {/* Card Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-2xl font-bold text-stone-900">{c.title}</h3>
                        <span className="text-xs font-mono bg-stone-100 text-stone-500 px-2 py-1 rounded border border-stone-200">{c.formula}</span>
                      </div>
                      
                      {/* Image */}
                      <div className="w-full aspect-[4/3] mb-8 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-center p-4">
                        <img src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${c.cid}/PNG?record_type=2d&image_size=large`} className="max-h-full max-w-full object-contain" alt={c.title} />
                      </div>

                      {/* Properties List */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between py-3 border-b border-stone-100">
                          <span className="text-stone-500 text-sm">IUPAC 명칭</span>
                          <span className="text-stone-800 text-sm font-mono italic text-right max-w-[60%] truncate" title={c.iupac}>{c.iupac}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-stone-100">
                          <span className="text-stone-500 text-sm">분자 질량 (MW)</span>
                          <span className="text-emerald-700 font-bold text-sm">{c.weight ? `${c.weight} g/mol` : '-'}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-stone-100">
                          <span className="text-stone-500 text-sm">지질 분배계수 (LogP)</span>
                          <span className="text-emerald-700 font-bold text-sm">{logP}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-stone-100">
                          <span className="text-stone-500 text-sm">H-Bond Donors</span>
                          <span className="text-emerald-700 font-bold text-sm">{hbd !== '-' ? `${hbd} 개` : '-'}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-stone-100">
                          <span className="text-stone-500 text-sm">H-Bond Acceptor</span>
                          <span className="text-emerald-700 font-bold text-sm">{hba !== '-' ? `${hba} 개` : '-'}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-stone-100">
                          <span className="text-stone-500 text-sm">정전기적 하전</span>
                          <span className="text-stone-800 font-bold text-sm">{charge}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-stone-500 text-sm">PubChem 고유 CID</span>
                          <span className="text-amber-700 font-bold text-sm">{c.cid}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
