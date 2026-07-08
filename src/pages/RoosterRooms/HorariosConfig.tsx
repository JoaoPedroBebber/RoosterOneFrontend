import { useMemo, useState } from "react";
import { CalendarDays, Clock3, DoorOpen, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type HorarioConfigurado = {
  id: number;
  diaSemana: string;
  horario: string;
  salas: number[];
};

type SalaResumo = {
  id: number;
  nome: string;
};

const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const horariosBase = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const salasBase: SalaResumo[] = [
  { id: 1, nome: "Sala 101" },
  { id: 2, nome: "Lab 204" },
  { id: 3, nome: "Sala 302" },
];

const HorariosConfig = () => {
  const [diaSelecionado, setDiaSelecionado] = useState("Segunda");
  const [horarioSelecionado, setHorarioSelecionado] = useState(horariosBase[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [configuracoes, setConfiguracoes] = useState<HorarioConfigurado[]>([
    { id: 1, diaSemana: "Segunda", horario: "08:00 - 09:00", salas: [1, 2] },
    { id: 2, diaSemana: "Quarta", horario: "14:00 - 15:00", salas: [3] },
  ]);

  const handleAdicionarHorario = () => {
    if (!diaSelecionado || !horarioSelecionado) return;

    const jaExiste = configuracoes.some(
      (item) => item.diaSemana === diaSelecionado && item.horario === horarioSelecionado,
    );

    if (jaExiste) return;

    setConfiguracoes((prev) => [
      ...prev,
      {
        id: Date.now(),
        diaSemana: diaSelecionado,
        horario: horarioSelecionado,
        salas: [],
      },
    ]);
    setIsDialogOpen(false);
    setDiaSelecionado(diasDaSemana[0]);
    setHorarioSelecionado(horariosBase[0]);
  };

  const handleAlternarSala = (configId: number, salaId: number) => {
    setConfiguracoes((prev) =>
      prev.map((item) => {
        if (item.id !== configId) return item;

        const jaAssociada = item.salas.includes(salaId);
        return {
          ...item,
          salas: jaAssociada ? item.salas.filter((id) => id !== salaId) : [...item.salas, salaId],
        };
      }),
    );
  };

  const handleRemoverHorario = (configId: number) => {
    setConfiguracoes((prev) => prev.filter((item) => item.id !== configId));
  };

  const agrupadoPorDia = useMemo(() => {
    return configuracoes.reduce<Record<string, HorarioConfigurado[]>>((acc, item) => {
      acc[item.diaSemana] = acc[item.diaSemana] ? [...acc[item.diaSemana], item] : [item];
      return acc;
    }, {});
  }, [configuracoes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <Clock3 className="h-3.5 w-3.5" />
            Configuração de horários
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Cadastre dias e horários disponíveis para reservas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Defina os turnos liberados e associe as salas que poderão usar cada opção.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo horário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar horário disponível</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Dia da semana</Label>
                <select
                  value={diaSelecionado}
                  onChange={(event) => setDiaSelecionado(event.target.value)}
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
                <Label>Horário</Label>
                <select
                  value={horarioSelecionado}
                  onChange={(event) => setHorarioSelecionado(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                >
                  {horariosBase.map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="w-full gap-2" onClick={handleAdicionarHorario}>
                <Plus className="h-4 w-4" />
                Criar horário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Horários cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(agrupadoPorDia).length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                Nenhum horário cadastrado ainda.
              </div>
            )}

            {Object.entries(agrupadoPorDia).map(([dia, itens]) => (
              <div key={dia} className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{dia}</span>
                </div>
                <div className="space-y-2">
                  {itens.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{item.horario}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoverHorario(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.salas.length > 0 ? (
                          item.salas.map((salaId) => {
                            const sala = salasBase.find((itemSala) => itemSala.id === salaId);
                            return sala ? <Badge key={salaId} variant="secondary">{sala.nome}</Badge> : null;
                          })
                        ) : (
                          <span className="text-sm text-muted-foreground">Ainda não há salas associadas.</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associar salas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Marque as salas que poderão usar cada horário cadastrado.
            </p>

            {configuracoes.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                Cadastre um horário para começar a associar salas.
              </div>
            )}

            {configuracoes.map((item) => (
              <div key={item.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{item.diaSemana}</p>
                    <p className="text-sm text-muted-foreground">{item.horario}</p>
                  </div>
                  <Badge variant="outline">{item.salas.length} salas</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {salasBase.map((sala) => (
                    <label key={sala.id} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                      <Checkbox
                        checked={item.salas.includes(sala.id)}
                        onCheckedChange={() => handleAlternarSala(item.id, sala.id)}
                      />
                      <span className="flex items-center gap-2">
                        <DoorOpen className="h-4 w-4 text-muted-foreground" />
                        {sala.nome}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HorariosConfig;
