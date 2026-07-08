import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Disciplina = {
  id: number;
  turmaId: number;
  nome: string;
  professor: string;
  cargaHoraria: string;
  periodo: string;
};

const initialDisciplinas: Disciplina[] = [
  { id: 1, turmaId: 101, nome: "Gestão Estratégica", professor: "Marina Souza", cargaHoraria: "80h", periodo: "1º período" },
  { id: 2, turmaId: 101, nome: "Contabilidade Básica", professor: "Ricardo Lima", cargaHoraria: "60h", periodo: "1º período" },
  { id: 3, turmaId: 101, nome: "Marketing", professor: "Clara Mendes", cargaHoraria: "40h", periodo: "2º período" },
  { id: 4, turmaId: 201, nome: "Programação Web", professor: "João Brito", cargaHoraria: "100h", periodo: "1º período" },
  { id: 5, turmaId: 201, nome: "Banco de Dados", professor: "Luciana Prado", cargaHoraria: "80h", periodo: "2º período" },
  { id: 6, turmaId: 301, nome: "Design de Identidade", professor: "Paula Nery", cargaHoraria: "60h", periodo: "1º período" },
  { id: 7, turmaId: 301, nome: "Tipografia", professor: "Henrique Diniz", cargaHoraria: "40h", periodo: "2º período" },
];

const GradeCurricular = () => {
  const navigate = useNavigate();
  const { cursoId, turmaId } = useParams();
  const cursoIdNumber = Number(cursoId);
  const turmaIdNumber = Number(turmaId);

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(() => initialDisciplinas.filter((disciplina) => disciplina.turmaId === turmaIdNumber));
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", professor: "", cargaHoraria: "", periodo: "" });

  useEffect(() => {
    setDisciplinas(initialDisciplinas.filter((disciplina) => disciplina.turmaId === turmaIdNumber));
    setQuery("");
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

  const disciplinasFiltradas = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return disciplinas;
    return disciplinas.filter((disciplina) => [disciplina.nome, disciplina.professor, disciplina.periodo, disciplina.cargaHoraria].some((value) => value.toLowerCase().includes(term)));
  }, [disciplinas, query]);

  const resetForm = () => {
    setForm({ nome: "", professor: "", cargaHoraria: "", periodo: "" });
    setEditingId(null);
  };

  const handleOpenDialog = (disciplina?: Disciplina) => {
    if (disciplina) {
      setForm({ nome: disciplina.nome, professor: disciplina.professor, cargaHoraria: disciplina.cargaHoraria, periodo: disciplina.periodo });
      setEditingId(disciplina.id);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim() || !form.professor.trim()) return;

    const payload: Disciplina = {
      id: editingId ?? Date.now(),
      turmaId: turmaIdNumber,
      nome: form.nome.trim(),
      professor: form.professor.trim(),
      cargaHoraria: form.cargaHoraria.trim() || "0h",
      periodo: form.periodo.trim() || "Sem período",
    };

    if (editingId) {
      setDisciplinas((prev) => prev.map((disciplina) => (disciplina.id === editingId ? payload : disciplina)));
    } else {
      setDisciplinas((prev) => [payload, ...prev]);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (!confirm("Deseja excluir esta disciplina?")) return;
    setDisciplinas((prev) => prev.filter((disciplina) => disciplina.id !== id));
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
              <BookOpen className="h-3.5 w-3.5" />
              Rooster Academy
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Grade curricular de {turmaNome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Consulte as disciplinas cadastradas para esta turma.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar disciplinas
          </CardTitle>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4" />
            Nova disciplina
          </Button>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar por nome, professor, período ou carga horária" value={query} onChange={(event) => setQuery(event.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 md:p-6">
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Carga horária</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplinasFiltradas.map((disciplina) => (
                  <TableRow key={disciplina.id}>
                    <TableCell className="font-medium">{disciplina.nome}</TableCell>
                    <TableCell>{disciplina.professor}</TableCell>
                    <TableCell>{disciplina.periodo}</TableCell>
                    <TableCell>{disciplina.cargaHoraria}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(disciplina)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(disciplina.id)}>
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
            {disciplinasFiltradas.map((disciplina) => (
              <div key={disciplina.id} className="rounded-lg border p-4">
                <div className="font-semibold">{disciplina.nome}</div>
                <div className="mt-1 text-sm text-muted-foreground">{disciplina.professor}</div>
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{disciplina.periodo}</span>
                  <span>{disciplina.cargaHoraria}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm" onClick={() => handleOpenDialog(disciplina)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(disciplina.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar disciplina" : "Nova disciplina"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nome da disciplina</Label>
                <Input value={form.nome} onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))} />
              </div>
              <div>
                <Label>Professor</Label>
                <Input value={form.professor} onChange={(event) => setForm((prev) => ({ ...prev, professor: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Carga horária</Label>
                <Input value={form.cargaHoraria} onChange={(event) => setForm((prev) => ({ ...prev, cargaHoraria: event.target.value }))} placeholder="Ex.: 80h" />
              </div>
              <div>
                <Label>Período</Label>
                <Input value={form.periodo} onChange={(event) => setForm((prev) => ({ ...prev, periodo: event.target.value }))} placeholder="Ex.: 1º período" />
              </div>
            </div>
            <Button className="w-full" onClick={handleSave}>
              {editingId ? "Salvar alterações" : "Criar disciplina"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeCurricular;
