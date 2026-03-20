import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const BuscaTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // when arriving from the dashboard/status card, we may receive a status filter
  // either in the query string (preferred) or in the navigation state. this
  // serves as the "gatilho" for the backend to load only the requested tickets.
  useEffect(() => {
    const statusFromQuery = searchParams.get("status");
    const statusFromState = (location.state as any)?.filter?.status;
    const status = statusFromQuery || statusFromState;

    if (status) {
      setFiltros(prev => ({ ...prev, status }));
      // trigger backend fetch (placeholder)
      // fetch(`/api/tickets?status=${encodeURIComponent(status)}`)
      //   .then(res => res.json())
      //   .then(data => setTickets(data));
    }
  }, [searchParams, location.state]);
  const [tickets, setTickets] = useState([
    { id: 1, titulo: "Problema com login", descricao: "Usuário não consegue fazer login no sistema", status: "Aberto", prioridade: "Alta", usuario: "Ana Souza", data: "2024-03-12", categoria: "Sistema", subcategoria: "Login" },
    { id: 2, titulo: "Computador lento", descricao: "Computador da sala 101 está muito lento", status: "Em atendimento", prioridade: "Média", usuario: "Carlos Silva", data: "2024-03-11", categoria: "Hardware", subcategoria: "Desempenho" },
    { id: 3, titulo: "Impressora sem papel", descricao: "Impressora do laboratório precisa de papel", status: "Encerrado", prioridade: "Baixa", usuario: "Maria Oliveira", data: "2024-03-10", categoria: "Periféricos", subcategoria: "Impressão" },
    { id: 4, titulo: "Sistema travando", descricao: "Aplicação congela durante uso", status: "Aguardando retorno", prioridade: "Alta", usuario: "João Santos", data: "2024-03-09", categoria: "Software", subcategoria: "Desempenho" },
    { id: 5, titulo: "Problema de rede", descricao: "Internet lenta no laboratório", status: "Aguardando terceiro", prioridade: "Média", usuario: "Fernanda Lima", data: "2024-03-08", categoria: "Rede", subcategoria: "Conectividade" },
    { id: 6, titulo: "Atualização pendente", descricao: "Sistema precisa ser atualizado", status: "Atrasado", prioridade: "Baixa", usuario: "Roberto Costa", data: "2024-03-07", categoria: "Sistema", subcategoria: "Atualização" },
  ]);

  const [filtros, setFiltros] = useState({
    id: "",
    titulo: "",
    status: "",
    prioridade: "",
    usuario: "",
    categoria: "",
    subcategoria: "",
    data: ""
  });

  const statusOptions = ["Aberto", "Em atendimento", "Reaberto", "Encerrado", "Aguardando retorno", "Aguardando terceiro", "Aguardando aprovação", "Atrasado"];
  const prioridadeOptions = ["Baixa", "Média", "Alta"];
  const categoriaOptions = ["Sistema", "Hardware", "Software", "Rede", "Periféricos"];
  const subcategoriaOptions = ["Login", "Desempenho", "Conectividade", "Impressão", "Atualização", "Acesso"];

  const ticketsFiltrados = useMemo(() => {
    return tickets.filter(ticket =>
      (filtros.id ? String(ticket.id).includes(filtros.id) : true) &&
      ticket.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()) &&
      ticket.usuario.toLowerCase().includes(filtros.usuario.toLowerCase()) &&
      ticket.categoria.toLowerCase().includes(filtros.categoria.toLowerCase()) &&
      ticket.subcategoria?.toLowerCase().includes(filtros.subcategoria.toLowerCase()) &&
      (filtros.status ? ticket.status === filtros.status : true) &&
      (filtros.prioridade ? ticket.prioridade === filtros.prioridade : true) &&
      (filtros.data ? ticket.data === filtros.data : true)
    );
  }, [tickets, filtros]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto": return "bg-red-100 text-red-800";
      case "Em atendimento": return "bg-yellow-100 text-yellow-800";
      case "Encerrado": return "bg-green-100 text-green-800";
      case "Aguardando retorno": return "bg-blue-100 text-blue-800";
      case "Aguardando terceiro": return "bg-purple-100 text-purple-800";
      case "Atrasado": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportar = () => {
    // Simulação de exportação
    alert("Relatório exportado com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/tickets')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Busca de Tickets</h1>
            <p className="text-muted-foreground">Encontre e visualize tickets específicos</p>
          </div>
        </div>
        <Button onClick={handleExportar} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label>ID</Label>
              <Input
                placeholder="Buscar por ID"
                value={filtros.id}
                onChange={e => setFiltros(prev => ({ ...prev, id: e.target.value }))}
              />
            </div>
            <div>
              <Label>Título</Label>
              <Input
                placeholder="Buscar por título"
                value={filtros.titulo}
                onChange={e => setFiltros(prev => ({ ...prev, titulo: e.target.value }))}
              />
            </div>
            <div>
              <Label>Usuário</Label>
              <Input
                placeholder="Buscar por usuário"
                value={filtros.usuario}
                onChange={e => setFiltros(prev => ({ ...prev, usuario: e.target.value }))}
              />
            </div>
            <div>
              <Label>Prioridade</Label>
              <select
                className="w-full rounded border border-input bg-background text-foreground h-10 px-2"
                value={filtros.prioridade}
                onChange={e => setFiltros(prev => ({ ...prev, prioridade: e.target.value }))}
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
                value={filtros.categoria}
                onChange={e => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
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
                value={filtros.subcategoria}
                onChange={e => setFiltros(prev => ({ ...prev, subcategoria: e.target.value }))}
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
                value={filtros.data}
                onChange={e => setFiltros(prev => ({ ...prev, data: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Resultados ({ticketsFiltrados.length} tickets encontrados)
        </h2>
      </div>

      {/* Grid de Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ticketsFiltrados.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Ticket #{ticket.id}</p>
                  <CardTitle className="text-lg leading-tight">{ticket.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {ticket.descricao}
                  </p>
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Prioridade:</span>
                    <div className="mt-1">
                      <Badge className={getPrioridadeColor(ticket.prioridade)} variant="secondary">
                        {ticket.prioridade}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Categoria:</span>
                    <p className="mt-1">{ticket.categoria}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Usuário:</span>
                    <p className="mt-1">{ticket.usuario}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Data:</span>
                    <p className="mt-1">{ticket.data}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ticketsFiltrados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum ticket encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros para encontrar o que procura.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuscaTicket;
