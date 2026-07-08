import { useMemo, useState } from "react";
import { BookOpen, Pencil, Plus, Search, Trash2, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

type Curso = {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: string;
  coordenador: string;
};

const usuariosDisponiveis = [
  "Prof. Marina Souza",
  "Prof. João Brito",
  "Prof. Paula Nery",
  "Prof. Carla Mendes",
  "Prof. Renato Almeida",
  "Prof. Beatriz Lima",
];

const initialCursos: Curso[] = [
  { id: 1, nome: "Administração", descricao: "Curso voltado para gestão e negócios", cargaHoraria: "320h", coordenador: "Prof. Marina Souza" },
  { id: 2, nome: "Desenvolvimento de Sistemas", descricao: "Formação em programação e tecnologia", cargaHoraria: "400h", coordenador: "Prof. João Brito" },
  { id: 3, nome: "Design Gráfico", descricao: "Criatividade e identidade visual", cargaHoraria: "280h", coordenador: "Prof. Paula Nery" },
];

const Cursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>(initialCursos);
  const [filtro, setFiltro] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", descricao: "", cargaHoraria: "", coordenador: "" });
  const [coordenadorBusca, setCoordenadorBusca] = useState("");

  const cursosFiltrados = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return cursos;
    return cursos.filter((curso) =>
      curso.nome.toLowerCase().includes(term) ||
      curso.descricao.toLowerCase().includes(term) ||
      curso.cargaHoraria.toLowerCase().includes(term) ||
      curso.coordenador.toLowerCase().includes(term),
    );
  }, [cursos, filtro]);

  const resetForm = () => {
    setForm({ nome: "", descricao: "", cargaHoraria: "", coordenador: "" });
    setCoordenadorBusca("");
    setEditingId(null);
  };

  const handleOpenDialog = (curso?: Curso) => {
    if (curso) {
      setForm({ nome: curso.nome, descricao: curso.descricao, cargaHoraria: curso.cargaHoraria, coordenador: curso.coordenador });
      setCoordenadorBusca(curso.coordenador);
      setEditingId(curso.id);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    const nome = form.nome.trim();
    if (!nome) return;

    if (editingId) {
      setCursos((prev) => prev.map((curso) => (curso.id === editingId ? { ...curso, nome, descricao: form.descricao.trim() || "Sem descrição", cargaHoraria: form.cargaHoraria.trim() || "0h", coordenador: form.coordenador.trim() || "Não informado" } : curso)));
    } else {
      const existe = cursos.some((curso) => curso.nome.toLowerCase() === nome.toLowerCase());
      if (existe) {
        alert("Curso já existe.");
        return;
      }

      setCursos((prev) => [
        ...prev,
        {
          id: Date.now(),
          nome,
          descricao: form.descricao.trim() || "Sem descrição",
          cargaHoraria: form.cargaHoraria.trim() || "0h",
          coordenador: form.coordenador.trim() || "Não informado",
        },
      ]);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (!confirm("Deseja excluir este curso?")) return;
    setCursos((prev) => prev.filter((curso) => curso.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Rooster Academy
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Cadastro de cursos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie os cursos da instituição com cadastro, edição e exclusão.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Novo curso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar curso" : "Novo curso"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do curso</Label>
                <Input value={form.nome} onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input value={form.descricao} onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))} />
              </div>
              <div>
                <Label>Carga horária</Label>
                <Input value={form.cargaHoraria} onChange={(event) => setForm((prev) => ({ ...prev, cargaHoraria: event.target.value }))} placeholder="Ex.: 320h" />
              </div>
              <div>
                <Label>Coordenador</Label>
                <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={coordenadorBusca}
                    onChange={(event) => {
                      const valor = event.target.value;
                      setCoordenadorBusca(valor);
                      setForm((prev) => ({ ...prev, coordenador: valor }));
                    }}
                    placeholder="Buscar coordenador"
                    className="w-full border-0 bg-transparent p-0 text-sm outline-none"
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleSave}>
                {editingId ? "Salvar alterações" : "Criar curso"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar por nome, descrição ou carga horária" value={filtro} onChange={(event) => setFiltro(event.target.value)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cursosFiltrados.map((curso) => (
          <Card key={curso.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{curso.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{curso.descricao}</p>
              <div className="text-sm font-medium text-foreground">Carga horária: {curso.cargaHoraria}</div>
              <div className="text-sm text-muted-foreground">Coordenador: {curso.coordenador}</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex-1 min-w-[120px]" onClick={() => navigate(`/academy/cursos/${curso.id}/turmas`)}>
                  <Users2 className="mr-2 h-4 w-4" />
                  Turmas
                </Button>
                <Button variant="outline" className="flex-1 min-w-[120px]" onClick={() => handleOpenDialog(curso)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(curso.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
