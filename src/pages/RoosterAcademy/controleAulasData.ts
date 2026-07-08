export type Presenca = {
  id: number;
  data: string;
  status: "Presente" | "Ausente" | "Falta justificada";
};

export type ScoreItem = {
  id: number;
  tipo: "Prova" | "Trabalho";
  descricao: string;
  nota: number;
  data: string;
};

export type Aluno = {
  id: number;
  turmaId: number;
  nome: string;
  email: string;
  nota: number;
  presencas: Presenca[];
  notas: ScoreItem[];
};

export type Turma = {
  id: number;
  curso: string;
  nome: string;
  periodo: string;
  turno: string;
  professor: string;
  vagas: number;
  status: string;
};

export type Aula = {
  id: number;
  turmaId: number;
  data: string;
  horario: string;
  topico: string;
};

export type Aviso = {
  id: number;
  turmaId: number;
  mensagem: string;
  enviadoEm: string;
};

export const initialTurmas: Turma[] = [
  { id: 101, curso: "Administração", nome: "ADM 2026/1", periodo: "2026/1", turno: "Manhã", professor: "Marina Souza", vagas: 32, status: "Ativa" },
  { id: 102, curso: "Administração", nome: "ADM 2026/2", periodo: "2026/2", turno: "Tarde", professor: "Ricardo Lima", vagas: 28, status: "Ativa" },
  { id: 201, curso: "Desenvolvimento de Sistemas", nome: "DS 2026/1", periodo: "2026/1", turno: "Noite", professor: "João Brito", vagas: 40, status: "Ativa" },
  { id: 202, curso: "Desenvolvimento de Sistemas", nome: "DS 2026/2", periodo: "2026/2", turno: "Tarde", professor: "Luciana Prado", vagas: 24, status: "Ativa" },
  { id: 301, curso: "Design Gráfico", nome: "DG 2026/1", periodo: "2026/1", turno: "Manhã", professor: "Paula Nery", vagas: 20, status: "Ativa" },
];

export const initialAlunos: Aluno[] = [
  { id: 1, turmaId: 101, nome: "Ana Paula Silva", email: "ana@escola.com", nota: 8.5, presencas: [{ id: 1, data: "2026-06-01", status: "Presente" }, { id: 2, data: "2026-06-08", status: "Presente" }, { id: 3, data: "2026-06-15", status: "Ausente" }], notas: [{ id: 1, tipo: "Prova", descricao: "Prova 1", nota: 8.0, data: "2026-06-02" }, { id: 2, tipo: "Trabalho", descricao: "Trabalho de Fluxo de Caixa", nota: 9.0, data: "2026-06-09" }] },
  { id: 2, turmaId: 101, nome: "Bruno Costa", email: "bruno@escola.com", nota: 7.2, presencas: [{ id: 4, data: "2026-06-01", status: "Presente" }, { id: 5, data: "2026-06-08", status: "Ausente" }, { id: 6, data: "2026-06-15", status: "Presente" }], notas: [{ id: 3, tipo: "Prova", descricao: "Prova 1", nota: 7.0, data: "2026-06-02" }, { id: 4, tipo: "Trabalho", descricao: "Projeto de Gestão", nota: 7.5, data: "2026-06-09" }] },
  { id: 3, turmaId: 101, nome: "Camila Rocha", email: "camila@escola.com", nota: 9.1, presencas: [{ id: 7, data: "2026-06-01", status: "Presente" }, { id: 8, data: "2026-06-08", status: "Presente" }, { id: 9, data: "2026-06-15", status: "Presente" }], notas: [{ id: 5, tipo: "Prova", descricao: "Prova 1", nota: 9.5, data: "2026-06-02" }, { id: 6, tipo: "Trabalho", descricao: "Trabalho Final", nota: 8.8, data: "2026-06-09" }] },
  { id: 4, turmaId: 201, nome: "Diego Martins", email: "diego@escola.com", nota: 6.8, presencas: [{ id: 10, data: "2026-06-02", status: "Presente" }, { id: 11, data: "2026-06-09", status: "Ausente" }], notas: [{ id: 7, tipo: "Prova", descricao: "Prova 1", nota: 6.5, data: "2026-06-03" }, { id: 8, tipo: "Trabalho", descricao: "Laboratório 1", nota: 7.0, data: "2026-06-10" }] },
  { id: 5, turmaId: 201, nome: "Elisa Torres", email: "elisa@escola.com", nota: 8.0, presencas: [{ id: 12, data: "2026-06-02", status: "Presente" }, { id: 13, data: "2026-06-09", status: "Presente" }], notas: [{ id: 9, tipo: "Prova", descricao: "Prova 1", nota: 8.0, data: "2026-06-03" }, { id: 10, tipo: "Trabalho", descricao: "Projeto 1", nota: 8.5, data: "2026-06-10" }] },
  { id: 6, turmaId: 201, nome: "Fabio Nunes", email: "fabio@escola.com", nota: 7.6, presencas: [{ id: 14, data: "2026-06-02", status: "Ausente" }, { id: 15, data: "2026-06-09", status: "Falta justificada" }], notas: [{ id: 11, tipo: "Prova", descricao: "Prova 1", nota: 7.4, data: "2026-06-03" }, { id: 12, tipo: "Trabalho", descricao: "Pesquisa Técnica", nota: 7.8, data: "2026-06-10" }] },
  { id: 7, turmaId: 202, nome: "Gabriela Souza", email: "gabriela@escola.com", nota: 9.3, presencas: [{ id: 16, data: "2026-06-03", status: "Presente" }, { id: 17, data: "2026-06-10", status: "Presente" }], notas: [{ id: 13, tipo: "Prova", descricao: "Prova 1", nota: 9.0, data: "2026-06-04" }, { id: 14, tipo: "Trabalho", descricao: "Design de Interface", nota: 9.6, data: "2026-06-11" }] },
  { id: 8, turmaId: 301, nome: "Helena Dias", email: "helena@escola.com", nota: 8.7, presencas: [{ id: 18, data: "2026-06-04", status: "Presente" }, { id: 19, data: "2026-06-11", status: "Presente" }, { id: 20, data: "2026-06-18", status: "Presente" }], notas: [{ id: 15, tipo: "Prova", descricao: "Prova 1", nota: 8.5, data: "2026-06-05" }, { id: 16, tipo: "Trabalho", descricao: "Portfólio", nota: 8.9, data: "2026-06-12" }] },
];

export const initialAulas: Aula[] = [
  { id: 1, turmaId: 101, data: "2026-07-01", horario: "08:00 - 10:00", topico: "Introdução ao Fluxo de Caixa" },
  { id: 2, turmaId: 101, data: "2026-07-03", horario: "08:00 - 10:00", topico: "Análise de Balanço" },
  { id: 3, turmaId: 201, data: "2026-07-01", horario: "19:00 - 21:00", topico: "Algoritmos e Lógica" },
  { id: 4, turmaId: 201, data: "2026-07-04", horario: "19:00 - 21:00", topico: "Banco de Dados" },
  { id: 5, turmaId: 202, data: "2026-07-02", horario: "19:00 - 21:00", topico: "Front-end React" },
  { id: 6, turmaId: 301, data: "2026-07-01", horario: "08:00 - 10:00", topico: "Tipografia e Layout" },
];

export const initialAvisos: Aviso[] = [
  { id: 1, turmaId: 101, mensagem: "Favor reforçar os conceitos de fluxo de caixa antes da prova.", enviadoEm: "2026-06-12" },
  { id: 2, turmaId: 201, mensagem: "Lembrar os alunos sobre entrega do projeto até sexta-feira.", enviadoEm: "2026-06-14" },
];
