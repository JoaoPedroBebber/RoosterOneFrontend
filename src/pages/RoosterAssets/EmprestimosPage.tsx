import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  PackageCheck,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

type Categoria = {
  id: number;
  nome: string;
  descricao: string;
  localizacao: string;
};

type Equipamento = {
  id: number;
  categoriaId: number;
  nome: string;
  marca: string;
  modelo: string;
  patrimonio: string;
  serial: string;
  status: string;
  localizacao: string;
  descricao: string;
};

type Emprestimo = {
  id: number;
  equipamentoId: number;
  responsavel: string;
  finalidade: string;
  dataEmprestimo: string;
  dataDevolucao: string;
  observacao: string;
  status: "Ativo" | "Devolvido";
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

const initialCategorias: Categoria[] = [
  { id: 1, nome: "Informática", descricao: "Computadores e periféricos", localizacao: "Bloco A" },
  { id: 2, nome: "Audiovisual", descricao: "Projetores e monitores", localizacao: "Bloco B" },
  { id: 3, nome: "Laboratório", descricao: "Equipamentos técnicos", localizacao: "Lab 204" },
];

const initialEquipamentos: Equipamento[] = [
  {
    id: 1,
    categoriaId: 1,
    nome: "Notebook Dell",
    marca: "Dell",
    modelo: "Latitude 5430",
    patrimonio: "PAT-1001",
    serial: "DL-5430-001",
    status: "Disponível",
    localizacao: "Sala 101",
    descricao: "Notebook para uso acadêmico",
  },
  {
    id: 2,
    categoriaId: 2,
    nome: "Projetor Epson",
    marca: "Epson",
    modelo: "EB-970",
    patrimonio: "PAT-1002",
    serial: "EP-970-202",
    status: "Em empréstimo",
    localizacao: "Auditório A",
    descricao: "Projetor multimídia",
  },
  {
    id: 3,
    categoriaId: 3,
    nome: "Microscópio", 
    marca: "Zeiss",
    modelo: "Axiolab",
    patrimonio: "PAT-1003",
    serial: "ZS-AX-101",
    status: "Disponível",
    localizacao: "Lab 204",
    descricao: "Microscópio óptico",
  },
];

const initialEmprestimos: Emprestimo[] = [
  {
    id: 1,
    equipamentoId: 2,
    responsavel: "Ana Souza",
    finalidade: "Apresentação de turma",
    dataEmprestimo: "2026-06-27",
    dataDevolucao: "2026-06-28",
    observacao: "Retirada no período da tarde",
    status: "Ativo",
  },
];

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

const EmprestimosPage = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(initialEquipamentos);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>(initialEmprestimos);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(initialCategorias[0]?.id ?? 0);
  const [selectedEquipamentoId, setSelectedEquipamentoId] = useState(initialEquipamentos[0]?.id ?? 0);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [selectedReservationDate, setSelectedReservationDate] = useState(formatDateKey(new Date()));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    responsavel: "",
    finalidade: "",
    dataEmprestimo: formatDateKey(new Date()),
    dataDevolucao: formatDateKey(new Date()),
    observacao: "",
    status: "Ativo" as "Ativo" | "Devolvido",
  });

  const equipamentosDaCategoria = useMemo(
    () => equipamentos.filter((item) => item.categoriaId === selectedCategoriaId),
    [equipamentos, selectedCategoriaId],
  );

  const equipamentoSelecionado = useMemo(
    () => equipamentos.find((item) => item.id === selectedEquipamentoId) ?? null,
    [equipamentos, selectedEquipamentoId],
  );

  const emprestimosDoEquipamento = useMemo(
    () => emprestimos.filter((item) => item.equipamentoId === selectedEquipamentoId),
    [emprestimos, selectedEquipamentoId],
  );

  const emprestimosFiltrados = useMemo(() => {
    if (!selectedReservationDate) return emprestimosDoEquipamento;
    return emprestimosDoEquipamento.filter((item) => item.dataEmprestimo === selectedReservationDate);
  }, [emprestimosDoEquipamento, selectedReservationDate]);

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

  const reservedDates = useMemo(() => new Set(emprestimosDoEquipamento.map((item) => item.dataEmprestimo)), [emprestimosDoEquipamento]);

  const handleCreateEmprestimo = () => {
    if (!form.responsavel.trim() || !form.finalidade.trim()) return;

    const newLoan: Emprestimo = {
      id: Date.now(),
      equipamentoId: selectedEquipamentoId,
      responsavel: form.responsavel,
      finalidade: form.finalidade,
      dataEmprestimo: form.dataEmprestimo,
      dataDevolucao: form.dataDevolucao,
      observacao: form.observacao,
      status: form.status,
    };

    setEmprestimos((prev) => [newLoan, ...prev]);
    setForm({
      responsavel: "",
      finalidade: "",
      dataEmprestimo: formatDateKey(new Date()),
      dataDevolucao: formatDateKey(new Date()),
      observacao: "",
      status: "Ativo",
    });
    setSelectedReservationDate(newLoan.dataEmprestimo);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <PackageCheck className="h-3.5 w-3.5" />
            Empréstimo
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Reserve equipamentos para uso institucional</h1>
          <p className="mt-1 text-sm text-muted-foreground">Escolha a categoria, o item e registre a retirada com data de devolução.</p>
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
              <CardTitle>Seleção do equipamento</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Categoria</Label>
                <SearchableSelect
                  value={selectedCategoriaId}
                  placeholder="Selecionar categoria"
                  searchPlaceholder="Buscar categoria..."
                  emptyText="Nenhuma categoria encontrada."
                  options={categorias.map((item) => ({ value: item.id, label: item.nome, description: item.descricao }))}
                  onChange={(categoriaId) => {
                    setSelectedCategoriaId(categoriaId);
                    const primeiroEquipamento = equipamentos.filter((item) => item.categoriaId === categoriaId)[0];
                    if (primeiroEquipamento) {
                      setSelectedEquipamentoId(primeiroEquipamento.id);
                    }
                  }}
                />
              </div>
              <div>
                <Label>Equipamento</Label>
                <SearchableSelect
                  value={selectedEquipamentoId}
                  placeholder="Selecionar equipamento"
                  searchPlaceholder="Buscar equipamento..."
                  emptyText="Nenhum equipamento encontrado."
                  options={equipamentosDaCategoria.map((item) => ({ value: item.id, label: item.nome, description: `${item.marca} · ${item.patrimonio}` }))}
                  onChange={setSelectedEquipamentoId}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between gap-2">
              <CardTitle>Empréstimos do item</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-2" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Novo empréstimo
                </Button>
                <Badge variant="secondary" className="rounded-full">
                  {equipamentoSelecionado?.nome ?? "Nenhum item"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{equipamentoSelecionado?.nome ?? "Selecione um equipamento"}</p>
                    <p className="text-sm text-muted-foreground">
                      {equipamentoSelecionado ? `${equipamentoSelecionado.marca} · ${equipamentoSelecionado.patrimonio}` : "Os registros aparecerão aqui."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {equipamentoSelecionado?.status ?? "Sem status"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {emprestimosFiltrados.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-card p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{item.finalidade}</p>
                        <p className="text-sm text-muted-foreground">{item.responsavel}</p>
                      </div>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{item.dataEmprestimo}</span>
                      <span className="flex items-center gap-1"><ClipboardList className="h-4 w-4" />{item.dataDevolucao}</span>
                    </div>
                    {item.observacao && <p className="mt-2 text-sm text-muted-foreground">{item.observacao}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendário de empréstimos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
                Anterior
              </Button>
              <div className="flex-1 text-center text-sm font-semibold">
                {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
                Próximo
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
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
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">Data selecionada</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReservationDate}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {emprestimosFiltrados.length} empréstimos
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Novo empréstimo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Responsável</Label>
              <Input value={form.responsavel} onChange={(event) => setForm((prev) => ({ ...prev, responsavel: event.target.value }))} />
            </div>
            <div>
              <Label>Finalidade</Label>
              <Input value={form.finalidade} onChange={(event) => setForm((prev) => ({ ...prev, finalidade: event.target.value }))} />
            </div>
            <div>
              <Label>Data do empréstimo</Label>
              <Input type="date" value={form.dataEmprestimo} onChange={(event) => setForm((prev) => ({ ...prev, dataEmprestimo: event.target.value }))} />
            </div>
            <div>
              <Label>Data de devolução</Label>
              <Input type="date" value={form.dataDevolucao} onChange={(event) => setForm((prev) => ({ ...prev, dataDevolucao: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as "Ativo" | "Devolvido" }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Ativo">Ativo</option>
                <option value="Devolvido">Devolvido</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Observação</Label>
              <Textarea value={form.observacao} onChange={(event) => setForm((prev) => ({ ...prev, observacao: event.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleCreateEmprestimo}>Salvar empréstimo</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmprestimosPage;
