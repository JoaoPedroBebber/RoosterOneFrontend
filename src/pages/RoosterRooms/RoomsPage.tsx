import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  DoorOpen,
  Plus,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

type SelectOption = {
  value: number;
  label: string;
  description?: string;
};

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

type Reserva = {
  id: number;
  salaId: number;
  titulo: string;
  responsavel: string;
  data: string;
  horario: string;
  observacao: string;
};

const SearchableSelect = ({
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  onChange,
}: {
  value: number;
  options: SelectOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  onChange: (value: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors hover:bg-muted/50"
        >
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-64 overflow-y-auto">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${option.value === value ? "opacity-100" : "opacity-0"}`} />
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

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

const initialReservas: Reserva[] = [
  { id: 1, salaId: 1, titulo: "Aula de Matemática", responsavel: "Ana Souza", data: "2026-06-27", horario: "08:00 - 10:00", observacao: "Turma 3A" },
  { id: 2, salaId: 1, titulo: "Reunião de Coordenação", responsavel: "João Pereira", data: "2026-06-29", horario: "14:00 - 15:00", observacao: "Sala reservada para reunião" },
  { id: 3, salaId: 2, titulo: "Prática de Redes", responsavel: "Marina Costa", data: "2026-06-30", horario: "10:00 - 12:00", observacao: "Turma de TI" },
];

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

const RoomsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [campi, setCampi] = useState<Campus[]>(initialCampi);
  const [blocos, setBlocos] = useState<Bloco[]>(initialBlocos);
  const [salas, setSalas] = useState<Sala[]>(initialSalas);
  const [reservas, setReservas] = useState<Reserva[]>(initialReservas);

  const [selectedCampusId, setSelectedCampusId] = useState(initialCampi[0]?.id ?? 0);
  const [selectedBlocoId, setSelectedBlocoId] = useState(initialBlocos[0]?.id ?? 0);
  const [selectedSalaId, setSelectedSalaId] = useState(initialSalas[0]?.id ?? 0);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [selectedReservationDate, setSelectedReservationDate] = useState(formatDateKey(new Date()));
  const [isReservaDialogOpen, setIsReservaDialogOpen] = useState(false);
  const [reservaForm, setReservaForm] = useState({
    titulo: "",
    responsavel: "",
    data: formatDateKey(new Date()),
    horario: "08:00 - 09:00",
    observacao: "",
  });

  useEffect(() => {
    if (location.pathname === "/rooms/reservas") {
      const salaId = Number(new URLSearchParams(location.search).get("sala"));
      if (!Number.isNaN(salaId) && salaId > 0) {
        setSelectedSalaId(salaId);
      }
    }
  }, [location.pathname, location.search]);

  const blocosDaReserva = useMemo(
    () => blocos.filter((item) => item.campusId === selectedCampusId),
    [blocos, selectedCampusId],
  );

  const salasDaReserva = useMemo(
    () => salas.filter((item) => item.blocoId === selectedBlocoId),
    [salas, selectedBlocoId],
  );

  const salaSelecionada = useMemo(
    () => salas.find((item) => item.id === selectedSalaId) ?? null,
    [salas, selectedSalaId],
  );

  const reservasDaSala = useMemo(
    () => reservas.filter((item) => item.salaId === selectedSalaId),
    [reservas, selectedSalaId],
  );

  const reservasDaSalaOrdenadas = useMemo(
    () => [...reservasDaSala].sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`)),
    [reservasDaSala],
  );

  const reservasDaSalaFiltradasPorData = useMemo(() => {
    if (!selectedReservationDate) return reservasDaSalaOrdenadas;
    return reservasDaSalaOrdenadas.filter((item) => item.data === selectedReservationDate);
  }, [reservasDaSalaOrdenadas, selectedReservationDate]);

  useEffect(() => {
    if (blocosDaReserva.length > 0 && !blocosDaReserva.some((item) => item.id === selectedBlocoId)) {
      setSelectedBlocoId(blocosDaReserva[0].id);
    }
  }, [blocosDaReserva, selectedBlocoId]);

  useEffect(() => {
    if (salasDaReserva.length > 0 && !salasDaReserva.some((item) => item.id === selectedSalaId)) {
      setSelectedSalaId(salasDaReserva[0].id);
    }
  }, [salasDaReserva, selectedSalaId]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const days: Array<Date | null> = [];

    for (let index = 0; index < startOffset; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }

    return days;
  }, [currentMonth]);

  const reservedDates = useMemo(() => new Set(reservasDaSala.map((item) => item.data)), [reservasDaSala]);

  const handleCreateReserva = () => {
    if (!reservaForm.titulo.trim() || !reservaForm.data) return;

    const newReserva: Reserva = {
      id: Date.now(),
      salaId: selectedSalaId,
      titulo: reservaForm.titulo,
      responsavel: reservaForm.responsavel,
      data: reservaForm.data,
      horario: reservaForm.horario,
      observacao: reservaForm.observacao,
    };

    setReservas((prev) => [newReserva, ...prev]);
    setReservaForm({ titulo: "", responsavel: "", data: formatDateKey(new Date()), horario: "08:00 - 09:00", observacao: "" });
    setSelectedReservationDate(newReserva.data);
    setIsReservaDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <DoorOpen className="h-3.5 w-3.5" />
            Reserva de salas
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Gerencie reservas e disponibilidade</h1>
          <p className="mt-1 text-sm text-muted-foreground">Selecione campus, bloco e sala com busca e acompanhe a agenda do dia.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seleção da sala</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Campus</Label>
                <SearchableSelect
                  value={selectedCampusId}
                  placeholder="Selecionar campus"
                  searchPlaceholder="Buscar campus..."
                  emptyText="Nenhum campus encontrado."
                  options={campi.map((item) => ({ value: item.id, label: item.nome, description: item.endereco }))}
                  onChange={(campusId) => {
                    setSelectedCampusId(campusId);
                    const blocosDoCampusSelecionado = blocos.filter((item) => item.campusId === campusId);
                    const primeiroBloco = blocosDoCampusSelecionado[0];
                    if (primeiroBloco) {
                      setSelectedBlocoId(primeiroBloco.id);
                      const primeiraSala = salas.filter((item) => item.blocoId === primeiroBloco.id)[0];
                      if (primeiraSala) {
                        setSelectedSalaId(primeiraSala.id);
                      }
                    }
                  }}
                />
              </div>
              <div>
                <Label>Bloco</Label>
                <SearchableSelect
                  value={selectedBlocoId}
                  placeholder="Selecionar bloco"
                  searchPlaceholder="Buscar bloco..."
                  emptyText="Nenhum bloco encontrado."
                  options={blocosDaReserva.map((item) => ({ value: item.id, label: item.nome, description: item.andar }))}
                  onChange={(blocoId) => {
                    setSelectedBlocoId(blocoId);
                    const primeiraSala = salas.filter((item) => item.blocoId === blocoId)[0];
                    if (primeiraSala) {
                      setSelectedSalaId(primeiraSala.id);
                    }
                  }}
                />
              </div>
              <div>
                <Label>Sala</Label>
                <SearchableSelect
                  value={selectedSalaId}
                  placeholder="Selecionar sala"
                  searchPlaceholder="Buscar sala..."
                  emptyText="Nenhuma sala encontrada."
                  options={salasDaReserva.map((item) => ({ value: item.id, label: item.nome, description: `Capacidade ${item.capacidade} pessoas` }))}
                  onChange={setSelectedSalaId}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between gap-2">
              <CardTitle>Reservas da sala</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setReservaForm((prev) => ({ ...prev, data: selectedReservationDate || prev.data }));
                    setIsReservaDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Nova reserva
                </Button>
                <Badge variant="secondary" className="rounded-full">
                  {salaSelecionada?.nome ?? "Nenhuma sala"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{salaSelecionada?.nome ?? "Selecione uma sala"}</p>
                    <p className="text-sm text-muted-foreground">
                      {salaSelecionada ? `${salaSelecionada.tipo} · ${salaSelecionada.capacidade} lugares` : "As reservas aparecerão aqui."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {salaSelecionada?.capacidade ?? 0}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {reservasDaSalaFiltradasPorData.map((reserva) => (
                  <div key={reserva.id} className="rounded-lg border border-border bg-card p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{reserva.titulo}</p>
                        <p className="text-sm text-muted-foreground">{reserva.responsavel}</p>
                      </div>
                      <Badge variant="outline">{reserva.horario}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {reserva.data}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        {reserva.horario}
                      </span>
                      {reserva.observacao && <span>{reserva.observacao}</span>}
                    </div>
                  </div>
                ))}
                {!reservasDaSalaFiltradasPorData.length && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Nenhuma reserva cadastrada para a data selecionada.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>Anterior</Button>
                <div className="flex-1 text-center text-sm font-semibold">{currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</div>
                <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>Próximo</Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square rounded border border-transparent" />;
                  }
                  const key = formatDateKey(day);
                  const isReserved = reservedDates.has(key);
                  const isSelected = selectedReservationDate === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedReservationDate(key)}
                      className={`aspect-square rounded border text-xs font-medium transition-colors ${isReserved ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground"} ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}`}
                    >
                      <span className="flex h-full items-center justify-center">{day.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <Dialog open={isReservaDialogOpen} onOpenChange={setIsReservaDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input value={reservaForm.titulo} onChange={(event) => setReservaForm((prev) => ({ ...prev, titulo: event.target.value }))} placeholder="Ex.: Reunião de equipe" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label>Responsável</Label>
                <Input value={reservaForm.responsavel} onChange={(event) => setReservaForm((prev) => ({ ...prev, responsavel: event.target.value }))} placeholder="Nome" />
              </div>
              <div>
                <Label>Data</Label>
                <Input value={reservaForm.data} readOnly disabled className="bg-muted/50" />
              </div>
            </div>
            <div>
              <Label>Horário</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>{reservaForm.horario || "Selecionar horário"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1" align="start">
                  <div className="max-h-56 overflow-y-auto">
                    {[
                      "08:00 - 09:00",
                      "09:00 - 10:00",
                      "10:00 - 11:00",
                      "11:00 - 12:00",
                      "13:00 - 14:00",
                      "14:00 - 15:00",
                      "15:00 - 16:00",
                      "16:00 - 17:00",
                    ].map((horario) => (
                      <button
                        key={horario}
                        type="button"
                        onClick={() => setReservaForm((prev) => ({ ...prev, horario }))}
                        className={`flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted ${reservaForm.horario === horario ? "bg-muted font-medium" : ""}`}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Observação</Label>
              <Textarea value={reservaForm.observacao} onChange={(event) => setReservaForm((prev) => ({ ...prev, observacao: event.target.value }))} placeholder="Informações extras" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsReservaDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateReserva} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar reserva
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsPage;
