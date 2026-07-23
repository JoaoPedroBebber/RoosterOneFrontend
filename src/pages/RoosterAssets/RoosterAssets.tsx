import { useMemo, useState } from "react";
import { Archive, ArrowLeft, CheckCircle2, ClipboardList, Layers, Plus, Search, Trash2, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initialAtivos, initialPatrimonios, statusOptions, type Ativo, type Patrimonio } from "./assetsData";

type ViewMode = "patrimonios";

const RoosterAssets = () => {
  const navigate = useNavigate();
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>(initialPatrimonios);
  const [ativos, setAtivos] = useState<Ativo[]>(initialAtivos);
  const [filtro, setFiltro] = useState("");
  const [patrimonioDialogOpen, setPatrimonioDialogOpen] = useState(false);
  const [editingPatrimonioId, setEditingPatrimonioId] = useState<number | null>(null);
  const [patrimonioForm, setPatrimonioForm] = useState({ nome: "", codigo: "", localizacao: "", descricao: "" });

  const patrimoniosFiltrados = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return patrimonios;
    return patrimonios.filter(
      (item) =>
        item.nome.toLowerCase().includes(term) ||
        item.codigo.toLowerCase().includes(term) ||
        item.localizacao.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term),
    );
  }, [patrimonios, filtro]);

  const ativosDoPatrimonio = useMemo(() => ativos.filter((item) => item.patrimonioId === 1 || item.patrimonioId === 2), [ativos]);
  const ativosEmManutencao = ativosDoPatrimonio.filter((item) => item.status === "Em manutenção").length;
  const totalConsumiveis = ativosDoPatrimonio.reduce((acc, item) => acc + item.consumiveis.length, 0);

  const handleOpenPatrimonioDialog = (patrimonio?: Patrimonio) => {
    if (patrimonio) {
      setPatrimonioForm({ nome: patrimonio.nome, codigo: patrimonio.codigo, localizacao: patrimonio.localizacao, descricao: patrimonio.descricao });
      setEditingPatrimonioId(patrimonio.id);
    } else {
      setPatrimonioForm({ nome: "", codigo: "", localizacao: "", descricao: "" });
      setEditingPatrimonioId(null);
    }
    setPatrimonioDialogOpen(true);
  };

  const handleSavePatrimonio = () => {
    const nome = patrimonioForm.nome.trim();
    if (!nome) return;

    if (editingPatrimonioId) {
      setPatrimonios((prev) =>
        prev.map((item) =>
          item.id === editingPatrimonioId
            ? { ...item, nome, codigo: patrimonioForm.codigo.trim(), localizacao: patrimonioForm.localizacao.trim(), descricao: patrimonioForm.descricao.trim() }
            : item,
        ),
      );
    } else {
      setPatrimonios((prev) => [
        ...prev,
        {
          id: Date.now(),
          nome,
          codigo: patrimonioForm.codigo.trim() || `PAT-${Date.now()}`,
          localizacao: patrimonioForm.localizacao.trim() || "Não informado",
          descricao: patrimonioForm.descricao.trim() || "",
          subcategorias: [],
        },
      ]);
    }

    setPatrimonioDialogOpen(false);
  };

  const handleDeletePatrimonio = (id: number) => {
    if (!confirm("Deseja excluir este patrimônio e todos os ativos relacionados?")) return;
    setPatrimonios((prev) => prev.filter((item) => item.id !== id));
    setAtivos((prev) => prev.filter((item) => item.patrimonioId !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <Archive className="h-3.5 w-3.5" />
            Rooster Assets
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Gestão de ativos, patrimônio e manutenção</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize patrimônios e navegue para as telas dedicadas de ativos e subcategorias.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border bg-background/80 p-4 shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>Patrimônios</span>
            </div>
            <CardTitle className="text-lg font-semibold">{patrimonios.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border bg-background/80 p-4 shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              <span>Ativos</span>
            </div>
            <CardTitle className="text-lg font-semibold">{ativos.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border bg-background/80 p-4 shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>Manutenção</span>
            </div>
            <CardTitle className="text-lg font-semibold">{ativosEmManutencao}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border bg-background/80 p-4 shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>Consumíveis</span>
            </div>
            <CardTitle className="text-lg font-semibold">{totalConsumiveis}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar patrimônios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Pesquisar por nome, código ou local" value={filtro} onChange={(event) => setFiltro(event.target.value)} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Dialog open={patrimonioDialogOpen} onOpenChange={setPatrimonioDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenPatrimonioDialog()}>
              <Plus className="h-4 w-4" />
              Novo patrimônio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPatrimonioId ? "Editar patrimônio" : "Novo patrimônio"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do patrimônio</Label>
                <Input value={patrimonioForm.nome} onChange={(event) => setPatrimonioForm((prev) => ({ ...prev, nome: event.target.value }))} />
              </div>
              <div>
                <Label>Código</Label>
                <Input value={patrimonioForm.codigo} onChange={(event) => setPatrimonioForm((prev) => ({ ...prev, codigo: event.target.value }))} />
              </div>
              <div>
                <Label>Localização</Label>
                <Input value={patrimonioForm.localizacao} onChange={(event) => setPatrimonioForm((prev) => ({ ...prev, localizacao: event.target.value }))} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={patrimonioForm.descricao} onChange={(event) => setPatrimonioForm((prev) => ({ ...prev, descricao: event.target.value }))} />
              </div>
              <Button className="w-full" onClick={handleSavePatrimonio}>{editingPatrimonioId ? "Salvar alterações" : "Criar patrimônio"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {patrimoniosFiltrados.map((patrimonio) => (
          <Card key={patrimonio.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{patrimonio.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{patrimonio.codigo}</p>
                </div>
                <Badge>{patrimonio.subcategorias.length} subcategorias</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{patrimonio.descricao}</p>
              <div className="text-sm text-muted-foreground">{patrimonio.localizacao}</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={() => navigate("/assets/ativos")}>{/* legado */}</Button>
                <Button variant="outline" className="gap-2" onClick={() => navigate("/assets/ativos")}> <ClipboardList className="h-4 w-4" /> Ver ativos</Button>
                <Button variant="outline" className="gap-2" onClick={() => navigate("/assets/subcategorias")}> <Layers className="h-4 w-4" /> Subcategorias</Button>
                <Button variant="outline" size="icon" onClick={() => handleOpenPatrimonioDialog(patrimonio)}><Trash2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDeletePatrimonio(patrimonio.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default RoosterAssets;
