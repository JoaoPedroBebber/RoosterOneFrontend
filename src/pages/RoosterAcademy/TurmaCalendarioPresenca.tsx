import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Users2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { initialAlunos, initialAulas, initialTurmas, type Aula } from "@/pages/RoosterAcademy/controleAulasData";

type AttendanceStatus = "Presente" | "Ausente" | "Falta justificada";

type AttendanceRecord = {
  aulaId: number;
  alunoId: number;
  status: AttendanceStatus;
};

const formatDateKey = (date: Date | string) => {
  if (typeof date === "string") return date;
  return date.toISOString().slice(0, 10);
};

const TurmaCalendarioPresenca = () => {
  const navigate = useNavigate();
  const { turmaId } = useParams();
  const turmaIdNumber = Number(turmaId);

  const selectedTurma = useMemo(
    () => initialTurmas.find((turma) => turma.id === turmaIdNumber) ?? null,
    [turmaIdNumber],
  );

  const turmaAulas = useMemo(
    () => (selectedTurma ? initialAulas.filter((aula) => aula.turmaId === selectedTurma.id) : []),
    [selectedTurma],
  );

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAulaId, setSelectedAulaId] = useState<number>(0);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(() =>
    initialAulas.flatMap((aula) =>
      initialAlunos
        .filter((aluno) => aluno.turmaId === aula.turmaId)
        .map((aluno) => ({
          aulaId: aula.id,
          alunoId: aluno.id,
          status: "Presente" as AttendanceStatus,
        })),
    ),
  );

  useEffect(() => {
    if (!selectedTurma) return;
    const aulas = initialAulas.filter((aula) => aula.turmaId === selectedTurma.id);
    const firstAula = aulas[0];
    setSelectedDate(firstAula ? new Date(firstAula.data) : new Date());
    setSelectedAulaId(firstAula?.id ?? 0);
  }, [selectedTurma]);

  const turmaAulasForDate = useMemo(
    () => turmaAulas.filter((aula) => aula.data === formatDateKey(selectedDate)),
    [turmaAulas, selectedDate],
  );

  const selectedAula = useMemo(
    () => turmaAulas.find((aula) => aula.id === selectedAulaId) ?? turmaAulasForDate[0] ?? turmaAulas[0] ?? null,
    [turmaAulas, turmaAulasForDate, selectedAulaId],
  );

  const alunosDaAula = useMemo(
    () => (selectedAula ? initialAlunos.filter((aluno) => aluno.turmaId === selectedAula.turmaId) : []),
    [selectedAula],
  );

  const attendanceForSelectedAula = useMemo(
    () => attendanceData.filter((record) => record.aulaId === selectedAula?.id),
    [attendanceData, selectedAula],
  );

  const handleOpenAttendanceDialog = (aula: Aula) => {
    setSelectedAulaId(aula.id);
    setAttendanceDialogOpen(true);
  };

  const toggleAttendance = (alunoId: number, status: AttendanceStatus) => {
    if (!selectedAula) return;
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.aulaId === selectedAula.id && record.alunoId === alunoId ? { ...record, status } : record,
      ),
    );
  };

  if (!selectedTurma) {
    return (
      <div className="space-y-6">
        <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/controle-presenca")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar ao controle de presença
        </Button>
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Turma não encontrada.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/controle-presenca")}>
            <ArrowLeft className="h-4 w-4" />
            Voltar ao controle de presença
          </Button>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <CalendarDays className="h-3.5 w-3.5" />
              Calendário da turma
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{selectedTurma.nome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Veja as aulas da turma, selecione uma data e registre a presença dos alunos.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-6 lg:grid-cols-[0.95fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Calendário</div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                captionLayout="dropdown"
                fromMonth={new Date(2026, 0, 1)}
                toMonth={new Date(2026, 11, 31)}
                modifiers={{
                  aula: turmaAulas.map((aula) => new Date(aula.data)),
                }}
              />
            </div>

            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Aulas em {formatDateKey(selectedDate)}</div>
              {turmaAulasForDate.length ? (
                <div className="mt-3 space-y-2">
                  {turmaAulasForDate.map((aula) => (
                    <div key={aula.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                      <div>
                        <div className="font-semibold text-foreground">{aula.topico}</div>
                        <div className="text-sm text-muted-foreground">{aula.horario}</div>
                      </div>
                      <Button size="sm" onClick={() => handleOpenAttendanceDialog(aula)}>
                        Registrar presença
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Nenhuma aula agendada para este dia.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users2 className="h-4 w-4" />
                  Aula selecionada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedAula ? (
                  <>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Aula</div>
                      <div className="font-semibold text-foreground">{selectedAula.topico}</div>
                      <div className="text-sm text-muted-foreground">{selectedAula.horario}</div>
                    </div>
                    <Button className="w-full" onClick={() => setAttendanceDialogOpen(true)}>
                      Abrir registro de presença
                    </Button>
                  </>
                ) : (
                  <div className="rounded-lg border p-6 text-sm text-muted-foreground">Selecione uma aula para registrar a presença.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Dialog open={attendanceDialogOpen} onOpenChange={setAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar presença · {selectedAula?.topico ?? "Aula"}</DialogTitle>
          </DialogHeader>
          {selectedAula ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Turma</div>
                <div className="font-semibold text-foreground">{selectedTurma.nome}</div>
                <div className="text-sm text-muted-foreground">{selectedAula.horario}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2">Aluno</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosDaAula.map((aluno) => {
                      const record = attendanceForSelectedAula.find((item) => item.alunoId === aluno.id);
                      return (
                        <tr key={aluno.id} className="border-b last:border-0">
                          <td className="py-3 font-medium">{aluno.nome}</td>
                          <td className="py-3">
                            <Badge variant={record?.status === "Presente" ? "secondary" : record?.status === "Ausente" ? "destructive" : "outline"}>
                              {record?.status ?? "Presente"}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => toggleAttendance(aluno.id, "Presente")}>
                                Presente
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => toggleAttendance(aluno.id, "Ausente")}>
                                Ausente
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">Selecione uma aula para continuar.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TurmaCalendarioPresenca;
