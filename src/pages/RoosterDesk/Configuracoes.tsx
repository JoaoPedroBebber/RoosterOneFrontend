import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

const Configuracoes = () => {
  const { theme, setTheme } = useTheme();

  const selectedTheme = theme || "system";

  const themes = [
    {
      value: "light",
      label: "Claro",
      icon: Sun,
      description: "Tema claro para uso diurno"
    },
    {
      value: "dark",
      label: "Escuro",
      icon: Moon,
      description: "Tema escuro para uso noturno"
    },
    {
      value: "system",
      label: "Sistema",
      icon: Monitor,
      description: "Usa a configuração do seu sistema"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência no sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Tema</Label>
            <RadioGroup
              value={selectedTheme}
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <div key={themeOption.value}>
                    <RadioGroupItem
                      value={themeOption.value}
                      id={themeOption.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={themeOption.value}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Icon className="mb-3 h-6 w-6" />
                      <div className="text-center">
                        <div className="font-semibold">{themeOption.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {themeOption.description}
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setTheme("system")}
              className="w-full"
            >
              <Monitor className="mr-2 h-4 w-4" />
              Redefinir para padrão do sistema
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Espaço para futuras configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Mais opções de configuração estarão disponíveis em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;