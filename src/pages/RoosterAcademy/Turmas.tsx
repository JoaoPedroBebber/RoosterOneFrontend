import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Pencil, Plus, Search, Trash2, Users2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Turma = {
  id: number;
  cursoId: number;
  nome: string;
  periodo: string;
  turno: string;
  vagas: number;
  status: string;
  observacao: string;
};

const initialTurmas: Turma[] = [
  { id: 101, cursoId: 1, nome: "ADM 2026/1", periodo: "2026/1", turno: "Manhã", vagas: 32, status: "Ativa", observacao: "Turma inicial do curso" },
  { id: 102, cursoId: 1, nome: "ADM 2026/2", periodo: "2026/2", turno: "Tarde", vagas: 28, status: "Ativa", observacao: "Turma para segunda entrada" },
  { id: 103, cursoId: 1, nome: "ADM 2027/1", periodo: "2027/1", turno: "Noite", vagas: 18, status: "Planejada", observacao: "Pré-matrícula aberta" },
  { id: 201, cursoId: 2, nome: "DS 2026/1", periodo: "2026/1", turno: "Manhã", vagas: 40, status: "Ativa", observacao: "Foco em backend" },
  { id: 202, cursoId: 2, nome: "DS 2026/2", periodo: "2026/2", turno: "Tarde", vagas: 24, status: "Ativa", observacao: "Foco em frontend" },
  { id: 203, cursoId: 2, nome: "DS 2027/1", periodo: "2027/1", turno: "Noite", vagas: 35, status: "Planejada", observacao: "Nova turma para 2027" },
  { id: 301, cursoId: 3, nome: "DG 2026/1", periodo: "2026/1", turno: "Manhã", vagas: 20, status: "Ativa", observacao: "Turma de portfolio" },
  { id: 302, cursoId: 3, nome: "DG 2026/2", periodo: "2026/2", turno: "Tarde", vagas: 22, status: "Ativa", observacao: "Turma com foco em branding" },
  { id: 303, cursoId: 3, nome: "DG 2027/1", periodo: "2027/1", turno: "Noite", vagas: 15, status: "Planejada", observacao: "Turma futura" },
];

const PAGE_SIZE = 8;

const Turmas = () => {
  const navigate = useNavigate();
  const { cursoId } = useParams();
  const cursoIdNumber = Number(cursoId);

  const [turmas, setTurmas] = useState<Turma[]>(() => initialTurmas.filter((turma) => turma.cursoId === cursoIdNumber));
  const [filters, setFilters] = useState({ nome: "", periodo: "", turno: "", vagas: "", status: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ nome: "", periodo: "", turno: "Manhã", vagas: "", status: "Ativa", observacao: "" });

  useEffect(() => {
    setTurmas(initialTurmas.filter((turma) => turma.cursoId === cursoIdNumber));
    setPage(1);
    setFilters({ nome: "", periodo: "", turno: "", vagas: "", status: "" });
  }, [cursoIdNumber]);

  const cursoNome = useMemo(() => {
    const map: Record<number, string> = {
      1: "Administração",
      2: "Desenvolvimento de Sistemas",
      3: "Design Gráfico",
    };
    return map[cursoIdNumber] ?? "Curso selecionado";
  }, [cursoIdNumber]);

  const turmasFiltradas = useMemo(() => {
    return turmas.filter((turma) => {
      const nomeMatch = !filters.nome || turma.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const periodoMatch = !filters.periodo || turma.periodo.toLowerCase().includes(filters.periodo.toLowerCase());
      const turnoMatch = !filters.turno || turma.turno.toLowerCase() === filters.turno.toLowerCase();
      const vagasMatch = !filters.vagas || String(turma.vagas).includes(filters.vagas);
      const statusMatch = !filters.status || turma.status.toLowerCase() === filters.status.toLowerCase();

      return nomeMatch && periodoMatch && turnoMatch && vagasMatch && statusMatch;
    });
  }, [turmas, filters]);

  const totalPages = Math.max(1, Math.ceil(turmasFiltradas.length / PAGE_SIZE));
  const paginaAtual = turmasFiltradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetForm = () => {
    setForm({ nome: "", periodo: "", turno: "Manhã", vagas: "", status: "Ativa", observacao: "" });
    setEditingId(null);
  };

  const handleOpenDialog = (turma?: Turma) => {
    if (turma) {
      setForm({
        nome: turma.nome,
        periodo: turma.periodo,
        turno: turma.turno,
        vagas: String(turma.vagas),
        status: turma.status,
        observacao: turma.observacao,
      });
      setEditingId(turma.id);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim() || !form.periodo.trim()) return;

    const payload = {
      id: editingId ?? Date.now(),
      cursoId: cursoIdNumber,
      nome: form.nome.trim(),
      periodo: form.periodo.trim(),
      turno: form.turno,
      vagas: Number(form.vagas) || 0,
      status: form.status,
      observacao: form.observacao.trim() || "Sem observação",
    };

    if (editingId) {
      setTurmas((prev) => prev.map((turma) => (turma.id === editingId ? payload : turma)));
    } else {
      setTurmas((prev) => [payload, ...prev]);
    }

    setDialogOpen(false);
    resetForm();
    setPage(1);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Deseja remover esta turma?")) return;
    setTurmas((prev) => prev.filter((turma) => turma.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/cursos")}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para cursos
          </Button>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <Users2 className="h-3.5 w-3.5" />
              Rooster Academy
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Turmas de {cursoNome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gerencie turmas, turnos, vagas e status com uma tela preparada para grande volume de dados.</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Nova turma
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Filtrar turmas
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Refine a lista por nome, período, turno, vagas e status.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({ nome: "", periodo: "", turno: "", vagas: "", status: "" });
              setPage(1);
            }}
          >
            Limpar filtros
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              placeholder="Ex.: ADM 2026"
              value={filters.nome}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, nome: event.target.value }));
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Período</Label>
            <Input
              placeholder="Ex.: 2026/1"
              value={filters.periodo}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, periodo: event.target.value }));
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Turno</Label>
            <select
              value={filters.turno}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, turno: event.target.value }));
                setPage(1);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Vagas</Label>
            <Input
              type="number"
              placeholder="Ex.: 32"
              value={filters.vagas}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, vagas: event.target.value }));
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={filters.status}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, status: event.target.value }));
                setPage(1);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="Ativa">Ativa</option>
              <option value="Planejada">Planejada</option>
              <option value="Encerrada">Encerrada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 md:p-6">
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginaAtual.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell className="font-medium">{turma.nome}</TableCell>
                    <TableCell>{turma.periodo}</TableCell>
                    <TableCell>{turma.turno}</TableCell>
                    <TableCell>{turma.vagas}</TableCell>
                    <TableCell>{turma.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/academy/cursos/${cursoIdNumber}/turmas/${turma.id}/alunos`)}>
                          <Users2 className="mr-2 h-4 w-4" />
                          Alunos
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/academy/cursos/${cursoIdNumber}/turmas/${turma.id}/grade`)}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Grade curricular
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(turma)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(turma.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {paginaAtual.map((turma) => (
              <div key={turma.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{turma.nome}</div>
                    <div className="text-sm text-muted-foreground">{turma.periodo} • {turma.turno}</div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{turma.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Vagas: {turma.vagas}</span>
                  <span>{turma.observacao}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" className="flex-1" size="sm" onClick={() => navigate(`/academy/cursos/${cursoIdNumber}/turmas/${turma.id}/alunos`)}>
                    <Users2 className="mr-2 h-4 w-4" />
                    Alunos
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm" onClick={() => navigate(`/academy/cursos/${cursoIdNumber}/turmas/${turma.id}/grade`)}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Grade
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm" onClick={() => handleOpenDialog(turma)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(turma.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Mostrando {Math.min(PAGE_SIZE, turmasFiltradas.length)} itens por página.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages}>
            Próximo
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar turma" : "Nova turma"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nome da turma</Label>
                <Input value={form.nome} onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))} />
              </div>
              <div>
                <Label>Período</Label>
                <Input value={form.periodo} onChange={(event) => setForm((prev) => ({ ...prev, periodo: event.target.value }))} placeholder="Ex.: 2026/1" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Turno</Label>
                <select
                  value={form.turno}
                  onChange={(event) => setForm((prev) => ({ ...prev, turno: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>
              <div>
                <Label>Vagas</Label>
                <Input type="number" value={form.vagas} onChange={(event) => setForm((prev) => ({ ...prev, vagas: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Planejada">Planejada</option>
                  <option value="Encerrada">Encerrada</option>
                </select>
              </div>
              <div>
                <Label>Observação</Label>
                <Input value={form.observacao} onChange={(event) => setForm((prev) => ({ ...prev, observacao: event.target.value }))} />
              </div>
            </div>
            <Button className="w-full" onClick={handleSave}>
              {editingId ? "Salvar alterações" : "Criar turma"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Turmas;
