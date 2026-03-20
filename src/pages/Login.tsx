import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [usuarioError, setUsuarioError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
  const [recuperacaoEmail, setRecuperacaoEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    setUsuarioError("");
    setPasswordError("");

    if (!usuario.trim()) {
      setUsuarioError("Digite o usuário para continuar.");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Digite a senha antes de entrar.");
      hasError = true;
    }

    if (hasError) return;

    navigate("/dashboard");
  };

  const handleRecuperacaoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email de recuperação enviado para: ${recuperacaoEmail}`);
    setMostrarRecuperacao(false);
    setRecuperacaoEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-slate-700 bg-slate-900/80 shadow-xl backdrop-blur">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full border border-white/20 bg-black/40 flex items-center justify-center">
              <img src="/icons/rooster.png" alt="Rooster Logo" className="h-12 w-12 filter brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-bold text-white">Rooster Desk</h1>
            <p className="text-sm text-slate-200">Wake up your workflow</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="usuario" className="text-slate-200">Usuário</Label>
              <Input
                id="usuario"
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="mt-1 bg-slate-800 text-white"
              />
              {usuarioError && <div className="mt-1 text-xs text-rose-400">{usuarioError}</div>}
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-200">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-slate-800 text-white"
              />
              {passwordError && <div className="mt-1 text-xs text-rose-400">{passwordError}</div>}
            </div>

            <Button type="submit" className="w-full">Entrar</Button>

            <div className="text-center">
              <button
                type="button"
                className="text-xs text-slate-300 hover:text-white"
                onClick={() => setMostrarRecuperacao(true)}
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {mostrarRecuperacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-sm rounded-xl border border-slate-600 bg-slate-950 p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-3">Recuperação de Senha</h2>
            <p className="text-sm text-slate-300 mb-4">Informe seu e-mail para receber o link de recuperação.</p>
            <form className="space-y-4" onSubmit={handleRecuperacaoSubmit}>
              <div>
                <Label htmlFor="recuperacaoEmail" className="text-slate-200">E-mail</Label>
                <Input
                  id="recuperacaoEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={recuperacaoEmail}
                  onChange={(e) => setRecuperacaoEmail(e.target.value)}
                  className="mt-1 bg-slate-800 text-white"
                  required
                />
              </div>
              <div className="flex justify-between gap-2">
                <Button type="submit" className="flex-1">Enviar</Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-white border-white/70 bg-slate-800 hover:bg-slate-700"
                  onClick={() => setMostrarRecuperacao(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
