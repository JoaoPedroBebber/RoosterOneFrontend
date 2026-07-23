import { useNavigate } from "react-router-dom";
import { Home, BookOpen, Archive, Laptop, Play, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HubCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Rooster Desk",
      description: "Gerencie tickets, usuários, categorias e setores do sistema de suporte.",
      icon: Home,
      path: "/dashboard",
      button: "Acessar Rooster Desk",
    },
    {
      title: "Rooster Academy",
      description: "Gerencie disciplinas, turmas, presença e calendário acadêmico.",
      icon: BookOpen,
      path: "/academy",
      button: "Acessar Rooster Academy",
    },
    {
      title: "Rooster Assets",
      description: "Controle ativos e patrimônio da universidade.",
      icon: Archive,
      path: "/assets",
      button: "Acessar Rooster Assets",
    },
    {
      title: "Rooster Learn",
      description: "Crie atividades online e resolva exercícios em sala digital.",
      icon: Laptop,
      path: "/learn",
      button: "Acessar Rooster Learn",
    },
    {
      title: "Rooster Boost",
      description: "Plataforma para cursos online, videoaulas e treinamentos.",
      icon: Play,
      path: "/boost",
      button: "Acessar Rooster Boost",
    },
    {
      title: "Rooster Finance",
      description: "Emissão de notas fiscais, controle de mensalidades e fluxo financeiro.",
      icon: CreditCard,
      path: "/finance",
      button: "Acessar Rooster Finance",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-3xl border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
                <Icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button onClick={() => navigate(card.path)} className="w-full" size="lg">
                {card.button}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default HubCards;
