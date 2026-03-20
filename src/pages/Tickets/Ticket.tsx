import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Clock, AlertCircle, CheckCircle, MessageSquare, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Anexo {
  id: number;
  nome: string;
  tamanho: string;
  tipo: string;
}

interface Mensagem {
  id: number;
  autor: "solicitante" | "tecnico";
  nomeAutor: string;
  conteudo: string;
  data: string;
  anexos?: Anexo[];
}

const Ticket = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dados simulados dos tickets (mesmos do BuscaTicket)
  const ticketsData = [
    { id: 1, titulo: "Problema com login", descricao: "Usuário não consegue fazer login no sistema. Recebe mensagem de erro ao tentar acessar.", status: "Em atendimento", prioridade: "Alta", usuario: "Ana Souza", categoria: "Sistema", dataCriacao: "2024-03-12", horaCriacao: "14:30", sla: "24 horas", tempoRestante: "18 horas 45 minutos", setor: "Suporte Técnico" },
    { id: 2, titulo: "Computador lento", descricao: "Computador da sala 101 está muito lento", status: "Em atendimento", prioridade: "Média", usuario: "Carlos Silva", categoria: "Hardware", dataCriacao: "2024-03-11", horaCriacao: "15:00", sla: "48 horas", tempoRestante: "36 horas 30 minutos", setor: "Suporte Técnico" },
    { id: 3, titulo: "Impressora sem papel", descricao: "Impressora do laboratório precisa de papel", status: "Encerrado", prioridade: "Baixa", usuario: "Maria Oliveira", categoria: "Periféricos", dataCriacao: "2024-03-10", horaCriacao: "10:15", sla: "12 horas", tempoRestante: "0 horas", setor: "Suporte Técnico" },
    { id: 4, titulo: "Sistema travando", descricao: "Aplicação congela durante uso", status: "Aguardando retorno", prioridade: "Alta", usuario: "João Santos", categoria: "Software", dataCriacao: "2024-03-09", horaCriacao: "16:45", sla: "24 horas", tempoRestante: "8 horas 15 minutos", setor: "Desenvolvimento" },
    { id: 5, titulo: "Problema de rede", descricao: "Internet lenta no laboratório", status: "Aguardando terceiro", prioridade: "Média", usuario: "Fernanda Lima", categoria: "Rede", dataCriacao: "2024-03-08", horaCriacao: "09:30", sla: "72 horas", tempoRestante: "60 horas 20 minutos", setor: "Infraestrutura" },
    { id: 6, titulo: "Atualização pendente", descricao: "Sistema precisa ser atualizado", status: "Atrasado", prioridade: "Baixa", usuario: "Roberto Costa", categoria: "Sistema", dataCriacao: "2024-03-07", horaCriacao: "11:00", sla: "168 horas", tempoRestante: "-24 horas", setor: "Suporte Técnico" },
  ];

  const ticketId = id ? parseInt(id) : 1;
  const ticketInfo = ticketsData.find(t => t.id === ticketId) || ticketsData[0];

  // Dados simulados do ticket
  const [ticketData, setTicketData] = useState(ticketInfo);

  const [statusSelecionado, setStatusSelecionado] = useState<string>(ticketInfo.status);
  const [usuarioAprovador, setUsuarioAprovador] = useState<string>("");

  const statusOptions = [
    "Aberto",
    "Em atendimento",
    "Encerrado",
    "Aguardando retorno",
    "Aguardando terceiro",
    "Atrasado",
    "Solicitar aprovação",
  ];

  const avaliadores = [
    "Carlos Silva - Suporte",
    "Patrícia Santana - Gerente",
    "Manuela Pereira - Diretor",
  ];

  const handleMudarStatus = (novoStatus: string) => {
    setStatusSelecionado(novoStatus);
    if (novoStatus !== "Solicitar aprovação") {
      setUsuarioAprovador("");
    }
  };

  const handleGravarStatus = () => {
    setTicketData((prev) => ({ ...prev, status: statusSelecionado }));
  };

  const handleAprovar = () => {
    setTicketData((prev) => ({ ...prev, status: "Encerrado" }));
    setStatusSelecionado("Encerrado");
  };

  const handleNaoAprovar = () => {
    setTicketData((prev) => ({ ...prev, status: "Aguardando retorno" }));
    setStatusSelecionado("Aguardando retorno");
  };

  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      autor: "solicitante",
      nomeAutor: "Ana Souza",
      conteudo: "Não consigo fazer login no sistema. Aparece um erro ao tentar acessar minha conta.",
      data: "2024-03-12 14:35",
    },
    {
      id: 2,
      autor: "tecnico",
      nomeAutor: "Carlos Silva - Suporte",
      conteudo: "Olá Ana, obrigado por reportar o problema. Vou verificar sua conta no sistema.",
      data: "2024-03-12 15:10",
    },
    {
      id: 3,
      autor: "tecnico",
      nomeAutor: "Carlos Silva - Suporte",
      conteudo: "Encontrei o problema. Sua senha foi resetada por segurança. Vou enviar um link para redefinir uma nova senha.",
      data: "2024-03-12 15:25",
    },
    {
      id: 4,
      autor: "solicitante",
      nomeAutor: "Ana Souza",
      conteudo: "Recebi o link, obrigada! Consegui criar uma nova senha e agora funciona.",
      data: "2024-03-12 16:00",
    },
    {
      id: 5,
      autor: "tecnico",
      nomeAutor: "Carlos Silva - Suporte",
      conteudo: "Que ótimo! Fico feliz que tenha resolvido. Estou fechando o ticket como resolução.",
      data: "2024-03-12 16:05",
    },
  ]);

  const [novaMensagem, setNovaMensagem] = useState("");
  const [anexosAtuais, setAnexosAtuais] = useState<Anexo[]>([]);

  const handleSelecionarAnexos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const novosAnexos = Array.from(files).map((file, idx) => ({
        id: Date.now() + idx,
        nome: file.name,
        tamanho: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        tipo: file.type || "desconhecido",
      }));
      setAnexosAtuais((prev) => [...prev, ...novosAnexos]);
      e.target.value = "";
    }
  };

 
  const handleEnviarMensagem = () => {
    if (novaMensagem.trim() || anexosAtuais.length > 0) {
      const agora = new Date();
      const dataFormatada = agora.toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const novaMensagemObj: Mensagem = {
        id: mensagens.length + 1,
        autor: "solicitante",
        nomeAutor: "Você",
        conteudo: novaMensagem.trim() || "(Arquivo anexado)",
        data: dataFormatada,
        anexos: anexosAtuais,
      };

      setMensagens([novaMensagemObj, ...mensagens]);
      setNovaMensagem("");
      setAnexosAtuais([]);
    }
  };

  const formatarData = (dataStr: string) => {
    return dataStr.split(" ")[0]; // Retorna apenas a data
  };

  const agruparMensagesPorDia = () => {
    const agrupadas: { [key: string]: Mensagem[] } = {};

    mensagens.forEach((msg) => {
      const data = formatarData(msg.data);
      if (!agrupadas[data]) {
        agrupadas[data] = [];
      }
      agrupadas[data].push(msg);
    });

    return agrupadas;
  };

  const getStatusFieldStyle = (status: string) => {
    switch (status) {
      case "Aberto":
        return "border-red-400 text-red-700";
      case "Em atendimento":
        return "border-yellow-400 text-yellow-700";
      case "Encerrado":
        return "border-green-400 text-green-700";
      case "Aguardando retorno":
        return "border-blue-400 text-blue-700";
      case "Aguardando terceiro":
        return "border-purple-400 text-purple-700";
      case "Atrasado":
        return "border-orange-400 text-orange-700";
      case "Solicitar aprovação":
        return "border-indigo-400 text-indigo-700";
      default:
        return "border-gray-300 text-gray-700";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      case "Baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const mensagensAgrupadas = agruparMensagesPorDia();

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/tickets/busca")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Ticket #{ticketData.id}</h1>
            </div>
            <p className="text-muted-foreground">{ticketData.titulo}</p>
          </div>
        </div>
      </div>

      {/* Informações do Ticket */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card de Status */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status do Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`w-full border rounded h-10 flex items-center justify-center ${getStatusFieldStyle(statusSelecionado)}`}>
              <span className="text-sm font-medium">{statusSelecionado}</span>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Alterar Status</label>
              <Select value={statusSelecionado} onValueChange={handleMudarStatus}>
                <SelectTrigger className="w-full h-10 rounded border border-input bg-white dark:bg-slate-900 text-foreground px-2">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" className="mt-2 w-full" onClick={handleGravarStatus}>
              Gravar
            </Button>
          </CardContent>
        </Card>

        {statusSelecionado === "Solicitar aprovação" && (
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprovar por
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Selecionar aprovador</label>
                <Select value={usuarioAprovador} onValueChange={(valor) => setUsuarioAprovador(valor)}>
                  <SelectTrigger className="w-full h-10 rounded border border-input bg-white dark:bg-slate-900 text-foreground px-2">
                    <SelectValue placeholder="Escolha o aprovador" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900">
                    {avaliadores.map((nome) => (
                      <SelectItem key={nome} value={nome}>
                        {nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded border border-muted p-3 bg-muted/50 dark:bg-muted/30">
                <p className="text-xs text-muted-foreground">Aprovador escolhido</p>
                <p className="font-medium">{usuarioAprovador || "Nenhum aprovador selecionado"}</p>
                <p className="text-xs mt-1">Setor: {usuarioAprovador ? "Suporte Técnico" : "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleAprovar} variant="secondary" className="w-full">
                  Aprovar
                </Button>
                <Button onClick={handleNaoAprovar} className="w-full">
                  Não aprovar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card de Informações */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Categoria</p>
              <p className="font-medium">{ticketData.categoria}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Solicitante</p>
              <p className="font-medium">{ticketData.usuario}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data de Criação</p>
              <p className="font-medium">
                {ticketData.dataCriacao} às {ticketData.horaCriacao}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Prioridade</p>
              <div className="mt-1">
                <Badge className={getPrioridadeColor(ticketData.prioridade)}>
                  {ticketData.prioridade}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de SLA */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              SLA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Tempo de Resolução</p>
              <p className="font-medium text-lg">{ticketData.sla}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tempo Restante</p>
              <p className="font-medium text-yellow-600">{ticketData.tempoRestante}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Setor Responsável</p>
              <p className="font-medium">{ticketData.setor}</p>
            </div>
          </CardContent>
        </Card>

        {/* Card de Descrição */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Descrição do Problema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{ticketData.descricao}</p>
          </CardContent>
        </Card>
      </div>


      {/* Chat de Mensagens */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversas ({mensagens.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(mensagensAgrupadas).map(([data, msgs]) => (
            <div key={data}>
              {/* Separador de dia */}
              <div className="flex items-center justify-center gap-2 my-4">
                <div className="flex-1 border-t border-muted"></div>
                <span className="text-xs text-muted-foreground px-2 bg-muted rounded-full">
                  {new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-1 border-t border-muted"></div>
              </div>

              {/* Mensagens do dia */}
              <div className="space-y-3">
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.autor === "solicitante"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                        msg.autor === "solicitante"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {msg.autor === "tecnico" && (
                        <p className="text-xs font-semibold opacity-75 mb-1">
                          {msg.nomeAutor}
                        </p>
                      )}
                      <p className="text-sm break-words">{msg.conteudo}</p>
                      {msg.anexos && msg.anexos.length > 0 && (
                        <div className="mt-2 space-y-1 border-t pt-2">
                          {msg.anexos.map((anexo) => (
                            <span key={anexo.id} className="text-xs text-neutral-100 block">
                              📎 {anexo.nome} ({anexo.tamanho})
                            </span>
                          ))}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          msg.autor === "solicitante"
                            ? "opacity-70"
                            : "opacity-60"
                        }`}
                      >
                        {msg.data.split(" ")[1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>

        {/* Input de Mensagem */}
        <div className="border-t p-4 space-y-2">
          <Textarea
            placeholder="Digite sua mensagem aqui..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEnviarMensagem();
              }
            }}
            className="resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div>
              <input
                id="anexar-entrada"
                type="file"
                className="hidden"
                multiple
                onChange={handleSelecionarAnexos}
              />
              <label htmlFor="anexar-entrada" className="text-sm text-blue-600 cursor-pointer hover:underline">
                Adicionar anexos (Máximo 5MB)
              </label>
              {anexosAtuais.length > 0 && (
                <span className="text-xs text-muted-foreground ml-2">({anexosAtuais.length} arquivo(s) selecionado(s))</span>
              )}
            </div>
            <Button
              onClick={handleEnviarMensagem}
              className="w-full md:w-auto"
              disabled={!novaMensagem.trim() && anexosAtuais.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Ticket;
