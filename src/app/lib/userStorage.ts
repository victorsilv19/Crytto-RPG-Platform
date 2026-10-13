// Estado do app guardado no navegador é sempre por conta (sufixo ":<userId>").
// Sem isso, tipo de usuário, saldo e perfil "vazam" entre contas do mesmo navegador e
// uma conta nova pula a escolha Mestre/Jogador por herdar o estado de outra.
export const USER_SCOPED_KEYS = [
  "userTypeSelected",
  "crytto-balance",
  "crytto-profile-data",
  "crytto-current-screen",
] as const;

export function userKey(base: string, userId?: string | null): string {
  return userId ? `${base}:${userId}` : base;
}

// Quando o backend devolve outro id para o mesmo usuário, o estado local acompanha o novo id.
export function migrateUserKeys(oldId: string, newId: string): void {
  if (oldId === newId) return;
  for (const base of USER_SCOPED_KEYS) {
    const value = localStorage.getItem(userKey(base, oldId));
    if (value !== null && localStorage.getItem(userKey(base, newId)) === null) {
      localStorage.setItem(userKey(base, newId), value);
    }
  }
}
