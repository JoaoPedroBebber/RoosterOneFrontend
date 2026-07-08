import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialAlunos, initialAulas, initialTurmas } from "@/pages/RoosterAcademy/controleAulasData";

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

const professorAtual = "Marina Souza";

const ControlePresenca = () => {
  const navigate = useNavigate();
  const [filterTurma, setFilterTurma] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterTurno, setFilterTurno] = useState("");
  const [turmaDialogOpen, setTurmaDialogOpen] = useState(false);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number>(() => initialTurmas.filter((turma) => turma.professor === professorAtual)[0]?.id ?? 0);

  const professorTurmas = useMemo(
    () => initialTurmas.filter((turma) => turma.professor === professorAtual),
    [],
  );

  const turmasFiltradas = useMemo(
    () =>
      professorTurmas.filter((turma) => {
        const matchesTurma = !filterTurma || turma.nome.toLowerCase().includes(filterTurma.toLowerCase());
        const matchesCurso = !filterCurso || turma.curso.toLowerCase().includes(filterCurso.toLowerCase());
        const matchesTurno = !filterTurno || turma.turno.toLowerCase().includes(filterTurno.toLowerCase());
        return matchesTurma && matchesCurso && matchesTurno;
      }),
    [professorTurmas, filterTurma, filterCurso, filterTurno],
  );

  useEffect(() => {
    if (!turmasFiltradas.length) return;
    if (!turmasFiltradas.some((turma) => turma.id === selectedTurmaId)) {
      setSelectedTurmaId(turmasFiltradas[0].id);
    }
  }, [selectedTurmaId, turmasFiltradas]);

  const selectedTurma = useMemo(
    () => turmasFiltradas.find((turma) => turma.id === selectedTurmaId) ?? turmasFiltradas[0] ?? null,
    [turmasFiltradas, selectedTurmaId],
  );

  const turmaAulas = useMemo(
    () => (selectedTurma ? initialAulas.filter((aula) => aula.turmaId === selectedTurma.id) : []),
    [selectedTurma],
  );

  const firstTurmaDate = useMemo(
    () => (turmaAulas[0] ? new Date(turmaAulas[0].data) : new Date()),
    [turmaAulas],
  );

  const [selectedDate, setSelectedDate] = useState<Date>(firstTurmaDate);
  const [selectedAulaId, setSelectedAulaId] = useState<number>(turmaAulas[0]?.id ?? 0);

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

  const attendanceForSelectedAula = useMemo(
    () => attendanceData.filter((record) => record.aulaId === selectedAula?.id),
    [attendanceData, selectedAula],
  );

  const handleSelectTurma = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setTurmaDialogOpen(true);
    setShowAttendanceList(false);
  };

  const toggleAttendance = (alunoId: number, status: AttendanceStatus) => {
    if (!selectedAula) return;
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.aulaId === selectedAula.id && record.alunoId === alunoId ? { ...record, status } : record,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <CalendarDays className="h-3.5 w-3.5" />
            Rooster Academy
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Controle de presença</h1>
          <p className="mt-1 text-sm text-muted-foreground">Turmas, calendário e lista de presença em popup.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/controle-aulas") }>
          <ArrowLeft className="h-4 w-4" />
          Voltar ao controle de aulas
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-1">
        <Card>
          <CardHeader className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              <CardTitle className="m-0">Turmas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                placeholder="Filtrar turma"
                value={filterTurma}
                onChange={(event) => setFilterTurma(event.target.value)}
              />
              <Input
                placeholder="Filtrar curso"
                value={filterCurso}
                onChange={(event) => setFilterCurso(event.target.value)}
              />
              <Input
                placeholder="Filtrar turno"
                value={filterTurno}
                onChange={(event) => setFilterTurno(event.target.value)}
              />
            </div>

            <div className="space-y-3">
              {turmasFiltradas.length ? (
                turmasFiltradas.map((turma) => {
                  const selected = turma.id === selectedTurma?.id;
                  const aulasCount = initialAulas.filter((aula) => aula.turmaId === turma.id).length;
                  return (
                    <div
                      key={turma.id}
                      className={`w-full rounded-lg border p-4 transition ${selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-foreground">{turma.nome}</div>
                          <div className="text-sm text-muted-foreground">{turma.curso} · {turma.turno}</div>
                        </div>
                        <Badge variant="secondary">{aulasCount} aulas</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => navigate(`/academy/controle-presenca/turmas/${turma.id}`)}>
                          Abrir calendário
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">Nenhuma turma encontrada.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={turmaDialogOpen} onOpenChange={setTurmaDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTurma?.nome ?? "Turma"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_0.9fr]">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Calendário da turma</div>
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
                  <div className="space-y-2 mt-3">
                    {turmaAulasForDate.map((aula) => (
                      <div key={aula.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                        <div>
                          <div className="font-semibold text-foreground">{aula.topico}</div>
                          <div className="text-sm text-muted-foreground">{aula.horario}</div>
                        </div>
                        <Button
                          size="sm"
                          variant={aula.id === selectedAula?.id ? "secondary" : "outline"}
                          onClick={() => {
                            setSelectedAulaId(aula.id);
                            setShowAttendanceList(true);
                          }}
                        >
                          Registrar presença
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma aula agendada para este dia.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{selectedAula ? "Aula selecionada" : "Selecione uma aula"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedAula ? (
                    <>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Aula</div>
                        <div className="font-semibold text-foreground">{selectedAula.topico}</div>
                        <div className="text-sm text-muted-foreground">{selectedAula.horario}</div>
                      </div>
                      <Button className="w-full" onClick={() => setShowAttendanceList(true)}>
                        Abrir lista de presença
                      </Button>
                    </>
                  ) : (
                    <div className="rounded-lg border p-6 text-sm text-muted-foreground">Selecione uma aula no calendário para registrar presença.</div>
                  )}
                </CardContent>
              </Card>

              {showAttendanceList && selectedAula ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lista de presença</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Aluno</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alunosDaAula.map((aluno) => {
                          const record = attendanceForSelectedAula.find((item) => item.alunoId === aluno.id);
                          return (
                            <TableRow key={aluno.id}>
                              <TableCell className="font-medium">{aluno.nome}</TableCell>
                              <TableCell>
                                <Badge variant={record?.status === "Presente" ? "secondary" : record?.status === "Ausente" ? "destructive" : "outline"}>
                                  {record?.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button size="sm" variant="outline" onClick={() => toggleAttendance(aluno.id, "Presente")}>Presente</Button>
                                <Button size="sm" variant="secondary" onClick={() => toggleAttendance(aluno.id, "Ausente")}>Ausente</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTurmaDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ControlePresenca;
