import { useMemo, useState } from "react";
import { ArrowLeft, Building2, Clock3, DoorOpen, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Campus = {
  id: number;
  nome: string;
  endereco: string;
  descricao: string;
};

type Bloco = {
  id: number;
  nome: string;
  campusId: number;
  andar: string;
  descricao: string;
};

type Sala = {
  id: number;
  nome: string;
  blocoId: number;
  capacidade: number;
  tipo: string;
  status: string;
};

type HorarioSala = {
  id: number;
  diaSemana: string;
  horarios: string[];
};

type ViewMode = "campi" | "blocos" | "salas";

const initialCampi: Campus[] = [
  { id: 1, nome: "Campus Central", endereco: "Rua das Flores, 100", descricao: "Campus principal" },
  { id: 2, nome: "Campus Norte", endereco: "Av. Industrial, 250", descricao: "Campus técnico" },
];

const initialBlocos: Bloco[] = [
  { id: 1, nome: "Bloco A", campusId: 1, andar: "Térreo", descricao: "Salas de aula" },
  { id: 2, nome: "Bloco B", campusId: 1, andar: "2º andar", descricao: "Laboratórios" },
  { id: 3, nome: "Bloco C", campusId: 2, andar: "Térreo", descricao: "Salas para cursos" },
];

const initialSalas: Sala[] = [
  { id: 1, nome: "Sala 101", blocoId: 1, capacidade: 40, tipo: "Teórica", status: "Ativa" },
  { id: 2, nome: "Lab 204", blocoId: 2, capacidade: 25, tipo: "Laboratório", status: "Ativa" },
  { id: 3, nome: "Sala 302", blocoId: 3, capacidade: 30, tipo: "Multimídia", status: "Manutenção" },
];

const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const RoomsManagementPage = () => {
  const [campi, setCampi] = useState<Campus[]>(initialCampi);
  const [blocos, setBlocos] = useState<Bloco[]>(initialBlocos);
  const [salas, setSalas] = useState<Sala[]>(initialSalas);
  const [view, setView] = useState<ViewMode>("campi");
  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(initialCampi[0]?.id ?? null);
  const [selectedBlocoId, setSelectedBlocoId] = useState<number | null>(initialBlocos.find((item) => item.campusId === initialCampi[0]?.id)?.id ?? null);
  const [filtro, setFiltro] = useState("");
  const [salaFiltroNome, setSalaFiltroNome] = useState("");
  const [salaFiltroCapacidade, setSalaFiltroCapacidade] = useState("");
  const [salaFiltroTipo, setSalaFiltroTipo] = useState("");

  const [campusDialogOpen, setCampusDialogOpen] = useState(false);
  const [blocoDialogOpen, setBlocoDialogOpen] = useState(false);
  const [salaDialogOpen, setSalaDialogOpen] = useState(false);
  const [editingCampusId, setEditingCampusId] = useState<number | null>(null);
  const [editingBlocoId, setEditingBlocoId] = useState<number | null>(null);
  const [editingSalaId, setEditingSalaId] = useState<number | null>(null);
  const [campusForm, setCampusForm] = useState({ nome: "", endereco: "", descricao: "" });
  const [blocoForm, setBlocoForm] = useState({ nome: "", andar: "", descricao: "" });
  const [salaForm, setSalaForm] = useState({ nome: "", capacidade: "", tipo: "", status: "Ativa" });
  const [horariosPorSala, setHorariosPorSala] = useState<Record<number, HorarioSala[]>>({
    1: [{ id: 1, diaSemana: "Segunda", horarios: ["08:00 - 09:00", "14:00 - 15:00"] }],
    2: [{ id: 2, diaSemana: "Quarta", horarios: ["10:00 - 12:00"] }],
  });
  const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);
  const [horarioSalaId, setHorarioSalaId] = useState<number | null>(null);
  const [horarioDia, setHorarioDia] = useState("Segunda");
  const [novoHorarioInicio, setNovoHorarioInicio] = useState("08:00");
  const [novoHorarioFim, setNovoHorarioFim] = useState("09:00");

  const campusFiltrados = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return campi;
    return campi.filter((campus) =>
      campus.nome.toLowerCase().includes(term) ||
      campus.endereco.toLowerCase().includes(term) ||
      campus.descricao.toLowerCase().includes(term),
    );
  }, [campi, filtro]);

  const blocosFiltrados = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    if (!term) return blocos.filter((bloco) => bloco.campusId === selectedCampusId);
    return blocos.filter(
      (bloco) => bloco.campusId === selectedCampusId && (bloco.nome.toLowerCase().includes(term) || bloco.andar.toLowerCase().includes(term) || bloco.descricao.toLowerCase().includes(term)),
    );
  }, [blocos, filtro, selectedCampusId]);

  const salasFiltradas = useMemo(() => {
    const nome = salaFiltroNome.trim().toLowerCase();
    const capacidade = salaFiltroCapacidade.trim();
    const tipo = salaFiltroTipo.trim().toLowerCase();

    return salas.filter((sala) => {
      if (sala.blocoId !== selectedBlocoId) return false;
      const matchNome = !nome || sala.nome.toLowerCase().includes(nome);
      const matchCapacidade = !capacidade || String(sala.capacidade).includes(capacidade);
      const matchTipo = !tipo || sala.tipo.toLowerCase().includes(tipo);
      return matchNome && matchCapacidade && matchTipo;
    });
  }, [salas, salaFiltroNome, salaFiltroCapacidade, salaFiltroTipo, selectedBlocoId]);

  const campusSelecionado = campi.find((item) => item.id === selectedCampusId) ?? null;
  const blocoSelecionado = blocos.find((item) => item.id === selectedBlocoId) ?? null;
  const salaParaHorarios = salas.find((item) => item.id === horarioSalaId) ?? null;

  const resetCampusForm = () => {
    setCampusForm({ nome: "", endereco: "", descricao: "" });
    setEditingCampusId(null);
  };

  const resetBlocoForm = () => {
    setBlocoForm({ nome: "", andar: "", descricao: "" });
    setEditingBlocoId(null);
  };

  const resetSalaForm = () => {
    setSalaForm({ nome: "", capacidade: "", tipo: "", status: "Ativa" });
    setEditingSalaId(null);
  };

  const handleOpenCampusDialog = (campus?: Campus) => {
    if (campus) {
      setCampusForm({ nome: campus.nome, endereco: campus.endereco, descricao: campus.descricao });
      setEditingCampusId(campus.id);
    } else {
      resetCampusForm();
    }
    setCampusDialogOpen(true);
  };

  const handleOpenBlocoDialog = (bloco?: Bloco) => {
    if (bloco) {
      setBlocoForm({ nome: bloco.nome, andar: bloco.andar, descricao: bloco.descricao });
      setEditingBlocoId(bloco.id);
    } else {
      resetBlocoForm();
    }
    setBlocoDialogOpen(true);
  };

  const handleOpenSalaDialog = (sala?: Sala) => {
    if (sala) {
      setSalaForm({ nome: sala.nome, capacidade: String(sala.capacidade), tipo: sala.tipo, status: sala.status });
      setEditingSalaId(sala.id);
    } else {
      resetSalaForm();
    }
    setSalaDialogOpen(true);
  };

  const handleSaveCampus = () => {
    const nome = campusForm.nome.trim();
    if (!nome) return;

    if (editingCampusId) {
      setCampi((prev) => prev.map((item) => (item.id === editingCampusId ? { ...item, nome, endereco: campusForm.endereco.trim(), descricao: campusForm.descricao.trim() || "Sem descrição" } : item)));
    } else {
      const existe = campi.some((item) => item.nome.toLowerCase() === nome.toLowerCase());
      if (existe) {
        alert("Campus já existe.");
        return;
      }
      setCampi((prev) => [...prev, { id: Date.now(), nome, endereco: campusForm.endereco.trim(), descricao: campusForm.descricao.trim() || "Sem descrição" }]);
    }

    setCampusDialogOpen(false);
    resetCampusForm();
  };

  const handleDeleteCampus = (id: number) => {
    if (!confirm("Deseja excluir este campus e todos os blocos e salas relacionados?")) return;

    const blocosDoCampus = blocos.filter((bloco) => bloco.campusId === id).map((bloco) => bloco.id);
    setCampi((prev) => prev.filter((item) => item.id !== id));
    setBlocos((prev) => prev.filter((item) => item.campusId !== id));
    setSalas((prev) => prev.filter((item) => !blocosDoCampus.includes(item.blocoId)));

    if (selectedCampusId === id) {
      setSelectedCampusId(campi.find((item) => item.id !== id)?.id ?? null);
      setSelectedBlocoId(null);
      setView("campi");
    }
  };

  const handleSaveBloco = () => {
    const nome = blocoForm.nome.trim();
    if (!nome || !selectedCampusId) return;

    if (editingBlocoId) {
      setBlocos((prev) => prev.map((item) => (item.id === editingBlocoId ? { ...item, nome, andar: blocoForm.andar.trim(), descricao: blocoForm.descricao.trim() || "Sem descrição" } : item)));
    } else {
      const existe = blocos.some((item) => item.campusId === selectedCampusId && item.nome.toLowerCase() === nome.toLowerCase());
      if (existe) {
        alert("Bloco já existe neste campus.");
        return;
      }
      setBlocos((prev) => [...prev, { id: Date.now(), nome, campusId: selectedCampusId, andar: blocoForm.andar.trim(), descricao: blocoForm.descricao.trim() || "Sem descrição" }]);
    }

    setBlocoDialogOpen(false);
    resetBlocoForm();
  };

  const handleDeleteBloco = (id: number) => {
    if (!confirm("Deseja excluir este bloco e todas as salas relacionadas?")) return;
    setBlocos((prev) => prev.filter((item) => item.id !== id));
    setSalas((prev) => prev.filter((item) => item.blocoId !== id));
  };

  const handleSaveSala = () => {
    const nome = salaForm.nome.trim();
    if (!nome || !selectedBlocoId) return;

    const capacidade = Number(salaForm.capacidade);
    if (Number.isNaN(capacidade) || capacidade <= 0) {
      return;
    }

    if (editingSalaId) {
      setSalas((prev) => prev.map((item) => (item.id === editingSalaId ? { ...item, nome, capacidade, tipo: salaForm.tipo.trim() || "Teórica", status: salaForm.status } : item)));
    } else {
      const existe = salas.some((item) => item.blocoId === selectedBlocoId && item.nome.toLowerCase() === nome.toLowerCase());
      if (existe) {
        alert("Sala já existe neste bloco.");
        return;
      }
      setSalas((prev) => [...prev, { id: Date.now(), nome, blocoId: selectedBlocoId, capacidade, tipo: salaForm.tipo.trim() || "Teórica", status: salaForm.status }]);
    }

    setSalaDialogOpen(false);
    resetSalaForm();
  };

  const handleDeleteSala = (id: number) => {
    if (!confirm("Deseja excluir esta sala?")) return;
    setSalas((prev) => prev.filter((item) => item.id !== id));
  };

  const goToBlocos = (campus: Campus) => {
    setSelectedCampusId(campus.id);
    setView("blocos");
    setFiltro("");
  };

  const goToSalas = (bloco: Bloco) => {
    setSelectedBlocoId(bloco.id);
    setView("salas");
    setFiltro("");
  };

  const goBack = () => {
    if (view === "salas") {
      setView("blocos");
    } else if (view === "blocos") {
      setView("campi");
      setSelectedCampusId(null);
    }
    setFiltro("");
  };

  const handleOpenHorarios = (sala: Sala) => {
    setHorarioSalaId(sala.id);
    setHorarioDia("Segunda");
    setNovoHorarioInicio("08:00");
    setNovoHorarioFim("09:00");
    setHorariosDialogOpen(true);
  };

  const handleAdicionarHorario = () => {
    if (!horarioSalaId) return;

    const inicio = novoHorarioInicio.trim();
    const fim = novoHorarioFim.trim();
    if (!inicio || !fim || inicio >= fim) return;

    const valor = `${inicio} - ${fim}`;

    setHorariosPorSala((prev) => {
      const itens = prev[horarioSalaId] ?? [];
      const existente = itens.find((item) => item.diaSemana === horarioDia);

      if (existente) {
        if (existente.horarios.includes(valor)) {
          return prev;
        }

        return {
          ...prev,
          [horarioSalaId]: itens.map((item) => (item.diaSemana === horarioDia ? { ...item, horarios: [...item.horarios, valor] } : item)),
        };
      }

      return {
        ...prev,
        [horarioSalaId]: [...itens, { id: Date.now(), diaSemana: horarioDia, horarios: [valor] }],
      };
    });

    setNovoHorarioInicio("08:00");
    setNovoHorarioFim("09:00");
  };

  const handleRemoverHorario = (diaSemana: string, horario: string) => {
    if (!horarioSalaId) return;

    setHorariosPorSala((prev) => {
      const itens = prev[horarioSalaId] ?? [];
      const atualizados = itens
        .map((item) => (item.diaSemana === diaSemana ? { ...item, horarios: item.horarios.filter((valor) => valor !== horario) } : item))
        .filter((item) => item.horarios.length > 0);

      return {
        ...prev,
        [horarioSalaId]: atualizados,
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <DoorOpen className="h-3.5 w-3.5" />
            Gerenciar salas
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Campus, blocos e salas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Navegue por cada etapa com cadastro, edição e exclusão.</p>
        </div>
        {view !== "campi" && (
          <Button variant="outline" onClick={goBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {view === "campi" ? "Filtrar campus" : view === "blocos" ? "Filtrar blocos" : "Filtrar salas"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {view === "salas" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Nome</Label>
                <Input placeholder="Buscar por nome" value={salaFiltroNome} onChange={(event) => setSalaFiltroNome(event.target.value)} />
              </div>
              <div>
                <Label>Capacidade</Label>
                <Input placeholder="Ex.: 40" value={salaFiltroCapacidade} onChange={(event) => setSalaFiltroCapacidade(event.target.value)} />
              </div>
              <div>
                <Label>Tipo</Label>
                <Input placeholder="Ex.: laboratório" value={salaFiltroTipo} onChange={(event) => setSalaFiltroTipo(event.target.value)} />
              </div>
            </div>
          ) : (
            <Input
              placeholder={view === "campi" ? "Buscar campus" : "Buscar bloco"}
              value={filtro}
              onChange={(event) => setFiltro(event.target.value)}
            />
          )}
        </CardContent>
      </Card>

      {view === "campi" && (
        <>
          <div className="flex justify-end">
            <Dialog open={campusDialogOpen} onOpenChange={setCampusDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => handleOpenCampusDialog()}>
                  <Plus className="h-4 w-4" />
                  Novo campus
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCampusId ? "Editar campus" : "Novo campus"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome do campus</Label>
                    <Input value={campusForm.nome} onChange={(event) => setCampusForm((prev) => ({ ...prev, nome: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Endereço</Label>
                    <Input value={campusForm.endereco} onChange={(event) => setCampusForm((prev) => ({ ...prev, endereco: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Input value={campusForm.descricao} onChange={(event) => setCampusForm((prev) => ({ ...prev, descricao: event.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleSaveCampus}>
                    {editingCampusId ? "Salvar alterações" : "Criar campus"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {campusFiltrados.map((campus) => (
              <Card key={campus.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{campus.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{campus.endereco}</p>
                  <p className="text-sm text-muted-foreground">{campus.descricao}</p>
                  <div className="text-xs text-muted-foreground">
                    {blocos.filter((bloco) => bloco.campusId === campus.id).length} blocos
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => goToBlocos(campus)}>
                      Ver blocos
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleOpenCampusDialog(campus)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteCampus(campus.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {view === "blocos" && campusSelecionado && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Blocos de {campusSelecionado.nome}</h2>
              <p className="text-sm text-muted-foreground">Gerencie os blocos deste campus.</p>
            </div>
            <Dialog open={blocoDialogOpen} onOpenChange={setBlocoDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => handleOpenBlocoDialog()}>
                  <Plus className="h-4 w-4" />
                  Novo bloco
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingBlocoId ? "Editar bloco" : "Novo bloco"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome do bloco</Label>
                    <Input value={blocoForm.nome} onChange={(event) => setBlocoForm((prev) => ({ ...prev, nome: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Andar</Label>
                    <Input value={blocoForm.andar} onChange={(event) => setBlocoForm((prev) => ({ ...prev, andar: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Input value={blocoForm.descricao} onChange={(event) => setBlocoForm((prev) => ({ ...prev, descricao: event.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleSaveBloco}>
                    {editingBlocoId ? "Salvar alterações" : "Criar bloco"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blocosFiltrados.map((bloco) => (
              <Card key={bloco.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{bloco.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{bloco.andar}</p>
                  <p className="text-sm text-muted-foreground">{bloco.descricao}</p>
                  <div className="text-xs text-muted-foreground">
                    {salas.filter((sala) => sala.blocoId === bloco.id).length} salas
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => goToSalas(bloco)}>
                      Ver salas
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleOpenBlocoDialog(bloco)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteBloco(bloco.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {view === "salas" && blocoSelecionado && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Salas de {blocoSelecionado.nome}</h2>
              <p className="text-sm text-muted-foreground">Gerencie as salas deste bloco.</p>
            </div>
            <Dialog open={salaDialogOpen} onOpenChange={setSalaDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => handleOpenSalaDialog()}>
                  <Plus className="h-4 w-4" />
                  Nova sala
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSalaId ? "Editar sala" : "Nova sala"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome da sala</Label>
                    <Input value={salaForm.nome} onChange={(event) => setSalaForm((prev) => ({ ...prev, nome: event.target.value }))} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Capacidade</Label>
                      <Input type="number" min="1" value={salaForm.capacidade} onChange={(event) => setSalaForm((prev) => ({ ...prev, capacidade: event.target.value }))} />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <select value={salaForm.status} onChange={(event) => setSalaForm((prev) => ({ ...prev, status: event.target.value }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                        <option value="Ativa">Ativa</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Inativa">Inativa</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Input value={salaForm.tipo} onChange={(event) => setSalaForm((prev) => ({ ...prev, tipo: event.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleSaveSala}>
                    {editingSalaId ? "Salvar alterações" : "Criar sala"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {salasFiltradas.map((sala) => (
              <Card key={sala.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle>{sala.nome}</CardTitle>
                    <Badge variant="secondary">{sala.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {sala.capacidade} pessoas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {sala.tipo}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => handleOpenHorarios(sala)}>
                      <Clock3 className="h-4 w-4" />
                      Horários
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleOpenSalaDialog(sala)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteSala(sala.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={horariosDialogOpen} onOpenChange={setHorariosDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Horários de funcionamento - {salaParaHorarios?.nome ?? "Sala"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label>Dia da semana</Label>
                <select
                  value={horarioDia}
                  onChange={(event) => setHorarioDia(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                >
                  {diasDaSemana.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Início</Label>
                <Input type="time" value={novoHorarioInicio} onChange={(event) => setNovoHorarioInicio(event.target.value)} />
              </div>
              <div>
                <Label>Fim</Label>
                <Input type="time" value={novoHorarioFim} onChange={(event) => setNovoHorarioFim(event.target.value)} />
              </div>
            </div>
            <Button className="w-full gap-2" onClick={handleAdicionarHorario}>
              <Plus className="h-4 w-4" />
              Adicionar horário
            </Button>

            <div className="space-y-3">
              {(horarioSalaId ? horariosPorSala[horarioSalaId] ?? [] : []).map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-3">
                  <div className="mb-2 font-medium text-foreground">{item.diaSemana}</div>
                  <div className="flex flex-wrap gap-2">
                    {item.horarios.map((horario) => (
                      <div key={horario} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                        <span>{horario}</span>
                        <button type="button" onClick={() => handleRemoverHorario(item.diaSemana, horario)} className="text-muted-foreground hover:text-foreground">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsManagementPage;
