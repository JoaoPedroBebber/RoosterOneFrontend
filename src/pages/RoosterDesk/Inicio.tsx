import { Building2, Sparkles } from "lucide-react";

const Inicio = () => {
  return (
    <div className="space-y-6">
      <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border bg-card p-8 shadow-sm">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <img
              src="/icons/rooster.png"
              alt="Logo do Rooster"
              className="h-14 w-14 object-contain"
            />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-4 w-4" />
            Início
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">Rooster Desk</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Aqui ficará a tela inicial do sistema, com a logo e o nome do software, pronta para receber a imagem da instituição no futuro.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Espaço reservado para a identidade da instituição
          </div>
        </div>
      </div>

      {/* atalhos removidos conforme solicitado */}
    </div>
  );
};

export default Inicio;
