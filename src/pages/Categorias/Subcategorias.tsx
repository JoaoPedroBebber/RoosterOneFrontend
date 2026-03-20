import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SubcategoriaItem {
  nome: string;
  slaVisualizacao: string;
  tempoResolucao: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
}

interface CategoriaComSub {
  nome: string;
  subcategorias: SubcategoriaItem[];
}

const categoriasBase: CategoriaComSub[] = [
  { nome: "Infraestrutura", subcategorias: [
    { nome: "Reforma", slaVisualizacao: "4h", tempoResolucao: "48h", prioridade: "Média" },
    { nome: "Instalação", slaVisualizacao: "6h", tempoResolucao: "72h", prioridade: "Baixa" },
    { nome: "Manutenção", slaVisualizacao: "2h", tempoResolucao: "24h", prioridade: "Alta" }
  ] },
  { nome: "Software", subcategorias: [
    { nome: "Bug", slaVisualizacao: "1h", tempoResolucao: "12h", prioridade: "Urgente" },
    { nome: "Nova funcionalidade", slaVisualizacao: "8h", tempoResolucao: "96h", prioridade: "Baixa" },
    { nome: "Atualização", slaVisualizacao: "4h", tempoResolucao: "72h", prioridade: "Média" }
  ] },
  { nome: "Hardware", subcategorias: [
    { nome: "Substituição", slaVisualizacao: "2h", tempoResolucao: "24h", prioridade: "Alta" },
    { nome: "Reparo", slaVisualizacao: "3h", tempoResolucao: "36h", prioridade: "Média" },
    { nome: "Configuração", slaVisualizacao: "4h", tempoResolucao: "48h", prioridade: "Baixa" }
  ] },
  { nome: "Rede", subcategorias: [
    { nome: "Conectividade", slaVisualizacao: "1h", tempoResolucao: "12h", prioridade: "Urgente" },
    { nome: "VPN", slaVisualizacao: "2h", tempoResolucao: "24h", prioridade: "Alta" },
    { nome: "Segurança", slaVisualizacao: "2h", tempoResolucao: "48h", prioridade: "Alta" }
  ] },
];

const Subcategorias = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();

  const nomeCategoria = categoria ? decodeURIComponent(categoria) : "";

  const categoriaAtiva = categoriasBase.find(c => c.nome === nomeCategoria) || { nome: nomeCategoria || "Categoria", subcategorias: [] };

  const [subcategorias, setSubcategorias] = useState<SubcategoriaItem[]>(categoriaAtiva.subcategorias);
  const [filtro, setFiltro] = useState("");
  const [novaSubcategoria, setNovaSubcategoria] = useState("");
  const [novoSLAVizualizacao, setNovoSLAVizualizacao] = useState("4h");
  const [novoTempoResolucao, setNovoTempoResolucao] = useState("24h");
  const [novaPrioridade, setNovaPrioridade] = useState<'Baixa' | 'Média' | 'Alta' | 'Urgente'>("Baixa");

  const subcategoriasFiltradas = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return subcategorias;
    return subcategorias.filter(sub => sub.nome.toLowerCase().includes(term));
  }, [subcategorias, filtro]);

  const handleCriarSubcategoria = () => {
    const nome = novaSubcategoria.trim();
    const slaVisualizacao = novoSLAVizualizacao.trim() || "4h";
    const tempoResolucao = novoTempoResolucao.trim() || "24h";
    const prioridade = novaPrioridade;
    if (!nome) return;

    if (subcategorias.some(sub => sub.nome.toLowerCase() === nome.toLowerCase())) {
      alert("Subcategoria já existe.");
      return;
    }

    setSubcategorias(prev => [...prev, { nome, slaVisualizacao, tempoResolucao, prioridade }]);
    setNovaSubcategoria("");
    setNovoSLAVizualizacao("4h");
    setNovoTempoResolucao("24h");
    setNovaPrioridade("Baixa");
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
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Nova Subcategoria</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Subcategoria</DialogTitle>
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
                <Button onClick={handleCriarSubcategoria} className="w-full">Adicionar</Button>
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
        {subcategoriasFiltradas.map((sub, idx) => (
          <Card key={`${sub.nome}-${idx}`} className="hover:shadow-lg transition-shadow">
            <CardContent>
              <p className="text-base font-medium">{sub.nome}</p>
              <p className="text-sm text-muted-foreground">SLA de visualização: {sub.slaVisualizacao}</p>
              <p className="text-sm text-muted-foreground">Tempo de resolução: {sub.tempoResolucao}</p>
              <p className="text-sm text-muted-foreground">Prioridade: <span className={
                sub.prioridade === 'Baixa' ? 'text-green-600' :
                sub.prioridade === 'Média' ? 'text-yellow-600' :
                sub.prioridade === 'Alta' ? 'text-orange-600' :
                'text-red-600'
              }>{sub.prioridade}</span></p>
            </CardContent>
          </Card>
        ))}
      </div>

      {subcategoriasFiltradas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium">Nenhuma subcategoria encontrada</h3>
            <p className="text-muted-foreground">Crie a primeira ou ajuste o filtro.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subcategorias;
