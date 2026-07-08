import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dadosMockSistema } from "@/pages/RoosterDesk/dados";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const UsuarioSetor = () => {
  const navigate = useNavigate();
  const { setor } = useParams<{ setor: string }>();
  const nomeSetor = setor ? decodeURIComponent(setor) : "";

  const setorAtivo = dadosMockSistema.setorDetalhes.find((s) => s.nome === nomeSetor);

  const [filtro, setFiltro] = useState("");
  const [usuariosState, setUsuariosState] = useState<string[]>(setorAtivo?.usuarios ?? []);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [suspendUntil, setSuspendUntil] = useState<string | null>(null);
  const [suspendedMap, setSuspendedMap] = useState<Record<string, string | null>>({});

  const tecnicosDisponiveis = useMemo(
    () => dadosMockSistema.usuarios.filter((u) => u.tipo === "Técnico" && !usuariosState.includes(u.nome)),
    [usuariosState]
  );

  const addUsuario = (nome: string) => {
    if (!nome) return;
    setUsuariosState((prev) => [...prev, nome]);
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    setUsuariosState((prev) => prev.filter((u) => u !== removeTarget));
    setSuspendedMap((prev) => {
      const copy = { ...prev };
      delete copy[removeTarget];
      return copy;
    });
    setRemoveTarget(null);
  };

  const confirmSuspend = (usuario: string | null) => {
    if (!usuario) return;
    setSuspendedMap((prev) => ({ ...prev, [usuario]: suspendUntil || "indefinido" }));
    setSuspendTarget(null);
    setSuspendUntil(null);
  };

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
          <p className="text-muted-foreground">Gerencie técnicos do setor, remova ou suspenda acessos.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/setores")}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <Label>Filtrar usuários</Label>
              <Input placeholder="Buscar usuário" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
            </div>

            <div>
              <Label>Adicionar técnico</Label>
              <select className="w-full rounded border border-input px-3 py-2" onChange={(e) => addUsuario(e.target.value)} defaultValue="">
                <option value="" disabled>
                  Selecione um técnico
                </option>
                {tecnicosDisponiveis.map((t) => (
                  <option key={t.nome} value={t.nome}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-right">
              <Label>Suspensões</Label>
              <div className="text-sm text-muted-foreground">Suspender acesso temporariamente ou indefinidamente</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div style={{ maxHeight: "520px", overflowY: "auto" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Suspenso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosState
              .filter((u) => u.toLowerCase().includes(filtro.toLowerCase()))
              .map((usuario) => {
                const nivel = setorAtivo.coordenadores.includes(usuario) ? "Coordenador" : "Técnico";
                const suspended = suspendedMap[usuario];
                return (
                  <TableRow key={usuario}>
                    <TableCell>{usuario}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          nivel === "Coordenador" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {nivel}
                      </span>
                    </TableCell>
                    <TableCell>
                      {suspended ? (
                        <div className="text-sm text-destructive">{suspended === "indefinido" ? "Sim (indef.)" : `Até ${suspended}`}</div>
                      ) : (
                        <div className="text-sm text-foreground">Não</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <AlertDialog open={Boolean(removeTarget === usuario)} onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" onClick={() => setRemoveTarget(usuario)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover usuário</AlertDialogTitle>
                              <AlertDialogDescription>Confirma remoção do usuário do setor? Esta ação removerá também suspensões.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-2 mt-4 justify-end">
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmRemove}>Remover</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={Boolean(suspendTarget === usuario)} onOpenChange={(open) => { if (!open) { setSuspendTarget(null); setSuspendUntil(null); } }}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" onClick={() => { setSuspendTarget(usuario); setSuspendUntil(null); }}>
                              {suspended ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{suspended ? "Reativar acesso" : "Suspender acesso"}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {suspended ? "Deseja reativar o acesso deste usuário?" : "Opcional: escolha uma data até quando suspender."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            {!suspended && (
                              <div className="mt-3">
                                <Label>Data até</Label>
                                <input type="date" className="w-full rounded border px-2 py-1 mt-1" value={suspendUntil ?? ""} onChange={(e) => setSuspendUntil(e.target.value)} />
                              </div>
                            )}
                            <div className="flex gap-2 mt-4 justify-end">
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => {
                                if (suspended) {
                                  setSuspendedMap((prev) => { const copy = { ...prev }; delete copy[usuario]; return copy; });
                                  setSuspendTarget(null);
                                } else {
                                  confirmSuspend(usuario);
                                }
                              }}>{suspended ? "Reativar" : "Confirmar"}</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

            {usuariosState.filter((u) => u.toLowerCase().includes(filtro.toLowerCase())).length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
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
