import { dadosMockSistema, type Ticket } from "@/pages/RoosterDesk/dados";

const ACCESS_TOKEN_KEY = "roosterdesk-access-token";
const REFRESH_TOKEN_KEY = "roosterdesk-refresh-token";
const ROLE_KEY = "desk-role";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };
}

export const mapBackendRole = (tipo?: string) => {
  switch (tipo) {
    case "Admin":
      return "admin";
    case "Coordenacao":
      return "coordenador";
    case "Tecnico":
      return "tecnico";
    default:
      return "usuario";
  }
};

export const getStoredToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const setStoredAuth = (loginResponse: LoginResponse) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, loginResponse.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, loginResponse.refresh_token);
  localStorage.setItem(ROLE_KEY, mapBackendRole(loginResponse.usuario.tipo));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const getStoredRole = () => localStorage.getItem(ROLE_KEY) ?? "admin";

export const login = async (email: string, senha: string) => {
  const role = email.includes("coord") ? "Coordenacao" : email.includes("tec") ? "Tecnico" : email.includes("user") ? "Usuario" : "Admin";

  const response: LoginResponse = {
    access_token: `mock-token-${Date.now()}`,
    refresh_token: `mock-refresh-${Date.now()}`,
    usuario: {
      id: 1,
      nome: "Usuário Mock",
      email,
      tipo: role,
    },
  };

  setStoredAuth(response);
  return response;
};

export const fetchCurrentUser = async () => {
  const storedRole = getStoredRole();

  return {
    id: 1,
    nome: "Usuário Mock",
    email: "mock@rosterdesk.local",
    tipo: storedRole === "admin" ? "Admin" : storedRole === "coordenador" ? "Coordenacao" : storedRole === "tecnico" ? "Tecnico" : "Usuario",
    setor: { id: 1, nome: "TI" },
  };
};

export const fetchTickets = async () => {
  return dadosMockSistema.tickets as Ticket[];
};

export const fetchTicketById = async (id: number) => {
  return (dadosMockSistema.tickets.find((item) => item.id === id) ?? dadosMockSistema.tickets[0]) as Ticket;
};

export const getMockTickets = () => dadosMockSistema.tickets as Ticket[];
