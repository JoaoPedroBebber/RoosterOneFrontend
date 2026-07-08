import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DisciplinaItem = {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: string;
  professorResponsavel: string;
};

type CategoriaDisciplina = {
  id: number;
  nome: string;
  descricao: string;
  disciplinas: DisciplinaItem[];
};

const categoriasMock: CategoriaDisciplina[] = [
  {
    id: 1,
    nome: "Jurídico",
    descricao: "Disciplinas voltadas ao direito, legislação e processos.",
    disciplinas: [
      { id: 1, nome: "Direito Constitucional", descricao: "Princípios fundamentais e organização do Estado.", cargaHoraria: "80h", professorResponsavel: "Marina Souza" },
      { id: 2, nome: "Direito Civil", descricao: "Noções de contratos e responsabilidade civil.", cargaHoraria: "60h", professorResponsavel: "Ricardo Lima" },
    ],
  },
  {
    id: 2,
    nome: "Tecnologias",
    descricao: "Disciplinas de tecnologia, desenvolvimento e dados.",
    disciplinas: [
      { id: 3, nome: "Programação Web", descricao: "Desenvolvimento moderno para interfaces e aplicações web.", cargaHoraria: "100h", professorResponsavel: "João Brito" },
      { id: 4, nome: "Banco de Dados", descricao: "Modelagem e consulta de bancos de dados relacionais.", cargaHoraria: "80h", professorResponsavel: "Luciana Prado" },
    ],
  },
  {
    id: 3,
    nome: "Humanas",
    descricao: "Disciplinas de formação humana, comunicação e comportamento.",
    disciplinas: [
      { id: 5, nome: "Psicologia Social", descricao: "Compreensão de relações sociais e dinâmicas humanas.", cargaHoraria: "40h", professorResponsavel: "Clara Mendes" },
      { id: 6, nome: "Comunicação e Expressão", descricao: "Desenvolvimento da comunicação oral e escrita.", cargaHoraria: "60h", professorResponsavel: "Paula Nery" },
    ],
  },
];

const professoresDisponiveis = [
  "Marina Souza",
  "Ricardo Lima",
  "Clara Mendes",
  "João Brito",
  "Luciana Prado",
  "Paula Nery",
  "Henrique Diniz",
];

const DisciplinasCategoria = () => {
  const navigate = useNavigate();
  const { categoriaNome } = useParams();
  const nomeCategoria = decodeURIComponent(categoriaNome ?? "");
  const [categorias, setCategorias] = useState<CategoriaDisciplina[]>(categoriasMock);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroProfessor, setFiltroProfessor] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", descricao: "", cargaHoraria: "", professorResponsavel: "" });

  const categoriaAtual = categorias.find((categoria) => categoria.nome === nomeCategoria) ?? categorias[0];

  const disciplinasFiltradas = useMemo(() => {
    return (categoriaAtual?.disciplinas ?? []).filter((disciplina) => {
      const nomeMatch = !filtroNome || disciplina.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const professorMatch = !filtroProfessor || disciplina.professorResponsavel.toLowerCase().includes(filtroProfessor.toLowerCase());
      return nomeMatch && professorMatch;
    });
  }, [categoriaAtual, filtroNome, filtroProfessor]);

  const resetForm = () => {
    setForm({ nome: "", descricao: "", cargaHoraria: "", professorResponsavel: "" });
    setEditingId(null);
  };

  const handleOpenDialog = (disciplina?: DisciplinaItem) => {
    if (disciplina) {
      setForm({
        nome: disciplina.nome,
        descricao: disciplina.descricao,
        cargaHoraria: disciplina.cargaHoraria,
        professorResponsavel: disciplina.professorResponsavel,
      });
      setEditingId(disciplina.id);
    } else {
      resetForm();
    }

    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim() || !form.professorResponsavel.trim()) return;

    const payload: DisciplinaItem = {
      id: editingId ?? Date.now(),
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || "Sem descrição cadastrada.",
      cargaHoraria: form.cargaHoraria.trim() || "0h",
      professorResponsavel: form.professorResponsavel.trim(),
    };

    setCategorias((prev) => prev.map((categoria) => {
      if (categoria.nome !== nomeCategoria) return categoria;
      if (editingId) {
        return {
          ...categoria,
          disciplinas: categoria.disciplinas.map((disciplina) => (disciplina.id === editingId ? payload : disciplina)),
        };
      }
      return {
        ...categoria,
        disciplinas: [payload, ...categoria.disciplinas],
      };
    }));

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (!confirm("Deseja remover esta disciplina?")) return;
    setCategorias((prev) => prev.map((categoria) => (categoria.nome !== nomeCategoria ? categoria : { ...categoria, disciplinas: categoria.disciplinas.filter((disciplina) => disciplina.id !== id) })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/disciplinas")}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para categorias
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Disciplinas de {nomeCategoria}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cadastre e gerencie as disciplinas desta classificação.</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Nova disciplina
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar disciplinas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input placeholder="Ex.: Direito" value={filtroNome} onChange={(event) => setFiltroNome(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Professor</Label>
            <Input placeholder="Ex.: Marina" value={filtroProfessor} onChange={(event) => setFiltroProfessor(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {disciplinasFiltradas.map((disciplina) => (
          <Card key={disciplina.id}>
            <CardHeader>
              <CardTitle>{disciplina.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{disciplina.descricao}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{disciplina.cargaHoraria}</span>
                <span>{disciplina.professorResponsavel}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={() => handleOpenDialog(disciplina)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(disciplina.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {disciplinasFiltradas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium">Nenhuma disciplina encontrada</h3>
            <p className="text-muted-foreground">Ajuste os filtros ou cadastre uma nova disciplina.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar disciplina" : "Nova disciplina"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome da disciplina</Label>
              <Input value={form.nome} onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))} rows={4} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Carga horária</Label>
                <Input value={form.cargaHoraria} onChange={(event) => setForm((prev) => ({ ...prev, cargaHoraria: event.target.value }))} placeholder="Ex.: 80h" />
              </div>
              <div>
                <Label>Professor responsável</Label>
                <select
                  value={form.professorResponsavel}
                  onChange={(event) => setForm((prev) => ({ ...prev, professorResponsavel: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione um professor</option>
                  {professoresDisponiveis.map((professor) => (
                    <option key={professor} value={professor}>
                      {professor}
                    </option>
                  ))}
                </select>
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

export default DisciplinasCategoria;
