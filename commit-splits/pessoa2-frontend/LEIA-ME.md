# Pessoa 2 — Frontend (React / UI)

Arquivos para commitar (mantendo a estrutura de pastas do repositório):

## Entry points
- `src/main.tsx` (modificado)
- `src/app/App.tsx` (modificado)

## Componentes de aplicação (`src/app/components/`)
Modificados:
- AudioPlayer.tsx, CalendarAgenda.tsx, CharacterManager.tsx, CharacterSheet.tsx,
  ChatArea.tsx, CryttsShop.tsx, DiceRoller.tsx, EnhancedMarketplace.tsx,
  Header.tsx, ProfileCustomizer.tsx, ReplayPlayer.tsx, Sidebar.tsx, ThemeCustomizer.tsx

Novos:
- Achievements.tsx, AuthScreen.tsx

## Biblioteca de UI (`src/app/components/ui/`)
Todos os 40 arquivos modificados:
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button,
calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog,
drawer, dropdown-menu, form, hover-card, input-otp, label, menubar, navigation-menu,
pagination, popover, progress, radio-group, resizable, scroll-area, select,
separator, sheet, sidebar, slider, sonner, switch, tabs, toggle, toggle-group, tooltip.

## Libs & Tipos (novos)
- `src/app/lib/api.ts`
- `src/app/lib/auth.ts`
- `src/app/lib/characterStore.ts`
- `src/app/lib/theme.ts`
- `src/types/shims.d.ts`

## Como aplicar
1. Extraia o zip na raiz do repositório (sobrescrevendo os arquivos existentes).
2. Confira com `git status` / `git diff` antes de commitar.
3. Sugestão de commit: `feat(frontend): atualiza componentes, UI kit, auth e libs`.
