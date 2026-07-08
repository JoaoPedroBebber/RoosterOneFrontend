import { useMemo, useState } from "react";
import { ArrowLeft, Search, Users2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialAlunos, initialAvisos, initialTurmas, Aluno, Aviso } from "@/pages/RoosterAcademy/controleAulasData";

const formatPercentage = (value: number) => `${Math.round(value)}%`;

const ControleAulasDetalhes = () => {
  const navigate = useNavigate();
  const { turmaId } = useParams();
  const turmaIdNumber = Number(turmaId);
  const [query, setQuery] = useState("");
  const [minNota, setMinNota] = useState("");
  const [minPresenca, setMinPresenca] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>(initialAvisos);
  const [avisoTexto, setAvisoTexto] = useState("");

  const selectedTurma = useMemo(
    () => initialTurmas.find((turma) => turma.id === turmaIdNumber) ?? null,
    [turmaIdNumber],
  );

  const alunosDaTurma = useMemo(
    () => initialAlunos.filter((aluno) => aluno.turmaId === turmaIdNumber),
    [turmaIdNumber],
  );

  const calcAlunoPresenca = (aluno: Aluno) => {
    if (!aluno.presencas.length) return 0;
    const presentes = aluno.presencas.filter((item) => item.status === "Presente").length;
    return (presentes / aluno.presencas.length) * 100;
  };

  const alunosFiltrados = useMemo(() => {
    const term = query.trim().toLowerCase();
    const notaMin = minNota ? Number(minNota) : 0;
    const presencaMin = minPresenca ? Number(minPresenca) : 0;

    return alunosDaTurma.filter((aluno) => {
      const matchesQuery =
        !term ||
        aluno.nome.toLowerCase().includes(term) ||
        aluno.email.toLowerCase().includes(term);
      const matchesNota = !minNota || aluno.nota >= notaMin;
      const matchesPresenca = !minPresenca || calcAlunoPresenca(aluno) >= presencaMin;
      return matchesQuery && matchesNota && matchesPresenca;
    });
  }, [alunosDaTurma, query, minNota, minPresenca]);

  const handleOpenNotas = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setDialogOpen(true);
  };

  const handleCloseNotas = () => {
    setSelectedAluno(null);
    setDialogOpen(false);
  };

  const avisosDaTurma = useMemo(
    () => avisos.filter((aviso) => aviso.turmaId === turmaIdNumber),
    [avisos, turmaIdNumber],
  );

  const handleAddAviso = () => {
    const texto = avisoTexto.trim();
    if (!selectedTurma || !texto) return;
    setAvisos((prev) => [
      { id: Date.now(), turmaId: selectedTurma.id, mensagem: texto, enviadoEm: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setAvisoTexto("");
  };

  if (!selectedTurma) {
    return (
      <div className="space-y-6">
        <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/controle-aulas")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar para controle de aulas
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
          <Button variant="outline" className="gap-2" onClick={() => navigate("/academy/controle-aulas") }>
            <ArrowLeft className="h-4 w-4" />
            Voltar para controle de aulas
          </Button>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <Users2 className="h-3.5 w-3.5" />
              Alunos da turma
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{selectedTurma.nome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Filtro de alunos e visão detalhada de notas por aluno.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Filtros de alunos
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label>Buscar aluno</Label>
              <Input
                placeholder="Nome ou e-mail"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nota mínima</Label>
              <Input
                type="number"
                placeholder="Ex.: 7.0"
                value={minNota}
                onChange={(event) => setMinNota(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Presença mínima (%)</Label>
              <Input
                type="number"
                placeholder="Ex.: 75"
                value={minPresenca}
                onChange={(event) => setMinPresenca(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setMinNota("");
                setMinPresenca("");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{alunosFiltrados.length} aluno{alunosFiltrados.length === 1 ? "" : "s"} encontrados</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-4">
          <div className="overflow-x-auto overflow-y-auto max-h-[520px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Presença</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosFiltrados.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.email}</TableCell>
                    <TableCell>{aluno.nota.toFixed(1)}</TableCell>
                    <TableCell>{formatPercentage(calcAlunoPresenca(aluno))}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenNotas(aluno)}>
                        Notas
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-4 w-4" />
            Avisos para professor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Input
                value={avisoTexto}
                onChange={(event) => setAvisoTexto(event.target.value)}
                placeholder="Digite um aviso para o professor"
              />
            </div>
            <Button className="w-full" onClick={handleAddAviso} disabled={!avisoTexto.trim()}>
              Enviar aviso
            </Button>
            <div className="space-y-2">
              {avisosDaTurma.length > 0 ? (
                avisosDaTurma.map((aviso) => (
                  <div key={aviso.id} className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">{aviso.enviadoEm}</div>
                    <div className="mt-1 text-sm text-foreground">{aviso.mensagem}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border p-3 text-sm text-muted-foreground">Nenhum aviso enviado para esta turma.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) handleCloseNotas(); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notas de {selectedAluno?.nome}</DialogTitle>
          </DialogHeader>
          {selectedAluno ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">E-mail</div>
                <div className="font-semibold text-foreground">{selectedAluno.email}</div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAluno.notas.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.tipo}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>{item.nota.toFixed(1)}</TableCell>
                        <TableCell>{item.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ControleAulasDetalhes;
