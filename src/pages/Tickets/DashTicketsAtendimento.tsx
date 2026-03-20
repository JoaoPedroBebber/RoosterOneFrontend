import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, MessageSquare, AlertCircle, Clock, CheckCircle, User, ExternalLink, AlertTriangle, List, Search, ShieldCheck } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Tickets = () => {
  const navigate = useNavigate();

  // when a status card is clicked, navigate to the search page passing the
  // chosen status both as a query string and via navigation state. the
  // receiving page can use this "gatilho" to trigger a backend request.
  const handleStatusClick = (status: string) => {
    navigate(
      `/tickets/busca?status=${encodeURIComponent(status)}`,
      {
        state: { filter: { status } },
      }
    );
  };

  const [tickets, setTickets] = useState([
    { id: 1, titulo: "Problema com login", descricao: "Usuário não consegue fazer login no sistema", status: "Aberto", prioridade: "Alta", usuario: "Ana Souza", data: "2024-03-12", categoria: "Sistema", subcategoria: "Login" },
    { id: 2, titulo: "Computador lento", descricao: "Computador da sala 101 está muito lento", status: "Em atendimento", prioridade: "Média", usuario: "Carlos Silva", data: "2024-03-11", categoria: "Hardware", subcategoria: "Desempenho" },
    { id: 3, titulo: "Impressora sem papel", descricao: "Impressora do laboratório precisa de papel", status: "Encerrado", prioridade: "Baixa", usuario: "Maria Oliveira", data: "2024-03-10", categoria: "Periféricos", subcategoria: "Impressão" },
    { id: 4, titulo: "Sistema travando", descricao: "Aplicação congela durante uso", status: "Aguardando retorno", prioridade: "Alta", usuario: "João Santos", data: "2024-03-09", categoria: "Software", subcategoria: "Desempenho" },
    { id: 5, titulo: "Problema de rede", descricao: "Internet lenta no laboratório", status: "Aguardando terceiro", prioridade: "Média", usuario: "Fernanda Lima", data: "2024-03-08", categoria: "Rede", subcategoria: "Conectividade" },
    { id: 6, titulo: "Atualização pendente", descricao: "Sistema precisa ser atualizado", status: "Atrasado", prioridade: "Baixa", usuario: "Roberto Costa", data: "2024-03-07", categoria: "Sistema", subcategoria: "Atualização" },
    { id: 7, titulo: "Pedido de liberação", descricao: "Necessita aprovação do gestor", status: "Aguardando aprovação", prioridade: "Média", usuario: "Fernanda Lima", data: "2024-03-13", categoria: "Sistema", subcategoria: "Acesso" },
    { id: 8, titulo: "Reabertura de chamado", descricao: "Reaberto após revisão", status: "Reaberto", prioridade: "Média", usuario: "Carlos Silva", data: "2024-03-14", categoria: "Software", subcategoria: "Acesso" },
  ]);
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroId, setFiltroId] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaSubcategoria, setNovaSubcategoria] = useState("");
  const [novoAnexos, setNovoAnexos] = useState<File[]>([]);
  const anexosInputRef = useRef<HTMLInputElement>(null);


  const handleCriarTicket = () => {
    if (!novoTitulo.trim()) return;

    const novoTicket = {
      id: Date.now(),
      titulo: novoTitulo,
      descricao: novaDescricao,
      status: "Aberto",
      prioridade: "Média",
      usuario: "Usuário Atual",
      data: new Date().toISOString().split("T")[0],
      categoria: novaCategoria || "Sistema",
      subcategoria: novaSubcategoria || "",
      anexos: novoAnexos.map(a => ({ nome: a.name, tamanho: `${(a.size/1024/1024).toFixed(2)}MB` }))
    };

    setTickets(prev => [novoTicket, ...prev]);
    setNovoTitulo("");
    setNovaDescricao("");
    setNovaCategoria("");
    setNovaSubcategoria("");
    setNovoAnexos([]);
  };

  const statusOptions = ["Aberto", "Em atendimento", "Reaberto", "Aguardando retorno", "Aguardando terceiro", "Aguardando aprovação", "Encerrado", "Atrasado"];
  const prioridadeOptions = ["Baixa", "Média", "Alta"];
  const categoriaOptions = ["Sistema", "Hardware", "Software", "Rede", "Periféricos"];
  const subcategoriaOptions = ["Login", "Desempenho", "Conectividade", "Impressão", "Atualização", "Acesso"];

  const ticketsFiltrados = tickets.filter(ticket =>
    (filtroId ? String(ticket.id).includes(filtroId) : true) &&
    ticket.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
    (filtroUsuario ? ticket.usuario.toLowerCase().includes(filtroUsuario.toLowerCase()) : true) &&
    (filtroStatus ? ticket.status === filtroStatus : true) &&
    (filtroPrioridade ? ticket.prioridade === filtroPrioridade : true) &&
    (filtroCategoria ? ticket.categoria === filtroCategoria : true) &&
    (filtroSubcategoria ? ticket.subcategoria === filtroSubcategoria : true) &&
    (filtroData ? ticket.data === filtroData : true)
  );

  // Estatísticas dos tickets por status
  const estatisticas = useMemo(() => {
    const stats = {
      "Aberto": { count: 0, icon: AlertCircle, color: "text-red-600 dark:text-red-200", bgColor: "bg-red-50 dark:bg-red-900/30" },
      "Em atendimento": { count: 0, icon: Clock, color: "text-yellow-600 dark:text-yellow-200", bgColor: "bg-yellow-50 dark:bg-yellow-900/30" },
      "Encerrado": { count: 0, icon: CheckCircle, color: "text-green-600 dark:text-green-200", bgColor: "bg-green-50 dark:bg-green-900/30" },
      "Aguardando retorno": { count: 0, icon: User, color: "text-blue-600 dark:text-blue-200", bgColor: "bg-blue-50 dark:bg-blue-900/30" },
      "Reaberto": { count: 0, icon: User, color: "text-sky-600 dark:text-sky-200", bgColor: "bg-sky-50 dark:bg-sky-900/30" },
      "Aguardando terceiro": { count: 0, icon: ExternalLink, color: "text-purple-600 dark:text-purple-200", bgColor: "bg-purple-50 dark:bg-purple-900/30" },
      "Aguardando aprovação": { count: 0, icon: ShieldCheck, color: "text-indigo-600 dark:text-indigo-200", bgColor: "bg-indigo-50 dark:bg-indigo-900/30" },
      "Atrasado": { count: 0, icon: AlertTriangle, color: "text-orange-600 dark:text-orange-200", bgColor: "bg-orange-50 dark:bg-orange-900/30" }
    };

    tickets.forEach(ticket => {
      if (stats[ticket.status]) {
        stats[ticket.status].count++;
      }
    });

    return stats;
  }, [tickets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
      case "Em atendimento": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200";
      case "Encerrado": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200";
      case "Aguardando retorno": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
      case "Aguardando terceiro": return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200";
      case "Aguardando aprovação": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200";
      case "Reaberto": return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200";
      case "Atrasado": return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-slate-900/40 dark:text-slate-200";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
      case "Média": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200";
      case "Baixa": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-slate-900/40 dark:text-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Gerenciamento de tickets e suporte técnico</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    className="w-full rounded border border-input bg-background text-foreground h-10 px-2"
                    style={{ maxHeight: '180px', overflowY: 'auto' }}
                    value={novaCategoria}
                    onChange={e => { setNovaCategoria(e.target.value); setNovaSubcategoria(""); }}
                  >
                    <option value="">Selecione</option>
                    {categoriaOptions.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="subcategoria">Subcategoria</Label>
                  <select
                    id="subcategoria"
                    className="w-full rounded border border-input bg-background text-foreground h-10 px-2"
                    style={{ maxHeight: '180px', overflowY: 'auto' }}
                    value={novaSubcategoria}
                    onChange={e => setNovaSubcategoria(e.target.value)}
                    disabled={!novaCategoria}
                  >
                    <option value="">Selecione</option>
                    {subcategoriaOptions.map(subcategoria => (
                      <option key={subcategoria} value={subcategoria}>{subcategoria}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Problema com computador"
                  value={novoTitulo}
                  onChange={e => setNovoTitulo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o problema em detalhes"
                  value={novaDescricao}
                  onChange={e => setNovaDescricao(e.target.value)}
                  className="h-40"
                />
              </div>
              <div>
                <Label>Anexos</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => anexosInputRef.current?.click()}
                    >
                      Adicionar Anexos
                    </Button>
                    <span className="text-xs text-muted-foreground">{novoAnexos.length} arquivo(s)</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    ref={anexosInputRef}
                    className="hidden"
                    onChange={e => {
                      if (e.target.files) {
                        setNovoAnexos(Array.from(e.target.files));
                      }
                    }}
                  />
                  {novoAnexos.length > 0 && (
                    <ul className="mt-2 text-xs list-disc list-inside text-muted-foreground">
                      {novoAnexos.map((file, idx) => (
                        <li key={idx}>{file.name} ({(file.size / (1024*1024)).toFixed(2)} MB)</li>
                      ))}
                    </ul>
                  )}
                </div>
              <Button className="w-full" onClick={handleCriarTicket}>Criar Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meus Tickets */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Meus Tickets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "Aberto",
            "Em atendimento",
            "Reaberto",
            "Aguardando retorno",
            "Aguardando terceiro",
            "Aguardando aprovação",
            "Encerrado",
            "Atrasado",
          ].map((status) => {
            const stat = estatisticas[status];
            if (!stat) return null;
            const IconComponent = stat.icon;
            return (
              <Card
                key={status}
                className={`cursor-pointer hover:shadow-md transition-shadow ${stat.bgColor} min-h-[120px]`}
                onClick={() => handleStatusClick(status)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <IconComponent className={`h-8 w-8 ${stat.color} mb-2`} />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{status}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label>ID</Label>
              <Input
                placeholder="Buscar por ID"
                value={filtroId}
                onChange={e => setFiltroId(e.target.value)}
              />
            </div>
            <div>
              <Label>Título</Label>
              <Input
                placeholder="Buscar por título"
                value={filtroTitulo}
                onChange={e => setFiltroTitulo(e.target.value)}
              />
            </div>
            <div>
              <Label>Usuário</Label>
              <Input
                placeholder="Buscar por usuário"
                value={filtroUsuario}
                onChange={e => setFiltroUsuario(e.target.value)}
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full rounded border border-input bg-background text-foreground h-10 px-2"
                value={filtroStatus}
                onChange={e => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Prioridade</Label>
              <select
                className="w-full rounded border border-input bg-background text-foreground h-10 px-2"
                value={filtroPrioridade}
                onChange={e => setFiltroPrioridade(e.target.value)}
              >
                <option value="">Todas</option>
                {prioridadeOptions.map(prioridade => (
                  <option key={prioridade} value={prioridade}>{prioridade}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Categoria</Label>
              <select
                className="w-full rounded border border-input bg-background text-foreground h-10 px-2"
                value={filtroCategoria}
                onChange={e => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas</option>
                {categoriaOptions.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Subcategoria</Label>
              <select
                className="w-full rounded border border-input bg-background text-foreground h-10 px-2"
                value={filtroSubcategoria}
                onChange={e => setFiltroSubcategoria(e.target.value)}
                disabled={!filtroCategoria}
              >
                <option value="">Todas</option>
                {subcategoriaOptions.map(subcategoria => (
                  <option key={subcategoria} value={subcategoria}>{subcategoria}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={filtroData}
                onChange={e => setFiltroData(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Tickets */}
      <div className="w-full">
        <div
          style={{
            maxHeight: "420px",
            overflowY: "auto",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
          className="bg-card text-card-foreground dark:bg-slate-900 dark:border-slate-700"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketsFiltrados.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-muted-foreground">#{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.titulo}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPrioridadeColor(ticket.prioridade)}>
                      {ticket.prioridade}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.usuario}</TableCell>
                  <TableCell>{ticket.data}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tickets da Equipe */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tickets da Equipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(estatisticas).map(([status, stat]) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={status}
                className={`cursor-pointer hover:shadow-md transition-shadow ${stat.bgColor} min-h-[120px]`}
                onClick={() => navigate('/Tickets/BuscaTicket', { state: { status } })}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <IconComponent className={`h-8 w-8 ${stat.color} mb-2`} />
                  <p className="text-sm font-medium text-muted-foreground mb-1">{status}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tickets;