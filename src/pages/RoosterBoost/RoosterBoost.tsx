import { Play, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RoosterBoost = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Video className="h-12 w-12" />
          </div>
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Rooster Boost
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Cursos Online e Videoaulas</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Ambiente para disponibilizar cursos digitais, trilhas e conteúdo em vídeo.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Cursos ativos", value: "0" },
          { label: "Videoaulas", value: "0" },
          { label: "Inscrições", value: "0" },
          { label: "Novos alunos", value: "0" },
        ].map((item) => (
          <Card key={item.label} className="rounded-3xl border bg-background/80 p-4 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg font-semibold">{item.value}</CardTitle>
              <CardDescription>{item.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoosterBoost;
