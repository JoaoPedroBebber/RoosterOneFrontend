import { CreditCard, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RoosterFinance = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <CreditCard className="h-12 w-12" />
          </div>
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Rooster Finance
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Financeiro e Mensalidades</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Emissão de notas fiscais, controle de mensalidades e gestão financeira de serviços e produtos.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Notas fiscais", value: "0" },
          { label: "Mensalidades", value: "0" },
          { label: "Receitas", value: "R$0,00" },
          { label: "Despesas", value: "R$0,00" },
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

export default RoosterFinance;
