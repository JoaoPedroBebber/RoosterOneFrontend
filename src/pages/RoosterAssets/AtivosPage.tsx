import { useMemo, useState } from "react";
import { ArrowLeft, ClipboardList, Layers, Pencil, Plus, Search, Trash2, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { initialAtivos, initialPatrimonios, statusOptions, type Ativo, type Patrimonio } from "./assetsData";

const AtivosPage = () => {
  const navigate = useNavigate();
  const [patrimonios] = useState<Patrimonio[]>(initialPatrimonios);
  const [ativos, setAtivos] = useState<Ativo[]>(initialAtivos);
  const [selectedPatrimonioId, setSelectedPatrimonioId] = useState<number>(initialPatrimonios[0]?.id ?? 0);
  const [filtro, setFiltro] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ativoDialogOpen, setAtivoDialogOpen] = useState(false);
  const [editingAtivoId, setEditingAtivoId] = useState<number | null>(null);
  const [ativoForm, setAtivoForm] = useState({ nome: "", subcategoria: "", serial: "", status: statusOptions[0], localizacao: "", observacoes: "" });
  const [manutencaoDialogOpen, setManutencaoDialogOpen] = useState(false);
  const [manutencaoTipo, setManutencaoTipo] = useState("Preventiva");
  const [manutencaoDescricao, setManutencaoDescricao] = useState("");
  const [consumivelNome, setConsumivelNome] = useState("");
  const [consumivelQuantidade, setConsumivelQuantidade] = useState("");
  const [consumivelUnidade, setConsumivelUnidade] = useState("");
  const [ativoParaManutencaoId, setAtivoParaManutencaoId] = useState<number | null>(null);

  const patrimonioSelecionado = patrimonios.find((item) => item.id === selectedPatrimonioId) ?? null;

  const ativosFiltrados = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    return ativos.filter((item) => {
      if (item.patrimonioId !== selectedPatrimonioId) return false;
      const matchStatus = !statusFilter || item.status === statusFilter;
      const matchTerm = !term || item.nome.toLowerCase().includes(term) || item.serial.toLowerCase().includes(term) || item.subcategoria.toLowerCase().includes(term) || item.localizacao.toLowerCase().includes(term);
      return matchStatus && matchTerm;
    });
  }, [ativos, filtro, selectedPatrimonioId, statusFilter]);

  const handleOpenAtivoDialog = (ativo?: Ativo) => {
    if (!patrimonioSelecionado) return;
    if (ativo) {
      setAtivoForm({ nome: ativo.nome, subcategoria: ativo.subcategoria, serial: ativo.serial, status: ativo.status, localizacao: ativo.localizacao, observacoes: ativo.observacoes });
      setEditingAtivoId(ativo.id);
    } else {
      setAtivoForm({ nome: "", subcategoria: patrimonioSelecionado.subcategorias[0] ?? "Geral", serial: "", status: statusOptions[0], localizacao: "", observacoes: "" });
      setEditingAtivoId(null);
    }
    setAtivoDialogOpen(true);
  };

  const handleSaveAtivo = () => {
    if (!patrimonioSelecionado) return;
    const nome = ativoForm.nome.trim();
    if (!nome) return;

    if (editingAtivoId) {
      setAtivos((prev) => prev.map((item) => item.id === editingAtivoId ? { ...item, nome, subcategoria: ativoForm.subcategoria, serial: ativoForm.serial.trim(), status: ativoForm.status, localizacao: ativoForm.localizacao.trim(), observacoes: ativoForm.observacoes.trim() } : item));
    } else {
      setAtivos((prev) => [...prev, { id: Date.now(), patrimonioId: patrimonioSelecionado.id, nome, subcategoria: ativoForm.subcategoria || patrimonioSelecionado.subcategorias[0] || "Geral", serial: ativoForm.serial.trim() || `SN-${Date.now()}`, status: ativoForm.status, localizacao: ativoForm.localizacao.trim() || patrimonioSelecionado.localizacao, observacoes: ativoForm.observacoes.trim(), manutencoes: [], consumiveis: [] }]);
    }

    setAtivoDialogOpen(false);
  };

  const handleDeleteAtivo = (id: number) => {
    if (!confirm("Deseja excluir este ativo?")) return;
    setAtivos((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenManutencao = (ativoId: number) => {
    setAtivoParaManutencaoId(ativoId);
    setManutencaoTipo("Preventiva");
    setManutencaoDescricao("");
    setConsumivelNome("");
    setConsumivelQuantidade("");
    setConsumivelUnidade("");
    setManutencaoDialogOpen(true);
  };

  const handleAddManutencao = () => {
    if (!ativoParaManutencaoId) return;
    const descricao = manutencaoDescricao.trim();
    if (!descricao) return;
    const data = new Date().toLocaleDateString("pt-BR");

    setAtivos((prev) => prev.map((item) => item.id === ativoParaManutencaoId ? { ...item, manutencoes: [...item.manutencoes, { id: Date.now(), data, tipo: manutencaoTipo, descricao }] } : item));
    setManutencaoDescricao("");
  };

  const handleAddConsumivel = () => {
    if (!ativoParaManutencaoId) return;
    const nome = consumivelNome.trim();
    const quantidade = Number(consumivelQuantidade);
    const unidade = consumivelUnidade.trim();
    if (!nome || !unidade || Number.isNaN(quantidade) || quantidade <= 0) return;
    const ultimaAtualizacao = new Date().toLocaleDateString("pt-BR");

    setAtivos((prev) => prev.map((item) => item.id === ativoParaManutencaoId ? { ...item, consumiveis: [...item.consumiveis, { id: Date.now(), nome, quantidade, unidade, ultimaAtualizacao }] } : item));
    setConsumivelNome("");
    setConsumivelQuantidade("");
    setConsumivelUnidade("");
  };

  const ativoParaManutencao = ativos.find((item) => item.id === ativoParaManutencaoId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <ClipboardList className="h-3.5 w-3.5" />
            Ver ativos
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Cadastro e gestão dos ativos por patrimônio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Selecione o patrimônio e gerencie seus ativos, manutenção e consumíveis.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar ativos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Patrimônio</Label>
            <select value={selectedPatrimonioId} onChange={(event) => setSelectedPatrimonioId(Number(event.target.value))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {patrimonios.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div>
            <Label>Busca</Label>
            <Input placeholder="Nome, serial ou localização" value={filtro} onChange={(event) => setFiltro(event.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Qualquer status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Qualquer status</SelectItem>
                {statusOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Dialog open={ativoDialogOpen} onOpenChange={setAtivoDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenAtivoDialog()}>
              <Plus className="h-4 w-4" />
              Novo ativo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAtivoId ? "Editar ativo" : "Novo ativo"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do ativo</Label>
                <Input value={ativoForm.nome} onChange={(event) => setAtivoForm((prev) => ({ ...prev, nome: event.target.value }))} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Subcategoria</Label>
                  <Select value={ativoForm.subcategoria} onValueChange={(value) => setAtivoForm((prev) => ({ ...prev, subcategoria: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {(patrimonioSelecionado?.subcategorias.length ? patrimonioSelecionado.subcategorias : ["Geral"]).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={ativoForm.status} onValueChange={(value) => setAtivoForm((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Serial</Label>
                <Input value={ativoForm.serial} onChange={(event) => setAtivoForm((prev) => ({ ...prev, serial: event.target.value }))} />
              </div>
              <div>
                <Label>Localização</Label>
                <Input value={ativoForm.localizacao} onChange={(event) => setAtivoForm((prev) => ({ ...prev, localizacao: event.target.value }))} />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea value={ativoForm.observacoes} onChange={(event) => setAtivoForm((prev) => ({ ...prev, observacoes: event.target.value }))} />
              </div>
              <Button className="w-full" onClick={handleSaveAtivo}>{editingAtivoId ? "Salvar alterações" : "Criar ativo"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-background/80 p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Subcategoria</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ativosFiltrados.map((ativo) => (
              <TableRow key={ativo.id}>
                <TableCell className="font-medium">{ativo.nome}</TableCell>
                <TableCell>{ativo.subcategoria}</TableCell>
                <TableCell>{ativo.serial}</TableCell>
                <TableCell>{ativo.status}</TableCell>
                <TableCell>{ativo.localizacao}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleOpenManutencao(ativo.id)}>
                      <Wrench className="h-4 w-4" />
                      Manutenção
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleOpenAtivoDialog(ativo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteAtivo(ativo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {ativosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Nenhum ativo encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={manutencaoDialogOpen} onOpenChange={setManutencaoDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manutenção e consumíveis</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-3xl border bg-muted/20 p-4">
              <h3 className="text-lg font-semibold">Ativo</h3>
              <p className="text-muted-foreground">{ativoParaManutencao?.nome ?? "Selecione um ativo"}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <CardHeader><CardTitle>Registros de manutenção</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {ativoParaManutencao?.manutencoes.length ? ativoParaManutencao.manutencoes.map((item) => <div key={item.id} className="rounded-xl border border-border p-3"><div className="flex items-center justify-between gap-2"><div><p className="font-semibold">{item.tipo}</p><p className="text-xs text-muted-foreground">{item.data}</p></div><Badge variant="secondary">{item.tipo}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{item.descricao}</p></div>) : <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Nenhum registro de manutenção.</div>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Consumíveis</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {ativoParaManutencao?.consumiveis.length ? ativoParaManutencao.consumiveis.map((item) => <div key={item.id} className="rounded-xl border border-border p-3"><div className="flex items-center justify-between gap-2"><div><p className="font-semibold">{item.nome}</p><p className="text-xs text-muted-foreground">{item.ultimaAtualizacao}</p></div><Badge variant="secondary">{item.quantidade} {item.unidade}</Badge></div></div>) : <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Nenhum consumível registrado.</div>}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Registrar manutenção</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tipo</Label>
                    <Select value={manutencaoTipo} onValueChange={setManutencaoTipo}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preventiva">Preventiva</SelectItem>
                        <SelectItem value="Corretiva">Corretiva</SelectItem>
                        <SelectItem value="Inspeção">Inspeção</SelectItem>
                        <SelectItem value="Calibração">Calibração</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea value={manutencaoDescricao} onChange={(event) => setManutencaoDescricao(event.target.value)} />
                  </div>
                  <Button className="w-full" onClick={handleAddManutencao}>Adicionar registro</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Adicionar consumível</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input value={consumivelNome} onChange={(event) => setConsumivelNome(event.target.value)} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div><Label>Quantidade</Label><Input type="number" min="1" value={consumivelQuantidade} onChange={(event) => setConsumivelQuantidade(event.target.value)} /></div>
                    <div className="md:col-span-2"><Label>Unidade</Label><Input value={consumivelUnidade} onChange={(event) => setConsumivelUnidade(event.target.value)} /></div>
                  </div>
                  <Button className="w-full" onClick={handleAddConsumivel}>Adicionar consumível</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AtivosPage;
