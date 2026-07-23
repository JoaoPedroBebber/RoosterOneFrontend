import { useMemo, useState } from "react";
import { ArrowLeft, Edit3, Layers, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialPatrimonios, type Patrimonio } from "./assetsData";

type SubcategoriaItem = {
  id: number;
  nome: string;
  patrimonioId: number;
};

const SubcategoriasPage = () => {
  const navigate = useNavigate();
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>(initialPatrimonios);
  const [selectedPatrimonioId, setSelectedPatrimonioId] = useState<number>(initialPatrimonios[0]?.id ?? 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [formNome, setFormNome] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const patrimonioSelecionado = useMemo(() => patrimonios.find((item) => item.id === selectedPatrimonioId) ?? null, [patrimonios, selectedPatrimonioId]);

  const subcategorias = useMemo<SubcategoriaItem[]>(() => {
    return patrimonios.flatMap((patrimonio) =>
      patrimonio.subcategorias.map((subcategoria, index) => ({
        id: Number(`${patrimonio.id}${index + 1}`),
        nome: subcategoria,
        patrimonioId: patrimonio.id,
      }))
    );
  }, [patrimonios]);

  const filteredSubcategorias = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return subcategorias.filter((subcategoria) => {
      const matchesSearch = normalizedSearch.length === 0 || subcategoria.nome.toLowerCase().includes(normalizedSearch);
      const matchesPatrimonio = selectedPatrimonioId === 0 || subcategoria.patrimonioId === selectedPatrimonioId;
      return matchesSearch && matchesPatrimonio;
    });
  }, [searchTerm, selectedPatrimonioId, subcategorias]);

  const editingSubcategoria = useMemo(() => subcategorias.find((item) => item.id === editingId) ?? null, [editingId, subcategorias]);
  const categoriaEmEdicao = editingSubcategoria ? patrimonios.find((item) => item.id === editingSubcategoria.patrimonioId) ?? null : patrimonioSelecionado;

  const resetForm = () => {
    setEditingId(null);
    setFormNome("");
  };

  const handleSubmit = () => {
    const nome = formNome.trim();
    if (!nome) return;

    const normalizedName = nome.replace(/\s+/g, " ");

    if (editingSubcategoria) {
      const categoriaAtual = patrimonios.find((item) => item.id === editingSubcategoria.patrimonioId);
      if (!categoriaAtual) return;

      const existeDuplicado = categoriaAtual.subcategorias.some((sub) => sub.toLowerCase() === normalizedName.toLowerCase() && sub !== editingSubcategoria.nome);
      if (existeDuplicado) return;

      setPatrimonios((prev) =>
        prev.map((item) =>
          item.id === editingSubcategoria.patrimonioId
            ? {
                ...item,
                subcategorias: item.subcategorias.map((sub) => (sub === editingSubcategoria.nome ? normalizedName : sub)),
              }
            : item
        )
      );
      resetForm();
      return;
    }

    if (!patrimonioSelecionado) return;

    const existeDuplicado = patrimonioSelecionado.subcategorias.some((sub) => sub.toLowerCase() === normalizedName.toLowerCase());
    if (existeDuplicado) return;

    setPatrimonios((prev) =>
      prev.map((item) => (item.id === patrimonioSelecionado.id ? { ...item, subcategorias: [...item.subcategorias, normalizedName] } : item))
    );
    setFormNome("");
  };

  const handleEdit = (subcategoria: SubcategoriaItem) => {
    setEditingId(subcategoria.id);
    setFormNome(subcategoria.nome);
  };

  const handleDelete = (subcategoria: SubcategoriaItem) => {
    setPatrimonios((prev) =>
      prev.map((item) =>
        item.id === subcategoria.patrimonioId ? { ...item, subcategorias: item.subcategorias.filter((sub) => sub !== subcategoria.nome) } : item
      )
    );

    if (editingId === subcategoria.id) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <Layers className="h-3.5 w-3.5" />
            Subcategorias
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Gerencie subcategorias com filtros e CRUD</h1>
          <p className="mt-1 text-sm text-muted-foreground">Busque, filtre e organize subcategorias sem alterar o vínculo com a categoria pai.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Buscar subcategoria</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Digite o nome da subcategoria"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por categoria</Label>
              <select
                value={selectedPatrimonioId}
                onChange={(event) => setSelectedPatrimonioId(Number(event.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={0}>Todas as categorias</option>
                {patrimonios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingSubcategoria ? "Editar subcategoria" : "Nova subcategoria"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={formNome} onChange={(event) => setFormNome(event.target.value)} placeholder="Ex.: Equipamentos" />
            </div>

            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Categoria vinculada:</span> {categoriaEmEdicao?.nome ?? "Selecione uma categoria"}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="gap-2" onClick={handleSubmit}>
                <Plus className="h-4 w-4" />
                {editingSubcategoria ? "Salvar alterações" : "Adicionar"}
              </Button>
              {editingSubcategoria && (
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Subcategorias cadastradas</CardTitle>
          <Badge variant="secondary">{filteredSubcategorias.length} itens</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredSubcategorias.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Nenhuma subcategoria encontrada com os filtros informados.</div>
          ) : (
            filteredSubcategorias.map((subcategoria) => {
              const categoria = patrimonios.find((item) => item.id === subcategoria.patrimonioId);
              return (
                <div key={subcategoria.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium text-foreground">{subcategoria.nome}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{categoria?.nome ?? "Categoria"}</Badge>
                      <span>{categoria?.descricao ?? "Categoria vinculada"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(subcategoria)}>
                      <Edit3 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subcategoria)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubcategoriasPage;
