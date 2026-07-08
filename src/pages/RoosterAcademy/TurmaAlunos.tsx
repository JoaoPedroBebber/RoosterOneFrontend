import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, FileDown, Pencil, Plus, Search, Trash2, Users2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Presenca = {
  id: number;
  data: string;
  status: "Presente" | "Ausente" | "Falta justificada";
};

type Aluno = {
  id: number;
  turmaId: number;
  nome: string;
  email: string;
  telefone: string;
  status: "Ativo" | "Inativo";
  presencas: Presenca[];
};

const initialAlunos: Aluno[] = [
  { id: 1, turmaId: 101, nome: "Ana Paula Silva", email: "ana@escola.com", telefone: "(11) 98888-0001", status: "Ativo", presencas: [{ id: 1, data: "2026-06-01", status: "Presente" }, { id: 2, data: "2026-06-08", status: "Presente" }] },
  { id: 2, turmaId: 101, nome: "Bruno Costa", email: "bruno@escola.com", telefone: "(11) 98888-0002", status: "Ativo", presencas: [{ id: 3, data: "2026-06-01", status: "Ausente" }, { id: 4, data: "2026-06-08", status: "Presente" }] },
  { id: 3, turmaId: 101, nome: "Camila Rocha", email: "camila@escola.com", telefone: "(11) 98888-0003", status: "Ativo", presencas: [{ id: 5, data: "2026-06-01", status: "Presente" }, { id: 6, data: "2026-06-08", status: "Falta justificada" }] },
  { id: 4, turmaId: 201, nome: "Diego Martins", email: "diego@escola.com", telefone: "(11) 98888-0004", status: "Ativo", presencas: [{ id: 7, data: "2026-06-01", status: "Presente" }] },
  { id: 5, turmaId: 201, nome: "Elisa Torres", email: "elisa@escola.com", telefone: "(11) 98888-0005", status: "Inativo", presencas: [{ id: 8, data: "2026-06-01", status: "Ausente" }] },
  { id: 6, turmaId: 301, nome: "Fabio Nunes", email: "fabio@escola.com", telefone: "(11) 98888-0006", status: "Ativo", presencas: [{ id: 9, data: "2026-06-01", status: "Presente" }, { id: 10, data: "2026-06-08", status: "Presente" }] },
];

const PAGE_SIZE = 8;

const TurmaAlunos = () => {
  const navigate = useNavigate();
  const { cursoId, turmaId } = useParams();
  const cursoIdNumber = Number(cursoId);
  const turmaIdNumber = Number(turmaId);

  const [alunos, setAlunos] = useState<Aluno[]>(() => initialAlunos.filter((aluno) => aluno.turmaId === turmaIdNumber));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [presenceFilter, setPresenceFilter] = useState("Todos");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", status: "Ativo" as "Ativo" | "Inativo" });
  const [attendanceForm, setAttendanceForm] = useState({ data: new Date().toISOString().slice(0, 10), status: "Presente" as Presenca["status"] });

  useEffect(() => {
    setAlunos(initialAlunos.filter((aluno) => aluno.turmaId === turmaIdNumber));
    setPage(1);
    setQuery("");
    setStatusFilter("Todos");
    setPresenceFilter("Todos");
  }, [turmaIdNumber]);

  const turmaNome = useMemo(() => {
    const map: Record<number, string> = {
      101: "ADM 2026/1",
      102: "ADM 2026/2",
      103: "ADM 2027/1",
      201: "DS 2026/1",
      202: "DS 2026/2",
      203: "DS 2027/1",
      301: "DG 2026/1",
      302: "DG 2026/2",
      303: "DG 2027/1",
    };
    return map[turmaIdNumber] ?? "Turma selecionada";
  }, [turmaIdNumber]);

  const alunosFiltrados = useMemo(() => {
    const term = query.trim().toLowerCase();
    return alunos.filter((aluno) => {
      const matchesText = !term || [aluno.nome, aluno.email, aluno.telefone].some((value) => value.toLowerCase().includes(term));
      const matchesStatus = statusFilter === "Todos" || aluno.status === statusFilter;
      const latestStatus = aluno.presencas.at(-1)?.status ?? "Sem registro";
      const matchesPresence = presenceFilter === "Todos" || latestStatus === presenceFilter;
      return matchesText && matchesStatus && matchesPresence;
    });
  }, [alunos, query, statusFilter, presenceFilter]);

  const totalPages = Math.max(1, Math.ceil(alunosFiltrados.length / PAGE_SIZE));
  const alunosPagina = alunosFiltrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetForm = () => {
    setForm({ nome: "", email: "", telefone: "", status: "Ativo" });
    setEditingId(null);
  };

  const handleOpenDialog = (aluno?: Aluno) => {
    if (aluno) {
      setForm({ nome: aluno.nome, email: aluno.email, telefone: aluno.telefone, status: aluno.status });
      setEditingId(aluno.id);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSaveAluno = () => {
    if (!form.nome.trim() || !form.email.trim()) return;

    const payload: Aluno = {
      id: editingId ?? Date.now(),
      turmaId: turmaIdNumber,
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone.trim() || "Não informado",
      status: form.status,
      presencas: editingId ? alunos.find((aluno) => aluno.id === editingId)?.presencas ?? [] : [],
    };

    if (editingId) {
      setAlunos((prev) => prev.map((aluno) => (aluno.id === editingId ? payload : aluno)));
    } else {
      setAlunos((prev) => [payload, ...prev]);
    }

    setDialogOpen(false);
    resetForm();
    setPage(1);
  };

  const handleDeleteAluno = (id: number) => {
    if (!confirm("Deseja excluir este aluno?")) return;
    setAlunos((prev) => prev.filter((aluno) => aluno.id !== id));
  };

  const handleOpenAttendanceDialog = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setAttendanceForm({ data: new Date().toISOString().slice(0, 10), status: "Presente" });
    setAttendanceDialogOpen(true);
  };

  const handleSaveAttendance = () => {
    if (!selectedAluno) return;

    const newRecord: Presenca = {
      id: Date.now(),
      data: attendanceForm.data,
      status: attendanceForm.status,
    };

    setAlunos((prev) => prev.map((aluno) => (aluno.id === selectedAluno.id ? { ...aluno, presencas: [...aluno.presencas, newRecord] } : aluno)));
    setAttendanceDialogOpen(false);
    setSelectedAluno(null);
  };

  const exportStudentsCsv = () => {
    const headers = ["Nome", "Email", "Telefone", "Status", "Última presença"];
    const rows = alunosFiltrados.map((aluno) => [aluno.nome, aluno.email, aluno.telefone, aluno.status, aluno.presencas.at(-1)?.status ?? "Sem registro"]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `alunos-${turmaNome}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAttendanceCsv = () => {
    const headers = ["Nome", "Data", "Status"];
    const rows = alunosFiltrados.flatMap((aluno) => aluno.presencas.map((presenca) => [aluno.nome, presenca.data, presenca.status]));
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `presenca-${turmaNome}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/academy/cursos/${cursoIdNumber}/turmas`)}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para turmas
          </Button>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <Users2 className="h-3.5 w-3.5" />
              Rooster Academy
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Alunos de {turmaNome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cadastre alunos, filtre a base e gere relatórios de alunos e presença com nomes.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={exportStudentsCsv}>
            <FileDown className="h-4 w-4" />
            Relatório de alunos
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportAttendanceCsv}>
            <FileDown className="h-4 w-4" />
            Relatório de presença
          </Button>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4" />
            Novo aluno
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Filtrar alunos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Buscar por nome, email ou telefone" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label>Status</Label>
                <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Todos">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              <div>
                <Label>Presença</Label>
                <select value={presenceFilter} onChange={(event) => { setPresenceFilter(event.target.value); setPage(1); }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Todos">Todos</option>
                  <option value="Presente">Presente</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Falta justificada">Falta justificada</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Alunos cadastrados</span>
              <span className="font-semibold text-foreground">{alunos.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Exibindo</span>
              <span className="font-semibold text-foreground">{alunosPagina.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Páginas</span>
              <span className="font-semibold text-foreground">{totalPages}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0 md:p-6">
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última presença</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosPagina.map((aluno) => {
                  const ultimaPresenca = aluno.presencas.at(-1);
                  return (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-medium">{aluno.nome}</TableCell>
                      <TableCell>{aluno.email}</TableCell>
                      <TableCell>{aluno.status}</TableCell>
                      <TableCell>{ultimaPresenca ? `${ultimaPresenca.status} • ${ultimaPresenca.data}` : "Sem registro"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenAttendanceDialog(aluno)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Presença
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenDialog(aluno)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteAluno(aluno.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {alunosPagina.map((aluno) => {
              const ultimaPresenca = aluno.presencas.at(-1);
              return (
                <div key={aluno.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{aluno.nome}</div>
                      <div className="text-sm text-muted-foreground">{aluno.email}</div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{aluno.status}</span>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">Última presença: {ultimaPresenca ? `${ultimaPresenca.status} • ${ultimaPresenca.data}` : "Sem registro"}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="outline" className="flex-1" size="sm" onClick={() => handleOpenAttendanceDialog(aluno)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Presença
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm" onClick={() => handleOpenDialog(aluno)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteAluno(aluno.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Mostrando {Math.min(PAGE_SIZE, alunosFiltrados.length)} registros por página.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>Anterior</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages}>Próximo</Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar aluno" : "Novo aluno"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nome do aluno</Label>
                <Input value={form.nome} onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Telefone</Label>
                <Input value={form.telefone} onChange={(event) => setForm((prev) => ({ ...prev, telefone: event.target.value }))} />
              </div>
              <div>
                <Label>Status</Label>
                <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as "Ativo" | "Inativo" }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
            <Button className="w-full" onClick={handleSaveAluno}>{editingId ? "Salvar alterações" : "Criar aluno"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={attendanceDialogOpen} onOpenChange={setAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Histórico de presença</DialogTitle>
          </DialogHeader>
          {selectedAluno ? (
            <div className="space-y-5">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-foreground">{selectedAluno.nome}</div>
                    <div className="text-sm text-muted-foreground">{selectedAluno.email}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Total de registros: {selectedAluno.presencas.length}</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">Presenças</div>
                  <div className="text-xl font-semibold text-foreground">{selectedAluno.presencas.filter((item) => item.status === "Presente").length}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">Ausências</div>
                  <div className="text-xl font-semibold text-foreground">{selectedAluno.presencas.filter((item) => item.status === "Ausente").length}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">Justificadas</div>
                  <div className="text-xl font-semibold text-foreground">{selectedAluno.presencas.filter((item) => item.status === "Falta justificada").length}</div>
                </div>
              </div>

              <div className="rounded-lg border">
                <div className="border-b p-4 font-medium">Histórico</div>
                <div className="max-h-64 overflow-y-auto">
                  {selectedAluno.presencas.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...selectedAluno.presencas].reverse().map((presenca) => (
                          <TableRow key={presenca.id}>
                            <TableCell>{presenca.data}</TableCell>
                            <TableCell>{presenca.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">Nenhum registro de presença encontrado.</div>
                  )}
                </div>
              </div>

            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TurmaAlunos;
