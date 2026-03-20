import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Categoria {
  nome: string;
  descricao: string;
  subcategorias: string[];
}

const categoriasBase: Categoria[] = [
  { nome: "Infraestrutura", descricao: "Atualizações de estrutura e instalações físicas", subcategorias: ["Reforma", "Instalação", "Manutenção"] },
  { nome: "Software", descricao: "Erros e melhorias em sistemas e aplicações", subcategorias: ["Bug", "Nova funcionalidade", "Atualização"] },
  { nome: "Hardware", descricao: "Atendimento em equipamentos, computadores e periféricos", subcategorias: ["Substituição", "Reparo", "Configuração"] },
  { nome: "Rede", descricao: "Conectividade, VPN e segurança de rede", subcategorias: ["Conectividade", "VPN", "Segurança"] },
];

const setorUsuariosMap: Record<string, string[]> = {
  TI: ["Ana Souza", "Carlos Silva"],
  Financeiro: ["João Santos", "Maria Oliveira"],
  Marketing: ["Fernanda Lima", "Roberto Costa"],
};

const Funcoes = () => {
  const navigate = useNavigate();
  const { setor } = useParams<{ setor: string }>();
  const nomeSetor = setor ? decodeURIComponent(setor) : "";

  const usuariosSetor = setorUsuariosMap[nomeSetor] || [];

  const [filtro, setFiltro] = useState("");

  const funcoes = useMemo(
    () => categoriasBase.flatMap((categoria) =>
      categoria.subcategorias.map((subcategoria) => ({
        categoria: categoria.nome,
        subcategoria,
      }))
    ),
    []
  );

  const funcoesFiltradas = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return funcoes;
    return funcoes.filter((funcao) =>
      funcao.categoria.toLowerCase().includes(termo) ||
      funcao.subcategoria.toLowerCase().includes(termo)
    );
  }, [filtro, funcoes]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Funções - {nomeSetor || "Setor"}</h1>
          <p className="text-muted-foreground">Aqui você pode atribuir usuários deste setor às categorias e subcategorias (funções).</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/setores")}> <ArrowLeft className="h-4 w-4" /> Voltar</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-4 w-4" /> Filtrar Funções</CardTitle>
        </CardHeader>
        <CardContent>
          <Input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar por categoria ou subcategoria" />
        </CardContent>
      </Card>

      {usuariosSetor.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado para o setor "{nomeSetor}".</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funcoesFiltradas.map(({ categoria, subcategoria }) => {
          return (
            <Card key={`${categoria}:${subcategoria}`} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{subcategoria}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Categoria: {categoria}</p>
                      <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/setores/${encodeURIComponent(nomeSetor)}/funcoes/${encodeURIComponent(categoria)}::${encodeURIComponent(subcategoria)}/usuarios`)}
                  >
                    Abrir tabela de atribuição desta função
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {funcoesFiltradas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium">Nenhuma função encontrada</h3>
            <p className="text-muted-foreground">Ajuste o filtro ou crie novas categorias/subcategorias em Categorias.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Funcoes;
