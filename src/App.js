import React, { useState, useEffect, useRef } from "react";
import {
  Tv, Lock, ArrowLeft, LogOut, Scissors, Crown, Trash2, Clock, Users,
  Eraser, Play, Calendar, X, Zap, Code2, Circle, Check, Info,
  AlertCircle, DollarSign, Banknote, TrendingUp, Camera, UserPlus, Link, Edit2, Star, Heart, Mic, MessageCircle, RefreshCw
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

// COMPONENTES VISUAIS
const GlassContainer = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`glass rounded-[2.5rem] p-8 ${className}`}>
    {children}
  </div>
);

const ISDSignature = () => (
  <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center pointer-events-none z-50">
    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
      <Code2 size={12} className="text-blue-500" />
      Developed by <span className="text-blue-400">&lt;ISD Systems /&gt;</span>
    </div>
  </div>
);

const App = () => {
  const [modo, setModo] = useState("selecao");
  const [clientesFila, setClientesFila] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [historicoAtendimentos, setHistoricoAtendimentos] = useState([]);
  const [barbeiroLogado, setBarbeiroLogado] = useState(null);
  const [checkoutAtivo, setCheckoutAtivo] = useState(null);
  const [valorInput, setValorInput] = useState("50.00");
  const [acessoInput, setAcessoInput] = useState("");
  const [showHistorico, setShowHistorico] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const [profEditando, setProfEditando] = useState(null);
  const [novoProf, setNovoProf] = useState({ nome: "", matricula: "", cadeira: "" });

  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    sobrenome: "",
    whatsapp: "",
    servico: ["CABELO"], 
  });

  // ESTADOS DE VOZ
  const [vozesDisponiveis, setVozesDisponiveis] = useState([]);
  const [vozSelecionadaUI, setVozSelecionadaUI] = useState(""); 
  const configVozRef = useRef(""); 
  const vozesRef = useRef([]);

  const audioRef = useRef(null);
  const prevClientesRef = useRef([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(isNaN(num) ? 0 : num);
  };

  // 🎙️ CARREGADOR DE VOZES AVANÇADO
  const atualizarVozes = () => {
    if (window.speechSynthesis) {
      // Pega todas as vozes do navegador
      let vozes = window.speechSynthesis.getVoices();
      // Filtra apenas as que tem PT no código de idioma (Brasil e Portugal)
      let vozesPt = vozes.filter(v => v.lang.toLowerCase().includes('pt'));
      
      setVozesDisponiveis(vozesPt);
      vozesRef.current = vozesPt;
    }
  };

  useEffect(() => {
    atualizarVozes();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = atualizarVozes;
    }

    const unsubConfig = db.collection("configuracoes_paiva").doc("geral").onSnapshot((doc) => {
      if (doc.exists && doc.data().vozTV) {
        configVozRef.current = doc.data().vozTV;
        setVozSelecionadaUI(doc.data().vozTV);
      }
    });

    return () => unsubConfig();
  }, []);

  // 🗣️ FUNÇÃO DA VOZ DA TV (COM ANTI-CRASH)
  const falarAnuncio = (nomeClienteCompleto, nomeBarbeiro, numCadeira) => {
    if (!window.speechSynthesis) return;
    const cadeiraTexto = numCadeira ? `na cadeira ${numCadeira}` : "";
    const texto = `${nomeClienteCompleto}. Chegou a sua vez com ${nomeBarbeiro} ${cadeiraTexto}.`;
    
    setTimeout(() => {
        const synth = window.speechSynthesis;
        synth.cancel(); // Limpa a garganta do navegador
        
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9; 
        msg.pitch = 1;

        if (configVozRef.current && vozesRef.current.length > 0) {
            const vozEscolhida = vozesRef.current.find(v => v.name === configVozRef.current);
            if (vozEscolhida) {
                msg.voice = vozEscolhida;
            }
        }

        synth.speak(msg);
    }, 1500); 
  };

  const getFinanceStats = (barbeiroNome) => {
    const agora = new Date();
    const hojeStart = new Date(agora);
    hojeStart.setHours(0, 0, 0, 0);

    const semanaStart = new Date(agora);
    semanaStart.setDate(agora.getDate() - agora.getDay());
    semanaStart.setHours(0, 0, 0, 0);

    const mesStart = new Date(agora.getFullYear(), agora.getMonth(), 1);
    mesStart.setHours(0, 0, 0, 0);

    const registros = barbeiroNome
      ? historicoAtendimentos.filter((h) => h.barbeiro === barbeiroNome)
      : historicoAtendimentos;

    const somar = (lista) => lista.reduce((acc, h) => acc + (Number(h.valor) || 0), 0);
    const filtrarData = (lista, inicio) => lista.filter((h) => h.dataConclusao?.toMillis() >= inicio.getTime());

    const calcularDesempenho = (lista) => {
        const count = lista.length;
        const fidelidade = lista.filter(h => h.isFiel).length;
        const duracaoTotal = lista.reduce((acc, h) => acc + (h.duracaoMinutos || 0), 0);
        const tempoMedio = count > 0 ? Math.floor(duracaoTotal / count) : 0;
        return { count, fidelidade, tempoMedio };
    };

    const regHoje = filtrarData(registros, hojeStart);
    const regSemana = filtrarData(registros, semanaStart);
    const regMes = filtrarData(registros, mesStart);

    return {
      hoje: somar(regHoje),
      semana: somar(regSemana),
      mes: somar(regMes),
      desempenhoMes: calcularDesempenho(regMes),
    };
  };

  const getAdvancedStats = () => {
    const agora = new Date();
    
    const nomeMesAtual = agora.toLocaleDateString('pt-BR', { month: 'long' });
    const dataMesPassado = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
    const nomeMesPassado = dataMesPassado.toLocaleDateString('pt-BR', { month: 'long' });

    const thisMonthStart = new Date(agora.getFullYear(), agora.getMonth(), 1);
    thisMonthStart.setHours(0,0,0,0);

    const lastMonthStart = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
    
    const currentQuarter = Math.floor(agora.getMonth() / 3);
    let lastQ = currentQuarter - 1;
    let yearQ = agora.getFullYear();
    if (lastQ < 0) { lastQ = 3; yearQ--; }
    const lastQuarterStart = new Date(yearQ, lastQ * 3, 1);
    const thisQuarterStart = new Date(agora.getFullYear(), currentQuarter * 3, 1);

    const nomesTrimestres = {
        0: "Janeiro, Fevereiro e Março",
        1: "Abril, Maio e Junho",
        2: "Julho, Agosto e Setembro",
        3: "Outubro, Novembro e Dezembro"
    };
    const nomeTrimestrePassado = nomesTrimestres[lastQ];

    const histThisMonth = [];
    const histLastMonth = [];
    const histLastQuarter = [];

    historicoAtendimentos.forEach((h) => {
      if (!h.dataConclusao) return;
      const time = h.dataConclusao.toMillis();
      if (time >= thisMonthStart.getTime()) histThisMonth.push(h);
      if (time >= lastMonthStart.getTime() && time < thisMonthStart.getTime()) histLastMonth.push(h);
      if (time >= lastQuarterStart.getTime() && time < thisQuarterStart.getTime()) histLastQuarter.push(h);
    });

    const groupByBarber = (arr) => {
      const map = {};
      arr.forEach((h) => {
        if (!map[h.barbeiro]) map[h.barbeiro] = { lucro: 0, count: 0, duracaoTotal: 0, fieis: 0 };
        map[h.barbeiro].lucro += Number(h.valor) || 0;
        map[h.barbeiro].count += 1;
        if (h.isFiel) map[h.barbeiro].fieis += 1;
        if (h.duracaoMinutos) map[h.barbeiro].duracaoTotal += h.duracaoMinutos;
      });
      return map;
    };

    const currentMonthMap = groupByBarber(histThisMonth);
    let maxLucroM = { name: "-", val: 0 };
    let maxCountM = { name: "-", val: 0 };
    let maxSpeedM = { name: "-", val: Infinity };
    let maxRequisitadoM = { name: "-", val: 0 };

    Object.keys(currentMonthMap).forEach((b) => {
      const d = currentMonthMap[b];
      if (d.lucro > maxLucroM.val) maxLucroM = { name: b, val: d.lucro };
      if (d.count > maxCountM.val) maxCountM = { name: b, val: d.count };
      const avgSpeed = d.duracaoTotal / d.count;
      if (d.duracaoTotal > 0 && avgSpeed < maxSpeedM.val) maxSpeedM = { name: b, val: avgSpeed };
      if (d.fieis > maxRequisitadoM.val) maxRequisitadoM = { name: b, val: d.fieis };
    });

    const monthMap = groupByBarber(histLastMonth);
    let monthWinnerName = "Nenhum no período";
    let bestMonthScore = -1;
    Object.keys(monthMap).forEach((b) => {
      const d = monthMap[b];
      const avgSpeed = d.duracaoTotal ? d.duracaoTotal / d.count : 30;
      const score = d.lucro + (d.count * 10) + (d.fieis * 20) - avgSpeed;
      if (score > bestMonthScore) {
        bestMonthScore = score;
        monthWinnerName = b;
      }
    });

    const clientMap = {};
    let topClient = { name: "Nenhum no período", count: 0, phone: "", meses: nomeTrimestrePassado };
    
    histLastQuarter.forEach((h) => {
      if (!h.nome) return;
      const n = h.nome.toUpperCase();
      if (!clientMap[n]) clientMap[n] = { count: 0, phone: h.whatsapp || "" };
      clientMap[n].count += 1;
      
      if (clientMap[n].count > topClient.count) {
        topClient.count = clientMap[n].count;
        topClient.name = n;
        topClient.phone = clientMap[n].phone; 
      }
    });

    return {
      mesAtualNome: nomeMesAtual,
      mesPassadoNome: nomeMesPassado,
      mesLucro: maxLucroM.name !== "-" ? `${maxLucroM.name} (${formatCurrency(maxLucroM.val)})` : "-",
      mesAtend: maxCountM.name !== "-" ? `${maxCountM.name} (${maxCountM.val})` : "-",
      mesSpeed: maxSpeedM.name !== "-" ? `${maxSpeedM.name} (${Math.floor(maxSpeedM.val)}m/corte)` : "-",
      mesFiel: maxRequisitadoM.name !== "-" ? `${maxRequisitadoM.name} (${maxRequisitadoM.val} pedidos)` : "-",
      eliteWinner: monthWinnerName,
      trimestreClient: topClient,
    };
  };

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    
    const unsubFila = db.collection("fila_paiva").orderBy("chegada", "asc").onSnapshot((snap) => {
        const novos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (modo === "painel") {
          const chamado = novos.find((c) => {
            const anterior = prevClientesRef.current.find((p) => p.id === c.id);
            return (c.status === "atendendo" && (!anterior || anterior.status === "esperando"));
          });
          if (chamado) {
              audioRef.current?.play().catch(() => {});
              const prof = profissionais.find(p => p.nome === chamado.barbeiroPref);
              const nomeCompleto = `${chamado.nome} ${chamado.sobrenome || ""}`.trim();
              falarAnuncio(nomeCompleto, chamado.barbeiroPref, prof?.cadeira);
          }
        }
        prevClientesRef.current = novos;
        setClientesFila(novos);
      });

    const unsubProf = db.collection("profissionais").onSnapshot((snap) =>
        setProfissionais(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
      
    const unsubHist = db.collection("historico_paiva").orderBy("dataConclusao", "desc").limit(3000).onSnapshot((snap) =>
        setHistoricoAtendimentos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
      
    return () => {
      unsubFila();
      unsubProf();
      unsubHist();
    };
  }, [modo, profissionais]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matriculaUrl = params.get("barbeiro");
    if (matriculaUrl && profissionais.length > 0 && modo === "selecao" && !barbeiroLogado) {
      const prof = profissionais.find((p) => p.matricula === matriculaUrl);
      if (prof) {
        setBarbeiroLogado(prof);
        setModo("admin_barbeiro");
        addToast(`Bem-vindo, ${prof.nome}!`, "sucesso");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [profissionais, modo, barbeiroLogado]);

  const handleLogin = () => {
    if (acessoInput === "123456") {
      setModo("gestao_master");
      setAcessoInput("");
    } else {
      const prof = profissionais.find((p) => p.matricula === acessoInput);
      if (prof) {
        setBarbeiroLogado(prof);
        setModo("admin_barbeiro");
        setAcessoInput("");
      } else addToast("Acesso Negado", "erro");
    }
  };

  const cadastrarCliente = async (barbeiro) => {
    const servicosFormatados = novoCliente.servico.join(" + ");
    await db.collection("fila_paiva").add({
      ...novoCliente,
      nome: novoCliente.nome.trim(),
      sobrenome: novoCliente.sobrenome.trim(),
      servico: servicosFormatados,
      barbeiroPref: barbeiro,
      chegada: firebase.firestore.Timestamp.now(),
      status: "esperando",
      escolhaDireta: barbeiro !== "Sem Preferência" 
    });
    setModo("selecao");
    setNovoCliente({ nome: "", sobrenome: "", whatsapp: "", servico: ["CABELO"] });
  };

  const limparFilaCompleta = async () => {
    if (!confirm("Deseja zerar toda a fila?")) return;
    const snap = await db.collection("fila_paiva").get();
    await Promise.all(snap.docs.map((d) => d.ref.delete()));
    addToast("Fila limpa.", "info");
  };

  const limparHistoricoCompleto = async () => {
    if (!confirm("Deseja apagar TODO o histórico? Esta ação é permanente!")) return;
    try {
      const snap = await db.collection("historico_paiva").get();
      const batch = db.batch();
      snap.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      addToast("Histórico zerado.", "sucesso");
      setShowHistorico(false);
    } catch (e) {
      addToast("Erro ao limpar.", "erro");
    }
  };

  const ServiceBadge = ({ s }) => (
    <span className="px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest inline-block mt-1">
      {s}
    </span>
  );

  // ================= TELA 1: CADASTRO =================
  if (modo === "cliente_registro") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <GlassContainer className="w-full max-w-lg space-y-6">
          <button onClick={() => setModo("selecao")} className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2">
            <ArrowLeft size={14} /> VOLTAR
          </button>
          <div className="text-center space-y-1">
            <h2 className="text-4xl font-black uppercase tracking-tighter neon-yellow">CADASTRO</h2>
            <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest neon-blue">FILA DE ATENDIMENTO</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="NOME" className="w-full p-5 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-yellow-500" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} />
            <input type="text" placeholder="SOBRENOME" className="w-full p-5 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-yellow-500" value={novoCliente.sobrenome} onChange={(e) => setNovoCliente({ ...novoCliente, sobrenome: e.target.value })} />
            <input type="text" placeholder="WHATSAPP (Opcional)" className="w-full p-5 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-yellow-500" value={novoCliente.whatsapp} onChange={(e) => setNovoCliente({ ...novoCliente, whatsapp: e.target.value })} />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-500 text-center block tracking-widest">SELECIONE OS SERVIÇOS (PODE SER MAIS DE UM)</label>
            <div className="grid grid-cols-2 gap-3">
              {["CABELO", "BARBA", "SOBRANCELHA", "OUTROS"].map((s) => (
                <button 
                  key={s} 
                  onClick={() => {
                    let servs = [...novoCliente.servico];
                    if (servs.includes(s)) {
                        servs = servs.filter(x => x !== s); 
                    } else {
                        servs.push(s); 
                    }
                    if (servs.length === 0) servs = ["CABELO"]; 
                    setNovoCliente({ ...novoCliente, servico: servs });
                  }} 
                  className={`py-4 rounded-xl font-black text-[10px] border transition-all ${novoCliente.servico.includes(s) ? "bg-yellow-500 border-yellow-400 text-slate-950" : "bg-slate-900 border-white/5 text-slate-500"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button disabled={!novoCliente.nome} onClick={() => setModo("barbeiro_choice")} className={`w-full p-8 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.3em] transition-all ${novoCliente.nome ? "bg-yellow-600 text-white shadow-xl shadow-yellow-900/20" : "bg-slate-800 text-slate-600"}`}>
            PROSSEGUIR
          </button>
        </GlassContainer>
        <ISDSignature />
      </div>
    );
  }

  // ================= TELA 2: ESCOLHA BARBEIRO =================
  if (modo === "barbeiro_choice") {
    const disponiveis = profissionais
        .filter((p) => p.status === "disponivel" || p.status === "volto_logo")
        .sort((a, b) => Number(a.cadeira) - Number(b.cadeira));

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <h2 className="text-5xl font-black mb-12 uppercase italic neon-yellow">QUEM VAI TE ATENDER?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <GlassContainer onClick={() => cadastrarCliente("Sem Preferência")} className="bg-yellow-600/10 border-yellow-500/20 flex flex-col items-center gap-2 cursor-pointer hover:bg-yellow-600 transition-all">
            <Zap size={32} className="text-yellow-500" />
            <span className="font-black text-xl uppercase">SEM PREFERÊNCIA</span>
          </GlassContainer>
          {disponiveis.map((p) => (
            <GlassContainer key={p.id} onClick={() => cadastrarCliente(p.nome)} className="flex flex-col items-center gap-2 cursor-pointer border-white/10 hover:border-yellow-500 transition-all">
              <Scissors size={24} className="text-yellow-500" />
              <span className="font-black text-xl uppercase">{p.nome}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">CADEIRA {p.cadeira}</span>
              <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${p.status === "disponivel" ? "text-emerald-500" : "text-orange-500"}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${p.status === "disponivel" ? "bg-emerald-500" : "bg-orange-500"}`} /> {p.status === "disponivel" ? "DISPONÍVEL" : "VOLTO LOGO"}
              </div>
            </GlassContainer>
          ))}
        </div>
        <button onClick={() => setModo("cliente_registro")} className="mt-8 text-slate-500 font-black uppercase text-xs">VOLTAR</button>
        <ISDSignature />
      </div>
    );
  }

  // ================= TELA 3: HOME =================
  if (modo === "selecao") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 pt-10">
          <h1 className="text-8xl font-black uppercase italic tracking-tighter neon-yellow leading-none mb-4">ELITE CARIOCA</h1>
          <p className="text-blue-500 font-bold tracking-[0.8em] uppercase text-sm neon-blue">SISTEMA EM TESTE (V1.0.0)</p>
        </div>
        <button onClick={() => setModo("cliente_registro")} className="relative glass h-80 w-80 md:h-[450px] md:w-[450px] rounded-[5rem] flex flex-col items-center justify-center gap-8 border-2 border-yellow-500/30 shadow-2xl z-10 hover:scale-105 transition-all">
          <Scissors size={100} className="text-yellow-500" />
          <div className="space-y-2">
            <span className="block font-black text-4xl md:text-6xl uppercase tracking-tighter">QUERO CORTAR</span>
            <span className="block text-blue-400 font-bold uppercase text-[10px] tracking-[0.4em] opacity-70">TOQUE PARA INICIAR</span>
          </div>
        </button>
        <div className="relative z-10 w-full flex justify-between items-end">
          <button onClick={() => setModo("painel")} className="opacity-30 hover:opacity-100 p-4 flex flex-col items-center gap-2">
            <Tv size={24} className="text-slate-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">PAINEL TV</span>
          </button>
          <div className="glass-slim px-6 py-4 rounded-[2rem] border border-white/5 flex items-center gap-4 bg-slate-900/40">
            <Lock size={14} className="text-slate-600" />
            <input type="password" placeholder="PIN" className="w-40 bg-transparent text-center font-black text-xs outline-none text-white focus:text-yellow-500" value={acessoInput} onChange={(e) => setAcessoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} className="bg-blue-600 px-8 py-2 rounded-xl font-bold uppercase text-xs text-white">OK</button>
          </div>
        </div>
        <ISDSignature />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  // ================= TELA 4: PAINEL DA TV =================
  if (modo === "painel") {
      const sortedProfs = [...profissionais].sort((a, b) => Number(a.cadeira) - Number(b.cadeira));
      const profsAtivos = sortedProfs.filter(p => p.status !== 'ausente');
      
      const filaGeralEspera = clientesFila.filter(c => c.barbeiroPref === "Sem Preferência" && c.status === "esperando");
      const filaGeralCount = filaGeralEspera.length;
      const filaGeralDisplay = filaGeralEspera.slice(0, 3);
      
      const totalCards = profsAtivos.length + 1;
      const numCols = totalCards > 5 ? Math.ceil(totalCards / 2) : totalCards;
      const numRows = totalCards > 5 ? 2 : 1;

    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-950 p-6 text-white flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4 shrink-0">
          <button onClick={() => setModo("selecao")} className="bg-slate-900 p-3 rounded-2xl text-slate-500"><ArrowLeft size={24} /></button>
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase italic tracking-widest neon-yellow">ELITE CARIOCA</h1>
            <p className="text-blue-500 font-bold tracking-[0.6em] text-[8px] uppercase neon-blue">PAINEL DE ATENDIMENTO</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">{new Date().toLocaleDateString("pt-BR")}</span>
            <span className="text-2xl font-black font-mono">{new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>

        <div 
            className="grid gap-4 flex-1 w-full h-full min-h-0"
            style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` }}
        >
            <div className="glass rounded-[2rem] p-4 h-full flex flex-col border border-blue-500/20 bg-slate-900/30 overflow-hidden">
                <h3 className="text-center font-black text-blue-400 uppercase text-[10px] tracking-widest mb-3 border-b border-white/5 pb-2 shrink-0">
                    FILA GERAL - <span className="text-white text-sm">{filaGeralCount}</span>
                </h3>
                <div className="flex flex-col gap-2 flex-1 justify-start overflow-hidden">
                    {filaGeralCount === 0 && <p className="text-center text-slate-600 font-bold uppercase mt-4 text-[10px]">Fila Vazia</p>}
                    
                    {filaGeralDisplay.map(c => (
                        <div key={c.id} className="p-3 bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-white/5 shrink-0 relative pt-5">
                            <span className="absolute top-1.5 right-2 text-[9px] text-slate-400 font-mono font-bold bg-slate-950/50 px-1.5 py-0.5 rounded">
                                {c.chegada?.toDate().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-lg font-black block uppercase leading-none mb-1 truncate w-full text-center px-2">{c.nome} {c.sobrenome}</span>
                            <ServiceBadge s={c.servico} />
                        </div>
                    ))}
                </div>
            </div>

            {profsAtivos.map(p => {
                const esperandoProf = clientesFila.filter(c => c.barbeiroPref === p.nome && c.status === "esperando");
                const countWaiting = esperandoProf.length;
                const emAtendimentoProf = clientesFila.find(c => c.barbeiroPref === p.nome && c.status === "atendendo");
                
                let displayList = [];
                if (emAtendimentoProf) {
                    displayList.push({ ...emAtendimentoProf, isAtendimento: true });
                }
                const remainingSlots = 3 - displayList.length;
                displayList = [...displayList, ...esperandoProf.slice(0, remainingSlots)];

                return (
                    <div key={p.id} className="glass rounded-[2rem] p-4 flex flex-col border border-yellow-500/20 bg-slate-900/30 overflow-hidden">
                        <h3 className="text-center font-black text-yellow-400 uppercase text-[10px] tracking-widest mb-3 border-b border-white/5 pb-2 shrink-0">
                            {p.nome} <span className="text-slate-500 mx-1">|</span> CD {p.cadeira} - <span className="text-white text-sm">{countWaiting}</span>
                            <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${p.status === "disponivel" ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-orange-500 shadow-[0_0_10px_#f97316]"}`} />
                        </h3>
                        
                        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                            {displayList.length === 0 && <p className="text-center text-slate-600 font-bold uppercase mt-4 text-[10px]">Livre</p>}
                            
                            {displayList.map((c) => (
                                <div key={c.id} className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all relative ${c.isAtendimento ? 'bg-emerald-600/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-1' : 'bg-slate-800/50 border-white/5 shrink-0 pt-5'}`}>
                                    {c.isAtendimento ? (
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1 flex items-center justify-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> EM ATENDIMENTO
                                        </span>
                                    ) : (
                                        <span className="absolute top-1.5 right-2 text-[9px] text-slate-400 font-mono font-bold bg-slate-950/50 px-1.5 py-0.5 rounded">
                                            {c.chegada?.toDate().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                    <span className={`font-black block uppercase leading-none mb-1 truncate w-full text-center px-2 ${c.isAtendimento ? 'text-2xl text-white' : 'text-base text-slate-300'}`}>{c.nome} {c.sobrenome}</span>
                                    <ServiceBadge s={c.servico} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
        <ISDSignature />
      </div>
    );
  }

  // ================= TELA 5: BARBEIRO =================
  if (modo === "admin_barbeiro" && barbeiroLogado) {
    const dAtual = profissionais.find((p) => p.id === barbeiroLogado.id) || barbeiroLogado;
    const emAtend = clientesFila.filter((c) => c.barbeiroPref === barbeiroLogado.nome && c.status === "atendendo");
    const statsB = getFinanceStats(barbeiroLogado.nome);
    const prox = clientesFila.sort((a, b) => a.chegada - b.chegada).find((c) => c.status === "esperando" && (c.barbeiroPref === "Sem Preferência" || c.barbeiroPref === barbeiroLogado.nome));

    const handleStatusChange = async (st) => {
      if (st === "ausente") {
        const filaMinha = clientesFila.filter((c) => c.barbeiroPref === barbeiroLogado.nome && c.status === "esperando");
        if (filaMinha.length > 0) {
          if (!window.confirm("Você tem cliente na fila, tem certeza que quer sair?")) return;
          const batch = db.batch();
          batch.update(db.collection("profissionais").doc(barbeiroLogado.id), { status: st });
          filaMinha.forEach((c) => {
            batch.update(db.collection("fila_paiva").doc(c.id), { barbeiroPref: "Sem Preferência" });
          });
          await batch.commit();
          return;
        }
      }
      await db.collection("profissionais").doc(barbeiroLogado.id).update({ status: st });
    };

    return (
      <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center text-white overflow-y-auto custom-scrollbar pb-24">
        <div className="w-full max-w-5xl space-y-10">
          <div className="flex justify-between items-center border-b border-white/5 pb-8 pt-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-yellow-600 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-[8px] font-black text-black/50 uppercase tracking-widest absolute top-2">Cadeira</span>
                <span className="text-4xl font-black text-black">{dAtual.cadeira || "-"}</span>
              </div>
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter neon-yellow leading-none">{barbeiroLogado.nome}</h2>
                <span className="text-blue-500 font-bold uppercase text-xs tracking-widest">Painel Operacional</span>
              </div>
            </div>
            <button onClick={() => { setBarbeiroLogado(null); setModo("selecao"); }} className="p-5 bg-slate-900 rounded-3xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><LogOut size={24} /></button>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest px-2">💰 Faturamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-slate-900/50 rounded-3xl border border-emerald-500/20"><span className="block text-xs text-emerald-500 font-bold uppercase tracking-widest mb-1">Hoje</span><span className="text-2xl font-black">{formatCurrency(statsB.hoje)}</span></div>
                <div className="p-6 bg-slate-900/50 rounded-3xl border border-blue-500/20"><span className="block text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">Semana</span><span className="text-2xl font-black">{formatCurrency(statsB.semana)}</span></div>
                <div className="p-6 bg-slate-900/50 rounded-3xl border border-yellow-500/20"><span className="block text-xs text-yellow-500 font-bold uppercase tracking-widest mb-1">Mês</span><span className="text-2xl font-black">{formatCurrency(statsB.mes)}</span></div>
            </div>
            <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest px-2 mt-8">📊 Meu Desempenho (Mês Atual)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-900/30 rounded-2xl border border-white/5 flex items-center justify-between"><div><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atendimentos</span><span className="text-xl font-black">{statsB.desempenhoMes.count}</span></div><Users size={20} className="text-slate-600"/></div>
                <div className="p-5 bg-slate-900/30 rounded-2xl border border-white/5 flex items-center justify-between"><div><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tempo Médio</span><span className="text-xl font-black">{statsB.desempenhoMes.tempoMedio} min</span></div><Clock size={20} className="text-slate-600"/></div>
                <div className="p-5 bg-slate-900/30 rounded-2xl border border-white/5 flex items-center justify-between"><div><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fidelidade</span><span className="text-xl font-black">{statsB.desempenhoMes.fidelidade} <span className="text-xs text-slate-500 font-normal">escolhas</span></span></div><Heart size={20} className="text-pink-600"/></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
            {["disponivel", "volto_logo", "ausente"].map((st) => (
              <button key={st} onClick={() => handleStatusChange(st)} className={`p-6 rounded-[2rem] font-black uppercase text-xs border-2 transition-all ${dAtual.status === st ? "bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-900/20" : "bg-slate-900 border-white/5 opacity-50 hover:opacity-100"}`}>
                {st === "volto_logo" ? "VOLTO LOGO" : st.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-12">
            {emAtend.length > 0 ? (
              <div className="p-10 bg-slate-900 rounded-[3rem] border-2 border-emerald-500/30 text-center space-y-6">
                <h3 className="font-black text-xs text-emerald-500 uppercase tracking-widest flex justify-center items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> EM ATENDIMENTO</h3>
                <h4 className="text-6xl font-black uppercase text-white leading-none">{emAtend[0].nome} {emAtend[0].sobrenome}</h4>
                <div className="py-2"><span className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm">SERVIÇO: {emAtend[0].servico}</span></div>
                <button onClick={() => setCheckoutAtivo(emAtend[0])} className="w-full bg-emerald-600 p-8 rounded-3xl font-black text-xl uppercase hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 mt-4">FINALIZAR & RECEBER</button>
              </div>
            ) : (
              <div className="p-10 bg-slate-900/50 rounded-[3rem] border border-white/5 text-center space-y-6">
                <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest flex items-center justify-center gap-3"><Users size={16} /> PRÓXIMO DA FILA</h3>
                {prox ? (
                  <div className="space-y-6">
                    <h4 className="text-5xl font-black uppercase text-white">{prox.nome} {prox.sobrenome}</h4>
                    <div className="py-1"><ServiceBadge s={prox.servico} /></div>
                    <button onClick={async () => { if (dAtual.status !== "disponivel") return addToast("Mude seu status para DISPONÍVEL primeiro.", "erro"); await db.collection("fila_paiva").doc(prox.id).update({ status: "atendendo", barbeiroPref: barbeiroLogado.nome, inicioAtendimento: firebase.firestore.Timestamp.now() }); addToast("Cliente Chamado!", "sucesso"); }} className="w-full bg-yellow-600 p-8 rounded-3xl font-black text-xl uppercase text-black hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-900/10">CHAMAR PRÓXIMO</button>
                  </div>
                ) : <p className="text-slate-500 font-bold uppercase text-sm py-10">NÃO HÁ CLIENTES NA FILA GERAL OU PARA VOCÊ</p>}
              </div>
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
                    
                    await db.collection("historico_paiva").add({ 
                        nome: `${checkoutAtivo.nome} ${checkoutAtivo.sobrenome || ""}`.trim(), 
                        whatsapp: checkoutAtivo.whatsapp || "", 
                        barbeiro: barbeiroLogado.nome, 
                        valor: parseFloat(valorInput), 
                        duracaoMinutos: duracaoMinutos, 
                        isFiel: checkoutAtivo.escolhaDireta || false, 
                        dataConclusao: firebase.firestore.Timestamp.now() 
                    }); 
                    await db.collection("fila_paiva").doc(checkoutAtivo.id).delete(); 
                    setCheckoutAtivo(null); 
                    addToast("Atendimento Finalizado!", "sucesso"); 
                }} className="p-6 bg-emerald-600 rounded-3xl font-black uppercase text-xs text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all">CONFIRMAR</button>
              </div>
            </div>
          </div>
        )}
        <ISDSignature />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  // ================= TELA 6: GESTÃO MASTER =================
  if (modo === "gestao_master") {
    const stats = getFinanceStats();
    const advStats = getAdvancedStats();
    
    const sortedProfsMaster = [...profissionais].sort((a, b) => Number(a.cadeira) - Number(b.cadeira));

    const salvarProfissional = async () => {
        if (!novoProf.nome || !novoProf.matricula) return addToast("Preencha Nome e Matrícula", "erro");
        if (profEditando) { await db.collection("profissionais").doc(profEditando).update({ nome: novoProf.nome, matricula: novoProf.matricula, cadeira: novoProf.cadeira || "" }); addToast("Dados atualizados!", "sucesso"); } else { await db.collection("profissionais").add({ ...novoProf, status: "ausente" }); addToast("Barbeiro cadastrado!", "sucesso"); }
        setNovoProf({ nome: "", matricula: "", cadeira: "" }); setProfEditando(null);
    };

    const handleWhatsAppElite = () => {
        const cliente = advStats.trimestreClient;
        if (!cliente || !cliente.phone) {
            return addToast("O cliente vencedor não possui WhatsApp cadastrado.", "erro");
        }
        const brinde = window.prompt(`Qual será o prêmio/brinde para ${cliente.name}?`);
        if (!brinde) return; 
        
        const texto = `Parabéns ${cliente.name}, você é o nosso cliente elite do trimestre (${cliente.meses}), você ganhou de brinde: ${brinde}!`;
        const phoneRaw = cliente.phone.replace(/\D/g, ''); 
        const finalPhone = phoneRaw.length <= 11 ? `55${phoneRaw}` : phoneRaw; 
        
        window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(texto)}`, '_blank');
    };

    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white flex flex-col items-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-6xl space-y-10 mb-20">
          <div className="flex justify-between items-center">
            <button onClick={() => setModo("selecao")} className="bg-slate-900 px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest border border-white/5 hover:bg-white/5 transition-all"><ArrowLeft size={16} /> Sair</button>
            <h3 className="text-2xl font-black uppercase text-yellow-500 italic flex items-center gap-2"><Crown size={24}/> GESTÃO MASTER</h3>
            <div className="flex gap-4">
              <button onClick={limparFilaCompleta} className="bg-red-600/10 text-red-500 border border-red-500/20 px-6 py-4 rounded-3xl font-black uppercase text-[10px] flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"><Eraser size={18} /> ZERAR FILA</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-slate-900/30 rounded-3xl border border-emerald-500/20">💰 Hoje: {formatCurrency(stats.hoje)}</div>
            <div className="p-8 bg-slate-900/30 rounded-3xl border border-blue-500/20">📅 Semana: {formatCurrency(stats.semana)}</div>
            <div className="p-8 bg-slate-900/30 rounded-3xl border border-yellow-500/20">🗓️ Mês: {formatCurrency(stats.mes)}</div>
          </div>

          <GlassContainer className="w-full space-y-6">
            <h3 className="font-black uppercase tracking-tighter text-2xl mb-4">🏆 Destaques & Desempenho</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-gradient-to-br from-yellow-600/20 to-yellow-900/10 rounded-3xl border border-yellow-500/30">
                <h4 className="text-yellow-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Star size={14} /> BARBEIRO ELITE ({advStats.mesPassadoNome})</h4>
                <p className="text-3xl font-black uppercase text-white">{advStats.eliteWinner}</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-600/20 to-blue-900/10 rounded-3xl border border-blue-500/30 relative">
                <h4 className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Users size={14} /> CLIENTE ELITE (Trimestre Passado)</h4>
                <p className="text-3xl font-black uppercase text-white flex justify-between items-center">
                    {advStats.trimestreClient.name}
                    {advStats.trimestreClient.count > 0 && <span className="text-sm font-bold text-slate-400">({advStats.trimestreClient.count} cortes)</span>}
                </p>
                {advStats.trimestreClient.count > 0 && (
                    <button onClick={handleWhatsAppElite} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[10px] tracking-widest p-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <MessageCircle size={16} /> Enviar Prêmio via WhatsApp
                    </button>
                )}
              </div>
            </div>

            <div className="pt-6">
              <h4 className="font-black uppercase text-sm mb-4 text-slate-500 tracking-widest">RANKING DE {advStats.mesAtualNome.toUpperCase()}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-900/40 rounded-3xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Banknote size={14} /> Maior Lucro</span>
                  <span className="text-lg font-black uppercase">{advStats.mesLucro}</span>
                </div>
                <div className="p-5 bg-slate-900/40 rounded-3xl border border-purple-500/20">
                  <span className="text-[10px] text-purple-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Scissors size={14} /> Mais Atend.</span>
                  <span className="text-lg font-black uppercase">{advStats.mesAtend}</span>
                </div>
                <div className="p-5 bg-slate-900/40 rounded-3xl border border-orange-500/20">
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Zap size={14} /> Mais Rápido</span>
                  <span className="text-lg font-black uppercase">{advStats.mesSpeed}</span>
                </div>
                <div className="p-5 bg-slate-900/40 rounded-3xl border border-pink-500/20">
                  <span className="text-[10px] text-pink-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Heart size={14} /> Mais Requisitado</span>
                  <span className="text-lg font-black uppercase">{advStats.mesFiel}</span>
                </div>
              </div>
            </div>
          </GlassContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                {/* FORMULARIO BARBEIRO */}
                <div className="space-y-4 bg-slate-900/20 p-6 rounded-[2rem] border border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-yellow-500 font-black uppercase text-xs">{profEditando ? "EDITAR BARBEIRO" : "NOVO BARBEIRO"}</h4>
                    {profEditando && (<button onClick={() => {setProfEditando(null); setNovoProf({ nome: "", matricula: "", cadeira: "" });}} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold">Cancelar Edição</button>)}
                </div>
                <input type="text" placeholder="NOME" className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 outline-none focus:border-yellow-500" value={novoProf.nome} onChange={(e) => setNovoProf({ ...novoProf, nome: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MATRÍCULA" className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 outline-none focus:border-yellow-500" value={novoProf.matricula} onChange={(e) => setNovoProf({ ...novoProf, matricula: e.target.value })} />
                    <input type="number" placeholder="Nº CADEIRA" className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 outline-none focus:border-yellow-500" value={novoProf.cadeira} onChange={(e) => setNovoProf({ ...novoProf, cadeira: e.target.value })} />
                </div>
                <button onClick={salvarProfissional} className={`w-full p-4 rounded-xl font-black text-black transition-all ${profEditando ? 'bg-blue-500' : 'bg-yellow-600 hover:bg-yellow-500'}`}>{profEditando ? "SALVAR ALTERAÇÕES" : "CADASTRAR BARBEIRO"}</button>
                </div>

                {/* PAINEL DE CONFIGURAÇÃO DE VOZ MELHORADO */}
                <div className="space-y-4 bg-slate-900/20 p-6 rounded-[2rem] border border-white/5">
                    <div className="flex justify-between items-center">
                        <h4 className="text-blue-400 font-black uppercase text-xs flex items-center gap-2"><Mic size={16}/> VOZ DA TV</h4>
                        <button onClick={atualizarVozes} className="flex items-center gap-1 text-[9px] text-blue-500 hover:text-white transition-all bg-blue-500/10 px-2 py-1 rounded-full uppercase font-bold">
                            <RefreshCw size={10} /> Buscar Vozes Online
                        </button>
                    </div>
                    <select
                        className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white appearance-none"
                        value={vozSelecionadaUI}
                        onChange={(e) => setVozSelecionadaUI(e.target.value)}
                    >
                        <option value="">Automática ({vozesDisponiveis.length} vozes encontradas)</option>
                        {vozesDisponiveis.map(v => (
                            <option key={v.name} value={v.name}>{v.name}</option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                window.speechSynthesis.cancel(); 
                                const msg = new SpeechSynthesisUtterance("Atenção, Teste de voz ativado.");
                                msg.lang = 'pt-BR';
                                if (vozSelecionadaUI) {
                                    const vozEncontrada = vozesDisponiveis.find(v => v.name === vozSelecionadaUI);
                                    if (vozEncontrada) msg.voice = vozEncontrada;
                                }
                                window.speechSynthesis.speak(msg);
                            }}
                            className="flex-1 p-3 rounded-xl font-black text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all text-xs"
                        >
                            TESTAR VOZ
                        </button>
                        <button
                            onClick={async () => {
                                await db.collection("configuracoes_paiva").doc("geral").set({ vozTV: vozSelecionadaUI }, { merge: true });
                                addToast("Voz da TV salva!", "sucesso");
                            }}
                            className="flex-1 p-3 rounded-xl font-black text-black bg-emerald-500 hover:bg-emerald-400 transition-all text-xs"
                        >
                            SALVAR NA NUVEM
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black uppercase text-xs">EQUIPE ATIVA ({profissionais.length})</h4>
              <div className="space-y-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedProfsMaster.map((p) => (
                  <div key={p.id} className={`p-4 rounded-2xl flex justify-between items-center border transition-all ${profEditando === p.id ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-900 border-white/5'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-black text-slate-500">{p.cadeira || "-"}</div>
                        <div><span className="font-black uppercase text-sm block">{p.nome}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">PIN: {p.matricula}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { const link = `${window.location.origin}?barbeiro=${p.matricula}`; navigator.clipboard.writeText(link); addToast("Link copiado!", "sucesso"); }} className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Copiar Link"><Link size={16} /></button>
                      <button onClick={() => { setProfEditando(p.id); setNovoProf({ nome: p.nome, matricula: p.matricula, cadeira: p.cadeira || "" }); }} className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => { if(window.confirm(`Deseja demitir/excluir ${p.nome}?`)) { db.collection("profissionais").doc(p.id).delete() } }} className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <GlassContainer className="w-full space-y-6">
            <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all group" onClick={() => setShowHistorico(!showHistorico)}>
              <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none"><Clock size={28} className="text-blue-500" /> Histórico Detalhado <span className="text-[10px] bg-slate-900 px-3 py-1 rounded-full text-slate-500 ml-4 group-hover:text-white transition-all">{showHistorico ? "CLIQUE PARA OCULTAR" : "CLIQUE PARA MOSTRAR"}</span></h3>
              {showHistorico && (<button onClick={(e) => { e.stopPropagation(); limparHistoricoCompleto(); }} className="bg-red-600/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-2xl font-black uppercase text-[9px] flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14} /> Apagar Banco de Dados</button>)}
            </div>
            {showHistorico && (
              <div className="overflow-x-auto pt-6 border-t border-white/5">
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase font-black text-slate-700 border-b border-white/5">
                      <tr>
                          <th className="pb-6 px-4">DATA</th>
                          <th className="pb-6 px-4">Cliente</th>
                          <th className="pb-6 px-4">Contato (Invisível TV)</th>
                          <th className="pb-6 px-4 text-center">Barbeiro</th>
                          <th className="pb-6 px-4 text-center">Valor</th>
                          <th className="pb-6 px-4 text-right">Hora</th>
                        </tr>
                    </thead>
                  <tbody className="text-xs">
                    {historicoAtendimentos.map((h) => (
                      <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                        <td className="py-6 px-4 font-black text-slate-400 font-mono">{h.dataConclusao?.toDate().toLocaleDateString("pt-BR")}</td>
                        <td className="py-6 px-4 font-black uppercase text-slate-300 tracking-tighter text-lg flex items-center gap-2">{h.nome} {h.isFiel && <Heart size={12} className="text-pink-500" title="Cliente escolheu este barbeiro" />}</td>
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
        </div>
        <ISDSignature />
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
        {t.type === "sucesso" ? <Check size={20} className="text-emerald-500" /> : t.type === "erro" ? <AlertCircle size={20} className="text-red-500" /> : <Info size={20} className="text-blue-500" />} {t.message}
      </div>
    ))}
  </div>
);

export default App;