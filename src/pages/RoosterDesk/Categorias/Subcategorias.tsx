import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dadosMockSistema } from "@/pages/RoosterDesk/dados";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SubcategoriaItem {
  id: number;
  nome: string;
  slaVisualizacao: string;
  tempoResolucao: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
}

const Subcategorias = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();

  const nomeCategoria = categoria ? decodeURIComponent(categoria) : "";
  const [subcategorias, setSubcategorias] = useState<SubcategoriaItem[]>(
    dadosMockSistema.categorias
      .find(c => c.nome === nomeCategoria)
      ?.subcategorias.map((nome, idx) => ({
        id: idx,
        nome,
        slaVisualizacao: "4h",
        tempoResolucao: "48h",
        prioridade: "Média" as const,
      })) ?? []
  );

  const [filtro, setFiltro] = useState("");
  const [novaSubcategoria, setNovaSubcategoria] = useState("");
  const [novoSLAVizualizacao, setNovoSLAVizualizacao] = useState("4h");
  const [novoTempoResolucao, setNovoTempoResolucao] = useState("24h");
  const [novaPrioridade, setNovaPrioridade] = useState<'Baixa' | 'Média' | 'Alta' | 'Urgente'>("Média");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const subcategoriasFiltradas = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return subcategorias;
    return subcategorias.filter(sub => sub.nome.toLowerCase().includes(term));
  }, [subcategorias, filtro]);

  const handleSaveSubcategoria = () => {
    const nome = novaSubcategoria.trim();
    if (!nome) return;

    if (editingId !== null) {
      setSubcategorias(prev => prev.map(item =>
        item.id === editingId
          ? { ...item, nome, slaVisualizacao: novoSLAVizualizacao, tempoResolucao: novoTempoResolucao, prioridade: novaPrioridade }
          : item
      ));
      setEditingId(null);
    } else {
      if (subcategorias.some(sub => sub.nome.toLowerCase() === nome.toLowerCase())) {
        alert("Subcategoria já existe.");
        return;
      }

      setSubcategorias(prev => [
        ...prev,
        {
          id: Math.max(...prev.map(p => p.id), 0) + 1,
          nome,
          slaVisualizacao: novoSLAVizualizacao,
          tempoResolucao: novoTempoResolucao,
          prioridade: novaPrioridade,
        }
      ]);
    }

    setNovaSubcategoria("");
    setNovoSLAVizualizacao("4h");
    setNovoTempoResolucao("24h");
    setNovaPrioridade("Média");
    setIsOpen(false);
  };

  const handleDeleteSubcategoria = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta subcategoria?")) {
      setSubcategorias(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEditSubcategoria = (sub: SubcategoriaItem) => {
    setNovaSubcategoria(sub.nome);
    setNovoSLAVizualizacao(sub.slaVisualizacao);
    setNovoTempoResolucao(sub.tempoResolucao);
    setNovaPrioridade(sub.prioridade);
    setEditingId(sub.id);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingId(null);
    setNovaSubcategoria("");
    setNovoSLAVizualizacao("4h");
    setNovoTempoResolucao("24h");
    setNovaPrioridade("Média");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subcategorias - {nomeCategoria || "--"}</h1>
          <p className="text-muted-foreground">Gerencie opções de subcategorias para esta categoria.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/categorias")}> <ArrowLeft className="h-4 w-4" /> Voltar</Button>
          <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Nova Subcategoria</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId !== null ? "Editar Subcategoria" : "Nova Subcategoria"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subcategoria-nome">Nome da Subcategoria</Label>
                  <Input
                    id="subcategoria-nome"
                    value={novaSubcategoria}
                    onChange={e => setNovaSubcategoria(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="subcategoria-sla-visualizacao">SLA de Visualização</Label>
                  <Input
                    id="subcategoria-sla-visualizacao"
                    value={novoSLAVizualizacao}
                    onChange={e => setNovoSLAVizualizacao(e.target.value)}
                    placeholder="Ex: 4h"
                  />
                </div>
                <div>
                  <Label htmlFor="subcategoria-tempo-resolucao">Tempo de Resolução</Label>
                  <Input
                    id="subcategoria-tempo-resolucao"
                    value={novoTempoResolucao}
                    onChange={e => setNovoTempoResolucao(e.target.value)}
                    placeholder="Ex: 24h"
                  />
                </div>
                <div>
                  <Label htmlFor="subcategoria-prioridade">Prioridade</Label>
                  <select
                    id="subcategoria-prioridade"
                    className="w-full border rounded px-2 py-1 mt-1"
                    value={novaPrioridade}
                    onChange={e => setNovaPrioridade(e.target.value as 'Baixa' | 'Média' | 'Alta' | 'Urgente')}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
                <Button onClick={handleSaveSubcategoria} className="w-full">{editingId !== null ? "Salvar alterações" : "Adicionar"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar Subcategorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Buscar</Label>
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
        {subcategoriasFiltradas.map(sub => (
          <Card key={sub.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{sub.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                <div>SLA Visualização: {sub.slaVisualizacao}</div>
                <div>Tempo Resolução: {sub.tempoResolucao}</div>
                <div>Prioridade: {sub.prioridade}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSubcategoria(sub)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSubcategoria(sub.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subcategoriasFiltradas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium">Nenhuma subcategoria encontrada</h3>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subcategorias;
