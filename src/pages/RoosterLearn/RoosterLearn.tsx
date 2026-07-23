import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, BookOpen, CheckCircle2, ClipboardList, Clock3, Copy, Laptop, Pencil, Plus, Search, ShieldCheck, Trophy, Trash2, Users, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useDeskRole } from "@/context/DeskContext";

type ActivityStatus = "Pendente" | "Em andamento" | "Entregue" | "Corrigida" | "Atrasada" | "Publicada" | "Rascunho" | "Encerrada";
type ActivityType = "Question�rio" | "Prova" | "Trabalho" | "Lista de exerc�cios" | "Pesquisa" | "Reda��o" | "Upload de arquivo";
type QuestionType = "M�ltipla escolha" | "Caixa de sele��o" | "Verdadeiro ou falso" | "Resposta curta" | "Resposta longa" | "Num�rica" | "Data" | "Upload de arquivos";

type Activity = {
  id: number;
  title: string;
  discipline: string;
  turma: string;
  teacher: string;
  publishedAt: string;
  dueDate: string;
  dueTime: string;
  maxScore: number;
  weight: number;
  estimatedTime: string;
  type: ActivityType;
  status: ActivityStatus;
  description: string;
  instructions: string;
  criteria: string;
  attachments: string[];
  images: string[];
  videos: string[];
  links: string[];
  deliveries: number;
  classAverage: number;
};

type Question = {
  id: number;
  title: string;
  description: string;
  type: QuestionType;
  points: number;
  required: boolean;
  autoFeedback: boolean;
};

type Submission = {
  id: number;
  aluno: string;
  atividade: string;
  status: "Entregue" | "Corrigida" | "Pendente";
  sentAt: string;
  timeSpent: string;
  score: number | null;
  responseText: string;
  responseLink: string;
  feedback: string;
  comments: string;
};

const activityTypes: ActivityType[] = [
  "Question�rio",
  "Prova",
  "Trabalho",
  "Lista de exerc�cios",
  "Pesquisa",
  "Reda��o",
  "Upload de arquivo",
];

const activityStatuses: ActivityStatus[] = ["Rascunho", "Publicada", "Pendente", "Em andamento", "Entregue", "Corrigida", "Atrasada", "Encerrada"];

const questionTypes: QuestionType[] = [
  "M�ltipla escolha",
  "Caixa de sele��o",
  "Verdadeiro ou falso",
  "Resposta curta",
  "Resposta longa",
  "Num�rica",
  "Data",
  "Upload de arquivos",
];

const statusMap: Record<ActivityStatus, string> = {
  Pendente: "bg-amber-100 text-amber-800",
  "Em andamento": "bg-sky-100 text-sky-800",
  Entregue: "bg-green-100 text-green-800",
  Atrasada: "bg-red-100 text-red-800",
  Corrigida: "bg-violet-100 text-violet-800",
  Publicada: "bg-emerald-100 text-emerald-800",
  Rascunho: "bg-slate-100 text-slate-800",
  Encerrada: "bg-zinc-100 text-zinc-800",
};

const initialActivities: Activity[] = [
  {
    id: 1,
    title: "Avalia��o diagn�stica de matem�tica",
    discipline: "Matem�tica",
    turma: "3� Ano A",
    teacher: "Prof. Marina Souza",
    publishedAt: "05/07/2025",
    dueDate: "15/07/2025",
    dueTime: "23:59",
    maxScore: 10,
    weight: 2,
    estimatedTime: "45 min",
    type: "Question�rio",
    status: "Publicada",
    description: "Avalia��o inicial com quest�es de m�ltipla escolha e resposta curta.",
    instructions: "Responda todas as quest�es com aten��o. Voc� pode revisar suas respostas antes de enviar.",
    criteria: "Cada quest�o vale 1 ponto. Quest�es erradas n�o t�m penalidade.",
    attachments: ["questionario-mat.pdf"],
    images: ["/images/math-example.png"],
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    links: ["https://www.example.com/matematica"],
    deliveries: 24,
    classAverage: 8.4,
  },
  {
    id: 2,
    title: "Trabalho de reda��o sobre sustentabilidade",
    discipline: "Portugu�s",
    turma: "2� Ano B",
    teacher: "Prof. Camila Oliveira",
    publishedAt: "01/07/2025",
    dueDate: "18/07/2025",
    dueTime: "20:00",
    maxScore: 20,
    weight: 3,
    estimatedTime: "90 min",
    type: "Trabalho",
    status: "Pendente",
    description: "Desenvolva um texto argumentativo sobre pr�ticas sustent�veis no ambiente escolar.",
    instructions: "Use exemplos reais e fa�a a revis�o final antes de entregar.",
    criteria: "Conte�do, coes�o, ortografia e apresenta��o.",
    attachments: ["modelo-redacao.pdf"],
    images: [],
    videos: ["https://www.youtube.com/watch?v=3GwjfUFyY6M"],
    links: ["https://www.example.com/redacao"],
    deliveries: 16,
    classAverage: 7.9,
  },
  {
    id: 3,
    title: "Pesquisa de satisfa��o da aula pr�tica",
    discipline: "Biologia",
    turma: "1� Ano C",
    teacher: "Prof. Rafael Lima",
    publishedAt: "08/07/2025",
    dueDate: "22/07/2025",
    dueTime: "23:59",
    maxScore: 5,
    weight: 1,
    estimatedTime: "15 min",
    type: "Pesquisa",
    status: "Publicada",
    description: "Responda as perguntas sobre a aula pr�tica de laborat�rio.",
    instructions: "Responda com sinceridade. Os resultados ajudar�o a melhorar a pr�xima aula.",
    criteria: "Respostas completas e objetivas.",
    attachments: ["slides-pratica.pdf"],
    images: [],
    videos: [],
    links: ["https://www.example.com/biologia"],
    deliveries: 30,
    classAverage: 9.1,
  },
];

const initialQuestions: Question[] = [
  {
    id: 1,
    title: "Qual � a f�rmula do alinhamento?",
    description: "Selecione a alternativa correta.",
    type: "M�ltipla escolha",
    points: 2,
    required: true,
    autoFeedback: true,
  },
  {
    id: 2,
    title: "Explique em suas palavras a fun��o do ecossistema.",
    description: "Resposta longa.",
    type: "Resposta longa",
    points: 4,
    required: true,
    autoFeedback: false,
  },
];

const initialSubmissions: Submission[] = [
  {
    id: 1,
    aluno: "Lucas Silva",
    atividade: "Avalia��o diagn�stica de matem�tica",
    status: "Entregue",
    sentAt: "11/07/2025 19:23",
    timeSpent: "32 min",
    score: null,
    responseText: "",
    responseLink: "",
    feedback: "Em breve voc� ter� a corre��o final.",
    comments: "",
  },
  {
    id: 2,
    aluno: "Marina Rocha",
    atividade: "Pesquisa de satisfa��o da aula pr�tica",
    status: "Corrigida",
    sentAt: "10/07/2025 14:10",
    timeSpent: "12 min",
    score: 5,
    responseText: "Achei a aula muito boa e din�mica.",
    responseLink: "",
    feedback: "Excelente participa��o. Continue assim.",
    comments: "Entrega aceita com nota m�xima.",
  },
];

type EditorBlock = {
  id: number;
  type: "T�tulo" | "Par�grafo" | "Lista" | "Cita��o" | "C�digo" | "Bloco destacado";
  content: string;
};

const RoosterLearn = () => {
  const { role } = useDeskRole();
  const isStudent = role === "usuario";
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useMemo(() => (location.pathname.endsWith("/gerenciar") ? "gerenciar" : "atividades"), [location.pathname]);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [search, setSearch] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("");
  const [turmaFilter, setTurmaFilter] = useState("");
  const [professorFilter, setProfessorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus>("Rascunho");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  const [activityForm, setActivityForm] = useState({
    title: "",
    discipline: "",
    turma: "",
    teacher: "",
    publishedAt: "",
    dueDate: "",
    dueTime: "",
    maxScore: "",
    weight: "",
    estimatedTime: "",
    type: "Question�rio" as ActivityType,
    status: "Rascunho" as ActivityStatus,
    description: "",
    instructions: "",
    criteria: "",
    attachments: [] as string[],
    images: [] as string[],
    videos: [] as string[],
    links: [] as string[],
  });

  const [editorBlocks, setEditorBlocks] = useState<EditorBlock[]>([]);
  const [questionResponses, setQuestionResponses] = useState<Record<number, string>>({});
  const [submissionText, setSubmissionText] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);

  const filteredActivities = useMemo(() => {
    const term = search.trim().toLowerCase();
    return activities.filter((activity) => {
      const matchesSearch = !term ||
        activity.title.toLowerCase().includes(term) ||
        activity.discipline.toLowerCase().includes(term) ||
        activity.turma.toLowerCase().includes(term) ||
        activity.teacher.toLowerCase().includes(term);

      const matchesDiscipline = !disciplineFilter || activity.discipline === disciplineFilter;
      const matchesTurma = !turmaFilter || activity.turma === turmaFilter;
      const matchesProfessor = !professorFilter || activity.teacher === professorFilter;
      const matchesStatus = statusFilter === "Rascunho" ? true : activity.status === statusFilter;
      const matchPeriodStart = !periodStart || activity.publishedAt >= periodStart;
      const matchPeriodEnd = !periodEnd || activity.publishedAt <= periodEnd;

      return matchesSearch && matchesDiscipline && matchesTurma && matchesProfessor && matchesStatus && matchPeriodStart && matchPeriodEnd;
    });
  }, [activities, search, disciplineFilter, turmaFilter, professorFilter, statusFilter, periodStart, periodEnd]);

  const teacherDisciplineOptions = useMemo(() => Array.from(new Set(activities.map((activity) => activity.discipline))), [activities]);
  const teacherTurmaOptions = useMemo(() => Array.from(new Set(activities.map((activity) => activity.turma))), [activities]);
  const teacherProfessorOptions = useMemo(() => Array.from(new Set(activities.map((activity) => activity.teacher))), [activities]);
  const teacherStatuses = useMemo(() => Array.from(new Set(activities.map((activity) => activity.status))), [activities]);

  const openDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailOpen(true);
    const submission = submissions.find((item) => item.atividade === activity.title && item.aluno === "Lucas Silva");
    setSubmissionText(submission?.responseText ?? "");
    setSubmissionLink(submission?.responseLink ?? "");
  };

  const openEditor = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setActivityForm({
        title: activity.title,
        discipline: activity.discipline,
        turma: activity.turma,
        teacher: activity.teacher,
        publishedAt: activity.publishedAt,
        dueDate: activity.dueDate,
        dueTime: activity.dueTime,
        maxScore: String(activity.maxScore),
        weight: String(activity.weight),
        estimatedTime: activity.estimatedTime,
        type: activity.type,
        status: activity.status,
        description: activity.description,
        instructions: activity.instructions,
        criteria: activity.criteria,
        attachments: activity.attachments,
        images: activity.images,
        videos: activity.videos,
        links: activity.links,
      });
      setEditorBlocks([]);
    } else {
      setEditingActivity(null);
      setActivityForm({
        title: "",
        discipline: "",
        turma: "",
        teacher: "",
        publishedAt: "",
        dueDate: "",
        dueTime: "",
        maxScore: "",
        weight: "",
        estimatedTime: "",
        type: "Question�rio",
        status: "Rascunho",
        description: "",
        instructions: "",
        criteria: "",
        attachments: [],
        images: [],
        videos: [],
        links: [],
      });
      setEditorBlocks([]);
    }
    setEditorOpen(true);
  };

  const handleSaveActivity = () => {
    const newActivity: Activity = {
      id: editingActivity ? editingActivity.id : Date.now(),
      title: activityForm.title.trim() || "Nova atividade",
      discipline: activityForm.discipline,
      turma: activityForm.turma,
      teacher: activityForm.teacher,
      publishedAt: activityForm.publishedAt || new Date().toLocaleDateString("pt-BR"),
      dueDate: activityForm.dueDate,
      dueTime: activityForm.dueTime,
      maxScore: Number(activityForm.maxScore) || 0,
      weight: Number(activityForm.weight) || 0,
      estimatedTime: activityForm.estimatedTime,
      type: activityForm.type,
      status: activityForm.status,
      description: activityForm.description,
      instructions: activityForm.instructions,
      criteria: activityForm.criteria,
      attachments: activityForm.attachments,
      images: activityForm.images,
      videos: activityForm.videos,
      links: activityForm.links,
      deliveries: editingActivity?.deliveries ?? 0,
      classAverage: editingActivity?.classAverage ?? 0,
    };

    setActivities((prev) =>
      editingActivity ? prev.map((item) => (item.id === editingActivity.id ? newActivity : item)) : [newActivity, ...prev],
    );
    setEditorOpen(false);
  };

  const handleDuplicateActivity = (activity: Activity) => {
    setActivities((prev) => [
      {
        ...activity,
        id: Date.now(),
        title: `${activity.title} (C�pia)`,
        publishedAt: new Date().toLocaleDateString("pt-BR"),
        status: "Rascunho",
        deliveries: 0,
      },
      ...prev,
    ]);
  };

  const handlePublishActivity = (activity: Activity) => {
    setActivities((prev) => prev.map((item) => (item.id === activity.id ? { ...item, status: "Publicada" } : item)));
  };

  const handleArchiveActivity = (activity: Activity) => {
    setActivities((prev) => prev.map((item) => (item.id === activity.id ? { ...item, status: "Encerrada" } : item)));
  };

  const handleDeleteActivity = (activity: Activity) => {
    if (!confirm("Deseja excluir esta atividade?")) return;
    setActivities((prev) => prev.filter((item) => item.id !== activity.id));
  };

  const handleSubmitActivity = () => {
    if (!selectedActivity) return;
    const update: Submission = {
      id: submissions.find((item) => item.atividade === selectedActivity.title)?.id ?? Date.now(),
      aluno: "Lucas Silva",
      atividade: selectedActivity.title,
      status: "Entregue",
      sentAt: new Date().toLocaleString("pt-BR"),
      timeSpent: "28 min",
      score: null,
      responseText: submissionText,
      responseLink: submissionLink,
      feedback: "Aguardando corre��o do professor.",
      comments: "",
    };

    setSubmissions((prev) => {
      const existing = prev.find((item) => item.atividade === selectedActivity.title && item.aluno === "Lucas Silva");
      if (existing) {
        return prev.map((item) => (item.id === existing.id ? update : item));
      }
      return [update, ...prev];
    });

    setDetailOpen(false);
  };

  const addEditorBlock = (type: EditorBlock["type"]) => {
    setEditorBlocks((prev) => [...prev, { id: Date.now(), type, content: "" }]);
  };

  const moveEditorBlock = (index: number, direction: -1 | 1) => {
    setEditorBlocks((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updateEditorBlock = (id: number, content: string) => {
    setEditorBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, content } : block)));
  };

  const currentSubmission = selectedActivity
    ? submissions.find((item) => item.atividade === selectedActivity.title && item.aluno === "Lucas Silva")
    : undefined;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              <Laptop className="h-4 w-4" />
              Rooster Learn
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Ambiente Virtual de Aprendizagem</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {isStudent
                ? "Acompanhe suas atividades, abra exerc�cios e entregue trabalho sem sair da plataforma."
                : "Crie e gerencie atividades com uma interface minimalista, r�pida e orientada para produ��o."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-3 rounded-3xl border bg-background p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate("/learn")}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${activeSection === "atividades" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
            <span>Atividades</span>
            <BookOpen className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/learn/gerenciar")}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${activeSection === "gerenciar" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
            <span>Gerenciar Atividades</span>
            <ClipboardList className="h-4 w-4" />
          </button>
        </aside>

        <main className="space-y-6">
          {activeSection === "atividades" ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Atividades</h2>
                  <p className="text-sm text-muted-foreground">Todas as atividades dispon�veis para voc�.</p>
                </div>
                <Input placeholder="Buscar atividade" value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-sm" />
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                {filteredActivities.map((activity) => (
                  <Card key={activity.id} className="rounded-3xl border bg-background/90 p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{activity.discipline}</p>
                        <h3 className="mt-3 text-xl font-semibold">{activity.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{activity.teacher}</p>
                      </div>
                      <Badge className={statusMap[activity.status]}>{activity.status}</Badge>
                    </div>
                    <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between"><span>Publicado</span><span>{activity.publishedAt}</span></div>
                      <div className="flex items-center justify-between"><span>Data limite</span><span>{activity.dueDate}</span></div>
                      <div className="flex items-center justify-between"><span>Pontua��o</span><span>{activity.maxScore}</span></div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button className="gap-2" variant="secondary" onClick={() => openDetail(activity)}>Abrir atividade</Button>
                      <Button variant="outline" className="gap-2" onClick={() => openDetail(activity)}>Detalhes</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Gerenciar atividades</h2>
                  <p className="text-sm text-muted-foreground">Crie, filtre e publique atividades com rapidez.</p>
                </div>
                <Button className="gap-2" onClick={() => openEditor()}><Plus className="h-4 w-4" />Nova atividade</Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <Select value={disciplineFilter} onValueChange={(value) => setDisciplineFilter(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {teacherDisciplineOptions.map((discipline) => (
                      <SelectItem key={discipline} value={discipline}>{discipline}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={turmaFilter} onValueChange={(value) => setTurmaFilter(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {teacherTurmaOptions.map((turma) => (
                      <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={professorFilter} onValueChange={(value) => setProfessorFilter(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Professor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {teacherProfessorOptions.map((professor) => (
                      <SelectItem key={professor} value={professor}>{professor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ActivityStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    {teacherStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <Label>Per�odo in�cio</Label>
                  <Input type="date" value={periodStart} onChange={(event) => setPeriodStart(event.target.value)} />
                </div>
                <div>
                  <Label>Per�odo fim</Label>
                  <Input type="date" value={periodEnd} onChange={(event) => setPeriodEnd(event.target.value)} />
                </div>
                <Input placeholder="Busca r�pida" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de atividades</CardTitle>
                  <CardDescription>Nome, disciplina, turma, status, prazo, entregas e m�dia.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Disciplina</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Entregas</TableHead>
                        <TableHead>M�dia</TableHead>
                        <TableHead className="text-right">A��es</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.title}</TableCell>
                          <TableCell>{activity.discipline}</TableCell>
                          <TableCell>{activity.turma}</TableCell>
                          <TableCell><Badge className={statusMap[activity.status]}>{activity.status}</Badge></TableCell>
                          <TableCell>{activity.dueDate}</TableCell>
                          <TableCell>{activity.deliveries}</TableCell>
                          <TableCell>{activity.classAverage.toFixed(1)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap justify-end gap-2">
                              <Button variant="ghost" className="px-2 py-2" onClick={() => openEditor(activity)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" className="px-2 py-2" onClick={() => handleDuplicateActivity(activity)}><Copy className="h-4 w-4" /></Button>
                              <Button variant="ghost" className="px-2 py-2" onClick={() => handlePublishActivity(activity)}><CheckCircle2 className="h-4 w-4" /></Button>
                              <Button variant="ghost" className="px-2 py-2" onClick={() => handleArchiveActivity(activity)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-4xl max-w-full rounded-3xl p-0">
          <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-background">
            <div className="border-b p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{selectedActivity?.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedActivity?.discipline} � {selectedActivity?.turma}</p>
                </div>
                <Badge className={selectedActivity ? statusMap[selectedActivity.status] : "bg-slate-100 text-slate-800"}>{selectedActivity?.status}</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-6 p-6">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <Card className="rounded-3xl border bg-muted p-4">
                    <p className="font-semibold">Descri��o</p>
                    <p className="text-sm text-muted-foreground">{selectedActivity?.description}</p>
                  </Card>
                  <Card className="rounded-3xl border bg-muted p-4">
                    <p className="font-semibold">Instru��es</p>
                    <p className="text-sm text-muted-foreground">{selectedActivity?.instructions}</p>
                  </Card>
                  <Card className="rounded-3xl border bg-muted p-4">
                    <p className="font-semibold">Crit�rios de avalia��o</p>
                    <p className="text-sm text-muted-foreground">{selectedActivity?.criteria}</p>
                  </Card>
                  {selectedActivity?.links.length ? (
                    <Card className="rounded-3xl border bg-muted p-4">
                      <p className="font-semibold">Links externos</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {selectedActivity.links.map((link) => (
                          <li key={link}><a href={link} target="_blank" rel="noreferrer" className="text-primary underline">{link}</a></li>
                        ))}
                      </ul>
                    </Card>
                  ) : null}
                  {selectedActivity?.videos.length ? (
                    <Card className="rounded-3xl border bg-muted p-4">
                      <p className="font-semibold">V�deos</p>
                      <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                        {selectedActivity.videos.map((video) => (
                          <div key={video} className="rounded-2xl bg-black/5 p-4">{video}</div>
                        ))}
                      </div>
                    </Card>
                  ) : null}
                </div>
                <div className="space-y-4">
                  <Card className="rounded-3xl border bg-muted p-4">
                    <p className="font-semibold">Resumo</p>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between"><span>Data de publica��o</span><span>{selectedActivity?.publishedAt}</span></div>
                      <div className="flex justify-between"><span>Data limite</span><span>{selectedActivity?.dueDate} �s {selectedActivity?.dueTime}</span></div>
                      <div className="flex justify-between"><span>Pontua��o m�xima</span><span>{selectedActivity?.maxScore}</span></div>
                      <div className="flex justify-between"><span>Tempo estimado</span><span>{selectedActivity?.estimatedTime}</span></div>
                    </div>
                  </Card>
                  <Card className="rounded-3xl border bg-muted p-4">
                    <p className="font-semibold">Anexos</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {selectedActivity?.attachments.map((file) => (
                        <li key={file} className="flex items-center justify-between rounded-2xl border border-border px-3 py-2">
                          <span>{file}</span>
                          <Button variant="ghost" size="sm">Baixar</Button>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  {selectedActivity?.images.length ? (
                    <Card className="rounded-3xl border bg-muted p-4">
                      <p className="font-semibold">Imagens anexadas</p>
                      <div className="mt-3 grid gap-3">
                        {selectedActivity.images.map((image) => (
                          <img key={image} src={image} alt={image} className="h-40 w-full rounded-3xl object-cover" />
                        ))}
                      </div>
                    </Card>
                  ) : null}
                </div>
              </div>

              {selectedActivity?.type === "Question�rio" ? (
                <Card className="rounded-3xl border bg-muted p-4">
                  <p className="font-semibold">Responder question�rio</p>
                  <div className="mt-4 space-y-4">
                    {initialQuestions.map((question) => (
                      <div key={question.id} className="rounded-3xl border border-border p-4">
                        <p className="font-medium">{question.title}</p>
                        <p className="text-sm text-muted-foreground">{question.description}</p>
                        <Textarea
                          value={questionResponses[question.id] || ""}
                          onChange={(event) => setQuestionResponses((prev) => ({ ...prev, [question.id]: event.target.value }))}
                          rows={3}
                          className="mt-3"
                        />
                      </div>
                    ))}
                    <Button className="gap-2" onClick={handleSubmitActivity}><CheckCircle2 className="h-4 w-4" />Enviar respostas</Button>
                  </div>
                </Card>
              ) : (
                <Card className="rounded-3xl border bg-muted p-4">
                  <p className="font-semibold">Entregar atividade</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>Resposta em texto</Label>
                      <Textarea value={submissionText} onChange={(event) => setSubmissionText(event.target.value)} rows={4} />
                    </div>
                    <div>
                      <Label>Link externo</Label>
                      <Input value={submissionLink} onChange={(event) => setSubmissionLink(event.target.value)} placeholder="https://" />
                    </div>
                    <div>
                      <Label>Arquivo</Label>
                      <input
                        type="file"
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2"
                        onChange={(event) => setSubmissionFile(event.target.files?.[0] ?? null)}
                      />
                    </div>
                    <Button className="gap-2" onClick={handleSubmitActivity}><CheckCircle2 className="h-4 w-4" />Enviar entrega</Button>
                  </div>
                </Card>
              )}

              {currentSubmission ? (
                <Card className="rounded-3xl border bg-muted p-4">
                  <p className="font-semibold">Status da entrega</p>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <div className="flex justify-between"><span>Status</span><span>{currentSubmission.status}</span></div>
                    <div className="flex justify-between"><span>Enviado em</span><span>{currentSubmission.sentAt}</span></div>
                    <div className="flex justify-between"><span>Tempo gasto</span><span>{currentSubmission.timeSpent}</span></div>
                    <div className="flex justify-between"><span>Nota</span><span>{currentSubmission.score ?? "Aguardando"}</span></div>
                    <div>
                      <p className="font-medium">Feedback</p>
                      <p>{currentSubmission.feedback}</p>
                    </div>
                    <div>
                      <p className="font-medium">Coment�rios</p>
                      <p>{currentSubmission.comments || "Nenhum coment�rio."}</p>
                    </div>
                  </div>
                </Card>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={() => setDetailOpen(false)}>Fechar</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="fixed inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-background p-6 sm:p-10">
          <div className="flex h-full flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{editingActivity ? "Editar atividade" : "Nova atividade"}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Nome da atividade</Label>
                    <Input value={activityForm.title} onChange={(event) => setActivityForm((prev) => ({ ...prev, title: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Disciplina</Label>
                    <Input value={activityForm.discipline} onChange={(event) => setActivityForm((prev) => ({ ...prev, discipline: event.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Turma</Label>
                    <Input value={activityForm.turma} onChange={(event) => setActivityForm((prev) => ({ ...prev, turma: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Professor</Label>
                    <Input value={activityForm.teacher} onChange={(event) => setActivityForm((prev) => ({ ...prev, teacher: event.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label>Descri��o</Label>
                  <Textarea value={activityForm.description} onChange={(event) => setActivityForm((prev) => ({ ...prev, description: event.target.value }))} rows={4} />
                </div>
                <div>
                  <Label>Instru��es</Label>
                  <Textarea value={activityForm.instructions} onChange={(event) => setActivityForm((prev) => ({ ...prev, instructions: event.target.value }))} rows={4} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Pontua��o</Label>
                    <Input type="number" min="0" value={activityForm.maxScore} onChange={(event) => setActivityForm((prev) => ({ ...prev, maxScore: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Peso</Label>
                    <Input type="number" min="0" value={activityForm.weight} onChange={(event) => setActivityForm((prev) => ({ ...prev, weight: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Tempo estimado</Label>
                    <Input value={activityForm.estimatedTime} onChange={(event) => setActivityForm((prev) => ({ ...prev, estimatedTime: event.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Data de publica��o</Label>
                    <Input type="date" value={activityForm.publishedAt} onChange={(event) => setActivityForm((prev) => ({ ...prev, publishedAt: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Data limite</Label>
                    <Input type="date" value={activityForm.dueDate} onChange={(event) => setActivityForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
                  </div>
                  <div>
                    <Label>Hor�rio limite</Label>
                    <Input type="time" value={activityForm.dueTime} onChange={(event) => setActivityForm((prev) => ({ ...prev, dueTime: event.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Tipo</Label>
                    <Select value={activityForm.type} onValueChange={(value) => setActivityForm((prev) => ({ ...prev, type: value as ActivityType }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={activityForm.status} onValueChange={(value) => setActivityForm((prev) => ({ ...prev, status: value as ActivityStatus }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Crit�rios</Label>
                    <Input value={activityForm.criteria} onChange={(event) => setActivityForm((prev) => ({ ...prev, criteria: event.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Links externos</Label>
                    <Input value={activityForm.links.join(", ")} onChange={(event) => setActivityForm((prev) => ({ ...prev, links: event.target.value.split(",").map((item) => item.trim()) }))} />
                  </div>
                  <div>
                    <Label>Anexos</Label>
                    <Input placeholder="PDF, Word, planilhas..." value={activityForm.attachments.join(", ")} disabled />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Editor de conte�do</p>
                      <p className="text-sm text-muted-foreground">Adicione blocos livres, t�tulos e instru��es.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["T�tulo", "Par�grafo", "Lista", "Cita��o", "C�digo", "Bloco destacado"] as EditorBlock["type"][]).map((type) => (
                        <Button key={type} variant="outline" size="sm" onClick={() => addEditorBlock(type)}>{type}</Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {editorBlocks.map((block, index) => (
                      <Card key={block.id} className="rounded-3xl border p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">{block.type}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => moveEditorBlock(index, -1)} disabled={index === 0}><ArrowUp className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => moveEditorBlock(index, 1)} disabled={index === editorBlocks.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <Textarea value={block.content} onChange={(event) => updateEditorBlock(block.id, event.target.value)} rows={3} />
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-muted bg-background p-4">
              <Button className="gap-2" onClick={handleSaveActivity}><CheckCircle2 className="h-4 w-4" />Salvar atividade</Button>
              <Button variant="outline" className="gap-2" onClick={() => setEditorOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoosterLearn;
