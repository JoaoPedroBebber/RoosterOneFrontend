import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerfilUsuario {
  nome: string;
  telefone: string;
  email: string;
  nivelAcesso: 'Usuário' | 'Técnico' | 'Coordenador';
  setor: string;
  categorias?: string[];
  subcategorias?: string[];
}

const Perfil = () => {
  const [usuario] = useState<PerfilUsuario>({
    nome: 'João da Silva',
    telefone: '(41) 99999-0000',
    email: 'joao.silva@escola.com',
    nivelAcesso: 'Técnico',
    setor: 'Suporte Técnico',
    categorias: ['Sistema', 'Hardware', 'Rede'],
    subcategorias: ['Login', 'Impressoras', 'Intermitência'],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
        <p className="text-muted-foreground">Veja abaixo seus dados e permissões atuais</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Nome</p>
            <p className="font-medium">{usuario.nome}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Telefone</p>
            <p className="font-medium">{usuario.telefone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{usuario.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Nível de Acesso</p>
            <Badge className="bg-blue-100 text-blue-800">{usuario.nivelAcesso}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Setor</p>
            <p className="font-medium">{usuario.setor}</p>
          </div>
        </CardContent>
      </Card>

      {(usuario.nivelAcesso === 'Técnico' || usuario.nivelAcesso === 'Coordenador') && (
        <Card>
          <CardHeader>
            <CardTitle>Escopo de Acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground">Categorias</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {usuario.categorias?.map((categoria) => (
                  <Badge key={categoria} className="bg-emerald-100 text-emerald-800">
                    {categoria}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground">Subcategorias</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {usuario.subcategorias?.map((subcategoria) => (
                  <Badge key={subcategoria} className="bg-amber-100 text-amber-800">
                    {subcategoria}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Perfil;
