import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/RoosterDesk/Dashboard";
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


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
            <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
            <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
            <Route path="/tickets" element={<Layout><Tickets /></Layout>} />
            <Route path="/tickets/busca" element={<Layout><BuscaTicket /></Layout>} />
            <Route path="/tickets/:id" element={<Layout><Ticket /></Layout>} />
            <Route path="/categorias" element={<Layout><Categorias /></Layout>} />
            <Route path="/categorias/:categoria/subcategorias" element={<Layout><Subcategorias /></Layout>} />
            <Route path="/setores" element={<Layout><Setores /></Layout>} />
            <Route path="/setores/:setor/usuarios" element={<Layout><UsuarioSetor /></Layout>} />
            <Route path="/setores/:setor/funcoes" element={<Layout><Subsetor /></Layout>} />
            <Route path="/setores/:setor/funcoes/:funcao/usuarios" element={<Layout><UsuarioFuncao /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
