import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dadosMockSistema } from "@/pages/RoosterDesk/dados";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  subcategorias: string[];
}

const Categorias = () => {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>(dadosMockSistema.categorias);
  const [filtro, setFiltro] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const categoriasFiltradas = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return categorias;
    return categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(term) ||
      categoria.descricao.toLowerCase().includes(term)
    );
  }, [categorias, filtro]);

  const handleSaveCategoria = () => {
    const nome = novaCategoria.trim();
    if (!nome) return;

    if (editingId) {
      setCategorias(prev => prev.map(item =>
        item.id === editingId
          ? { ...item, nome, descricao: novaDescricao.trim() || "Sem descrição" }
          : item
      ));
      setEditingId(null);
    } else {
      const existe = categorias.some(c => c.nome.toLowerCase() === nome.toLowerCase());
      if (existe) {
        alert("Categoria já existe.");
        return;
      }

      setCategorias(prev => [
        ...prev,
        {
          id: Date.now(),
          nome,
          descricao: novaDescricao.trim() || "Sem descrição",
          subcategorias: [],
        },
      ]);
    }

    setNovaCategoria("");
    setNovaDescricao("");
    setIsOpen(false);
  };

  const handleDeleteCategoria = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategorias(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEditCategoria = (categoria: Categoria) => {
    setNovaCategoria(categoria.nome);
    setNovaDescricao(categoria.descricao);
    setEditingId(categoria.id);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingId(null);
    setNovaCategoria("");
    setNovaDescricao("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Gerencie categorias e acesse subcategorias.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoria-nome">Nome da Categoria</Label>
                <Input
                  id="categoria-nome"
                  value={novaCategoria}
                  onChange={e => setNovaCategoria(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="categoria-descricao">Descrição</Label>
                <Input
                  id="categoria-descricao"
                  value={novaDescricao}
                  onChange={e => setNovaDescricao(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveCategoria} className="w-full">
                {editingId ? "Salvar alterações" : "Criar Categoria"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Buscar nome/descrição</Label>
              <Input
                placeholder="Digite para filtrar"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriasFiltradas.map(categoria => (
          <Card key={categoria.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{categoria.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{categoria.descricao}</p>
              <div className="text-xs text-muted-foreground mb-3">{categoria.subcategorias.length} subcategorias</div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/categorias/${encodeURIComponent(categoria.nome)}/subcategorias`)}
                >
                  Ver Subcategorias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategoria(categoria)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategoria(categoria.id)}
                >
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
            <p className="text-muted-foreground">Ajuste os filtros ou crie uma nova categoria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Categorias;
