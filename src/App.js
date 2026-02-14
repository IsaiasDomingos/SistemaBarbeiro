import React, { useState, useEffect, useRef } from "react";
import {
  Tv, Lock, ArrowLeft, LogOut, Scissors, Crown, Trash2, Clock, Users, 
  Eraser, Play, Calendar, X, Zap, Code2, Circle, Check, Info, 
  AlertCircle, DollarSign, Banknote, TrendingUp, Camera, UserPlus
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
  const [showHistorico, setShowHistorico] = useState(false); // NOVO: Controle de visualização da tabela
  const [toasts, setToasts] = useState([]);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    sobrenome: "",
    whatsapp: "",
    servico: "CABELO",
  });
  const [novoProf, setNovoProf] = useState({ nome: "", matricula: "" });

  const audioRef = useRef(null);
  const prevClientesRef = useRef([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(isNaN(num) ? 0 : num);
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

    const somar = (lista) =>
      lista.reduce((acc, h) => acc + (Number(h.valor) || 0), 0);
    const filtrarData = (lista, inicio) =>
      lista.filter((h) => h.dataConclusao?.toMillis() >= inicio.getTime());

    return {
      hoje: somar(filtrarData(registros, hojeStart)),
      semana: somar(filtrarData(registros, semanaStart)),
      mes: somar(filtrarData(registros, mesStart)),
    };
  };

  // NOVO: LÓGICA DE DESTAQUES (MASTER)
  const getAdvancedStats = () => {
    const agora = new Date();

    // 1. Definições de Tempo (Semana Atual)
    const thisWeekStart = new Date(agora);
    thisWeekStart.setDate(agora.getDate() - agora.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    // 2. Definições de Tempo (Mês Passado)
    const thisMonthStart = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const lastMonthStart = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);

    // 3. Definições de Tempo (Trimestre Passado)
    const currentQuarter = Math.floor(agora.getMonth() / 3);
    let lastQ = currentQuarter - 1;
    let yearQ = agora.getFullYear();
    if (lastQ < 0) { lastQ = 3; yearQ--; }
    const lastQuarterStart = new Date(yearQ, lastQ * 3, 1);
    const thisQuarterStart = new Date(agora.getFullYear(), currentQuarter * 3, 1);

    // Arrays isolados
    const histThisWeek = [];
    const histLastMonth = [];
    const histLastQuarter = [];

    historicoAtendimentos.forEach(h => {
      if (!h.dataConclusao) return;
      const time = h.dataConclusao.toMillis();
      if (time >= thisWeekStart.getTime()) histThisWeek.push(h);
      if (time >= lastMonthStart.getTime() && time < thisMonthStart.getTime()) histLastMonth.push(h);
      if (time >= lastQuarterStart.getTime() && time < thisQuarterStart.getTime()) histLastQuarter.push(h);
    });

    const groupByBarber = (arr) => {
      const map = {};
      arr.forEach(h => {
        if (!map[h.barbeiro]) map[h.barbeiro] = { lucro: 0, count: 0, duracaoTotal: 0 };
        map[h.barbeiro].lucro += Number(h.valor) || 0;
        map[h.barbeiro].count += 1;
        if (h.duracaoMinutos) map[h.barbeiro].duracaoTotal += h.duracaoMinutos;
      });
      return map;
    };

    // Calculos da Semana Atual
    const weekMap = groupByBarber(histThisWeek);
    let maxLucroW = { name: "-", val: 0 };
    let maxCountW = { name: "-", val: 0 };
    let maxSpeedW = { name: "-", val: Infinity };

    Object.keys(weekMap).forEach(b => {
      if (weekMap[b].lucro > maxLucroW.val) maxLucroW = { name: b, val: weekMap[b].lucro };
      if (weekMap[b].count > maxCountW.val) maxCountW = { name: b, val: weekMap[b].count };
      const avgSpeed = weekMap[b].duracaoTotal / weekMap[b].count;
      if (weekMap[b].duracaoTotal > 0 && avgSpeed < maxSpeedW.val) maxSpeedW = { name: b, val: avgSpeed };
    });

    // Barbeiro do Mês (Mês Passado) -> Formula: Lucro + (Atendimentos*10) - penalidade de lentidao
    const monthMap = groupByBarber(histLastMonth);
    let monthWinnerName = "Nenhum no período";
    let bestMonthScore = -1;
    Object.keys(monthMap).forEach(b => {
      const d = monthMap[b];
      const avgSpeed = d.duracaoTotal ? (d.duracaoTotal / d.count) : 30; 
      const score = d.lucro + (d.count * 10) - avgSpeed;
      if (score > bestMonthScore) {
        bestMonthScore = score;
        monthWinnerName = b;
      }
    });

    // Cliente VIP (Trimestre Passado)
    const clientMap = {};
    let topClientName = "Nenhum no período";
    let topClientCount = 0;
    histLastQuarter.forEach(h => {
      if(!h.nome) return;
      const n = h.nome.toUpperCase();
      clientMap[n] = (clientMap[n] || 0) + 1;
      if (clientMap[n] > topClientCount) {
        topClientCount = clientMap[n];
        topClientName = n;
      }
    });

    return {
      semanaLucro: maxLucroW.name !== "-" ? `${maxLucroW.name} (${formatCurrency(maxLucroW.val)})` : "-",
      semanaAtend: maxCountW.name !== "-" ? `${maxCountW.name} (${maxCountW.val})` : "-",
      semanaSpeed: maxSpeedW.name !== "-" ? `${maxSpeedW.name} (${Math.floor(maxSpeedW.val)}m/cliente)` : "-",
      mesWinner: monthWinnerName,
      trimestreClient: topClientName !== "NENHUM NO PERÍODO" ? `${topClientName} (${topClientCount} cortes)` : "Nenhum no período"
    };
  };

  useEffect(() => {
    audioRef.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
    );
    const unsubFila = db
      .collection("fila_paiva")
      .orderBy("chegada", "asc")
      .onSnapshot((snap) => {
        const novos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (modo === "painel") {
          const chamado = novos.find((c) => {
            const anterior = prevClientesRef.current.find((p) => p.id === c.id);
            return (
              c.status === "atendendo" &&
              (!anterior || anterior.status === "esperando")
            );
          });
          if (chamado) audioRef.current?.play().catch(() => {});
        }
        prevClientesRef.current = novos;
        setClientesFila(novos);
      });
    const unsubProf = db
      .collection("profissionais")
      .onSnapshot((snap) =>
        setProfissionais(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
    // Expandido para 2000 para garantir que pegue o trimestre e o mes inteiro com segurança para o DONO
    const unsubHist = db
      .collection("historico_paiva")
      .orderBy("dataConclusao", "desc")
      .limit(2000)
      .onSnapshot((snap) =>
        setHistoricoAtendimentos(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
      );
    return () => {
      unsubFila();
      unsubProf();
      unsubHist();
    };
  }, [modo]);

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
    await db.collection("fila_paiva").add({
      ...novoCliente,
      barbeiroPref: barbeiro,
      chegada: firebase.firestore.Timestamp.now(),
      status: "esperando",
    });
    setModo("selecao");
    setNovoCliente({
      nome: "",
      sobrenome: "",
      whatsapp: "",
      servico: "CABELO",
    });
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
      setShowHistorico(false); // Fecha a tabela ao zerar
    } catch (e) {
      addToast("Erro ao limpar.", "erro");
    }
  };

  const ServiceBadge = ({ s }) => (
    <span className="px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest">
      {s}
    </span>
  );

  if (modo === "cliente_registro") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <GlassContainer className="w-full max-w-lg space-y-6">
          <button
            onClick={() => setModo("selecao")}
            className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2"
          >
            <ArrowLeft size={14} /> VOLTAR
          </button>
          <div className="text-center space-y-1">
            <h2 className="text-4xl font-black uppercase tracking-tighter neon-yellow">
              CADASTRO
            </h2>
            <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest neon-blue">
              FILA DE ATENDIMENTO
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="NOME"
              className="w-full p-5 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-yellow-500"
              value={novoCliente.nome}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, nome: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="SOBRENOME"
              className="w-full p-5 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-yellow-500"
              value={novoCliente.sobrenome}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, sobrenome: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="WHATSAPP"
              className="w-full p-5 bg-slate-950 rounded-2xl border border-white/5 text-white font-bold outline-none focus:border-yellow-500"
              value={novoCliente.whatsapp}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, whatsapp: e.target.value })
              }
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-500 text-center block tracking-widest">
              SELECIONE O SERVIÇO
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["CABELO", "BARBA", "SOBRANCELHA", "COMPLETO"].map((s) => (
                <button
                  key={s}
                  onClick={() => setNovoCliente({ ...novoCliente, servico: s })}
                  className={`py-4 rounded-xl font-black text-[10px] border transition-all ${
                    novoCliente.servico === s
                      ? "bg-yellow-500 border-yellow-400 text-slate-950"
                      : "bg-slate-900 border-white/5 text-slate-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            disabled={!novoCliente.nome}
            onClick={() => setModo("barbeiro_choice")}
            className={`w-full p-8 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.3em] transition-all ${
              novoCliente.nome
                ? "bg-yellow-600 text-white shadow-xl shadow-yellow-900/20"
                : "bg-slate-800 text-slate-600"
            }`}
          >
            PROSSEGUIR
          </button>
        </GlassContainer>
        <ISDSignature />
      </div>
    );
  }

  if (modo === "barbeiro_choice") {
    const disponiveis = profissionais.filter(
      (p) => p.status === "disponivel" || p.status === "volto_logo"
    );
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <h2 className="text-5xl font-black mb-12 uppercase italic neon-yellow">
          QUEM VAI TE ATENDER?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <GlassContainer
            onClick={() => cadastrarCliente("Sem Preferência")}
            className="bg-yellow-600/10 border-yellow-500/20 flex flex-col items-center gap-2 cursor-pointer hover:bg-yellow-600 transition-all"
          >
            <Zap size={32} className="text-yellow-500" />
            <span className="font-black text-xl uppercase">
              SEM PREFERÊNCIA
            </span>
          </GlassContainer>
          {disponiveis.map((p) => (
            <GlassContainer
              key={p.id}
              onClick={() => cadastrarCliente(p.nome)}
              className="flex flex-col items-center gap-2 cursor-pointer border-white/10 hover:border-yellow-500 transition-all"
            >
              <Scissors size={24} className="text-yellow-500" />
              <span className="font-black text-xl uppercase">{p.nome}</span>
              <div
                className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                  p.status === "disponivel"
                    ? "text-emerald-500"
                    : "text-orange-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    p.status === "disponivel" ? "bg-emerald-500" : "bg-orange-500"
                  }`}
                />{" "}
                {p.status === "disponivel" ? "DISPONÍVEL" : "VOLTO LOGO"}
              </div>
            </GlassContainer>
          ))}
        </div>
        <button
          onClick={() => setModo("cliente_registro")}
          className="mt-8 text-slate-500 font-black uppercase text-xs"
        >
          VOLTAR
        </button>
        <ISDSignature />
      </div>
    );
  }

  if (modo === "selecao") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 pt-10">
          <h1 className="text-8xl font-black uppercase italic tracking-tighter neon-yellow leading-none mb-4">
            ELITE CARIOCA
          </h1>
          <p className="text-blue-500 font-bold tracking-[0.8em] uppercase text-sm neon-blue">
            SISTEMA EM TESTE (V1.0.0)
          </p>
        </div>
        <button
          onClick={() => setModo("cliente_registro")}
          className="relative glass h-80 w-80 md:h-[450px] md:w-[450px] rounded-[5rem] flex flex-col items-center justify-center gap-8 border-2 border-yellow-500/30 shadow-2xl z-10 hover:scale-105 transition-all"
        >
          <Scissors size={100} className="text-yellow-500" />
          <div className="space-y-2">
            <span className="block font-black text-4xl md:text-6xl uppercase tracking-tighter">
              QUERO CORTAR
            </span>
            <span className="block text-blue-400 font-bold uppercase text-[10px] tracking-[0.4em] opacity-70">
              TOQUE PARA INICIAR
            </span>
          </div>
        </button>
        <div className="relative z-10 w-full flex justify-between items-end">
          <button
            onClick={() => setModo("painel")}
            className="opacity-30 hover:opacity-100 p-4 flex flex-col items-center gap-2"
          >
            <Tv size={24} className="text-slate-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
              PAINEL TV
            </span>
          </button>
          <div className="glass-slim px-6 py-4 rounded-[2rem] border border-white/5 flex items-center gap-4 bg-slate-900/40">
            <Lock size={14} className="text-slate-600" />
            <input
              type="password"
              placeholder="PIN"
              className="w-40 bg-transparent text-center font-black text-xs outline-none text-white focus:text-yellow-500"
              value={acessoInput}
              onChange={(e) => setAcessoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="bg-blue-600 px-8 py-2 rounded-xl font-bold uppercase text-xs text-white"
            >
              OK
            </button>
          </div>
        </div>
        <ISDSignature />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  if (modo === "painel") {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-white flex flex-col">
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <button
            onClick={() => setModo("selecao")}
            className="bg-slate-900 p-4 rounded-3xl text-slate-500"
          >
            <ArrowLeft size={32} />
          </button>
          <div className="text-center">
            <h1 className="text-5xl font-black uppercase italic tracking-widest neon-yellow">
              ELITE CARIOCA
            </h1>
            <p className="text-blue-500 font-bold tracking-[0.6em] text-[10px] uppercase neon-blue">
              TV DASHBOARD
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-xl font-bold text-blue-400 uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
            <span className="text-4xl font-black font-mono">
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
          <GlassContainer className="bg-slate-900/30 border-blue-500/20">
            <h3 className="text-center font-black text-blue-400 uppercase text-xs tracking-widest mb-8 border-b border-white/5 pb-4">
              FILA GERAL
            </h3>
            <div className="space-y-4">
              {clientesFila
                .filter(
                  (c) =>
                    c.barbeiroPref === "Sem Preferência" &&
                    c.status === "esperando"
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className="p-6 bg-slate-800 rounded-3xl text-center"
                  >
                    <span className="text-2xl font-black block">
                      {c.nome.toUpperCase()}
                    </span>
                    <span className="text-blue-400 font-bold block mb-2 text-xs">
                      {c.chegada?.toDate().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <ServiceBadge s={c.servico} />
                  </div>
                ))}
            </div>
          </GlassContainer>
          {profissionais
            .filter((p) => p.status !== "ausente")
            .map((p) => (
              <GlassContainer
                key={p.id}
                className="bg-slate-900/30 border-yellow-500/20"
              >
                <h3 className="text-center font-black text-yellow-400 uppercase text-xs tracking-widest mb-8 border-b border-white/5 pb-4 flex justify-center items-center gap-2">
                  {p.nome.toUpperCase()}{" "}
                  <div
                    className={`w-2 h-2 rounded-full ${
                      p.status === "disponivel"
                        ? "bg-emerald-500"
                        : "bg-orange-500"
                    }`}
                  />
                </h3>
                <div className="space-y-4">
                  {clientesFila
                    .filter(
                      (c) =>
                        c.barbeiroPref === p.nome && c.status === "esperando"
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        className="p-6 bg-yellow-600/20 rounded-3xl text-center border border-yellow-500/30"
                      >
                        <span className="text-2xl font-black block">
                          {c.nome.toUpperCase()}
                        </span>
                        <span className="text-blue-400 font-bold block mb-2 text-xs">
                          {c.chegada?.toDate().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <ServiceBadge s={c.servico} />
                      </div>
                    ))}
                </div>
              </GlassContainer>
            ))}
        </div>
        <ISDSignature />
      </div>
    );
  }

  if (modo === "admin_barbeiro" && barbeiroLogado) {
    const dAtual = profissionais.find((p) => p.id === barbeiroLogado.id) || barbeiroLogado;
    const emAtend = clientesFila.filter((c) => c.barbeiroPref === barbeiroLogado.nome && c.status === "atendendo");
    const statsB = getFinanceStats(barbeiroLogado.nome);
    const prox = clientesFila.sort((a, b) => a.chegada - b.chegada).find((c) => c.status === "esperando" && (c.barbeiroPref === "Sem Preferência" || c.barbeiroPref === barbeiroLogado.nome));

    return (
      <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center justify-center text-white">
        <div className="w-full max-w-5xl space-y-10">
          <div className="flex justify-between items-center border-b border-white/5 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-yellow-600 rounded-3xl flex items-center justify-center">
                <Scissors size={40} />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter neon-yellow">
                {barbeiroLogado.nome}
              </h2>
            </div>
            <button
              onClick={() => {
                setBarbeiroLogado(null);
                setModo("selecao");
              }}
              className="p-5 bg-slate-900 rounded-3xl text-red-500"
            >
              <LogOut size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 rounded-3xl border border-emerald-500/20">
              💰 Hoje: {formatCurrency(statsB.hoje)}
            </div>
            <div className="p-6 bg-slate-900/50 rounded-3xl border border-blue-500/20">
              📅 Semana: {formatCurrency(statsB.semana)}
            </div>
            <div className="p-6 bg-slate-900/50 rounded-3xl border border-yellow-500/20">
              🗓️ Mês: {formatCurrency(statsB.mes)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {["disponivel", "volto_logo", "ausente"].map((st) => (
              <button
                key={st}
                onClick={() =>
                  db
                    .collection("profissionais")
                    .doc(barbeiroLogado.id)
                    .update({ status: st })
                }
                className={`p-6 rounded-[2rem] font-black uppercase text-xs border-2 transition-all ${
                  dAtual.status === st
                    ? "bg-emerald-600 border-emerald-400"
                    : "bg-slate-900 border-white/5 opacity-40"
                }`}
              >
                {st === "volto_logo" ? "VOLTO LOGO" : st.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-12">
            {emAtend.length > 0 ? (
              <div key="estado-atendendo" className="p-10 bg-slate-900 rounded-[3rem] border-2 border-emerald-500/30 text-center space-y-6">
                <h3 className="font-black text-xs text-emerald-500 uppercase tracking-widest">
                  EM ATENDIMENTO
                </h3>
                <h4 className="text-6xl font-black uppercase">
                  {emAtend[0].nome}
                </h4>
                <button
                  onClick={() => {
                    if (dAtual.status !== "disponivel")
                      return addToast("PARA PROSSEGUIR VOCÊ DEVE ESTAR DISPONÍVEL", "erro");
                    setCheckoutAtivo(emAtend[0]);
                  }}
                  className="w-full bg-emerald-600 p-8 rounded-3xl font-black uppercase hover:bg-emerald-500 transition-all"
                >
                  FINALIZAR SERVIÇO
                </button>
              </div>
            ) : (
              <div key="estado-esperando" className="p-10 bg-slate-900/50 rounded-[3rem] border border-white/5 text-center space-y-6">
                <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest flex items-center justify-center gap-3">
                  <Users size={16} /> PRÓXIMO DA FILA
                </h3>
                {prox ? (
                  <div key="cliente-presente" className="space-y-6">
                    <h4 className="text-5xl font-black uppercase text-white">
                      {prox.nome}
                    </h4>
                    <button
                      onClick={async () => {
                        if (dAtual.status !== "disponivel")
                          return addToast("PARA PROSSEGUIR VOCÊ DEVE ESTAR DISPONÍVEL", "erro");
                        await db
                          .collection("fila_paiva")
                          .doc(prox.id)
                          .update({
                            status: "atendendo",
                            barbeiroPref: barbeiroLogado.nome,
                          });
                        addToast("Chamado!", "sucesso");
                      }}
                      className="w-full bg-yellow-600 p-8 rounded-3xl font-black uppercase text-black hover:bg-yellow-500 transition-all"
                    >
                      CHAMAR PRÓXIMO
                    </button>
                  </div>
                ) : (
                  <p key="cliente-ausente" className="text-slate-500 font-bold uppercase text-sm py-10">
                    NÃO HÁ CLIENTES NA FILA
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        {checkoutAtivo && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <div className="glass rounded-[2.5rem] p-10 w-full max-w-md space-y-10 border-emerald-500/30 text-center">
              <h3 className="text-3xl font-black italic neon-yellow">
                VALOR PAGO
              </h3>
              <input
                type="number"
                step="0.01"
                className="w-full bg-slate-950 p-8 rounded-3xl text-5xl font-black text-center text-white outline-none border-2 border-emerald-500/20 focus:border-emerald-500 transition-all"
                value={valorInput}
                onChange={(e) => setValorInput(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCheckoutAtivo(null)}
                  className="p-6 bg-slate-900 rounded-3xl font-black uppercase text-xs text-slate-500"
                >
                  CANCELAR
                </button>
                <button
                  onClick={async () => {
                    if (dAtual.status !== "disponivel")
                      return addToast("PARA PROSSEGUIR VOCÊ DEVE ESTAR DISPONÍVEL", "erro");

                    // INVISIVEL PARA O USUARIO: Registrando duracao para calcular o mais rapido
                    let duracaoMinutos = 15; // default
                    if (checkoutAtivo.chegada) {
                      const ch = checkoutAtivo.chegada.toMillis ? checkoutAtivo.chegada.toMillis() : checkoutAtivo.chegada;
                      duracaoMinutos = Math.max(1, Math.floor((Date.now() - ch) / 60000));
                    }

                    await db.collection("historico_paiva").add({
                      nome: checkoutAtivo.nome + " " + (checkoutAtivo.sobrenome || ""),
                      barbeiro: barbeiroLogado.nome,
                      valor: parseFloat(valorInput),
                      duracaoMinutos: duracaoMinutos, // Novo parametro para as estatisticas
                      dataConclusao: firebase.firestore.Timestamp.now(),
                    });
                    await db.collection("fila_paiva").doc(checkoutAtivo.id).delete();
                    setCheckoutAtivo(null);
                    addToast("Finalizado!", "sucesso");
                  }}
                  className="p-6 bg-emerald-600 rounded-3xl font-black uppercase text-xs text-white shadow-xl shadow-emerald-900/20"
                >
                  CONFIRMAR
                </button>
              </div>
            </div>
          </div>
        )}
        <ISDSignature />
        <EliteToasts toasts={toasts} />
      </div>
    );
  }

  if (modo === "gestao_master") {
    const stats = getFinanceStats();
    const advStats = getAdvancedStats(); // Puxando a nova lógica de destaques

    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white flex flex-col items-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-6xl space-y-10 mb-20">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setModo("selecao")}
              className="bg-slate-900 px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest border border-white/5"
            >
              <ArrowLeft size={16} /> Sair
            </button>
            <h3 className="text-2xl font-black uppercase text-yellow-500 italic">
              GESTÃO MASTER
            </h3>
            <div className="flex gap-4">
              <button
                onClick={limparFilaCompleta}
                className="bg-red-600/10 text-red-500 border border-red-500/20 px-6 py-4 rounded-3xl font-black uppercase text-[10px] flex items-center gap-2"
              >
                <Eraser size={18} /> ZERAR FILA
              </button>
              <div className="p-4 bg-yellow-600 rounded-3xl shadow-xl shadow-yellow-900/20">
                <Crown size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-slate-900/30 rounded-3xl border border-emerald-500/20">
              💰 Hoje: {formatCurrency(stats.hoje)}
            </div>
            <div className="p-8 bg-slate-900/30 rounded-3xl border border-blue-500/20">
              📅 Semana: {formatCurrency(stats.semana)}
            </div>
            <div className="p-8 bg-slate-900/30 rounded-3xl border border-yellow-500/20">
              🗓️ Mês: {formatCurrency(stats.mes)}
            </div>
          </div>

          {/* NOVA SESSÃO: DESTAQUES E DESEMPENHO */}
          <GlassContainer className="w-full space-y-6">
            <h3 className="font-black uppercase tracking-tighter text-2xl mb-4">🏆 Destaques & Desempenho</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-gradient-to-br from-yellow-600/20 to-yellow-900/10 rounded-3xl border border-yellow-500/30">
                <h4 className="text-yellow-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Crown size={14}/> BARBEIRO DO MÊS (Mês Passado)</h4>
                <p className="text-3xl font-black uppercase text-white">{advStats.mesWinner}</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-600/20 to-blue-900/10 rounded-3xl border border-blue-500/30">
                <h4 className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Users size={14}/> CLIENTE VIP (Trimestre Passado)</h4>
                <p className="text-3xl font-black uppercase text-white">{advStats.trimestreClient}</p>
              </div>
            </div>

            <div className="pt-6">
              <h4 className="font-black uppercase text-sm mb-4 text-slate-500 tracking-widest">RANKING DA SEMANA ATUAL</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/40 rounded-3xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Banknote size={14}/> Maior Lucro</span>
                  <span className="text-xl font-black uppercase">{advStats.semanaLucro}</span>
                </div>
                <div className="p-6 bg-slate-900/40 rounded-3xl border border-purple-500/20">
                  <span className="text-[10px] text-purple-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Scissors size={14}/> Mais Atendimentos</span>
                  <span className="text-xl font-black uppercase">{advStats.semanaAtend}</span>
                </div>
                <div className="p-6 bg-slate-900/40 rounded-3xl border border-orange-500/20">
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Zap size={14}/> Mais Rápido</span>
                  <span className="text-xl font-black uppercase">{advStats.semanaSpeed}</span>
                </div>
              </div>
            </div>
          </GlassContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-yellow-500 font-black uppercase text-xs">
                NOVO BARBEIRO
              </h4>
              <input
                type="text"
                placeholder="NOME"
                className="w-full p-4 bg-slate-950 rounded-xl border border-white/5"
                value={novoProf.nome}
                onChange={(e) =>
                  setNovoProf({ ...novoProf, nome: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="MATRÍCULA"
                className="w-full p-4 bg-slate-950 rounded-xl border border-white/5"
                value={novoProf.matricula}
                onChange={(e) =>
                  setNovoProf({ ...novoProf, matricula: e.target.value })
                }
              />
              <button
                onClick={async () => {
                  if (!novoProf.nome || !novoProf.matricula)
                    return addToast("Preencha todos os dados", "erro");
                  await db.collection("profissionais").add({
                    ...novoProf,
                    status: "ausente",
                  });
                  setNovoProf({ nome: "", matricula: "" });
                  addToast("Barbeiro cadastrado!", "sucesso");
                }}
                className="w-full bg-yellow-600 p-4 rounded-xl font-black text-black"
              >
                SALVAR
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="font-black uppercase text-xs">EQUIPE ATIVA</h4>
              <div className="space-y-2 h-[200px] overflow-y-auto">
                {profissionais.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-900 rounded-xl flex justify-between border border-white/5"
                  >
                    <div>
                      <span className="font-black uppercase text-xs block">
                        {p.nome}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">
                        ID: {p.matricula}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        db.collection("profissionais").doc(p.id).delete()
                      }
                      className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* TABELA DE HISTÓRICO - OCULTA POR PADRÃO */}
          <GlassContainer className="w-full space-y-6">
            <div 
              className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-all"
              onClick={() => setShowHistorico(!showHistorico)}
            >
              <h3 className="font-black uppercase tracking-tighter text-2xl flex items-center gap-3 select-none">
                <Clock size={28} className="text-blue-500" /> Histórico Detalhado
                <span className="text-[10px] bg-slate-900 px-3 py-1 rounded-full text-slate-500 ml-4">
                  {showHistorico ? "CLIQUE PARA OCULTAR" : "CLIQUE PARA MOSTRAR"}
                </span>
              </h3>
              {showHistorico && (
                <button
                  onClick={(e) => { e.stopPropagation(); limparHistoricoCompleto(); }}
                  className="bg-red-600/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-2xl font-black uppercase text-[9px] flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={14} /> Limpar Histórico
                </button>
              )}
            </div>

            {showHistorico && (
              <div className="overflow-x-auto pt-6 border-t border-white/5">
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase font-black text-slate-700 border-b border-white/5">
                    <tr>
                      <th className="pb-6 px-4">DATA</th>
                      <th className="pb-6 px-4">Cliente</th>
                      <th className="pb-6 px-4 text-center">Barbeiro</th>
                      <th className="pb-6 px-4 text-center">Valor</th>
                      <th className="pb-6 px-4 text-right">Hora</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {historicoAtendimentos.map((h) => (
                      <tr
                        key={h.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-all"
                      >
                        <td className="py-6 px-4 font-black text-slate-400 font-mono">
                          {h.dataConclusao?.toDate().toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-6 px-4 font-black uppercase text-slate-300 tracking-tighter text-lg">
                          {h.nome}
                        </td>
                        <td className="py-6 px-4 text-center">
                          <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase text-yellow-500">
                            <Scissors size={10} className="inline mr-1" />{" "}
                            {h.barbeiro}
                          </span>
                        </td>
                        <td className="py-6 px-4 text-center font-black text-emerald-400">
                          {formatCurrency(h.valor || 0)}
                        </td>
                        <td className="py-6 px-4 text-right text-slate-500 font-mono">
                          {h.dataConclusao
                            ?.toDate()
                            .toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </td>
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
      <div
        key={t.id}
        className="pointer-events-auto bg-slate-900 border border-white/10 p-6 rounded-2xl flex items-center gap-4 text-white font-black uppercase text-xs shadow-2xl"
      >
        {t.type === "sucesso" ? (
          <Check size={20} className="text-emerald-500" />
        ) : (
          <Info size={20} className="text-blue-500" />
        )}
        {t.message}
      </div>
    ))}
  </div>
);

export default App;