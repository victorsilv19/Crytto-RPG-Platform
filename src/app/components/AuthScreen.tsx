import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Swords, LogIn, UserPlus, Loader2 } from "lucide-react";
import { login, register, type SessionUser } from "../lib/auth";

interface AuthScreenProps {
  onAuthenticated: (user: SessionUser) => void;
}

type Mode = "login" | "register";

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Bloqueia o acesso sem credenciais válidas.
    if (!username.trim() || !password) {
      toast.error("Preencha usuário e senha.");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const user = mode === "login"
        ? await login(username, password)
        : await register(username, password);
      toast.success(mode === "login" ? `Bem-vindo de volta, ${user.username}!` : `Conta criada! Bem-vindo, ${user.username}!`);
      onAuthenticated(user);
    } catch (err: any) {
      toast.error(err?.message || "Não foi possível autenticar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-red-900/5 pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 border-red-900/30">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-900/30 to-red-700/20 border-2 border-red-500/50 rounded-full mx-auto mb-3">
            <Swords className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Entrar naooo CRYTTO" : "Criar Conta"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Acesse sua conta para continuar sua aventura"
              : "Crie sua conta para começar a jogar"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
              />
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar Senha</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                />
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : mode === "login" ? (
                <LogIn className="h-4 w-4 mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {mode === "login" ? "Login" : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                resetFields();
              }}
              className="text-red-400 hover:text-red-300 font-medium"
            >
              {mode === "login" ? "Criar Conta" : "Fazer Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
