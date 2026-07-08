import { Sparkles } from "lucide-react";
import HubCards from "./HubCards";

const Hub = () => {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-4 w-4" />
            Rooster Hub
          </div>
          <div>
            <h1 className="text-4xl font-semibold">Central de módulos</h1>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Escolha o módulo que deseja acessar para gerenciar seu trabalho.
            </p>
          </div>
        </div>

        <HubCards />
      </div>
    </div>
  );
};

export default Hub;
