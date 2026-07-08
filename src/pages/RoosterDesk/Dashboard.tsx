import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dadosMockSistema } from "@/pages/RoosterDesk/dados";
import { Plus, Pencil, Trash2, MessageSquare, AlertCircle, Clock, CheckCircle, User, ExternalLink, AlertTriangle, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { fetchTickets } from "@/lib/api";

const statsColor = {
  aberto: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/30 dark:text-indigo-100",
  atendimento: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/30 dark:text-yellow-100",
  encerrado: "bg-green-100 text-green-800 dark:bg-green-500/30 dark:text-green-100",
  atrasado: "bg-red-100 text-red-800 dark:bg-red-500/30 dark:text-red-100",
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState(dadosMockSistema.tickets);
  const [filtroTitulo, setFiltroTitulo] = useState("");

  useEffect(() => {
    let active = true;

    const loadTickets = async () => {
      try {
        const ticketsApi = await fetchTickets();
        if (active) {
          setTickets(ticketsApi);
        }
      } catch {
        if (active) {
          setTickets(dadosMockSistema.tickets);
        }
      }
    };

    loadTickets();

    return () => {
      active = false;
    };
  }, []);

  const ticketsFiltrados = useMemo(() =>
    tickets.filter((ticket) =>
      ticket.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
    ),
  [tickets, filtroTitulo]);

  const totalTickets = tickets.length;
  const finalizados = tickets.filter((ticket) => ticket.status === "Encerrado").length;
  const atrasados = tickets.filter((ticket) => ticket.status === "Atrasado").length;
  const emAtendimento = tickets.filter((ticket) => ticket.status === "Em atendimento").length;
  const aguardandoRetorno = tickets.filter((ticket) => ticket.status === "Aguardando retorno").length;
  const abertos = tickets.filter((ticket) => ticket.status === "Aberto").length;
  const onTime = finalizados;

  const percentualOnTime = totalTickets ? Number(((onTime / totalTickets) * 100).toFixed(1)) : 0;
  const percentualAtraso = totalTickets ? Number(((atrasados / totalTickets) * 100).toFixed(1)) : 0;

  const slaPieData = [
    { name: "No tempo", value: onTime, color: "#22c55e" },
    { name: "Atrasados", value: atrasados, color: "#ef4444" },
    { name: "Em atendimento", value: emAtendimento, color: "#f59e0b" },
    { name: "Aguardando retorno", value: aguardandoRetorno, color: "#0ea5e9" },
  ];

  const slaLabelMap: Record<string, string> = {
    "No tempo": "Finalizados no tempo",
    "Atrasados": "Atrasados",
    "Em atendimento": "Em atendimento",
    "Aguardando retorno": "Aguardando retorno",
  };

  const tecnicosBarColors = ["#6366f1", "#3b82f6", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const tecnicosData = useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      acc[ticket.tecnico] = (acc[ticket.tecnico] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, atendidos]) => ({ name, atendidos }));
  }, [tickets]);

  const pieColors = ["#22c55e", "#f59e0b", "#ef4444", "#0ea5e9", "#a855f7", "#14b8a6", "#8b5cf6"];

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novoSetor, setNovoSetor] = useState("");

  const criarTicket = () => {
    if (!novoTitulo.trim()) return;
    setTickets((prev) => [
      ...prev,
      {
        id: Date.now(),
        titulo: novoTitulo,
        status: "Aberto",
        prioridade: "Média",
        usuario: "Usuário Atual",
        categoria: novaCategoria || "Geral",
        tecnico: "A definir",
        data: new Date().toLocaleDateString("pt-BR"),
      },
    ]);
    setNovoTitulo("");
    setNovaDescricao("");
    setNovaCategoria("");
    setNovoSetor("");
  };

  const statCards = [
    { label: "Tickets Totais", value: totalTickets, style: "bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-900" },
    { label: "Abertos", value: abertos, style: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/30 dark:text-indigo-100" },
    { label: "Em Atendimento", value: emAtendimento, style: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/40 dark:text-yellow-100" },
    { label: "Aguardando retorno", value: aguardandoRetorno, style: "bg-sky-100 text-sky-800 dark:bg-sky-500/40 dark:text-sky-100" },
    { label: "Encerrados", value: finalizados, style: "bg-green-100 text-green-800 dark:bg-green-500/40 dark:text-green-100" },
    { label: "Atrasados", value: atrasados, style: "bg-red-100 text-red-800 dark:bg-red-500/40 dark:text-red-100" },
    { label: "SLAs cumpridos", value: `${percentualOnTime}%`, style: "bg-slate-800 text-white dark:bg-slate-700 dark:text-white" },
    { label: "% Atrasados", value: `${percentualAtraso}%`, style: "bg-orange-700 text-white dark:bg-orange-600 dark:text-white" },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos tickets e desempenho.</p>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className={`rounded-xl p-4 ${card.style}`}>
            <p className="text-sm opacity-80">{card.label}</p>
            <h2 className="text-2xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Gráficos empilhados */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>SLAs de Atendimento (Distribuição)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slaPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={48}
                    paddingAngle={4}
                    stroke="#0f172a"
                    strokeWidth={2}
                    fillOpacity={0.95}
                    labelLine={true}
                    label={({ name, percent }) => `${slaLabelMap[name as string] || name}: ${(percent * 100).toFixed(1)}%`}
                    onMouseEnter={(_, index) => {}}
                  >
                    {slaPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} tickets`, ""]}
                    wrapperStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: 8, border: "1px solid #334155", color: "#f8fafc" }}
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid #334155", color: "#f8fafc" }}
                    itemStyle={{ color: "#f8fafc" }}
                    labelStyle={{ color: "#f8fafc" }}
                    cursor={{ fill: "rgba(255, 255, 255, 0.25)" }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      color: "#cbd5e1",
                      backgroundColor: "rgba(15, 23, 42, 0.85)",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      padding: "6px",
                    }}
                    iconSize={10}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 p-3 text-sm">
                <strong className="block text-xs text-slate-500 dark:text-slate-300">Total SLA cumprido</strong>
                <span className="text-lg font-semibold">{onTime} tickets</span>
              </div>
              <div className="rounded-lg bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 p-3 text-sm">
                <strong className="block text-xs text-slate-500 dark:text-slate-300">Média por técnico</strong>
                <span className="text-lg font-semibold">{(totalTickets / (tecnicosData.length || 1)).toFixed(1)}</span>
              </div>
              <div className="rounded-lg bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 p-3 text-sm">
                <strong className="block text-xs text-slate-500 dark:text-slate-300">Total atrasados</strong>
                <span className="text-lg font-semibold">{atrasados} tickets</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets por Técnico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tecnicosData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fill: "#cbd5e1" }} />
                  <YAxis allowDecimals={false} stroke="#cbd5e1" tick={{ fill: "#cbd5e1" }} />
                  <Tooltip
                    wrapperStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid #334155", color: "#f8fafc" }}
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid #334155", color: "#f8fafc" }}
                    cursor={{ fill: "rgba(255,255,255,0.08)" }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: "#cbd5e1",
                      backgroundColor: "rgba(15, 23, 42, 0.85)",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      padding: "6px",
                    }}
                    iconSize={10}
                    iconType="circle"
                  />
                  <Bar dataKey="atendidos" radius={[10, 10, 0, 0]} barSize={24}>
                    {tecnicosData.map((entry, index) => (
                      <Cell key={`bar-cell-${entry.name}`} fill={tecnicosBarColors[index % tecnicosBarColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {tecnicosData.sort((a,b)=>b.atendidos-a.atendidos).map((item) => (
                <div key={item.name} className="flex justify-between text-sm" style={{borderBottom: '1px solid #e5e7eb', paddingBottom: '4px'}}>
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.atendidos}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default Dashboard;
