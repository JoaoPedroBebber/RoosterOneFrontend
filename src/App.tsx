import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from "react";
import { DeskProvider, useDeskRole } from "@/context/DeskContext";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/RoosterDesk/Dashboard";
import Inicio from "@/pages/RoosterDesk/Inicio";
import Usuarios from "@/pages/RoosterDesk/Usuarios";
import Perfil from "@/pages/RoosterDesk/Perfil";
import Configuracoes from "@/pages/RoosterDesk/Configuracoes";
import Login from "@/pages/RoosterDesk/Login";
import Tickets from "@/pages/RoosterDesk/Tickets/DashTicketsAtendimento";
import BuscaTicket from "@/pages/RoosterDesk/Tickets/BuscaTicket";
import Ticket from "@/pages/RoosterDesk/Tickets/Ticket";
import Categorias from "@/pages/RoosterDesk/Categorias/Categorias";
import Subcategorias from "@/pages/RoosterDesk/Categorias/Subcategorias";
import Setores from "@/pages/RoosterDesk/Setores/Setores";
import Subsetor from "@/pages/RoosterDesk/Setores/Funcoes";
import UsuarioFuncao from "@/pages/RoosterDesk/Setores/UsuarioFuncao";
import UsuarioSetor from "@/pages/RoosterDesk/Setores/UsuarioSetor";
import NotFound from "@/pages/RoosterDesk/NotFound";
import Hub from "@/pages/RoosterHub/Hub";
import RoomsPage from "@/pages/RoosterRooms/RoomsPage";
import RoomsManagementPage from "@/pages/RoosterRooms/RoomsManagementPage";
import Cursos from "@/pages/RoosterAcademy/Cursos";
import Turmas from "@/pages/RoosterAcademy/Turmas";
import TurmaAlunos from "@/pages/RoosterAcademy/TurmaAlunos";
import GradeCurricular from "@/pages/RoosterAcademy/GradeCurricular";
import ControleAulas from "@/pages/RoosterAcademy/ControleAulas";
import ControleAulasDetalhes from "@/pages/RoosterAcademy/ControleAulasDetalhes";
import DisciplinasInstitucionais from "@/pages/RoosterAcademy/DisciplinasInstitucionais";
import DisciplinasCategoria from "@/pages/RoosterAcademy/DisciplinasCategoria";
import ControlePresenca from "@/pages/RoosterAcademy/ControlePresenca";
import TurmaCalendarioPresenca from "@/pages/RoosterAcademy/TurmaCalendarioPresenca";
import RoosterAssets from "@/pages/RoosterAssets/RoosterAssets";
import AtivosPage from "@/pages/RoosterAssets/AtivosPage";
import SubcategoriasPage from "@/pages/RoosterAssets/SubcategoriasPage";
import EmprestimosPage from "@/pages/RoosterAssets/EmprestimosPage";
import RoosterLearn from "@/pages/RoosterLearn/RoosterLearn";
import RoosterBoost from "@/pages/RoosterBoost/RoosterBoost";
import RoosterFinance from "@/pages/RoosterFinance/RoosterFinance";

const queryClient = new QueryClient();

// Componente para redirecionamento automático baseado no role
const RoleBasedRedirect = () => {
  const { role } = useDeskRole();
  const location = useLocation();

  const restrictedPaths = ["/dashboard", "/usuarios", "/configuracoes", "/perfil", "/categorias", "/setores", "/academy"];

  if (role === "usuario" && restrictedPaths.includes(location.pathname)) {
    return <Navigate to="/tickets" replace />;
  }

  return null;
};

// Componente para dashboard com redirecionamento para usuario
const DashboardWithRedirect = () => {
  const { role } = useDeskRole();

  if (role === "usuario") {
    return <Navigate to="/tickets" replace />;
  }

  return <Dashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DeskProvider>
          <RoleBasedRedirect />
          <Routes>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/hub" element={<Layout><Hub /></Layout>} />
          <Route path="/inicio" element={<Layout><Inicio /></Layout>} />
          <Route path="/dashboard" element={<Layout><DashboardWithRedirect /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
          <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
          <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
          <Route path="/tickets" element={<Layout><Tickets /></Layout>} />
          <Route path="/tickets/busca" element={<Layout><BuscaTicket /></Layout>} />
          <Route path="/tickets/:id" element={<Layout><Ticket /></Layout>} />
          <Route path="/rooms/reservas" element={<Layout><RoomsPage /></Layout>} />
          <Route path="/rooms" element={<Layout><RoomsManagementPage /></Layout>} />
          <Route path="/academy" element={<Navigate to="/academy/controle-aulas" replace />} />
          <Route path="/academy/cursos" element={<Layout><Cursos /></Layout>} />
          <Route path="/academy/cursos/:cursoId/turmas" element={<Layout><Turmas /></Layout>} />
          <Route path="/academy/cursos/:cursoId/turmas/:turmaId/alunos" element={<Layout><TurmaAlunos /></Layout>} />
          <Route path="/academy/cursos/:cursoId/turmas/:turmaId/grade" element={<Layout><GradeCurricular /></Layout>} />
          <Route path="/academy/controle-aulas" element={<Layout><ControleAulas /></Layout>} />
          <Route path="/academy/controle-aulas/turmas/:turmaId" element={<Layout><ControleAulasDetalhes /></Layout>} />
          <Route path="/academy/controle-presenca" element={<Layout><ControlePresenca /></Layout>} />
          <Route path="/academy/controle-presenca/turmas/:turmaId" element={<Layout><TurmaCalendarioPresenca /></Layout>} />
          <Route path="/academy/disciplinas" element={<Layout><DisciplinasInstitucionais /></Layout>} />
          <Route path="/academy/disciplinas/:categoriaNome/disciplinas" element={<Layout><DisciplinasCategoria /></Layout>} />
          <Route path="/assets" element={<Layout><RoosterAssets /></Layout>} />
          <Route path="/assets/ativos" element={<Layout><AtivosPage /></Layout>} />
          <Route path="/assets/subcategorias" element={<Layout><SubcategoriasPage /></Layout>} />
          <Route path="/assets/emprestimos" element={<Layout><EmprestimosPage /></Layout>} />
          <Route path="/learn" element={<Layout><RoosterLearn /></Layout>} />
          <Route path="/learn/gerenciar" element={<Layout><RoosterLearn /></Layout>} />
          <Route path="/boost" element={<Layout><RoosterBoost /></Layout>} />
          <Route path="/finance" element={<Layout><RoosterFinance /></Layout>} />
          <Route path="/categorias" element={<Layout><Categorias /></Layout>} />
          <Route path="/categorias/:categoria/subcategorias" element={<Layout><Subcategorias /></Layout>} />
          <Route path="/setores" element={<Layout><Setores /></Layout>} />
          <Route path="/setores/:setor/usuarios" element={<Layout><UsuarioSetor /></Layout>} />
          <Route path="/setores/:setor/funcoes" element={<Layout><Subsetor /></Layout>} />
          <Route path="/setores/:setor/funcoes/:funcao/usuarios" element={<Layout><UsuarioFuncao /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        </DeskProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
