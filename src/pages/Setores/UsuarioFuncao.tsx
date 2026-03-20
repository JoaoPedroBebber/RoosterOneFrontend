import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SetorItem {
  nome: string;
  descricao: string;
  usuarios: string[];
  subsetores: string[];
}

interface CategoriaItem {
  nome: string;
  subcategorias: string[];
}

const setoresBase: SetorItem[] = [
  { nome: "TI", descricao: "Infraestrutura e sistemas", usuarios: ["Ana Souza", "Carlos Silva"], subsetores: ["Infra", "Sistema"] },
  { nome: "Financeiro", descricao: "Contas a pagar e receber", usuarios: ["João Santos", "Maria Oliveira"], subsetores: ["Contas a pagar", "Contas a receber"] },
  { nome: "Marketing", descricao: "Vídeos e imagens", usuarios: ["Fernanda Lima", "Roberto Costa"], subsetores: ["Vídeos", "Imagens"] },
];

const categoriasBase: CategoriaItem[] = [
  { nome: "Infraestrutura", subcategorias: ["Reforma", "Instalação", "Manutenção"] },
  { nome: "Software", subcategorias: ["Bug", "Nova funcionalidade", "Atualização"] },
  { nome: "Hardware", subcategorias: ["Substituição", "Reparo", "Configuração"] },
  { nome: "Rede", subcategorias: ["Conectividade", "VPN", "Segurança"] },
];

const UsuarioFuncao = () => {
  const navigate = useNavigate();
  const { setor, funcao } = useParams<{ setor: string; funcao: string }>();
  const nomeSetor = setor ? decodeURIComponent(setor) : "";

  const setorAtivo = setoresBase.find((s) => s.nome === nomeSetor);

  const usuarios = setorAtivo?.usuarios ?? [];

  const funcaoSelecionadaNome = funcao ? decodeURIComponent(funcao) : "";
  const [categoriaFuncao, subcategoriaFuncao] = funcaoSelecionadaNome.split("::");

  const funcaoLabel = funcaoSelecionadaNome ? `${categoriaFuncao} / ${subcategoriaFuncao}` : "";

  const funcoes = useMemo(
    () => categoriasBase.flatMap((categoria) =>
      categoria.subcategorias.map((subcategoria) => ({ categoria: categoria.nome, subcategoria }))
    ),
    []
  );

  const [usrFiltro, setUsrFiltro] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});

  const usuariosFiltrados = useMemo(() =>
    usuarios.filter((u) => u.toLowerCase().includes(usrFiltro.trim().toLowerCase())),
    [usuarios, usrFiltro]
  );

  const getFuncaoKey = () => funcaoSelecionadaNome;

  const funcaoValida = Boolean(categoriaFuncao && subcategoriaFuncao && categoriasBase.some((c) => c.nome === categoriaFuncao && c.subcategorias.includes(subcategoriaFuncao)));

  const handleAtribuirFuncao = () => {
    if (!usuarioSelecionado || !funcaoValida) return;
    const usuario = usuarioSelecionado;
    const key = usuario;
    setAssignments((prev) => {
      const atual = prev[key] ?? [];
      if (atual.includes(funcaoLabel)) return prev;
      return { ...prev, [key]: [...atual, funcaoLabel] };
    });
  };

  const handleRemoverFuncao = (usuario: string, funcNome: string) => {
    setAssignments((prev) => {
      const atual = prev[usuario] ?? [];
      return { ...prev, [usuario]: atual.filter((item) => item !== funcNome) };
    });
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

  if (!funcaoValida) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(`/setores/${encodeURIComponent(nomeSetor)}/funcoes`)}>Voltar</Button>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Função inválida.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuários x Funções - {setorAtivo.nome}</h1>
          <p className="text-muted-foreground">Atribua funções para usuários deste setor.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/setores")}> <ArrowLeft className="h-4 w-4" /> Voltar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de atributos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Filtrar usuários</Label>
              <Input placeholder="Buscar usuário" value={usrFiltro} onChange={(e) => setUsrFiltro(e.target.value)} />
            </div>
            <div>
              <Label>Usuário</Label>
              <select
                value={usuarioSelecionado}
                onChange={(e) => setUsuarioSelecionado(e.target.value)}
                className="w-full rounded border border-input px-3 py-2"
              >
                <option value="">Selecione usuário</option>
                {usuariosFiltrados.map((usuario) => (
                  <option key={usuario} value={usuario}>{usuario}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
            <div>
              <Label>Função</Label>
              <Input value={funcaoLabel} disabled />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleAtribuirFuncao}>Atribuir a função</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usuariosFiltrados.map((usuario) => (
          <Card key={usuario} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{usuario}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(assignments[usuario] ?? []).map((funcao) => (
                  <Badge key={funcao} variant="secondary" className="px-2 py-1">
                    {funcao}
                    <button
                      onClick={() => handleRemoverFuncao(usuario, funcao)}
                      className="ml-1 rounded-full px-1 font-bold"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
              {(assignments[usuario] ?? []).length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">Nenhuma função atribuída.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsuarioFuncao;
