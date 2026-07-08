import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dadosMockSistema } from "@/pages/RoosterDesk/dados";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Setor {
  id: number;
  nome: string;
  descricao: string;
}


const Setores = () => {
  const navigate = useNavigate();

  const [setores, setSetores] = useState<Setor[]>(dadosMockSistema.setores);
  const [filtro, setFiltro] = useState("");
  const [novoSetor, setNovoSetor] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");


  const setoresFiltrados = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return setores;
    return setores.filter((setor) =>
      setor.nome.toLowerCase().includes(termo) ||
      setor.descricao.toLowerCase().includes(termo)
    );
  }, [filtro, setores]);

  const criarSetor = () => {
    const nome = novoSetor.trim();
    if (!nome) {
      alert("Informe um nome de setor.");
      return;
    }

    if (setores.some((s) => s.nome.toLowerCase() === nome.toLowerCase())) {
      alert("Setor já existe.");
      return;
    }

    setSetores((prev) => [
      ...prev,
      { id: Date.now(), nome, descricao: novaDescricao || "Sem descrição" },
    ]);

    setNovoSetor("");
    setNovaDescricao("");
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Setores e Funções</h1>
          <p className="text-muted-foreground">Baseado em Categorias/Subcategorias: crie departamentos e atribua permissões e funções.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Setor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="setor-novo">Nome do Setor</Label>
                <Input id="setor-novo" value={novoSetor} onChange={(e) => setNovoSetor(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="descricao-novo">Descrição</Label>
                <Input id="descricao-novo" value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)} />
              </div>
              <Button className="w-full" onClick={criarSetor}>
                Criar Setor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Filtrar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar por setor ou descrição" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {setoresFiltrados.map((setor) => (
          <Card key={setor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{setor.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{setor.descricao}</p>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/setores/${encodeURIComponent(setor.nome)}/usuarios`)}>
                  Gerenciar Usuários
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate(`/setores/${encodeURIComponent(setor.nome)}/funcoes`)}>
                  Gerenciar Funções
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {setoresFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhum setor encontrado. Crie um novo setor para começar.</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Setores;
