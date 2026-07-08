import { useNavigate } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HubCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="rounded-3xl border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
        <CardHeader className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
            <Home className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Rooster Desk</CardTitle>
          <CardDescription>
            Gerencie tickets, usuários, categorias e setores do sistema de suporte.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button onClick={() => navigate("/dashboard")} className="w-full" size="lg">
            Acessar Rooster Desk
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
        <CardHeader className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
            <BookOpen className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Rooster Academy</CardTitle>
          <CardDescription>
            Gerencie disciplinas, turmas, presença e calendário acadêmico.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button onClick={() => navigate("/academy/dashboard")} className="w-full" size="lg">
            Acessar Rooster Academy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HubCards;
