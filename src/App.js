import React, { useState, useEffect, useRef } from "react";
import {
  Tv, Lock, ArrowLeft, LogOut, Scissors, Crown, Trash2, Clock, Users,
  Eraser, Play, Calendar, X, Zap, Code2, Circle, Check, Info,
  AlertCircle, DollarSign, Banknote, TrendingUp, Camera, UserPlus, Link, Edit2, Star, Heart, Mic, MessageCircle, RefreshCw, Trophy, Gift, Award, Volume2, Search, Mountain, ChevronDown, ChevronUp, ShieldCheck
} from "lucide-react";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAU5crOPK6roszFly_pyl0G7CcsYFvjm6U",
  authDomain: "sistema-barbearia-acb02.firebaseapp.com",
  projectId: "sistema-barbearia-acb02",
  storageBucket: "sistema-barbearia-acb02.firebasestorage.app",
  messagingSenderId: "958055433116",
  appId: "1:958055433116:web:485e9f85f8386121852002",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ================= COMPONENTES VISUAIS PADRONIZADOS =================

const GlassContainer = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`glass rounded-[2.5rem] p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

// RODAPÉ FIXO GLOBAL
const FixedFooter = () => (
  <footer className="fixed bottom-0 left-0 w-full z-[100] py-2 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md border-t border-white/10">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
      SISTEMA EM TESTE (V1.0.0)
    </span>
    <div className="flex items-center gap-1.5 text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mt-1">
      <Code2 size={12} /> Developed by ISD Systems
    </div>
  </footer>
);

const GlobalClock = ({ currentTime }) => (
  <div className="fixed top-4 right-6 z-[100] flex flex-col items-end pointer-events-none">
     <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-slate-900/80 px-3 py-1 rounded-t-lg backdrop-blur-md border border-white/10 border-b-0">{currentTime.toLocaleDateString("pt-BR")}</span>
     <span className="text-xl font-black font-mono text-white bg-slate-900/90 px-3 py-1.5 rounded-b-lg rounded-tl-lg backdrop-blur-md border border-white/10 shadow-2xl">{currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
  </div>
);

const BarberPole = ({ className = "" }) => (
  <div className={`w-8 md:w-12 flex flex-col items-center pt-4 shrink-0 ${className}`}>
     <div className="w-6 h-6 md:w-10 md:h-10 bg-[#f5deb3] rounded-full shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.3)] mb-1 z-10 relative shrink-0"></div>
     <div className="flex-1 w-4 md:w-8 rounded-b-lg border-2 border-slate-700 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #fff, #fff 15px, #dc2626 15px, #dc2626 30px, #fff 30px, #fff 45px, #2563eb 45px, #2563eb 60px)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none"></div>
     </div>
  </div>
);

// POSTE FINO PARA A TELA DA TV
const MiniBarberPole = () => (
  <div className="w-4 md:w-6 h-full flex flex-col items-center py-1 shrink-0">
     <div className="w-3 h-3 md:w-4 md:h-4 bg-[#f5deb3] rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.3)] mb-0.5 z-10 shrink-0"></div>
     <div className="flex-1 w-2 md:w-3 rounded-b-sm border border-slate-700 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #fff, #fff 8px, #dc2626 8px, #dc2626 16px, #fff 16px, #fff 24px, #2563eb 24px, #2563eb 32px)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none"></div>
     </div>
  </div>
);

const RioSilhouetteSVG = () => (
    <svg viewBox="0 0 500 150" className="w-full h-full text-slate-500/20 fill-current">
      <path d="M 10 100 Q 50 90 80 100 Q 120 110 150 80 L 180 30 Q 200 10 220 30 L 250 80 Q 280 100 320 90 L 350 110 L 400 110 L 420 100 L 440 105 L 460 100 L 480 110 L 490 120" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M 440 105 L 440 50 M 420 70 L 460 70" stroke="currentColor" strokeWidth="3" />
      <path d="M 180 30 L 280 50 M 190 35 L 290 55" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="230" y="40" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
);

const EliteHeader = ({ subtitle, className = "" }) => (
    <div className={`flex items-stretch justify-center relative shrink-0 w-full border-b border-white/10 mb-6 ${className}`} style={{ minHeight: "130px" }}>
       <BarberPole className="mx-2 md:mx-6" />
       <div className="flex-1 flex flex-col items-center justify-between relative z-10 pt-4 pb-6 max-w-4xl">
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20 scale-125 md:scale-110 mt-2">
               <RioSilhouetteSVG />
           </div>
           <div className="relative z-10 flex flex-col items-center text-center w-full mt-2">
              <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />)}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-widest text-white leading-none w-full" style={{ textShadow: "2px 2px 0px #334155, 4px 4px 0px #0f172a" }}>
                  BARBEARIA ELITE CARIOCA
              </h1>
           </div>
           <div className="relative z-10 w-full flex justify-center mt-6">
              <p className="text-yellow-500 font-bold tracking-[0.4em] md:tracking-[0.8em] text-[9px] md:text-xs uppercase neon-yellow px-4 py-1.5 bg-slate-950/70 rounded-full backdrop-blur-md border border-yellow-500/20 shadow-lg">
                  {subtitle}
              </p>
           </div>
       </div>
       <BarberPole className="mx-2 md:mx-6" />
    </div>
);

const formatNameTV = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
    const firstName = parts[0];
    const lastNameInitial = parts[parts.length - 1].charAt(0);
    return `${firstName} ${lastNameInitial}.`;
};

// ================= INÍCIO DO APP =================
const App = () => {
  const [modo, setModo] = useState("selecao");
  const [isIsolado, setIsIsolado] = useState(false); 
  const [clientesFila, setClientesFila] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [historicoAtendimentos, setHistoricoAtendimentos] = useState([]);
  const [clientesDB, setClientesDB] = useState([]);
  const [showClientesDB, setShowClientesDB] = useState(false);
  const [barbeiroLogado, setBarbeiroLogado] = useState(null);
  const [checkoutAtivo, setCheckoutAtivo] = useState(null);
  const [valorInput, setValorInput] = useState("50.00");
  const [acessoInput, setAcessoInput] = useState("");
  const [showHistorico, setShowHistorico] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [audioDestravado, setAudioDestravado] = useState(false);
  const [showFilaExclusiva, setShowFilaExclusiva] = useState(false);
  
  const [showFaturamento, setShowFaturamento] = useState(false);
  const [showDestaques, setShowDestaques] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showEquipe, setShowEquipe] = useState(false);
  const [showSeguranca, setShowSeguranca] = useState(false);
  const [showFatBarbeiro, setShowFatBarbeiro] = useState(false);
  const [showDesempBarbeiro, setShowDesempBarbeiro] = useState(false);
  const [showSazonalBarbeiro, setShowSazonalBarbeiro] = useState(false);

  const [profEditando, setProfEditando] = useState(null);
  const [novoProf, setNovoProf] = useState({ nome: "", cpf: "", telefone: "", cadeira: "" });
  const [novoCliente, setNovoCliente] = useState({ nome: "", cpf: "", whatsapp: "", servico: ["CABELO"] });
  const [loginCpf, setLoginCpf] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());
  const [senhaMasterConfig, setSenhaMasterConfig] = useState("123456");
  const [senhaAtualInput, setSenhaAtualInput] = useState("");
  const [novaSenhaInput, setNovaSenhaInput] = useState("");
  const [cofreTrofeus, setCofreTrofeus] = useState({});
  
  const [vozesDisponiveis, setVozesDisponiveis] = useState([]);
  const [vozSelecionadaUI, setVozSelecionadaUI] = useState(""); 
  const configVozRef = useRef(""); 
  const vozesRef = useRef([]);
  const audioRef = useRef(null);
  const prevClientesRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubConfig = db.collection("configuracoes_paiva").doc("geral").onSnapshot((doc) => {
      if (doc.exists) {
        if (doc.data().vozTV) { configVozRef.current = doc.data().vozTV; setVozSelecionadaUI(doc.data().vozTV); }
        if (doc.data().senhaMaster) { setSenhaMasterConfig(doc.data().senhaMaster); }
      }
    });
    const unsubCofre = db.collection("configuracoes_paiva").doc("cofre_trofeus").onSnapshot((doc) => {
      if (doc.exists) { setCofreTrofeus(doc.data()); }
    });
    return () => { unsubConfig(); unsubCofre(); };
  }, []);

  // ================= 🧠 SISTEMA DE FILA DE ÁUDIO TV EXTREMA =================
  const filaAnuncios = useRef([]);
  const isAnunciando = useRef(false);

  const processarFilaAnuncios = () => {
    if (isAnunciando.current || filaAnuncios.current.length === 0) return;
    isAnunciando.current = true;

    const { nomeClienteCompleto, nomeBarbeiro, numCadeira } = filaAnuncios.current.shift();
    if (!nomeClienteCompleto) { isAnunciando.current = false; processarFilaAnuncios(); return; }
    
    const primeiroNome = nomeClienteCompleto.split(" ")[0];

    const dispararVoz = () => {
        if (window.speechSynthesis) {
            const cadeiraTexto = numCadeira ? `na cadeira ${numCadeira}` : "";
            const texto = `${primeiroNome}. Chegou a sua vez com ${nomeBarbeiro} ${cadeiraTexto}.`;

            const falar = (vezesRestantes, callback) => {
                if (vezesRestantes <= 0) { callback(); return; }
                const msg = new SpeechSynthesisUtterance(texto);
                msg.lang = "pt-BR"; msg.rate = 0.9; msg.pitch = 1;

                if (configVozRef.current && vozesRef.current.length > 0) {
                    const vozEscolhida = vozesRef.current.find((v) => v.name === configVozRef.current);
                    if (vozEscolhida) msg.voice = vozEscolhida;
                }

                msg.onend = () => { setTimeout(() => falar(vezesRestantes - 1, callback), 800); };
                msg.onerror = () => { callback(); };
                window.speechSynthesis.speak(msg);
            };

            falar(2, () => {
                isAnunciando.current = false;
                processarFilaAnuncios();
            });
        } else {
            isAnunciando.current = false;
            processarFilaAnuncios();
        }
    };

    if (audioRef.current) {
        audioRef.current.volume = 1;
        audioRef.current.currentTime = 0;
        
        audioRef.current.onended = () => {
            audioRef.current.onended = null;
            dispararVoz();
        };

        audioRef.current.play().catch((e) => {
            console.log("Som bloqueado:", e);
            dispararVoz(); 
        });
    } else {
        dispararVoz();
    }
  };

  const falarAnuncio = (nomeClienteCompleto, nomeBarbeiro, numCadeira) => {
    filaAnuncios.current.push({ nomeClienteCompleto, nomeBarbeiro, numCadeira });
    processarFilaAnuncios();
  };
  // =========================================================================

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(isNaN(num) ? 0 : num);
  };

  const atualizarVozes = () => {
    if (window.speechSynthesis) {
      let vozes = window.speechSynthesis.getVoices();
      let vozesPt = vozes.filter((v) => v.lang.toLowerCase().includes("pt"));
      if (vozesPt.length === 0) vozesPt = vozes;
      setVozesDisponiveis(vozesPt);
      vozesRef.current = vozesPt;
    }
  };

  useEffect(() => {
    atualizarVozes();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = atualizarVozes;
    }
  }, []);

  const getFinanceStats = (barbeiroNome) => {
    const agora = new Date();
    const hojeStart = new Date(agora); hojeStart.setHours(0, 0, 0, 0);
    const semanaStart = new Date(agora); semanaStart.setDate(agora.getDate() - agora.getDay()); semanaStart.setHours(0, 0, 0, 0);
    const mesStart = new Date(agora.getFullYear(), agora.getMonth(), 1); mesStart.setHours(0, 0, 0, 0);
    const registros = barbeiroNome ? historicoAtendimentos.filter((h) => h.barbeiro === barbeiroNome) : historicoAtendimentos;
    const somar = (lista) => lista.reduce((acc, h) => acc + (Number(h.valor) || 0), 0);
    const filtrarData = (lista, inicio) => lista.filter((h) => h.dataConclusao?.toMillis() >= inicio.getTime());
    const calcularDesempenho = (lista) => {
      const count = lista.length;
      const fidelidade = lista.filter((h) => h.isFiel).length;
      const duracaoTotal = lista.reduce((acc, h) => acc + (h.duracaoMinutos || 0), 0);
      const tempoMedio = count > 0 ? Math.floor(duracaoTotal / count) : 0;
      return { count, fidelidade, tempoMedio };
    };
    return {
      hoje: somar(filtrarData(registros, hojeStart)),
      semana: somar(filtrarData(registros, semanaStart)),
      mes: somar(filtrarData(registros, mesStart)),
      desempenhoMes: calcularDesempenho(filtrarData(registros, mesStart)),
    };
  };

  const getAdvancedStats = () => {
    const agora = new Date();
    const m = agora.getMonth();
    const y = agora.getFullYear();
    const nomeMesAtual = agora.toLocaleDateString("pt-BR", { month: "long" });
    const dataMesPassado = new Date(y, m - 1, 1);
    const nomeMesPassado = dataMesPassado.toLocaleDateString("pt-BR", { month: "long" });
    const thisMonthStart = new Date(y, m, 1); thisMonthStart.setHours(0, 0, 0, 0);
    const lastMonthStart = new Date(y, m - 1, 1);

    let showTri = false; let startTri, endTri, labelTri;
    if (m === 0) { showTri = true; labelTri = "4º Trimestre (" + (y - 1) + ")"; startTri = new Date(y - 1, 9, 1); endTri = new Date(y - 1, 12, 0); }
    else if (m === 3) { showTri = true; labelTri = "1º Trimestre"; startTri = new Date(y, 0, 1); endTri = new Date(y, 3, 0); }
    else if (m === 6) { showTri = true; labelTri = "2º Trimestre"; startTri = new Date(y, 3, 1); endTri = new Date(y, 6, 0); }
    else if (m === 9) { showTri = true; labelTri = "3º Trimestre"; startTri = new Date(y, 6, 1); endTri = new Date(y, 9, 0); }

    let showSem = false; let startSem, endSem, labelSem;
    if (m === 6) { showSem = true; labelSem = "1º Semestre"; startSem = new Date(y, 0, 1); endSem = new Date(y, 6, 0); }
    else if (m === 0) { showSem = true; labelSem = "2º Semestre (" + (y - 1) + ")"; startSem = new Date(y - 1, 6, 1); endSem = new Date(y - 1, 12, 0); }

    let showAno = false; let startAno, endAno, labelAno;
    if (m === 0) { showAno = true; labelAno = "ANO " + (y - 1); startAno = new Date(y - 1, 0, 1); endAno = new Date(y - 1, 12, 0); }

    const histThisMonth = []; const histLastMonth = []; const histTri = []; const histSem = []; const histAno = [];
    historicoAtendimentos.forEach((h) => {
      if (!h.dataConclusao) return;
      const time = h.dataConclusao.toMillis();
      if (time >= thisMonthStart.getTime()) histThisMonth.push(h);
      if (time >= lastMonthStart.getTime() && time < thisMonthStart.getTime()) histLastMonth.push(h);
      if (showTri && time >= startTri.getTime() && time <= endTri.getTime()) histTri.push(h);
      if (showSem && time >= startSem.getTime() && time <= endSem.getTime()) histSem.push(h);
      if (showAno && time >= startAno.getTime() && time <= endAno.getTime()) histAno.push(h);
    });

    const groupByBarber = (arr) => {
      const map = {};
      arr.forEach((h) => {
        if (!map[h.barbeiro]) map[h.barbeiro] = { lucro: 0, count: 0, duracaoTotal: 0, fieis: 0 };
        map[h.barbeiro].lucro += Number(h.valor) || 0; map[h.barbeiro].count += 1;
        if (h.isFiel) map[h.barbeiro].fieis += 1;
        if (h.duracaoMinutos) map[h.barbeiro].duracaoTotal += h.duracaoMinutos;
      });
      return map;
    };

    const currentMonthMap = groupByBarber(histThisMonth);
    let maxLucroM = { name: "-", val: 0 }, maxCountM = { name: "-", val: 0 }, maxSpeedM = { name: "-", val: Infinity }, maxRequisitadoM = { name: "-", val: 0 };
    Object.keys(currentMonthMap).forEach((b) => {
      const d = currentMonthMap[b];
      if (d.lucro > maxLucroM.val) maxLucroM = { name: b, val: d.lucro };
      if (d.count > maxCountM.val) maxCountM = { name: b, val: d.count };
      const avgSpeed = d.duracaoTotal / d.count;
      if (d.duracaoTotal > 0 && avgSpeed < maxSpeedM.val) maxSpeedM = { name: b, val: avgSpeed };
      if (d.fieis > maxRequisitadoM.val) maxRequisitadoM = { name: b, val: d.fieis };
    });

    const monthMap = groupByBarber(histLastMonth);
    let monthWinnerName = "Nenhum no período", bestMonthScore = -1;
    Object.keys(monthMap).forEach((b) => {
      const d = monthMap[b];
      const score = d.lucro + d.count * 10 + d.fieis * 20 - (d.duracaoTotal ? d.duracaoTotal / d.count : 30);
      if (score > bestMonthScore) { bestMonthScore = score; monthWinnerName = b; }
    });

    const calcChampion = (arr) => {
        const map = groupByBarber(arr); let best = -1; let winner = "Nenhum"; let total = 0;
        Object.keys(map).forEach((b) => {
            const d = map[b]; total += d.lucro;
            const score = d.lucro + d.count * 10 + d.fieis * 20 - (d.duracaoTotal ? d.duracaoTotal / d.count : 30);
            if (score > best) { best = score; winner = b; }
        });
        return { winner, total };
    };

    const calcClient = (histArray) => {
      let top = { name: "Nenhum", count: 0, phone: "" };
      const map = {};
      histArray.forEach((h) => {
        if (!h.nome) return;
        const n = h.nome.toUpperCase();
        const p = h.whatsapp ? h.whatsapp.replace(/\D/g, "") : "NO_PHONE";
        const key = `${n}_${p}`;
        if (!map[key]) map[key] = { count: 0, phone: h.whatsapp || "", name: n };
        map[key].count += 1;
        if (map[key].count > top.count) { top.count = map[key].count; top.name = map[key].name; top.phone = map[key].phone; }
      });
      return top;
    };

    let triStats = showTri ? calcChampion(histTri) : { winner: "Nenhum", total: 0 };
    let semStats = showSem ? calcChampion(histSem) : { winner: "Nenhum", total: 0 };
    let anoStats = showAno ? calcChampion(histAno) : { winner: "Nenhum", total: 0 };
    let cTri = showTri ? calcClient(histTri) : { name: "Nenhum", count: 0, phone: "" };
    let cSem = showSem ? calcClient(histSem) : { name: "Nenhum", count: 0, phone: "" };
    let cAno = showAno ? calcClient(histAno) : { name: "Nenhum", count: 0, phone: "" };

    const mCofre = cofreTrofeus?.master || {};
    if (showTri && triStats.total === 0 && mCofre.lucroTri > 0) {
        triStats.winner = mCofre.bTriWinner; triStats.total = mCofre.lucroTri; cTri = mCofre.clientTri;
    }
    if (showSem && semStats.total === 0 && mCofre.lucroSem > 0) {
        semStats.winner = mCofre.bSemWinner; semStats.total = mCofre.lucroSem; cSem = mCofre.clientSem;
    }
    if (showAno && anoStats.total === 0 && mCofre.lucroAno > 0) {
        anoStats.winner = mCofre.bAnoWinner; anoStats.total = mCofre.lucroAno; cAno = mCofre.clientAno;
    }

    return {
      mesAtualNome: nomeMesAtual, mesPassadoNome: nomeMesPassado,
      mesLucro: maxLucroM.name !== "-" ? `${maxLucroM.name} (${formatCurrency(maxLucroM.val)})` : "-",
      mesAtend: maxCountM.name !== "-" ? `${maxCountM.name} (${maxCountM.val})` : "-",
      mesSpeed: maxSpeedM.name !== "-" ? `${maxSpeedM.name} (${Math.floor(maxSpeedM.val)}m/corte)` : "-",
      mesFiel: maxRequisitadoM.name !== "-" ? `${maxRequisitadoM.name} (${maxRequisitadoM.val} pedidos)` : "-",
      eliteWinner: monthWinnerName,
      showTri, labelTri, clientTri: cTri, lucroTri: triStats.total, bTriWinner: triStats.winner,
      showSem, labelSem, clientSem: cSem, lucroSem: semStats.total, bSemWinner: semStats.winner,
      showAno, labelAno, clientAno: cAno, lucroAno: anoStats.total, bAnoWinner: anoStats.winner,
    };
  };

  const getBarbeiroSazonalStats = (barbeiroNome) => {
    const adv = getAdvancedStats();
    const todosDoBarbeiro = historicoAtendimentos.filter(h => h.barbeiro === barbeiroNome);
    
    const calculateForPeriod = (start, end) => {
        const periodRecords = start && end ? todosDoBarbeiro.filter((h) => h.dataConclusao && h.dataConclusao.toMillis() >= start.getTime() && h.dataConclusao.toMillis() <= end.getTime()) : [];
        const lucro = periodRecords.reduce((acc, h) => acc + (Number(h.valor) || 0), 0);
        const count = periodRecords.length;
        const fieis = periodRecords.filter(h => h.isFiel).length;
        const tempoTot = periodRecords.reduce((acc, h) => acc + (h.duracaoMinutos || 0), 0);
        return { lucro, count, fieis, tempoMedio: count > 0 ? Math.floor(tempoTot / count) : 0 };
    };

    const agora = new Date(); const y = agora.getFullYear(); const m = agora.getMonth();
    
    let startTri, endTri, startSem, endSem, startAno, endAno;
    if (m === 0) { startTri = new Date(y - 1, 9, 1); endTri = new Date(y - 1, 12, 0); }
    else if (m === 3) { startTri = new Date(y, 0, 1); endTri = new Date(y, 3, 0); }
    else if (m === 6) { startTri = new Date(y, 3, 1); endTri = new Date(y, 6, 0); }
    else if (m === 9) { startTri = new Date(y, 6, 1); endTri = new Date(y, 9, 0); }

    if (m === 6) { startSem = new Date(y, 0, 1); endSem = new Date(y, 6, 0); }
    else if (m === 0) { startSem = new Date(y - 1, 6, 1); endSem = new Date(y - 1, 12, 0); }

    if (m === 0) { startAno = new Date(y - 1, 0, 1); endAno = new Date(y - 1, 12, 0); }

    let triStats = adv.showTri ? calculateForPeriod(startTri, endTri) : null;
    let semStats = adv.showSem ? calculateForPeriod(startSem, endSem) : null;
    let anoStats = adv.showAno ? calculateForPeriod(startAno, endAno) : null;

    const bCofre = cofreTrofeus?.barbeiros?.[barbeiroNome] || {};
    if (adv.showTri && triStats.count === 0 && bCofre.tri?.count > 0) triStats = bCofre.tri;
    if (adv.showSem && semStats.count === 0 && bCofre.sem?.count > 0) semStats = bCofre.sem;
    if (adv.showAno && anoStats.count === 0 && bCofre.ano?.count > 0) anoStats = bCofre.ano;

    return { tri: triStats, sem: semStats, ano: anoStats, showTri: adv.showTri, labelTri: adv.labelTri, showSem: adv.showSem, labelSem: adv.labelSem, showAno: adv.showAno, labelAno: adv.labelAno };
  };

  useEffect(() => {
    audioRef.current = new Audio("https://cdn.freesound.org/previews/322/322929_5260872-lq.mp3");
    const unsubFila = db.collection("fila_paiva").orderBy("chegada", "asc").onSnapshot((snap) => {
        const novos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (modo === "painel") {
          const chamado = novos.find((c) => {
            const anterior = prevClientesRef.current.find((p) => p.id === c.id);
            return (c.status === "atendendo" && (!anterior || anterior.status === "esperando"));
          });
          if (chamado) {
              const prof = profissionais.find(p => p.nome === chamado.barbeiroPref);
              falarAnuncio(chamado.nome, chamado.barbeiroPref, prof?.cadeira);
          }
        }
        prevClientesRef.current = novos;
        setClientesFila(novos);
      });
    const unsubProf = db.collection("profissionais").onSnapshot((snap) => setProfissionais(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubHist = db.collection("historico_paiva").orderBy("dataConclusao", "desc").limit(3000).onSnapshot((snap) => setHistoricoAtendimentos(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { unsubFila(); unsubProf(); unsubHist(); };
  }, [modo, profissionais, audioDestravado]); 

  // ================= 🛡️ LÓGICA DO LINK BLINDADO =================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b_id = params.get("b_id");

    if (b_id) {
      if (profissionais.length > 0) {
        const prof = profissionais.find((p) => p.id === b_id);
        if (prof) {
          if (!barbeiroLogado || barbeiroLogado.id !== prof.id) {
            setBarbeiroLogado(prof);
            setModo("admin_barbeiro");
            setIsIsolado(true);
            addToast(`Bem-vindo, ${prof.nome}!`, "sucesso");
          }
        } else {
          setBarbeiroLogado(null);
          setModo("bloqueado");
        }
      }
    } else if (isIsolado && barbeiroLogado) {
      const aindaExiste = profissionais.find((p) => p.id === barbeiroLogado.id);
      if (!aindaExiste) {
        setBarbeiroLogado(null);
        setModo("bloqueado");
      }
    }
  }, [profissionais, barbeiroLogado, isIsolado]);

  useEffect(() => {
    if (modo === "gestao_master") {
      const unsubClientes = db.collection("clientes_paiva").orderBy("nome", "asc").onSnapshot((snap) => setClientesDB(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
      return () => unsubClientes();
    }
  }, [modo]);

  const handleLogin = () => {
    if (acessoInput === senhaMasterConfig) {
      setModo("gestao_master");
      setAcessoInput("");
    } else {
      const prof = profissionais.find((p) => p.matricula === acessoInput);
      if (prof) {
        setBarbeiroLogado(prof);
        setModo("admin_barbeiro");
        setIsIsolado(false);
        setAcessoInput("");
      } else addToast("Acesso Negado", "erro");
    }
  };

  const handleBuscaCpf = async () => {
    const limpo = loginCpf.replace(/\D/g, "");
    if (limpo.length !== 11 && limpo !== "0") return addToast("CPF deve ter 11 números", "erro");
    if (limpo === "0") { addToast("Modo Rápido não localiza cadastro.", "erro"); return; }
    const snap = await db.collection("clientes_paiva").doc(limpo).get();
    if (snap.exists) {
      const d = snap.data();
      setNovoCliente({ nome: d.nome, cpf: d.cpf, whatsapp: d.whatsapp || "", servico: ["CABELO"], });
      setModo("cliente_servicos");
      addToast(`Bem-vindo de volta, ${d.nome.split(" ")[0]}!`, "sucesso");
    } else {
      addToast("CPF não encontrado. Faça seu cadastro!", "erro");
      setNovoCliente({ ...novoCliente, cpf: limpo });
      setModo("cliente_registro_novo");
    }
  };

  const prosseguirServicos = async () => {
    const n = novoCliente.nome.trim();
    if (!n.includes(" ")) return addToast("Digite Nome e Sobrenome!", "erro");
    const isBypass = novoCliente.cpf === "0" && novoCliente.whatsapp === "0";
    if (!isBypass) {
      if (novoCliente.cpf.length !== 11) return addToast("CPF Incompleto (Precisa de 11 dígitos)", "erro");
      if (novoCliente.whatsapp.length < 10) return addToast("WhatsApp Inválido (Use DDD)", "erro");
      const snap = await db.collection("clientes_paiva").doc(novoCliente.cpf).get();
      if (snap.exists) { return addToast("Este CPF já está cadastrado! Use a opção 'JÁ TENHO CADASTRO'.", "erro"); }
      await db.collection("clientes_paiva").doc(novoCliente.cpf).set({ nome: n, cpf: novoCliente.cpf, whatsapp: novoCliente.whatsapp });
    } else {
      addToast("Modo Rápido Ativado (Não será salvo no cofre).", "info");
    }
    setModo("cliente_servicos");
  };

  const enviarParaFila = async (barbeiro) => {
    const servicosFormatados = novoCliente.servico.join(" + ");
    await db.collection("fila_paiva").add({
      nome: novoCliente.nome, cpf: novoCliente.cpf, whatsapp: novoCliente.whatsapp, servico: servicosFormatados, barbeiroPref: barbeiro, chegada: firebase.firestore.Timestamp.now(), status: "esperando", escolhaDireta: barbeiro !== "Sem Preferência",
    });
    setModo("selecao");
    setNovoCliente({ nome: "", cpf: "", whatsapp: "", servico: ["CABELO"] });
    setLoginCpf("");
  };

  const limparFilaCompleta = async () => {
    const pin = window.prompt("PARA ZERAR A FILA, DIGITE A SENHA MASTER:");
    if (pin !== senhaMasterConfig) return addToast("Senha Incorreta.", "erro");
    const snap = await db.collection("fila_paiva").get();
    await Promise.all(snap.docs.map((d) => d.ref.delete()));
    addToast("Fila limpa.", "info");
  };

  const limparHistoricoCompleto = async () => {
    const pin = window.prompt("PERIGO: PARA APAGAR O HISTÓRICO E FECHAR O CAIXA, DIGITE A SENHA MASTER:");
    if (pin !== senhaMasterConfig) return addToast("Senha Incorreta.", "erro");
    
    try {
      const advStats = getAdvancedStats();
      const barbeirosFechamento = {};
      profissionais.forEach(p => { barbeirosFechamento[p.nome] = getBarbeiroSazonalStats(p.nome); });

      const novoCofreData = {
         dataFechamento: firebase.firestore.Timestamp.now(),
         master: {
            bTriWinner: advStats.bTriWinner, clientTri: advStats.clientTri, lucroTri: advStats.lucroTri,
            bSemWinner: advStats.bSemWinner, clientSem: advStats.clientSem, lucroSem: advStats.lucroSem,
            bAnoWinner: advStats.bAnoWinner, clientAno: advStats.clientAno, lucroAno: advStats.lucroAno
         },
         barbeiros: barbeirosFechamento
      };

      const batch = db.batch();
      batch.set(db.collection("configuracoes_paiva").doc("cofre_trofeus"), novoCofreData);

      const snap = await db.collection("historico_paiva").get();
      snap.docs.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();
      addToast("Histórico zerado e Cofre de Troféus guardado com segurança!", "sucesso");
      setShowHistorico(false);
    } catch (e) {
      addToast("Erro crítico ao salvar o Cofre de Troféus.", "erro");
    }
  };

  const ServiceBadge = ({ s }) => (
    <span className="px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest inline-block mt-1">
      {s}
    </span>
  );

  // ================= TELAS =================

  if (modo === "bloqueado") {
    return (
      <div className="h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center pb-12">
        <GlobalClock currentTime={currentTime} />
        <AlertCircle size={80} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="text-4xl font-black uppercase tracking-widest text-red-500 mb-2">ACESSO REVOGADO</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Este link não é mais válido no sistema.</p>
        <FixedFooter />
      </div>
    );
  }

  if (modo === "selecao_cadastro") {
    return (
      <div className="h-screen overflow-hidden bg-slate-950 flex flex-col text-white pb-12 relative">
        <GlobalClock currentTime={currentTime} />
        <div className="p-4 md:p-6 pb-0 absolute top-0 left-0 z-50">
          <button onClick={() => setModo("selecao")} className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2 hover:text-white transition-all"><ArrowLeft size={14} /> VOLTAR</button>
        </div>
        <EliteHeader subtitle="CADASTRO" />
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
          <h2 className="text-2xl md:text-3xl font-black mb-8 uppercase italic neon-yellow text-center">ESCOLHA UMA OPÇÃO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <GlassContainer onClick={() => setModo("cliente_login")} className="flex flex-col items-center gap-4 cursor-pointer border-white/10 hover:border-yellow-500 transition-all hover:bg-slate-900/80 text-center">
              <Search size={40} className="text-yellow-500" />
              <span className="font-black text-xl uppercase">JÁ TENHO CADASTRO</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Acesso rápido via CPF</span>
            </GlassContainer>
            <GlassContainer onClick={() => setModo("cliente_registro_novo")} className="flex flex-col items-center gap-4 cursor-pointer border-white/10 hover:border-blue-500 transition-all hover:bg-slate-900/80 text-center">
              <UserPlus size={40} className="text-blue-500" />
              <span className="font-black text-xl uppercase">NOVO CADASTRO</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Primeira vez no salão</span>
            </GlassContainer>
          </div>
        </div>
        <FixedFooter />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  if (modo === "cliente_login") {
    return (
      <div className="h-screen overflow-hidden bg-slate-950 flex flex-col text-white pb-12 relative">
        <GlobalClock currentTime={currentTime} />
        <div className="p-4 md:p-6 pb-0 absolute top-0 left-0 z-50">
          <button onClick={() => setModo("selecao_cadastro")} className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2 hover:text-white transition-all"><ArrowLeft size={14} /> VOLTAR</button>
        </div>
        <EliteHeader subtitle="CADASTRO" />
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <GlassContainer className="w-full max-w-md space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-yellow-500">BEM-VINDO DE VOLTA</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">DIGITE SEU CPF PARA CONTINUAR</p>
            </div>
            <input type="tel" placeholder="APENAS NÚMEROS (11 DÍGITOS)" className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 text-center text-white font-black text-xl outline-none focus:border-yellow-500 tracking-widest" value={loginCpf} onChange={(e) => setLoginCpf(e.target.value.replace(/\D/g, "").slice(0, 11))} />
            <button disabled={loginCpf.length !== 11 && loginCpf !== "0"} onClick={handleBuscaCpf} className={`w-full p-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all ${loginCpf.length === 11 || loginCpf === "0" ? "bg-yellow-600 text-white shadow-xl shadow-yellow-900/20" : "bg-slate-800 text-slate-600"}`}>ENTRAR</button>
          </GlassContainer>
        </div>
        <FixedFooter />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  if (modo === "cliente_registro_novo") {
    return (
      <div className="h-screen overflow-hidden bg-slate-950 flex flex-col text-white pb-12 relative">
        <GlobalClock currentTime={currentTime} />
        <div className="p-4 md:p-6 pb-0 absolute top-0 left-0 z-50">
          <button onClick={() => setModo("selecao_cadastro")} className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2 hover:text-white transition-all"><ArrowLeft size={14} /> VOLTAR</button>
        </div>
        <EliteHeader subtitle="CADASTRO" />
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <GlassContainer className="w-full max-w-lg space-y-4">
            <div className="text-center space-y-1 mb-2">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-blue-500">NOVO CLIENTE</h2>
              <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">PREENCHA SEUS DADOS OU DIGITE "0" PARA IGNORAR</p>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="NOME E SOBRENOME (Obrigatório)" className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-blue-500 uppercase" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value.toUpperCase() })} />
              <input type="tel" placeholder="CPF (Apenas números)" className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-blue-500" value={novoCliente.cpf} onChange={(e) => setNovoCliente({ ...novoCliente, cpf: e.target.value.replace(/\D/g, "").slice(0, 11) })} />
              <input type="tel" placeholder="WHATSAPP COM DDD (Ex: 21999998888)" className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-blue-500" value={novoCliente.whatsapp} onChange={(e) => setNovoCliente({ ...novoCliente, whatsapp: e.target.value.replace(/\D/g, "").slice(0, 11) })} />
            </div>
            <button disabled={!novoCliente.nome.trim() || !novoCliente.cpf || !novoCliente.whatsapp} onClick={prosseguirServicos} className={`w-full p-5 mt-2 rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all ${novoCliente.nome.trim() && novoCliente.cpf && novoCliente.whatsapp ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20" : "bg-slate-800 text-slate-600"}`}>PROSSEGUIR</button>
          </GlassContainer>
        </div>
        <FixedFooter />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  if (modo === "cliente_servicos") {
    return (
      <div className="h-screen overflow-hidden bg-slate-950 flex flex-col text-white pb-12 relative">
        <GlobalClock currentTime={currentTime} />
        <EliteHeader subtitle="CADASTRO" />
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <GlassContainer className="w-full max-w-lg space-y-4">
            <div className="text-center space-y-1 mb-2">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter neon-yellow">O QUE VAMOS FAZER?</h2>
              <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest neon-blue">{novoCliente.nome}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["CABELO", "BARBA", "SOBRANCELHA", "OUTROS"].map((s) => (
                <button key={s} onClick={() => { let servs = [...novoCliente.servico]; if (servs.includes(s)) servs = servs.filter((x) => x !== s); else servs.push(s); if (servs.length === 0) servs = ["CABELO"]; setNovoCliente({ ...novoCliente, servico: servs }); }} className={`py-4 md:py-6 rounded-2xl font-black text-xs md:text-sm border-2 transition-all ${novoCliente.servico.includes(s) ? "bg-yellow-500 border-yellow-400 text-slate-950 shadow-lg shadow-yellow-900/20" : "bg-slate-900 border-white/5 text-slate-400"}`}>{s}</button>
              ))}
            </div>
            <button onClick={() => setModo("barbeiro_choice")} className="w-full p-5 mt-4 rounded-3xl font-black uppercase text-xs md:text-sm tracking-[0.3em] transition-all bg-yellow-600 text-white hover:bg-yellow-500">ESCOLHER PROFISSIONAL</button>
          </GlassContainer>
        </div>
        <FixedFooter />
      </div>
    );
  }

  if (modo === "barbeiro_choice") {
    const disponiveis = profissionais.filter((p) => p.status === "disponivel" || p.status === "volto_logo").sort((a, b) => Number(a.cadeira) - Number(b.cadeira));
    return (
      <div className="h-screen overflow-hidden bg-slate-950 flex flex-col text-white text-center pb-12 relative">
        <GlobalClock currentTime={currentTime} />
        <EliteHeader subtitle="CADASTRO" />
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
          <h2 className="text-2xl md:text-4xl font-black mb-6 uppercase italic neon-yellow shrink-0">QUEM VAI TE ATENDER?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl overflow-y-auto custom-scrollbar pr-2 pb-4">
            <GlassContainer onClick={() => enviarParaFila("Sem Preferência")} className="bg-yellow-600/10 border-yellow-500/20 flex flex-col items-center gap-2 cursor-pointer hover:bg-yellow-600 transition-all !p-4">
              <Zap size={24} className="text-yellow-500" />
              <span className="font-black text-lg uppercase">SEM PREFERÊNCIA</span>
            </GlassContainer>
            {disponiveis.map((p) => (
              <GlassContainer key={p.id} onClick={() => enviarParaFila(p.nome)} className="flex flex-col items-center gap-2 cursor-pointer border-white/10 hover:border-yellow-500 transition-all !p-4">
                <Scissors size={20} className="text-yellow-500" />
                <span className="font-black text-lg uppercase">{p.nome}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">CADEIRA {p.cadeira}</span>
                <div className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${p.status === "disponivel" ? "text-emerald-500" : "text-orange-500"}`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${p.status === "disponivel" ? "bg-emerald-500" : "bg-orange-500"}`} /> {p.status === "disponivel" ? "DISPONÍVEL" : "VOLTO LOGO"}
                </div>
              </GlassContainer>
            ))}
          </div>
          <button onClick={() => setModo("cliente_servicos")} className="mt-4 text-slate-500 font-black uppercase text-[10px] md:text-xs hover:text-white transition-all shrink-0">VOLTAR PARA SERVIÇOS</button>
        </div>
        <FixedFooter />
      </div>
    );
  }

  if (modo === "selecao") {
    return (
      <div className="h-screen overflow-hidden bg-slate-950 flex flex-col text-white relative pb-12">
        <GlobalClock currentTime={currentTime} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
        <EliteHeader subtitle="BEM-VINDO(A)" />
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
          <button onClick={() => setModo("selecao_cadastro")} className="relative glass h-56 w-56 md:h-[300px] md:w-[300px] rounded-[4rem] flex flex-col items-center justify-center gap-4 border-2 border-yellow-500/30 shadow-2xl z-10 hover:scale-105 transition-all mb-8 shrink-0">
            <Scissors size={64} className="text-yellow-500" />
            <div className="space-y-1 mt-2">
              <span className="block font-black text-2xl md:text-3xl uppercase tracking-tighter text-center leading-tight">
                TOQUE AQUI<br/>PARA INICIAR
              </span>
            </div>
          </button>
          
          <div className="relative z-10 w-full flex justify-between items-end max-w-5xl mx-auto shrink-0 px-4">
            <button onClick={() => setModo("painel")} className="opacity-100 hover:scale-105 p-4 md:p-5 bg-blue-900/20 border border-blue-500/30 rounded-3xl flex flex-col items-center gap-2 shadow-lg shadow-blue-900/20 transition-all group">
              <Tv size={24} className="text-blue-400 group-hover:text-blue-300" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-blue-300">PAINEL TV</span>
            </button>
            <div className="glass-slim px-4 md:px-6 py-3 md:py-4 rounded-[2rem] border border-white/5 flex items-center gap-3 md:gap-4 bg-slate-900/40">
              <Lock size={14} className="text-slate-600 hidden sm:block" />
              <input type="password" placeholder="PIN" className="w-24 md:w-32 bg-transparent text-center font-black text-[10px] md:text-xs outline-none text-white focus:text-yellow-500 tracking-widest" value={acessoInput} onChange={(e) => setAcessoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
              <button onClick={handleLogin} className="bg-blue-600 px-4 md:px-6 py-2 rounded-xl font-bold uppercase text-[10px] md:text-xs text-white">OK</button>
            </div>
          </div>
        </div>
        <FixedFooter />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  if (modo === "painel") {
    const sortedProfs = [...profissionais].sort((a, b) => Number(a.cadeira) - Number(b.cadeira));
    const profsAtivos = sortedProfs.filter((p) => p.status !== "ausente");
    const filaGeralEspera = clientesFila.filter((c) => c.barbeiroPref === "Sem Preferência" && c.status === "esperando");
    const filaGeralCount = filaGeralEspera.length;
    const totalGeralEspera = filaGeralEspera.length + clientesFila.filter((c) => c.barbeiroPref !== "Sem Preferência" && c.status === "esperando").length;
    const maxDisplayItems = profsAtivos.length <= 2 ? 8 : profsAtivos.length <= 4 ? 6 : 5;
    const filaGeralDisplay = filaGeralEspera.slice(0, maxDisplayItems);
    const totalCards = profsAtivos.length + 1;
    const numCols = totalCards > 5 ? Math.ceil(totalCards / 2) : totalCards;
    const numRows = totalCards > 5 ? 2 : 1;

    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-950 text-white flex flex-col relative pb-12">
        {!audioDestravado && (
          <div onClick={() => {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(" ");
                msg.volume = 0;
                window.speechSynthesis.speak(msg);
              }
              if (audioRef.current) {
                 audioRef.current.volume = 0;
                 audioRef.current.play().then(() => {
                     audioRef.current.pause();
                     audioRef.current.currentTime = 0;
                     audioRef.current.volume = 1;
                 }).catch(() => {});
              }
              setAudioDestravado(true);
            }} className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center cursor-pointer">
            <div className="bg-blue-600 p-12 rounded-[3rem] shadow-[0_0_50px_rgba(37,99,235,0.5)] animate-bounce flex flex-col items-center gap-6 border-4 border-white/20">
              <Volume2 size={72} className="text-white" />
              <span className="text-4xl font-black uppercase tracking-widest text-white text-center">CLIQUE AQUI PARA ATIVAR A TV</span>
              <span className="text-sm font-bold text-blue-200 uppercase tracking-widest text-center">NECESSÁRIO PARA LIBERAR O SOM DA CAMPAINHA</span>
            </div>
          </div>
        )}

        <header className="relative w-full flex items-center justify-between px-2 py-1 bg-slate-950 shadow-md border-b border-white/10 h-14 shrink-0 z-20">
          <div className="h-full flex items-center gap-2">
             <button onClick={() => setModo("selecao")} className="p-2 text-slate-500 hover:text-white transition-all"><ArrowLeft size={20} /></button>
             <MiniBarberPole />
          </div>
          
          <div className="flex-1 flex items-center justify-center space-x-2 md:space-x-4 overflow-hidden">
             <div className="flex gap-1 hidden sm:flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />)}
             </div>
             <h1 className="text-lg md:text-xl font-black uppercase tracking-widest text-white truncate text-shadow-sm">
                BARBEARIA ELITE CARIOCA
             </h1>
             <div className="h-6 w-px bg-white/20 mx-2 hidden md:block"></div>
             <div className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-lg flex items-center space-x-2 shrink-0">
                <span className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">Aguardando:</span>
                <span className="text-lg font-black text-white leading-none">{totalGeralEspera}</span>
             </div>
          </div>
          
          <div className="h-full flex items-center gap-3 pr-2">
             <div className="flex flex-col items-end justify-center hidden sm:flex">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{currentTime.toLocaleDateString("pt-BR")}</span>
                <span className="text-sm font-black text-white tracking-widest font-mono flex items-center gap-1"><Clock size={12} className="text-blue-400"/> {currentTime.toLocaleTimeString("pt-BR", {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
             </div>
             <MiniBarberPole />
          </div>
        </header>

        <div className="flex-1 flex p-4 pb-4 min-w-0 overflow-hidden relative z-10 w-full">
          <div className="grid gap-4 flex-1 w-full h-full min-h-0" style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` }}>
            <div className="glass rounded-[2rem] p-4 h-full flex flex-col border border-blue-500/20 bg-slate-900/30 overflow-hidden">
              <h3 className="text-center font-black text-blue-400 uppercase text-xs md:text-sm tracking-widest mb-3 border-b border-white/5 pb-2 shrink-0">
                FILA GERAL - <span className="text-white text-lg ml-1">{filaGeralCount}</span>
              </h3>
              <div className="flex flex-col gap-2 flex-1 justify-start overflow-hidden">
                {filaGeralCount === 0 && (<p className="text-center text-slate-600 font-bold uppercase mt-4 text-[10px]">Fila Vazia</p>)}
                {filaGeralDisplay.map((c) => (
                  <div key={c.id} className="p-3 md:p-4 bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-white/5 shrink-0 relative pt-6 md:pt-8">
                    <span className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono font-bold bg-slate-950/50 px-2 py-1 rounded">{c.chegada?.toDate().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="text-xl md:text-2xl font-black block uppercase leading-none mb-1 truncate w-full text-center px-2">{formatNameTV(c.nome)}</span>
                    <ServiceBadge s={c.servico} />
                  </div>
                ))}
              </div>
            </div>
            
            {profsAtivos.map((p) => {
              const esperandoProf = clientesFila.filter((c) => c.barbeiroPref === p.nome && c.status === "esperando");
              const countWaiting = esperandoProf.length;
              const emAtendimentoProf = clientesFila.find((c) => c.barbeiroPref === p.nome && c.status === "atendendo");
              let displayList = [];
              if (emAtendimentoProf) displayList.push({ ...emAtendimentoProf, isAtendimento: true });
              const remainingSlots = maxDisplayItems - displayList.length;
              displayList = [...displayList, ...esperandoProf.slice(0, remainingSlots)];
              
              return (
                <div key={p.id} className="glass rounded-[2rem] p-4 flex flex-col border border-yellow-500/20 bg-slate-900/30 overflow-hidden">
                  <h3 className="text-center font-black text-yellow-400 uppercase text-xs md:text-sm tracking-widest mb-3 border-b border-white/5 pb-2 shrink-0">
                    {p.nome} <span className="text-slate-500 mx-1">|</span> CD {p.cadeira} - <span className="text-white text-lg ml-1">{countWaiting}</span>
                    <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${p.status === "disponivel" ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-orange-500 shadow-[0_0_10px_#f97316]"}`} />
                  </h3>
                  <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                    {displayList.length === 0 && (<p className="text-center text-slate-600 font-bold uppercase mt-4 text-[10px]">Livre</p>)}
                    {displayList.map((c) => (
                      <div key={c.id} className={`p-3 md:p-4 rounded-xl border flex flex-col items-center justify-center transition-all relative ${c.isAtendimento ? "bg-emerald-600/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-1" : "bg-slate-800/50 border-white/5 shrink-0 pt-6 md:pt-8"}`}>
                        {c.isAtendimento ? (
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2 flex items-center justify-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> EM ATENDIMENTO</span>
                        ) : (
                          <span className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono font-bold bg-slate-950/50 px-2 py-1 rounded">{c.chegada?.toDate().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                        )}
                        <span className={`font-black block uppercase leading-none mb-1 truncate w-full text-center px-2 ${c.isAtendimento ? "text-3xl lg:text-4xl text-white" : "text-xl md:text-2xl text-slate-300"}`}>{formatNameTV(c.nome)}</span>
                        <ServiceBadge s={c.servico} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <FixedFooter />
      </div>
    );
  }

  if (modo === "admin_barbeiro" && barbeiroLogado) {
    const dAtual = profissionais.find((p) => p.id === barbeiroLogado.id) || barbeiroLogado;
    const emAtend = clientesFila.filter((c) => c.barbeiroPref === barbeiroLogado.nome && c.status === "atendendo");
    const statsB = getFinanceStats(barbeiroLogado.nome);
    const statSazonal = getBarbeiroSazonalStats(barbeiroLogado.nome);
    const prox = clientesFila.sort((a, b) => a.chegada - b.chegada).find((c) => c.status === "esperando" && (c.barbeiroPref === "Sem Preferência" || c.barbeiroPref === barbeiroLogado.nome));
    const minhaFilaExclusiva = clientesFila.filter((c) => c.barbeiroPref === barbeiroLogado.nome && c.status === "esperando").sort((a, b) => a.chegada - b.chegada);
    const totalFilaGeral = clientesFila.filter((c) => c.barbeiroPref === "Sem Preferência" && c.status === "esperando").length;

    const handleStatusChange = async (st) => {
      if (st === "ausente") {
        const filaMinha = clientesFila.filter((c) => c.barbeiroPref === barbeiroLogado.nome && c.status === "esperando");
        if (filaMinha.length > 0) {
          if (!window.confirm("Você tem cliente na fila, tem certeza que quer sair?")) return;
          const batch = db.batch();
          batch.update(db.collection("profissionais").doc(barbeiroLogado.id), { status: st });
          filaMinha.forEach((c) => { batch.update(db.collection("fila_paiva").doc(c.id), { barbeiroPref: "Sem Preferência" }); });
          await batch.commit(); return;
        }
      }
      await db.collection("profissionais").doc(barbeiroLogado.id).update({ status: st });
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-white pb-16">
        <GlobalClock currentTime={currentTime} />
        <div className="relative z-50 p-6 pb-0 absolute top-0 left-0">
          {!isIsolado && (
            <button onClick={() => { setBarbeiroLogado(null); setModo("selecao"); }} className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2 hover:text-white transition-all"><LogOut size={14} /> SAIR</button>
          )}
        </div>
        <EliteHeader subtitle={`MEU PAINEL - ${barbeiroLogado.nome.toUpperCase()}`} className="pt-6" />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col items-center pb-24">
          <div className="w-full max-w-5xl space-y-8">
            <div className="flex justify-center items-center gap-6 border-b border-white/5 pb-6">
              <div className="w-20 h-20 bg-yellow-600 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-[8px] font-black text-black/50 uppercase tracking-widest absolute top-2">Cadeira</span>
                <span className="text-4xl font-black text-black">{dAtual.cadeira || "-"}</span>
              </div>
            </div>

            <GlassContainer className="w-full">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowFilaExclusiva(!showFilaExclusiva)}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  <h3 className="font-black uppercase tracking-tighter text-xl flex items-center gap-3 select-none text-yellow-500"><Users size={24} /> Meus Clientes ({minhaFilaExclusiva.length})</h3>
                  <span className="hidden md:inline text-slate-500">|</span>
                  <span className="font-bold text-slate-400 text-sm uppercase tracking-widest">Fila Geral: {totalFilaGeral} aguardando</span>
                </div>
                {showFilaExclusiva ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showFilaExclusiva && (
                <div className="pt-6 border-t border-white/5 mt-4 space-y-3">
                  {minhaFilaExclusiva.length === 0 ? (
                    <p className="text-slate-500 text-xs font-bold uppercase text-center py-4">Nenhum cliente exclusivo aguardando no momento.</p>
                  ) : (
                    minhaFilaExclusiva.map((c) => (
                      <div key={c.id} className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex justify-between items-center hover:border-yellow-500/30 transition-all">
                        <div>
                          <span className="font-black text-lg block uppercase text-white">{c.nome}</span>
                          <ServiceBadge s={c.servico} />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1 rounded-lg">{c.chegada?.toDate().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </GlassContainer>

            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-8">
              {["disponivel", "volto_logo", "ausente"].map((st) => (
                <button key={st} onClick={() => handleStatusChange(st)} className={`p-6 rounded-[2rem] font-black uppercase text-[10px] md:text-xs border-2 transition-all ${dAtual.status === st ? "bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-900/20 text-white" : "bg-slate-900 border-white/5 opacity-50 hover:opacity-100 text-slate-400"}`}>
                  {st === "volto_logo" ? "VOLTO LOGO" : st.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-12">
              {emAtend.length > 0 ? (
                <div className="p-10 bg-slate-900 rounded-[3rem] border-2 border-emerald-500/30 text-center space-y-6">
                  <h3 className="font-black text-xs text-emerald-500 uppercase tracking-widest flex justify-center items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> EM ATENDIMENTO</h3>
                  <h4 className="text-5xl md:text-6xl font-black uppercase text-white leading-none truncate">{emAtend[0].nome}</h4>
                  <div className="py-2"><span className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm">SERVIÇO: {emAtend[0].servico}</span></div>
                  <button onClick={() => setCheckoutAtivo(emAtend[0])} className="w-full bg-emerald-600 p-8 rounded-3xl font-black text-xl uppercase hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 mt-4 text-white">FINALIZAR & RECEBER</button>
                </div>
              ) : (
                <div className="p-10 bg-slate-900/50 rounded-[3rem] border border-white/5 text-center space-y-6">
                  <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest flex items-center justify-center gap-3"><Users size={16} /> PRÓXIMO DA FILA</h3>
                  {prox ? (
                    <div className="space-y-6">
                      <h4 className="text-4xl md:text-5xl font-black uppercase text-white truncate">{prox.nome}</h4>
                      <div className="py-1"><ServiceBadge s={prox.servico} /></div>
                      <button onClick={async () => {
                          if (dAtual.status !== "disponivel") return addToast("Mude seu status para DISPONÍVEL primeiro.", "erro");
                          await db.collection("fila_paiva").doc(prox.id).update({ status: "atendendo", barbeiroPref: barbeiroLogado.nome, inicioAtendimento: firebase.firestore.Timestamp.now() });
                          addToast("Cliente Chamado!", "sucesso");
                        }} className="w-full bg-yellow-600 p-8 rounded-3xl font-black text-xl uppercase text-black hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-900/10">CHAMAR PRÓXIMO</button>
                    </div>
                  ) : (<p className="text-slate-500 font-bold uppercase text-sm py-10">NÃO HÁ CLIENTES NA FILA GERAL OU PARA VOCÊ</p>)}
                </div>
              )}
            </div>

            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowFatBarbeiro(!showFatBarbeiro)}>
                <h3 className="font-black uppercase tracking-tighter text-lg flex items-center gap-3 select-none text-emerald-500"><Banknote size={20} /> Faturamento (Dia a Dia)</h3>
                {showFatBarbeiro ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showFatBarbeiro && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-4 border-t border-white/5">
                  <div className="p-6 bg-slate-950/50 rounded-3xl border border-emerald-500/20 overflow-hidden"><span className="block text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Hoje</span><span className="text-2xl font-black block w-full truncate" title={formatCurrency(statsB.hoje)}>{formatCurrency(statsB.hoje)}</span></div>
                  <div className="p-6 bg-slate-950/50 rounded-3xl border border-blue-500/20 overflow-hidden"><span className="block text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1">Semana</span><span className="text-2xl font-black block w-full truncate" title={formatCurrency(statsB.semana)}>{formatCurrency(statsB.semana)}</span></div>
                  <div className="p-6 bg-slate-950/50 rounded-3xl border border-yellow-500/20 overflow-hidden"><span className="block text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1">Mês Atual</span><span className="text-2xl font-black block w-full truncate" title={formatCurrency(statsB.mes)}>{formatCurrency(statsB.mes)}</span></div>
                </div>
              )}
            </GlassContainer>

            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowDesempBarbeiro(!showDesempBarbeiro)}>
                <h3 className="font-black uppercase tracking-tighter text-lg flex items-center gap-3 select-none text-blue-500"><TrendingUp size={20} /> Desempenho (Mês Atual)</h3>
                {showDesempBarbeiro ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showDesempBarbeiro && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-4 border-t border-white/5">
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center justify-between"><div><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atendimentos</span><span className="text-xl font-black">{statsB.desempenhoMes.count}</span></div><Users size={20} className="text-slate-600" /></div>
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center justify-between"><div><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tempo Médio</span><span className="text-xl font-black">{statsB.desempenhoMes.tempoMedio} min</span></div><Clock size={20} className="text-slate-600" /></div>
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center justify-between"><div><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fidelidade</span><span className="text-xl font-black">{statsB.desempenhoMes.fidelidade} <span className="text-xs text-slate-500 font-normal">escolhas</span></span></div><Heart size={20} className="text-pink-600" /></div>
                </div>
              )}
            </GlassContainer>

            {/* FASE 5: HISTÓRICO SAZONAL DO BARBEIRO */}
            {(statSazonal.showTri || statSazonal.showSem || statSazonal.showAno) && (
                <GlassContainer className="w-full bg-slate-900/30">
                  <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowSazonalBarbeiro(!showSazonalBarbeiro)}>
                    <h3 className="font-black uppercase tracking-tighter text-lg flex items-center gap-3 select-none text-yellow-500"><Trophy size={20} /> Meus Fechamentos Oficiais</h3>
                    {showSazonalBarbeiro ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
                  </div>
                  {showSazonalBarbeiro && (
                    <div className="space-y-6 pt-6 mt-4 border-t border-white/5">
                        {statSazonal.showTri && statSazonal.tri && (
                            <div className="p-5 bg-slate-950/50 rounded-2xl border border-yellow-500/20">
                                <h4 className="text-yellow-500 font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2"><Star size={12}/> RESULTADO {statSazonal.labelTri.toUpperCase()}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Lucro Total</span><span className="text-lg font-black text-white">{formatCurrency(statSazonal.tri.lucro)}</span></div>
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Cortes</span><span className="text-lg font-black text-white">{statSazonal.tri.count}</span></div>
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Tempo Médio</span><span className="text-lg font-black text-white">{statSazonal.tri.tempoMedio}m</span></div>
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Fidelidade</span><span className="text-lg font-black text-pink-400">{statSazonal.tri.fieis}</span></div>
                                </div>
                            </div>
                        )}
                        {statSazonal.showSem && statSazonal.sem && (
                            <div className="p-5 bg-slate-950/50 rounded-2xl border border-purple-500/20">
                                <h4 className="text-purple-400 font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2"><Crown size={12}/> RESULTADO {statSazonal.labelSem.toUpperCase()}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Lucro Total</span><span className="text-lg font-black text-white">{formatCurrency(statSazonal.sem.lucro)}</span></div>
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Cortes</span><span className="text-lg font-black text-white">{statSazonal.sem.count}</span></div>
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Tempo Médio</span><span className="text-lg font-black text-white">{statSazonal.sem.tempoMedio}m</span></div>
                                    <div><span className="block text-[9px] text-slate-400 uppercase font-bold">Fidelidade</span><span className="text-lg font-black text-pink-400">{statSazonal.sem.fieis}</span></div>
                                </div>
                            </div>
                        )}
                        {statSazonal.showAno && statSazonal.ano && (
                            <div className="p-5 bg-gradient-to-br from-yellow-600/10 to-yellow-900/10 rounded-2xl border border-yellow-500/50 shadow-xl shadow-yellow-500/10">
                                <h4 className="text-yellow-500 font-black uppercase text-[12px] tracking-widest mb-4 flex items-center gap-2"><Trophy size={16}/> SEU ANO {statSazonal.labelAno.replace("ANO ", "")}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div><span className="block text-[10px] text-slate-400 uppercase font-bold">Faturamento Anual</span><span className="text-2xl font-black text-emerald-400">{formatCurrency(statSazonal.ano.lucro)}</span></div>
                                    <div><span className="block text-[10px] text-slate-400 uppercase font-bold">Total de Cortes</span><span className="text-2xl font-black text-white">{statSazonal.ano.count}</span></div>
                                    <div><span className="block text-[10px] text-slate-400 uppercase font-bold">Agilidade Média</span><span className="text-2xl font-black text-white">{statSazonal.ano.tempoMedio}m</span></div>
                                    <div><span className="block text-[10px] text-slate-400 uppercase font-bold">Votos de Confiança</span><span className="text-2xl font-black text-pink-400">{statSazonal.ano.fieis}</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                  )}
                </GlassContainer>
            )}

          </div>
        </div>
        {checkoutAtivo && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <div className="glass rounded-[2.5rem] p-10 w-full max-w-md space-y-8 border-emerald-500/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              <h3 className="text-3xl font-black italic neon-yellow mb-2">VALOR PAGO</h3>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-6">Serviço: {checkoutAtivo.servico}</p>
              <input type="number" step="0.01" className="w-full bg-slate-950 p-8 rounded-3xl text-5xl font-black text-center text-white outline-none border-2 border-emerald-500/20 focus:border-emerald-500 transition-all" value={valorInput} onChange={(e) => setValorInput(e.target.value)} />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => setCheckoutAtivo(null)} className="p-6 bg-slate-900 rounded-3xl font-black uppercase text-xs text-slate-500 hover:text-white transition-all">CANCELAR</button>
                <button onClick={async () => {
                    let duracaoMinutos = 15;
                    if (checkoutAtivo.inicioAtendimento) {
                      const inicio = checkoutAtivo.inicioAtendimento.toMillis ? checkoutAtivo.inicioAtendimento.toMillis() : checkoutAtivo.inicioAtendimento;
                      duracaoMinutos = Math.max(1, Math.floor((Date.now() - inicio) / 60000));
                    } else if (checkoutAtivo.chegada) {
                      const ch = checkoutAtivo.chegada.toMillis ? checkoutAtivo.chegada.toMillis() : checkoutAtivo.chegada;
                      duracaoMinutos = Math.max(1, Math.floor((Date.now() - ch) / 60000));
                    }
                    await db.collection("historico_paiva").add({ nome: checkoutAtivo.nome, whatsapp: checkoutAtivo.whatsapp || "", barbeiro: barbeiroLogado.nome, valor: parseFloat(valorInput), duracaoMinutos: duracaoMinutos, isFiel: checkoutAtivo.escolhaDireta || false, dataConclusao: firebase.firestore.Timestamp.now(), });
                    await db.collection("fila_paiva").doc(checkoutAtivo.id).delete();
                    setCheckoutAtivo(null); addToast("Atendimento Finalizado!", "sucesso");
                  }} className="p-6 bg-emerald-600 rounded-3xl font-black uppercase text-xs text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all">CONFIRMAR</button>
              </div>
            </div>
          </div>
        )}
        <FixedFooter />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  if (modo === "gestao_master") {
    const stats = getFinanceStats();
    const advStats = getAdvancedStats();
    const sortedProfsMaster = [...profissionais].sort((a, b) => Number(a.cadeira) - Number(b.cadeira));

    const salvarProfissional = async () => {
      if (!novoProf.nome || !novoProf.cadeira) return addToast("Preencha Nome e Cadeira", "erro");
      if (profEditando) {
        await db.collection("profissionais").doc(profEditando).update({ nome: novoProf.nome, cpf: novoProf.cpf, telefone: novoProf.telefone, cadeira: novoProf.cadeira, });
        addToast("Dados atualizados!", "sucesso");
      } else {
        let pin = ""; let unique = false;
        while (!unique) {
          pin = Math.floor(100 + Math.random() * 900).toString();
          if (!profissionais.some((p) => p.matricula === pin)) unique = true;
        }
        await db.collection("profissionais").add({ nome: novoProf.nome, cpf: novoProf.cpf, telefone: novoProf.telefone, cadeira: novoProf.cadeira, matricula: pin, status: "ausente", });
        addToast("Barbeiro cadastrado com PIN " + pin, "sucesso");
      }
      setNovoProf({ nome: "", cpf: "", telefone: "", cadeira: "" }); setProfEditando(null);
    };

    const enviarLinkBarbeiro = (p) => {
      if (!p.telefone) return addToast("Este barbeiro não tem telefone cadastrado.", "erro");
      const link = `${window.location.origin}?b_id=${p.id}`;
      let num = p.telefone.replace(/\D/g, "");
      if (num.length <= 11) num = `55${num}`;
      const texto = `Olá ${p.nome}, aqui está o link de acesso exclusivo do seu painel de atendimento:\n\n${link}\n\nSeu código de acesso manual (PIN) é: ${p.matricula}\nSua cadeira é a número: ${p.cadeira}\n\nLembre-se, este link é intransferível e caso seja desativado, você perderá o acesso.`;
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(texto)}`, "_blank");
    };

    const handleWhatsAppClient = (clientObj, motivo) => {
      if (!clientObj || !clientObj.phone || clientObj.phone.trim() === "" || clientObj.phone === "NO_PHONE") return addToast("O cliente vencedor não possui WhatsApp cadastrado.", "erro");
      const brinde = window.prompt(`Qual será o prêmio/brinde para ${clientObj.name}?`);
      if (!brinde) return;
      const texto = `Parabéns ${clientObj.name}, você é o nosso ${motivo}, você ganhou de brinde: ${brinde}!`;
      let phoneRaw = clientObj.phone.replace(/\D/g, "");
      if (phoneRaw.length === 8 || phoneRaw.length === 9) phoneRaw = `5521${phoneRaw}`;
      else if (phoneRaw.length === 10 || phoneRaw.length === 11) phoneRaw = `55${phoneRaw}`;
      else if (phoneRaw.length < 8) phoneRaw = `5521${phoneRaw}`;
      window.open(`https://wa.me/${phoneRaw}?text=${encodeURIComponent(texto)}`, "_blank");
    };

    const deletarClienteDB = async (id) => {
      const pin = window.prompt("Atenção: Para excluir este cliente, digite a SENHA MASTER:");
      if (pin !== senhaMasterConfig) return addToast("Senha Incorreta.", "erro");
      await db.collection("clientes_paiva").doc(id).delete(); addToast("Cliente removido do banco!", "sucesso");
    };

    const limparClientesDB = async () => {
      const pin = window.prompt("PERIGO: Para apagar TODOS os clientes, digite a SENHA MASTER:");
      if (pin !== senhaMasterConfig) return addToast("Senha Incorreta.", "erro");
      const snap = await db.collection("clientes_paiva").get(); const batch = db.batch();
      snap.docs.forEach((doc) => batch.delete(doc.ref)); await batch.commit();
      addToast("Todos os clientes apagados.", "sucesso");
    };

    const trocarSenhaMaster = async () => {
        if (senhaAtualInput !== senhaMasterConfig) return addToast("A senha atual está incorreta!", "erro");
        if (novaSenhaInput.length < 4) return addToast("A nova senha deve ter no mínimo 4 dígitos!", "erro");
        if (!window.confirm("Certeza que deseja alterar a Senha Master da Barbearia?")) return;
        
        await db.collection("configuracoes_paiva").doc("geral").set({ senhaMaster: novaSenhaInput }, { merge: true });
        addToast("Senha Master atualizada com sucesso!", "sucesso");
        setSenhaAtualInput(""); setNovaSenhaInput(""); setShowSeguranca(false);
    };

    return (
      <div className="min-h-screen overflow-x-hidden bg-slate-950 flex flex-col text-white pb-16">
        <GlobalClock currentTime={currentTime} />
        <div className="p-4 md:p-6 pb-0 absolute top-0 left-0 z-50">
          <button onClick={() => setModo("selecao")} className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2 hover:text-white transition-all"><ArrowLeft size={14} /> VOLTAR</button>
        </div>
        
        {/* Adicionado pt-6 para respirar e não cortar o topo dos postes */}
        <EliteHeader subtitle="PAINEL MASTER" className="pt-6" />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex flex-col items-center pb-24">
          <div className="w-full max-w-6xl space-y-8 mb-20">
            
            {/* VOZ DA TV E ZERAR FILA (NOVO LAYOUT PROMOVIDO) */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 w-full bg-slate-900/30 p-6 rounded-[2.5rem] border border-white/5">
               <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 shrink-0">
                     <Mic size={24} className="text-blue-400" />
                     <h4 className="text-blue-400 font-black uppercase tracking-widest text-sm">ÁUDIO TV</h4>
                  </div>
                  <select className="flex-1 w-full max-w-sm p-4 bg-slate-950 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white appearance-none text-xs font-bold" value={vozSelecionadaUI} onChange={(e) => setVozSelecionadaUI(e.target.value)}>
                      <option value="">Automática ({vozesDisponiveis.length} vozes)</option>
                      {vozesDisponiveis.map((v) => (<option key={v.name} value={v.name}>{v.name}</option>))}
                  </select>
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                     <button onClick={() => { window.speechSynthesis.cancel(); const msg = new SpeechSynthesisUtterance("Atenção, Teste de voz ativado."); msg.lang = "pt-BR"; if (vozSelecionadaUI) { const vozEncontrada = vozesDisponiveis.find((v) => v.name === vozSelecionadaUI); if (vozEncontrada) msg.voice = vozEncontrada; } window.speechSynthesis.speak(msg); }} className="p-4 rounded-xl font-black text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest">Testar</button>
                     <button onClick={async () => { await db.collection("configuracoes_paiva").doc("geral").set({ vozTV: vozSelecionadaUI }, { merge: true }); addToast("Voz da TV salva!", "sucesso"); }} className="p-4 rounded-xl font-black text-black bg-emerald-500 hover:bg-emerald-400 transition-all text-[10px] uppercase tracking-widest">Salvar</button>
                     <button onClick={atualizarVozes} className="p-4 rounded-xl font-black text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-all" title="Buscar Vozes"><RefreshCw size={16} /></button>
                  </div>
               </div>
               <div className="shrink-0 w-full lg:w-auto border-t border-white/5 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-6">
                  <button onClick={limparFilaCompleta} className="w-full lg:w-auto bg-red-600/10 text-red-500 border border-red-500/20 px-8 py-4 rounded-2xl font-black uppercase text-xs flex justify-center items-center gap-3 hover:bg-red-600 hover:text-white transition-all"><Eraser size={20} /> ZERAR FILA</button>
               </div>
            </div>

            {/* SEÇÃO FATURAMENTO */}
            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowFaturamento(!showFaturamento)}>
                <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none text-emerald-500"><Banknote size={28} /> Faturamento</h3>
                {showFaturamento ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showFaturamento && (
                <div className="pt-6 mt-4 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-emerald-500/20 overflow-hidden"><span className="block text-xs text-emerald-500 font-bold uppercase tracking-widest mb-1">💰 Hoje</span><span className="text-3xl font-black block w-full truncate" title={formatCurrency(stats.hoje)}>{formatCurrency(stats.hoje)}</span></div>
                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-blue-500/20 overflow-hidden"><span className="block text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">📅 Semana</span><span className="text-3xl font-black block w-full truncate" title={formatCurrency(stats.semana)}>{formatCurrency(stats.semana)}</span></div>
                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-yellow-500/20 overflow-hidden"><span className="block text-xs text-yellow-500 font-bold uppercase tracking-widest mb-1">🗓️ Mês</span><span className="text-3xl font-black block w-full truncate" title={formatCurrency(stats.mes)}>{formatCurrency(stats.mes)}</span></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {advStats.showTri && (<div className="p-6 bg-slate-950/30 rounded-2xl border border-white/5"><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{advStats.labelTri}</span><span className="text-xl font-black text-slate-300 block truncate">{formatCurrency(advStats.lucroTri)}</span></div>)}
                    {advStats.showSem && (<div className="p-6 bg-slate-950/30 rounded-2xl border border-white/5"><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{advStats.labelSem}</span><span className="text-xl font-black text-slate-300 block truncate">{formatCurrency(advStats.lucroSem)}</span></div>)}
                    {advStats.showAno && (<div className="p-6 bg-slate-950/30 rounded-2xl border border-white/5"><span className="block text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-1">{advStats.labelAno}</span><span className="text-xl font-black text-pink-300 block truncate">{formatCurrency(advStats.lucroAno)}</span></div>)}
                  </div>
                </div>
              )}
            </GlassContainer>

            {/* SEÇÃO DESTAQUES & PREMIAÇÕES */}
            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowDestaques(!showDestaques)}>
                <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none text-yellow-500"><Trophy size={28} /> Premiações & Destaques</h3>
                {showDestaques ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showDestaques && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-4 border-t border-white/5">
                  <div className="p-8 bg-gradient-to-br from-yellow-600/20 to-yellow-900/10 rounded-3xl border border-yellow-500/30">
                    <h4 className="text-yellow-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Star size={14} /> BARBEIRO ELITE ({advStats.mesPassadoNome})</h4>
                    <p className="text-3xl font-black uppercase text-white truncate">{advStats.eliteWinner}</p>
                  </div>
                  {advStats.showTri && (
                    <div className="p-8 bg-gradient-to-br from-blue-600/20 to-blue-900/10 rounded-3xl border border-blue-500/30 relative">
                      <h4 className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Users size={14} /> CLIENTE ELITE ({advStats.labelTri})</h4>
                      <p className="text-3xl font-black uppercase text-white flex justify-between items-center overflow-hidden">
                        <span className="truncate">{advStats.clientTri.name}</span>
                        {advStats.clientTri.count > 0 && (<span className="text-sm font-bold text-slate-400 shrink-0 ml-2">({advStats.clientTri.count} atendimentos)</span>)}
                      </p>
                      {advStats.clientTri.count > 0 && (
                        <button onClick={() => handleWhatsAppClient(advStats.clientTri, `cliente elite do ${advStats.labelTri}`)} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[10px] tracking-widest p-3 rounded-xl flex items-center justify-center gap-2 transition-all"><MessageCircle size={16} /> Enviar Prêmio via WhatsApp</button>
                      )}
                    </div>
                  )}
                  {advStats.showTri && (
                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/10 relative">
                      <h4 className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Trophy size={14} /> BARBEIRO DESTAQUE ({advStats.labelTri})</h4>
                      <p className="text-3xl font-black uppercase text-white truncate">{advStats.bTriWinner}</p>
                    </div>
                  )}
                  {advStats.showSem && (
                    <div className="p-8 bg-gradient-to-br from-purple-600/20 to-purple-900/10 rounded-3xl border border-purple-500/30 relative col-span-1 md:col-span-2">
                      <h4 className="text-purple-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Trophy size={14} /> BARBEIRO CAMPEÃO DO {advStats.labelSem.toUpperCase()}</h4>
                      <p className="text-4xl font-black uppercase text-white neon-purple truncate">{advStats.bSemWinner}</p>
                    </div>
                  )}
                  {advStats.showSem && !advStats.showAno && (
                    <div className="p-8 bg-gradient-to-br from-cyan-600/20 to-cyan-900/10 rounded-3xl border border-cyan-500/30 relative col-span-1 md:col-span-2">
                      <h4 className="text-cyan-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Award size={14} /> CLIENTE CAMPEÃO DO {advStats.labelSem.toUpperCase()}</h4>
                      <p className="text-3xl font-black uppercase text-white flex justify-between items-center overflow-hidden">
                        <span className="truncate">{advStats.clientSem.name}</span>
                        {advStats.clientSem.count > 0 && (<span className="text-sm font-bold text-slate-400 shrink-0 ml-2">({advStats.clientSem.count} atendimentos)</span>)}
                      </p>
                      {advStats.clientSem.count > 0 && (
                        <button onClick={() => handleWhatsAppClient(advStats.clientSem, `cliente campeão do ${advStats.labelSem}`)} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[10px] tracking-widest p-3 rounded-xl flex items-center justify-center gap-2 transition-all"><MessageCircle size={16} /> Enviar Prêmio via WhatsApp</button>
                      )}
                    </div>
                  )}
                  {advStats.showAno && (
                    <div className="p-8 bg-gradient-to-br from-pink-600/20 to-pink-900/10 rounded-3xl border border-pink-500/30 relative shadow-2xl shadow-pink-500/20 col-span-1 md:col-span-2">
                      <div className="absolute -top-4 -right-4 bg-yellow-500 p-3 rounded-full shadow-lg animate-bounce"><Crown size={24} className="text-black" /></div>
                      <h4 className="text-pink-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Gift size={14} /> CLIENTE ELITE DO {advStats.labelAno}</h4>
                      <p className="text-4xl font-black uppercase text-white flex flex-col"><span className="truncate w-full">{advStats.clientAno.name}</span><span className="text-sm font-bold text-slate-400 mt-1">({advStats.clientAno.count} ATENDIMENTOS NO ANO)</span></p>
                      {advStats.clientAno.count > 0 && (<button onClick={() => handleWhatsAppClient(advStats.clientAno, `cliente do ano de ${new Date().getFullYear()}`)} className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase text-[12px] tracking-widest p-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"><MessageCircle size={18} /> 🎁 ENVIAR SUPER PRÊMIO</button>)}
                    </div>
                  )}
                  {advStats.showAno && (
                    <div className="p-8 bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 rounded-3xl border border-yellow-500/50 relative shadow-2xl shadow-yellow-500/20 col-span-1 md:col-span-2">
                      <div className="absolute -top-4 -right-4 bg-yellow-500 p-3 rounded-full shadow-lg"><Crown size={24} className="text-black" /></div>
                      <h4 className="text-yellow-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Trophy size={14} /> BARBEIRO DO {advStats.labelAno}</h4>
                      <p className="text-5xl font-black uppercase text-white truncate neon-yellow">{advStats.bAnoWinner}</p>
                    </div>
                  )}
                </div>
              )}
            </GlassContainer>

            {/* SEÇÃO RANKING */}
            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowRanking(!showRanking)}>
                <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none text-blue-400"><TrendingUp size={28} /> Ranking ({advStats.mesAtualNome.toUpperCase()})</h3>
                {showRanking ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showRanking && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 mt-4 border-t border-white/5">
                  <div className="p-5 bg-slate-950/50 rounded-3xl border border-emerald-500/20 overflow-hidden"><span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Banknote size={14} /> Maior Lucro</span><span className="text-lg font-black uppercase block truncate" title={advStats.mesLucro}>{advStats.mesLucro}</span></div>
                  <div className="p-5 bg-slate-950/50 rounded-3xl border border-purple-500/20 overflow-hidden"><span className="text-[10px] text-purple-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Scissors size={14} /> Mais Atend.</span><span className="text-lg font-black uppercase block truncate" title={advStats.mesAtend}>{advStats.mesAtend}</span></div>
                  <div className="p-5 bg-slate-950/50 rounded-3xl border border-orange-500/20 overflow-hidden"><span className="text-[10px] text-orange-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Zap size={14} /> Mais Rápido</span><span className="text-lg font-black uppercase block truncate" title={advStats.mesSpeed}>{advStats.mesSpeed}</span></div>
                  <div className="p-5 bg-slate-950/50 rounded-3xl border border-pink-500/20 overflow-hidden"><span className="text-[10px] text-pink-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Heart size={14} /> Mais Requisitado</span><span className="text-lg font-black uppercase block truncate" title={advStats.mesFiel}>{advStats.mesFiel}</span></div>
                </div>
              )}
            </GlassContainer>

            {/* SEÇÃO EQUIPE */}
            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowEquipe(!showEquipe)}>
                <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none text-slate-300"><Scissors size={28} /> Equipe Ativa ({profissionais.length})</h3>
                {showEquipe ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showEquipe && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 mt-4 border-t border-white/5">
                  <div className="space-y-4 bg-slate-950/50 p-6 rounded-[2rem] border border-white/5 h-fit">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-yellow-500 font-black uppercase text-xs">{profEditando ? "EDITAR BARBEIRO" : "NOVO BARBEIRO"}</h4>
                      {profEditando && (<button onClick={() => { setProfEditando(null); setNovoProf({ nome: "", cpf: "", telefone: "", cadeira: "" }); }} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold">Cancelar</button>)}
                    </div>
                    <input type="text" placeholder="NOME" className="w-full p-4 bg-slate-900 rounded-xl border border-white/5 outline-none focus:border-yellow-500 uppercase" value={novoProf.nome} onChange={(e) => setNovoProf({ ...novoProf, nome: e.target.value.toUpperCase() })} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="tel" placeholder="CPF" className="w-full p-4 bg-slate-900 rounded-xl border border-white/5 outline-none focus:border-yellow-500" value={novoProf.cpf} onChange={(e) => setNovoProf({ ...novoProf, cpf: e.target.value.replace(/\D/g, "").slice(0, 11) })} />
                      <input type="tel" placeholder="TELEFONE (DDD)" className="w-full p-4 bg-slate-900 rounded-xl border border-white/5 outline-none focus:border-yellow-500" value={novoProf.telefone} onChange={(e) => setNovoProf({ ...novoProf, telefone: e.target.value.replace(/\D/g, "") })} />
                    </div>
                    <input type="number" placeholder="Nº CADEIRA" className="w-full p-4 bg-slate-900 rounded-xl border border-white/5 outline-none focus:border-yellow-500" value={novoProf.cadeira} onChange={(e) => setNovoProf({ ...novoProf, cadeira: e.target.value })} />
                    <button onClick={salvarProfissional} className={`w-full p-4 rounded-xl font-black text-black transition-all mt-2 ${profEditando ? "bg-blue-500" : "bg-yellow-600 hover:bg-yellow-500"}`}>{profEditando ? "SALVAR ALTERAÇÕES" : "CADASTRAR BARBEIRO"}</button>
                  </div>
                  
                  <div className="space-y-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {sortedProfsMaster.map((p) => (
                      <div key={p.id} className={`p-4 rounded-2xl flex justify-between items-center border transition-all ${profEditando === p.id ? "bg-blue-900/20 border-blue-500/50" : "bg-slate-950/50 border-white/5"}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-black text-slate-500 shrink-0">{p.cadeira || "-"}</div>
                          <div className="overflow-hidden">
                            <span className="font-black uppercase text-sm block text-white truncate">{p.nome}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono truncate block">PIN: {p.matricula} | {p.cpf || "Sem CPF"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => enviarLinkBarbeiro(p)} className="p-2.5 bg-green-900/20 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded-lg" title="Enviar Link Seguro via WhatsApp"><MessageCircle size={16} /></button>
                          <button onClick={() => { setProfEditando(p.id); setNovoProf({ nome: p.nome, cpf: p.cpf || "", telefone: p.telefone || "", cadeira: p.cadeira || "", }); }} className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all" title="Editar"><Edit2 size={16} /></button>
                          <button onClick={() => { if (window.confirm(`Deseja demitir/excluir ${p.nome}? O link de acesso dele será destruído para sempre.`)) { db.collection("profissionais").doc(p.id).delete(); } }} className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Excluir"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassContainer>

            {/* COFRE DE CLIENTES */}
            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowClientesDB(!showClientesDB)}>
                <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none text-slate-300"><UserPlus size={28} /> Cadastro de Clientes <span className="text-sm font-bold text-slate-500">({clientesDB.length})</span></h3>
                <div className="flex items-center gap-4">
                  {showClientesDB && (<button onClick={(e) => { e.stopPropagation(); limparClientesDB(); }} className="bg-red-600/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-2xl font-black uppercase text-[9px] flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14} /> Apagar Todos</button>)}
                  {showClientesDB ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
                </div>
              </div>
              {showClientesDB && (
                <div className="pt-6 border-t border-white/5 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clientesDB.length === 0 && (<p className="text-slate-500 text-sm font-bold uppercase col-span-2">Nenhum cliente salvo no banco de dados ainda.</p>)}
                  {clientesDB.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex justify-between items-center hover:border-blue-500/30 transition-all">
                      <div><span className="block font-black text-white uppercase">{c.nome}</span><span className="text-xs font-mono text-slate-400 block mt-1">CPF: {c.cpf} | Tel: {c.whatsapp}</span></div>
                      <button onClick={() => deletarClienteDB(c.id)} className="p-3 bg-red-900/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Apagar Cliente"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </GlassContainer>

            {/* HISTÓRICO DE ATENDIMENTOS */}
            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowHistorico(!showHistorico)}>
                <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none text-slate-300"><Clock size={28} /> Histórico Detalhado <span className="text-sm font-bold text-slate-500">({historicoAtendimentos.length})</span></h3>
                <div className="flex items-center gap-4">
                  {showHistorico && (<button onClick={(e) => { e.stopPropagation(); limparHistoricoCompleto(); }} className="bg-red-600/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-2xl font-black uppercase text-[9px] flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14} /> Apagar Histórico e Salvar Cofre</button>)}
                  {showHistorico ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
                </div>
              </div>
              {showHistorico && (
                <div className="overflow-x-auto pt-6 border-t border-white/5 mt-4">
                  <table className="w-full text-left">
                    <thead className="text-[10px] uppercase font-black text-slate-700 border-b border-white/5">
                      <tr><th className="pb-6 px-4">DATA</th><th className="pb-6 px-4">Cliente</th><th className="pb-6 px-4">Contato (Invisível TV)</th><th className="pb-6 px-4 text-center">Barbeiro</th><th className="pb-6 px-4 text-center">Valor</th><th className="pb-6 px-4 text-right">Hora</th></tr>
                    </thead>
                    <tbody className="text-xs">
                      {historicoAtendimentos.map((h) => (
                        <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                          <td className="py-6 px-4 font-black text-slate-400 font-mono">{h.dataConclusao?.toDate().toLocaleDateString("pt-BR")}</td>
                          <td className="py-6 px-4 font-black uppercase text-slate-300 tracking-tighter text-lg flex items-center gap-2">{h.nome} {h.isFiel && (<Heart size={12} className="text-pink-500" title="Cliente escolheu este barbeiro" />)}</td>
                          <td className="py-6 px-4 text-slate-500 font-mono tracking-widest">{h.whatsapp || "Sem Registro"}</td>
                          <td className="py-6 px-4 text-center"><span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase text-yellow-500"><Scissors size={10} className="inline mr-1" /> {h.barbeiro}</span></td>
                          <td className="py-6 px-4 text-center font-black text-emerald-400">{formatCurrency(h.valor || 0)}</td>
                          <td className="py-6 px-4 text-right text-slate-500 font-mono">{h.dataConclusao?.toDate().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassContainer>
            
            {/* SEGURANÇA E SENHA DINÂMICA */}
            <GlassContainer className="w-full bg-slate-900/30">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowSeguranca(!showSeguranca)}>
                <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none text-red-500"><ShieldCheck size={28} /> Segurança do Sistema</h3>
                {showSeguranca ? <ChevronUp className="text-slate-500 group-hover:text-white transition-all" /> : <ChevronDown className="text-slate-500 group-hover:text-white transition-all" />}
              </div>
              {showSeguranca && (
                <div className="pt-6 mt-4 border-t border-white/5 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 space-y-4">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">A senha Master protege as exclusões de clientes, a limpeza da fila e o apagão de histórico. Digite sua senha atual para cadastrar uma nova.</p>
                        <div className="flex items-center gap-4">
                            <input type="password" placeholder="Senha Atual" className="flex-1 p-4 bg-slate-950 rounded-xl border border-white/5 outline-none text-white focus:border-red-500 tracking-[0.3em] font-black text-center" value={senhaAtualInput} onChange={e => setSenhaAtualInput(e.target.value)} />
                            <input type="password" placeholder="Nova Senha" className="flex-1 p-4 bg-slate-950 rounded-xl border border-white/5 outline-none text-white focus:border-red-500 tracking-[0.3em] font-black text-center" value={novaSenhaInput} onChange={e => setNovaSenhaInput(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={trocarSenhaMaster} disabled={!senhaAtualInput || !novaSenhaInput} className={`p-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${senhaAtualInput && novaSenhaInput ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-slate-800 text-slate-600'}`}>Alterar Senha</button>
                </div>
              )}
            </GlassContainer>
            
          </div>
        </div>
        <FixedFooter />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }
  return null;
};

const EliteToasts = ({ toasts }) => (
  <div className="fixed top-10 right-10 z-[500] flex flex-col gap-4 pointer-events-none">
    {toasts.map((t) => (
      <div key={t.id} className="pointer-events-auto bg-slate-900 border border-white/10 p-6 rounded-2xl flex items-center gap-4 text-white font-black uppercase text-xs shadow-2xl">
        {t.type === "sucesso" ? (<Check size={20} className="text-emerald-500" />) : t.type === "erro" ? (<AlertCircle size={20} className="text-red-500" />) : (<Info size={20} className="text-blue-500" />)} {t.message}
      </div>
    ))}
  </div>
);

export default App;