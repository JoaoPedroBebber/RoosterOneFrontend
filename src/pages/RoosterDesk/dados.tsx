import { useMemo } from "react";

// Tipos dos principais campos do sistema
export interface Usuario {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  tipo: "Admin" | "Professor" | "Coordenação" | "Administrativo" | "Técnico";
  setor: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  subcategorias: string[];
}

export interface Setor {
  id: number;
  nome: string;
  descricao: string;
}

export interface SetorDetalhes {
  nome: string;
  descricao: string;
  usuarios: string[];
  coordenadores: string[];
  subsetores: string[];
}

export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  status: "Aberto" | "Em atendimento" | "Encerrado" | "Aguardando retorno" | "Aguardando terceiro" | "Atrasado" | "Solicitar aprovação";
  prioridade: "Alta" | "Média" | "Baixa";
  usuario: string;
  categoria: string;
  tecnico: string;
  dataCriacao: string;
  data?: string;
  horaCriacao?: string;
  sla: string;
  tempoRestante: string;
  setor: string;
}

export interface MensagemTicket {
  id: number;
  autor: "solicitante" | "tecnico";
  nomeAutor: string;
  conteudo: string;
  data: string;
  anexos?: { id: number; nome: string; tamanho: string; tipo: string }[];
}

export interface ConfiguracaoTema {
  value: "light" | "dark" | "system";
  label: string;
  description: string;
}

// Legenda/descrição de cada conjunto de dados
export const dadosSistemaLegenda = {
  usuarios: "Dados usados em src/pages/Usuarios.tsx (filtros, edição, exclusão, CSV)",
  categorias: "Dados usados em src/pages/Categorias/Categorias.tsx + Subcategorias.tsx",
  setores: "Dados usados em src/pages/Setores/Setores.tsx para gestão de setores e integração com rotas de usuários/funções",
  setorDetalhes: "Dados usados em src/pages/Setores/UsuarioSetor.tsx para vincular usuários e coordenadores",
  funcoes: "Dados usados em src/pages/Setores/Funcoes.tsx e UsuarioFuncao.tsx para links de categoria/subcategoria",
  tickets: "Dados usados em src/pages/Dashboard.tsx, src/pages/Tickets/BuscaTicket.tsx e src/pages/Tickets/Ticket.tsx",
  ticketMensagens: "Mensagens e anexos dentro de um ticket (src/pages/Tickets/Ticket.tsx)",
  configuracoes: "Opções de tema em src/pages/Configuracoes.tsx",
};

// Mock completo do sistema
export const dadosMockSistema = {
  usuarios: [
    { id: 1, nome: "Ana Caralho", telefone: "(41) 99999-1111", email: "ana@example.com", tipo: "Admin", setor: "TI" },
    { id: 2, nome: "Carlos Silva", telefone: "(41) 98888-2222", email: "carlos@example.com", tipo: "Professor", setor: "Ensino" },
    { id: 3, nome: "Maria Oliveira", telefone: "(41) 97777-3333", email: "maria@example.com", tipo: "Coordenação", setor: "Administração" },
    { id: 4, nome: "João Santos", telefone: "(41) 96666-4444", email: "joao@example.com", tipo: "Administrativo", setor: "Financeiro" },
    { id: 5, nome: "Fernanda Lima", telefone: "(41) 95555-5555", email: "fernanda@example.com", tipo: "Professor", setor: "Ensino" },
    { id: 6, nome: "Roberto Costa", telefone: "(41) 94444-6666", email: "roberto@example.com", tipo: "Técnico", setor: "Suporte Técnico" },
  ] as Usuario[],
  categorias: [
    { id: 1, nome: "Infraestrutura", descricao: "Atualizações de estrutura e instalações físicas", subcategorias: ["Reforma", "Instalação", "Manutenção"] },
    { id: 2, nome: "Software", descricao: "Erros e melhorias em sistemas e aplicações", subcategorias: ["Bug", "Nova funcionalidade", "Atualização"] },
    { id: 3, nome: "Hardware", descricao: "Atendimento em equipamentos, computadores e periféricos", subcategorias: ["Substituição", "Reparo", "Configuração"] },
    { id: 4, nome: "Rede", descricao: "Conectividade, VPN e segurança de rede", subcategorias: ["Conectividade", "VPN", "Segurança"] },
  ] as Categoria[],
  setores: [
    { id: 1, nome: "TI", descricao: "Infraestrutura e sistemas" },
    { id: 2, nome: "Financeiro", descricao: "Contas a pagar e receber" },
    { id: 3, nome: "Marketing", descricao: "Vídeos e imagens" },
  ] as Setor[],
  setorDetalhes: [
    { nome: "TI", descricao: "Infraestrutura e sistemas", usuarios: ["Ana Souza", "Carlos Silva"], coordenadores: ["Caio Almeida"], subsetores: ["Infra", "Sistema"] },
    { nome: "Financeiro", descricao: "Contas a pagar e receber", usuarios: ["João Santos", "Maria Oliveira"], coordenadores: ["Bruna Moraes"], subsetores: ["Contas a pagar", "Contas a receber"] },
    { nome: "Marketing", descricao: "Vídeos e imagens", usuarios: ["Fernanda Lima", "Roberto Costa"], coordenadores: ["Lara Castro"], subsetores: ["Vídeos", "Imagens"] },
  ] as SetorDetalhes[],
  funcoes: [
    { categoria: "Infraestrutura", subcategoria: "Reforma" },
    { categoria: "Infraestrutura", subcategoria: "Instalação" },
    { categoria: "Infraestrutura", subcategoria: "Manutenção" },
    { categoria: "Software", subcategoria: "Bug" },
    { categoria: "Software", subcategoria: "Nova funcionalidade" },
    { categoria: "Software", subcategoria: "Atualização" },
    { categoria: "Hardware", subcategoria: "Substituição" },
    { categoria: "Hardware", subcategoria: "Reparo" },
    { categoria: "Hardware", subcategoria: "Configuração" },
    { categoria: "Rede", subcategoria: "Conectividade" },
    { categoria: "Rede", subcategoria: "VPN" },
    { categoria: "Rede", subcategoria: "Segurança" },
  ],
  tickets: [
    { id: 1, titulo: "Problema com login", descricao: "Usuário não consegue fazer login no sistema.", status: "Em atendimento", prioridade: "Alta", usuario: "Ana Souza", categoria: "Sistema", tecnico: "Carlos Silva", dataCriacao: "2024-03-12", data: "2024-03-12", horaCriacao: "14:30", sla: "24 horas", tempoRestante: "18 horas 45 minutos", setor: "Suporte Técnico" },
    { id: 2, titulo: "Computador lento", descricao: "Computador da sala 101 está muito lento", status: "Em atendimento", prioridade: "Média", usuario: "Carlos Silva", categoria: "Hardware", tecnico: "Roberto Costa", dataCriacao: "2024-03-11", data: "2024-03-11", horaCriacao: "15:00", sla: "48 horas", tempoRestante: "36 horas 30 minutos", setor: "Suporte Técnico" },
    { id: 3, titulo: "Impressora sem papel", descricao: "Impressora do laboratório precisa de papel", status: "Encerrado", prioridade: "Baixa", usuario: "Maria Oliveira", categoria: "Periféricos", tecnico: "João Santos", dataCriacao: "2024-03-10", data: "2024-03-10", horaCriacao: "10:15", sla: "12 horas", tempoRestante: "0 horas", setor: "Suporte Técnico" },
    { id: 4, titulo: "Sistema travando", descricao: "Aplicação congela durante uso", status: "Aguardando retorno", prioridade: "Alta", usuario: "João Santos", categoria: "Software", tecnico: "Carlos Silva", dataCriacao: "2024-03-09", data: "2024-03-09", horaCriacao: "16:45", sla: "24 horas", tempoRestante: "8 horas 15 minutos", setor: "Desenvolvimento" },
    { id: 5, titulo: "Problema de rede", descricao: "Internet lenta no laboratório", status: "Aguardando terceiro", prioridade: "Média", usuario: "Fernanda Lima", categoria: "Rede", tecnico: "Roberto Costa", dataCriacao: "2024-03-08", data: "2024-03-08", horaCriacao: "09:30", sla: "72 horas", tempoRestante: "60 horas 20 minutos", setor: "Infraestrutura" },
    { id: 6, titulo: "Atualização pendente", descricao: "Sistema precisa ser atualizado", status: "Atrasado", prioridade: "Baixa", usuario: "Roberto Costa", categoria: "Sistema", tecnico: "Carlos Silva", dataCriacao: "2024-03-07", data: "2024-03-07", horaCriacao: "11:00", sla: "168 horas", tempoRestante: "-24 horas", setor: "Suporte Técnico" },
    { id: 7, titulo: "Manutenção no servidor", descricao: "Servidor de arquivos precisa de intervenção preventiva.", status: "Aberto", prioridade: "Alta", usuario: "Patrícia Santos", categoria: "Infraestrutura", tecnico: "Roberto Costa", dataCriacao: "2024-03-06", data: "2024-03-06", horaCriacao: "08:20", sla: "12 horas", tempoRestante: "11 horas", setor: "Infraestrutura" },
    { id: 8, titulo: "Relatório de vendas não abre", descricao: "Relatório está apresentando erro de carregamento.", status: "Aberto", prioridade: "Média", usuario: "Bruna Mendes", categoria: "Software", tecnico: "Carlos Silva", dataCriacao: "2024-03-05", data: "2024-03-05", horaCriacao: "13:10", sla: "24 horas", tempoRestante: "16 horas", setor: "Desenvolvimento" },
    { id: 9, titulo: "Notebook sem conexão", descricao: "Notebook da recepção não conecta na rede Wi-Fi.", status: "Aguardando retorno", prioridade: "Alta", usuario: "Luciana Prado", categoria: "Rede", tecnico: "Roberto Costa", dataCriacao: "2024-03-04", data: "2024-03-04", horaCriacao: "17:40", sla: "18 horas", tempoRestante: "7 horas", setor: "Infraestrutura" },
    { id: 10, titulo: "Teclado sem resposta", descricao: "Teclado do laboratório de informática não funciona.", status: "Encerrado", prioridade: "Baixa", usuario: "Eduardo Rocha", categoria: "Hardware", tecnico: "João Santos", dataCriacao: "2024-03-03", data: "2024-03-03", horaCriacao: "09:50", sla: "12 horas", tempoRestante: "0 horas", setor: "Suporte Técnico" },
    { id: 11, titulo: "Câmera não grava", descricao: "Câmera do auditório não grava vídeos corretamente.", status: "Aguardando terceiro", prioridade: "Média", usuario: "Marina Souza", categoria: "Periféricos", tecnico: "Roberto Costa", dataCriacao: "2024-03-02", data: "2024-03-02", horaCriacao: "11:30", sla: "48 horas", tempoRestante: "29 horas", setor: "Suporte Técnico" },
    { id: 12, titulo: "Atualização do painel administrativo", descricao: "Pedido de atualização em fluxo administrativo.", status: "Encerrado", prioridade: "Baixa", usuario: "Henrique Alves", categoria: "Infraestrutura", tecnico: "Carlos Silva", dataCriacao: "2024-03-01", data: "2024-03-01", horaCriacao: "10:05", sla: "24 horas", tempoRestante: "0 horas", setor: "Administração" },
  ] as Ticket[],
  ticketMensagens: [
    { id: 1, autor: "solicitante", nomeAutor: "Ana Souza", conteudo: "Não consigo fazer login no sistema.", data: "2024-03-12 14:35" },
    { id: 2, autor: "tecnico", nomeAutor: "Carlos Silva - Suporte", conteudo: "Olá, vou verificar seu acesso.", data: "2024-03-12 15:10" },
    { id: 3, autor: "tecnico", nomeAutor: "Carlos Silva - Suporte", conteudo: "Senha resetada. Por favor teste novamente.", data: "2024-03-12 15:25" },
  ] as MensagemTicket[],
  configuracoes: {
    temaSelecionado: "system",
    temasDisponiveis: [
      { value: "light", label: "Claro", description: "Tema claro para uso diurno" },
      { value: "dark", label: "Escuro", description: "Tema escuro para uso noturno" },
      { value: "system", label: "Sistema", description: "Usa a configuração do sistema" },
    ] as ConfiguracaoTema[],
  },
  opcoes: {
    statusTicket: ["Aberto", "Em atendimento", "Encerrado", "Aguardando retorno", "Aguardando terceiro", "Atrasado", "Solicitar aprovação"],
    prioridades: ["Alta", "Média", "Baixa"],
    categoriasSistema: ["Infraestrutura", "Software", "Hardware", "Rede", "Sistema", "Periféricos"],
  },
};

const Dados = () => {
  const estatisticas = useMemo(() => {
    const totalUsuarios = dadosMockSistema.usuarios.length;
    const totalTickets = dadosMockSistema.tickets.length;
    const ticketsPorStatus = dadosMockSistema.tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalUsuarios, totalTickets, ticketsPorStatus };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dados Mocados do Sistema</h1>
      <p className="text-muted-foreground">Este arquivo concentra os mocks de todas as telas e campos do sistema.</p>

      <section>
        <h2 className="text-2xl font-semibold">Legenda</h2>
        <ul className="list-disc pl-5">
          {Object.entries(dadosSistemaLegenda).map(([key, label]) => (
            <li key={key}>
              <strong>{key}</strong>: {label}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Visão Geral</h2>
        <ul className="list-disc pl-5">
          <li>Total de usuários: {estatisticas.totalUsuarios}</li>
          <li>Total de tickets: {estatisticas.totalTickets}</li>
          <li>Tickets por status: {JSON.stringify(estatisticas.ticketsPorStatus)}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Exportar JSON</h2>
        <pre className="whitespace-pre-wrap bg-slate-100 p-4 rounded border border-slate-200" style={{ maxHeight: "320px", overflowY: "auto" }}>
          {JSON.stringify(dadosMockSistema, null, 2)}
        </pre>
      </section>
    </div>
  );
};

export default Dados;
