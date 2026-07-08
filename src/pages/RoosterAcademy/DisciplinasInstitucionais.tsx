import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const initialCategorias: CategoriaDisciplina[] = [
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

const DisciplinasInstitucionais = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<CategoriaDisciplina[]>(initialCategorias);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", descricao: "" });

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((categoria) => {
      const nomeMatch = !filtroNome || categoria.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const descricaoMatch = !filtroDescricao || categoria.descricao.toLowerCase().includes(filtroDescricao.toLowerCase());
      return nomeMatch && descricaoMatch;
    });
  }, [categorias, filtroNome, filtroDescricao]);

  const resetForm = () => {
    setForm({ nome: "", descricao: "" });
    setEditingId(null);
  };

  const handleOpenDialog = (categoria?: CategoriaDisciplina) => {
    if (categoria) {
      setForm({ nome: categoria.nome, descricao: categoria.descricao });
      setEditingId(categoria.id);
    } else {
      resetForm();
    }

    setDialogOpen(true);
  };

  const handleSave = () => {
    const nome = form.nome.trim();
    if (!nome) return;

    if (editingId) {
      setCategorias((prev) => prev.map((categoria) => (categoria.id === editingId ? { ...categoria, nome, descricao: form.descricao.trim() || "Sem descrição" } : categoria)));
    } else {
      const existe = categorias.some((categoria) => categoria.nome.toLowerCase() === nome.toLowerCase());
      if (existe) {
        alert("Essa categoria já existe.");
        return;
      }

      setCategorias((prev) => [...prev, { id: Date.now(), nome, descricao: form.descricao.trim() || "Sem descrição", disciplinas: [] }]);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (!confirm("Deseja remover esta categoria?")) return;
    setCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
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
              <BookOpen className="h-3.5 w-3.5" />
              Rooster Academy
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Classificação de disciplinas</h1>
            <p className="mt-1 text-sm text-muted-foreground">Organize as disciplinas por categorias como Jurídico, Tecnologias e Humanas.</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar categorias
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input placeholder="Ex.: Jurídico" value={filtroNome} onChange={(event) => setFiltroNome(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input placeholder="Ex.: direito" value={filtroDescricao} onChange={(event) => setFiltroDescricao(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categoriasFiltradas.map((categoria) => (
          <Card key={categoria.id} className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>{categoria.nome}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">{categoria.descricao}</p>
              <div className="text-sm text-muted-foreground">{categoria.disciplinas.length} disciplinas cadastradas</div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/academy/disciplinas/${encodeURIComponent(categoria.nome)}/disciplinas`)}>
                  Ver disciplinas
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleOpenDialog(categoria)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(categoria.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categoriasFiltradas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
            <p className="text-muted-foreground">Ajuste os filtros ou crie uma nova classificação.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome da categoria</Label>
              <Input value={form.nome} onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input value={form.descricao} onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))} />
            </div>
            <Button className="w-full" onClick={handleSave}>
              {editingId ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DisciplinasInstitucionais;
