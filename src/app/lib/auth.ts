// Autenticação client-side simples baseada em localStorage.
// OBS: por ser um projeto sem backend de auth dedicado, as contas ficam no navegador.
// As senhas NÃO são guardadas em texto puro — armazenamos apenas o hash SHA-256.
// Isto não substitui um servidor de autenticação real, mas atende aos requisitos:
// login/registro funcionais, bloqueio sem credenciais válidas e sessão persistente no F5.

const ACCOUNTS_KEY = "crytto-accounts";
const SESSION_KEY = "crytto-session";
const USER_ID_KEY = "crytto-user-id"; // reutilizado pelo restante do app (characters/api)
const USERNAME_KEY = "crytto-username";

export interface Account {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  username: string;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "u-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback simples caso SubtleCrypto não esteja disponível (ex.: http sem contexto seguro).
  let h = 0;
  for (let i = 0; i < password.length; i++) h = (Math.imul(31, h) + password.charCodeAt(i)) | 0;
  return "fallback-" + (h >>> 0).toString(16);
}

function readAccounts(): Account[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Ativa a sessão e sincroniza a identidade usada pelo resto do app (API de personagens etc.).
function startSession(account: Account): SessionUser {
  const user: SessionUser = { id: account.id, username: account.username };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem(USER_ID_KEY, account.id);
  localStorage.setItem(USERNAME_KEY, account.username);
  return user;
}

export function getCurrentUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function updateCurrentUserId(id: string): SessionUser | null {
  const current = getCurrentUser();
  if (!current) return null;
  const updated = { ...current, id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  localStorage.setItem(USER_ID_KEY, id);
  return updated;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export async function register(username: string, password: string): Promise<SessionUser> {
  const name = username.trim();
  if (name.length < 3) throw new Error("O usuário deve ter ao menos 3 caracteres.");
  if (password.length < 4) throw new Error("A senha deve ter ao menos 4 caracteres.");

  const accounts = readAccounts();
  if (accounts.some((a) => a.username.toLowerCase() === name.toLowerCase())) {
    throw new Error("Este usuário já existe. Faça login.");
  }

  const account: Account = {
    id: uuid(),
    username: name,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  accounts.push(account);
  writeAccounts(accounts);
  return startSession(account);
}

export async function login(username: string, password: string): Promise<SessionUser> {
  const name = username.trim();
  if (!name || !password) throw new Error("Informe usuário e senha.");

  const account = readAccounts().find((a) => a.username.toLowerCase() === name.toLowerCase());
  if (!account) throw new Error("Usuário não encontrado.");

  const hash = await hashPassword(password);
  if (hash !== account.passwordHash) throw new Error("Senha incorreta.");

  return startSession(account);
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
