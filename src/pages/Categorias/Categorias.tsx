import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nome: "Infraestrutura", descricao: "Atualizações de estrutura e instalações físicas", subcategorias: ["Reforma", "Instalação", "Manutenção"] },
    { id: 2, nome: "Software", descricao: "Erros e melhorias em sistemas e aplicações", subcategorias: ["Bug", "Nova funcionalidade", "Atualização"] },
    { id: 3, nome: "Hardware", descricao: "Atendimento em equipamentos, computadores e periféricos", subcategorias: ["Substituição", "Reparo", "Configuração"] },
    { id: 4, nome: "Rede", descricao: "Conectividade, VPN e segurança de rede", subcategorias: ["Conectividade", "VPN", "Segurança"] },
  ]);

  const [filtro, setFiltro] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  const categoriasFiltradas = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return categorias;
    return categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(term) ||
      categoria.descricao.toLowerCase().includes(term)
    );
  }, [categorias, filtro]);

  const handleCriarCategoria = () => {
    const nome = novaCategoria.trim();
    if (!nome) return;

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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
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
              <Button onClick={handleCriarCategoria} className="w-full">
                Criar Categoria
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/categorias/${encodeURIComponent(categoria.nome)}/subcategorias`)}
              >
                Ver Subcategorias
              </Button>
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
