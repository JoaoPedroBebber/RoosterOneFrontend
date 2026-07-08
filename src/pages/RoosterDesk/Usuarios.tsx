import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Phone, FolderOpen } from "lucide-react";
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { dadosMockSistema } from "@/pages/RoosterDesk/dados";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  tipo: string;
  setor: string;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>(dadosMockSistema.usuarios);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTelefone, setFiltroTelefone] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroSetor, setFiltroSetor] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tipos = useMemo(() => [...new Set(usuarios.map(u => u.tipo))], [usuarios]);
  const setores = useMemo(() => [...new Set(usuarios.map(u => u.setor))], [usuarios]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const newUsers = results.data.map((row: { nome: string; telefone: string; email: string; tipo: string; setor: string }, index: number) => ({
            id: Date.now() + index,
            nome: row.nome,
            telefone: row.telefone,
            email: row.email,
            tipo: row.tipo,
            setor: row.setor,
          }));
          setUsuarios(prev => [...prev, ...newUsers]);
        },
      });
    }
  };

  const downloadTemplate = () => {
    const csvContent = "nome,telefone,email,tipo,setor\nJoão Silva,(41) 99999-0000,joao@example.com,Professor,Ensino";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
    usuario.telefone.includes(filtroTelefone) &&
    usuario.email.toLowerCase().includes(filtroEmail.toLowerCase()) &&
    (filtroTipo ? usuario.tipo === filtroTipo : true) &&
    (filtroSetor ? usuario.setor === filtroSetor : true)
  );

  const navigate = useNavigate();

  const openEditDialog = (usuario: User) => {
    setEditUserId(usuario.id);
    setEditEmail(usuario.email);
    setEditTelefone(usuario.telefone);
    setEditTipo(usuario.tipo);
    setIsEditDialogOpen(true);
  };

  const saveUserEdition = () => {
    if (editUserId === null) return;
    setUsuarios(prev => prev.map(u => u.id === editUserId ? { ...u, email: editEmail, telefone: editTelefone, tipo: editTipo } : u));
    setIsEditDialogOpen(false);
    setEditUserId(null);
    setEditEmail("");
    setEditTelefone("");
    setEditTipo("");
  };

  const openDeleteDialog = (userId: number) => {
    setDeleteUserId(userId);
    setAdminPassword("");
    setDeleteError("");
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteUserId) return;
    if (adminPassword !== "admin") {
      setDeleteError("Senha incorreta. Tente 'admin'.");
      return;
    }
    setUsuarios(prev => prev.filter(u => u.id !== deleteUserId));
    setIsDeleteDialogOpen(false);
    setDeleteUserId(null);
    setAdminPassword("");
    setDeleteError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Cadastro e controle de usuários do sistema</p>
        </div>
        <div className="flex gap-2">

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" placeholder="Ex: João da Silva" />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="Ex: (41) 99999-0000" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Ex: joao@example.com" />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <select id="tipo" className="w-full border rounded h-10 px-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    <option value="Admin">Admin</option>
                    <option value="Professor">Professor</option>
                    <option value="Coordenação">Coordenação</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="setor">Setor</Label>
                  <select id="setor" className="w-full border rounded h-10 px-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    <option value="TI">TI</option>
                    <option value="Ensino">Ensino</option>
                    <option value="Administração">Administração</option>
                    <option value="Financeiro">Financeiro</option>
                  </select>
                </div>
                <Button className="w-full">Cadastrar Usuário</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editTelefone">Telefone</Label>
                  <Input
                    id="editTelefone"
                    value={editTelefone}
                    onChange={e => setEditTelefone(e.target.value)}
                    placeholder="(41) 99999-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    placeholder="usuario@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="editTipo">Permissões</Label>
                  <select id="editTipo" value={editTipo} onChange={e => setEditTipo(e.target.value)} className="w-full border rounded h-10 px-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    <option value="Admin">Admin</option>
                    <option value="Professor">Professor</option>
                    <option value="Coordenação">Coordenação</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
                <Button className="w-full" onClick={saveUserEdition}>Salvar alterações</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Digite a senha de admin para confirmar a exclusão de usuário.</p>
                <div>
                  <Label htmlFor="adminPassword">Senha de Admin</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="admin"
                  />
                </div>
                {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
                <div className="flex gap-2">
                  <Button className="w-full" onClick={confirmDelete}>Confirmar exclusão</Button>
                  <Button className="w-full" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Importar CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Usuários via CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Baixe o modelo de CSV para importar usuários. Certifique-se de que o arquivo tenha as colunas: nome, telefone, email, tipo, setor.
                </p>
                <Button onClick={downloadTemplate} variant="outline" className="w-full">
                  Baixar Modelo CSV
                </Button>
                <div>
                  <Label>Selecionar Arquivo CSV</Label>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full mt-2">
                    Escolher Arquivo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Nome</Label>
              <Input
                placeholder="Buscar por nome"
                value={filtroNome}
                onChange={e => setFiltroNome(e.target.value)}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                placeholder="Buscar por telefone"
                value={filtroTelefone}
                onChange={e => setFiltroTelefone(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="Buscar por email"
                value={filtroEmail}
                onChange={e => setFiltroEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                className="w-full border rounded h-10 px-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
              >
                <option value="">Todos</option>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Setor</Label>
              <select
                className="w-full border rounded h-10 px-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                value={filtroSetor}
                onChange={e => setFiltroSetor(e.target.value)}
              >
                <option value="">Todos</option>
                {setores.map(setor => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Usuários */}
      <div className="w-full">
        <div
          style={{
            maxHeight: "420px",
            overflowY: "auto",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
          className="bg-card text-card-foreground"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.telefone}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.tipo}</TableCell>
                  <TableCell>{usuario.setor}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(usuario)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => window.open(`https://wa.me/${usuario.telefone.replace(/\D/g, '')}`, '_blank')}
                      >
                        <Phone className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(usuario.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {usuariosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum usuário encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Usuarios;