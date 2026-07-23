export type Patrimonio = {
  id: number;
  nome: string;
  codigo: string;
  localizacao: string;
  descricao: string;
  subcategorias: string[];
};

export type Manutencao = {
  id: number;
  data: string;
  tipo: string;
  descricao: string;
};

export type Consumivel = {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  ultimaAtualizacao: string;
};

export type Ativo = {
  id: number;
  patrimonioId: number;
  nome: string;
  subcategoria: string;
  serial: string;
  status: string;
  localizacao: string;
  observacoes: string;
  manutencoes: Manutencao[];
  consumiveis: Consumivel[];
};

export const initialPatrimonios: Patrimonio[] = [
  {
    id: 1,
    nome: "Infraestrutura",
    codigo: "PAT-001",
    localizacao: "Campus Central",
    descricao: "Prédios, móveis e instalações físicas.",
    subcategorias: ["Móveis", "Instalações", "Rede"],
  },
  {
    id: 2,
    nome: "Laboratórios",
    codigo: "PAT-002",
    localizacao: "Campus Norte",
    descricao: "Equipamentos técnicos e de pesquisa.",
    subcategorias: ["Óptica", "Eletrônica", "Química"],
  },
];

export const initialAtivos: Ativo[] = [
  {
    id: 1,
    patrimonioId: 2,
    nome: "Microscópio Zeiss",
    subcategoria: "Óptica",
    serial: "ZEI-2024-008",
    status: "Ativo",
    localizacao: "Lab 204",
    observacoes: "Revisão semestral programada.",
    manutencoes: [{ id: 1, data: "12/03/2025", tipo: "Preventiva", descricao: "Limpeza e calibração" }],
    consumiveis: [{ id: 1, nome: "Lâminas", quantidade: 50, unidade: "un", ultimaAtualizacao: "10/03/2025" }],
  },
  {
    id: 2,
    patrimonioId: 1,
    nome: "Projetor Epson",
    subcategoria: "Instalações",
    serial: "EPS-3021-110",
    status: "Em manutenção",
    localizacao: "Auditório A",
    observacoes: "Aguardando troca de lâmpada.",
    manutencoes: [{ id: 2, data: "05/04/2025", tipo: "Corretiva", descricao: "Troca de lâmpada e limpeza óptica" }],
    consumiveis: [{ id: 2, nome: "Lâmpada", quantidade: 1, unidade: "un", ultimaAtualizacao: "05/04/2025" }],
  },
];

export const statusOptions = ["Ativo", "Em manutenção", "Inativo", "Aguardando peça"];
