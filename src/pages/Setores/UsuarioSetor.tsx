import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SetorItem {
  nome: string;
  descricao: string;
  usuarios: string[];
  coordinadores: string[];
}

const setoresBase: SetorItem[] = [
  { nome: "TI", descricao: "Infraestrutura e sistemas", usuarios: ["Ana Souza", "Carlos Silva"], coordinadores: ["Caio Almeida"] },
  { nome: "Financeiro", descricao: "Contas a pagar e receber", usuarios: ["João Santos", "Maria Oliveira"], coordinadores: ["Bruna Moraes"] },
  { nome: "Marketing", descricao: "Vídeos e imagens", usuarios: ["Fernanda Lima", "Roberto Costa"], coordinadores: ["Lara Castro"] },
];

const usuariosDisponiveis = [
  "Ana Souza",
  "Carlos Silva",
  "Maria Oliveira",
  "João Santos",
  "Fernanda Lima",
  "Roberto Costa",
  "Pedro Henrique",
  "Juliana Alves",
  "Marcos Lima",
];

const UsuarioSetor = () => {
  const navigate = useNavigate();
  const { setor } = useParams<{ setor: string }>();
  const nomeSetor = setor ? decodeURIComponent(setor) : "";

  const setorAtivo = setoresBase.find((s) => s.nome === nomeSetor);

  const [filtro, setFiltro] = useState("");
  const usuarios = setorAtivo?.usuarios ?? [];
  const userRoles: Record<string, "Usuário" | "Técnico" | "Coordenador"> = (() => {
    const roles: Record<string, "Usuário" | "Técnico" | "Coordenador"> = {};
    if (setorAtivo) {
      setorAtivo.usuarios.forEach((u) => {
        if (!roles[u]) roles[u] = "Usuário";
      });
      setorAtivo.coordinadores.forEach((c) => {
        roles[c] = "Coordenador";
      });
    }
    return roles;
  })();



  if (!setorAtivo) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/setores")}>Voltar</Button>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Setor não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuários do setor - {setorAtivo.nome}</h1>
          <p className="text-muted-foreground">Defina coordenadores e vincule usuários ao setor.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/setores")}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="filtro-usuario">Buscar usuário</Label>
          <Input
            id="filtro-usuario"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Digite nome do usuário"
          />
        </div>
      </div>



      <div style={{ maxHeight: "520px", overflowY: "auto" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Nível</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.filter(u => u.toLowerCase().includes(filtro.toLowerCase())).map((usuario) => {
              const nivel = userRoles[usuario] ?? "Usuário";
              return (
                <TableRow key={usuario}>
                  <TableCell>{usuario}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      nivel === "Coordenador" ? "bg-emerald-100 text-emerald-700" : nivel === "Técnico" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {nivel}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}

            {usuarios.filter(u => u.toLowerCase().includes(filtro.toLowerCase())).length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                  Nenhum usuário vinculado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsuarioSetor;
