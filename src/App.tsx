import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Usuarios from "@/pages/Usuarios";
import Perfil from "@/pages/Perfil";
import Configuracoes from "@/pages/Configuracoes";
import Login from "@/pages/Login";
import Tickets from "@/pages/Tickets/DashTicketsAtendimento";
import BuscaTicket from "@/pages/Tickets/BuscaTicket";
import Ticket from "@/pages/Tickets/Ticket";
import Categorias from "@/pages/Categorias/Categorias";
import Subcategorias from "@/pages/Categorias/Subcategorias";
import Setores from "@/pages/Setores/Setores";
import Subsetor from "@/pages/Setores/Funcoes";
import UsuarioFuncao from "@/pages/Setores/UsuarioFuncao";
import UsuarioSetor from "@/pages/Setores/UsuarioSetor";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            {/* abrir direto no dashboard; remove rota/login */}
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
