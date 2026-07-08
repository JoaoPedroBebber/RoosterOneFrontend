import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, MessageSquare, Search, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Aluno, Aviso, initialAlunos, initialAvisos, initialTurmas } from "@/pages/RoosterAcademy/controleAulasData";

const formatPercentage = (value: number) => `${Math.round(value)}%`;

const ControleAulas = () => {
  const navigate = useNavigate();
  const [selectedTurmaId, setSelectedTurmaId] = useState<number>(initialTurmas[0].id);
  const [avisos, setAvisos] = useState<Aviso[]>(initialAvisos);
  const [avisoTexto, setAvisoTexto] = useState("");
  const [filters, setFilters] = useState({
    turma: "",
    curso: "",
    professor: "",
    mediaPresencaMin: "",
    mediaNotaMin: "",
  });

  const calcTurmaMediaPresenca = (turmaId: number) => {
    const alunos = initialAlunos.filter((aluno) => aluno.turmaId === turmaId);
    const registros = alunos.flatMap((aluno) => aluno.presencas);
    if (!registros.length) return 0;
    const presentes = registros.filter((registro) => registro.status === "Presente").length;
    return (presentes / registros.length) * 100;
  };

  const calcTurmaMediaNotas = (turmaId: number) => {
    const alunos = initialAlunos.filter((aluno) => aluno.turmaId === turmaId);
    if (!alunos.length) return 0;
    return alunos.reduce((total, aluno) => total + aluno.nota, 0) / alunos.length;
  };

  const turmasFiltradas = useMemo(() => {
    return initialTurmas.filter((turma) => {
      const turmaMatch = !filters.turma || turma.nome.toLowerCase().includes(filters.turma.toLowerCase());
      const cursoMatch = !filters.curso || turma.curso.toLowerCase().includes(filters.curso.toLowerCase());
      const professorMatch = !filters.professor || turma.professor.toLowerCase().includes(filters.professor.toLowerCase());
      const mediaPresenca = calcTurmaMediaPresenca(turma.id);
      const mediaNota = calcTurmaMediaNotas(turma.id);
      const presencaMin = filters.mediaPresencaMin ? Number(filters.mediaPresencaMin) : 0;
      const notaMin = filters.mediaNotaMin ? Number(filters.mediaNotaMin) : 0;
      const presencaMatch = !filters.mediaPresencaMin || mediaPresenca >= presencaMin;
      const notaMatch = !filters.mediaNotaMin || mediaNota >= notaMin;

      return turmaMatch && cursoMatch && professorMatch && presencaMatch && notaMatch;
    });
  }, [filters]);

  const selectedTurma = useMemo(() => initialTurmas.find((turma) => turma.id === selectedTurmaId) ?? null, [selectedTurmaId]);

  const alunosDaTurma = useMemo(() => initialAlunos.filter((aluno) => aluno.turmaId === selectedTurmaId), [selectedTurmaId]);

  const mediaNotas = useMemo(() => {
    if (!alunosDaTurma.length) return 0;
    return alunosDaTurma.reduce((total, aluno) => total + aluno.nota, 0) / alunosDaTurma.length;
  }, [alunosDaTurma]);

  const mediaPresenca = useMemo(() => {
    const registros = alunosDaTurma.flatMap((aluno) => aluno.presencas);
    if (!registros.length) return 0;
    const presentes = registros.filter((registro) => registro.status === "Presente").length;
    return (presentes / registros.length) * 100;
  }, [alunosDaTurma]);

  const avisosDaTurma = useMemo(() => avisos.filter((aviso) => aviso.turmaId === selectedTurmaId), [avisos, selectedTurmaId]);

  const handleAddAviso = () => {
    const texto = avisoTexto.trim();
    if (!selectedTurma || !texto) return;
    setAvisos((prev) => [
      { id: Date.now(), turmaId: selectedTurma.id, mensagem: texto, enviadoEm: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setAvisoTexto("");
  };

  const calcAlunoPresenca = (aluno: Aluno) => {
    if (!aluno.presencas.length) return 0;
    const presentes = aluno.presencas.filter((item) => item.status === "Presente").length;
    return (presentes / aluno.presencas.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 bg-background/95 pb-4 pt-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Rooster Academy
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Controle de aulas</h1>
            <p className="mt-1 text-sm text-muted-foreground">Painel de controle para coordenadores com médias de presença, notas e avisos por turma.</p>
          </div>

          <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/cursos") }>
            <ArrowLeft className="h-4 w-4" />
            Voltar para cursos
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <CardTitle className="m-0">Turmas</CardTitle>
            </div>
            <Button
              variant="outline"
              onClick={() => setFilters({ turma: "", curso: "", professor: "", mediaPresencaMin: "", mediaNotaMin: "" })}
            >
              Limpar filtros
            </Button>
          </CardHeader>
          <div className="px-4 pb-4 pt-0">
            <p className="text-sm text-muted-foreground">Filtre turmas por nome, curso, professor, presença e nota média.</p>
          </div>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="space-y-2">
                <Label>Turma</Label>
                <Input
                  placeholder="Ex.: ADM 2026/1"
                  value={filters.turma}
                  onChange={(event) => setFilters((prev) => ({ ...prev, turma: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Curso</Label>
                <Input
                  placeholder="Ex.: Administração"
                  value={filters.curso}
                  onChange={(event) => setFilters((prev) => ({ ...prev, curso: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Professor</Label>
                <Input
                  placeholder="Ex.: Marina Souza"
                  value={filters.professor}
                  onChange={(event) => setFilters((prev) => ({ ...prev, professor: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Presença mínima (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.mediaPresencaMin}
                  onChange={(event) => setFilters((prev) => ({ ...prev, mediaPresencaMin: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Nota mínima</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.mediaNotaMin}
                  onChange={(event) => setFilters((prev) => ({ ...prev, mediaNotaMin: event.target.value }))}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="p-0 md:p-4">
            <div className="overflow-x-auto overflow-y-auto max-h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Média presença</TableHead>
                    <TableHead>Média nota</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turmasFiltradas.map((turma) => (
                    <TableRow key={turma.id} className={turma.id === selectedTurmaId ? "bg-muted" : ""}>
                      <TableCell className="font-medium">{turma.nome}</TableCell>
                      <TableCell>{turma.curso}</TableCell>
                      <TableCell>{turma.professor}</TableCell>
                      <TableCell>{formatPercentage(calcTurmaMediaPresenca(turma.id))}</TableCell>
                      <TableCell>{calcTurmaMediaNotas(turma.id).toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/academy/controle-aulas/turmas/${turma.id}`)}>
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da turma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedTurma ? (
                <div className="space-y-3">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Turma</div>
                    <div className="text-lg font-semibold text-foreground">{selectedTurma.nome}</div>
                    <div className="text-sm text-muted-foreground">{selectedTurma.curso} • {selectedTurma.periodo} • {selectedTurma.turno}</div>
                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-muted-foreground">Professor</div>
                        <div className="font-semibold text-foreground">{selectedTurma.professor}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-muted-foreground">Alunos</div>
                        <div className="font-semibold text-foreground">{alunosDaTurma.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Média de presença</div>
                      <div className="mt-2 text-2xl font-semibold text-foreground">{formatPercentage(mediaPresenca)}</div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Média de notas</div>
                      <div className="mt-2 text-2xl font-semibold text-foreground">{mediaNotas.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Selecione uma turma para ver o resumo.</div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
};

export default ControleAulas;
