---

description: "Task list template for feature implementation"
---

# Tasks: Minha Estante — Lista de Leituras

**Input**: Design documents from `/specs/001-lista-leituras/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automatizados **não** incluídos (não solicitados na spec; RNF05 = projeto introdutório). A spec pede **testes manuais** dos critérios de aceite — cada fase de story termina com uma tarefa de verificação manual (`quickstart.md`).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project (Expo)**: `App.tsx`, `app.json`, `tsconfig.json` na raiz; código em `src/`
- Estrutura exata em `plan.md` → "Project Structure"

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Projeto Expo + TypeScript + dependências

- [ ] T001 Initialize Expo project with TypeScript template (creates `package.json`, `app.json`, `tsconfig.json`, `App.tsx` at repository root via `npx create-expo-app`)
- [ ] T002 [P] Add navigation dependencies `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context` in `package.json`
- [ ] T003 [P] Add `@react-native-async-storage/async-storage` in `package.json`
- [ ] T004 [P] Configure `strict: true`, `noUncheckedIndexedAccess`, `noImplicitAny` in `tsconfig.json`
- [ ] T005 [P] Configure ESLint + Prettier (template Expo presets) in `package.json` / `.eslintrc.js`
- [ ] T006 Create source directories `src/navigation/`, `src/screens/`, `src/components/`, `src/state/`, `src/storage/`, `src/types/`, `src/validation/` in repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Núcleo tipado que TODAS as stories dependem

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [P] Create `StatusLeitura`, `Livro`, `Filtro` types with closed union in `src/types/livro.ts` (data-model.md)
- [ ] T008 [P] Implement pure `validarLivroForm` (trim + required + erros) in `src/validation/livroForm.ts` (contract §5)
- [ ] T009 Implement `LivroRepository` over AsyncStorage (`carregar`/`salvar`, chave `@minha-estante/dados`) in `src/storage/livroRepository.ts` (depends on T007)
- [ ] T010 [P] Implement `livroReducer` with actions `carregado`, `falhaCarga`, `adicionar`, `alterarStatus`, `definirFiltro`, `limparErro` in `src/state/livroReducer.ts` (depends on T007)
- [ ] T011 Implement `LivroProvider` (Context + reducer, load on mount, persist after mutations) in `src/state/LivroProvider.tsx` (depends on T009, T010)
- [ ] T012 Create `RootNavigator` (native-stack: `Estante` initial, `Cadastro`) in `src/navigation/RootNavigator.tsx` (depends on T002)
- [ ] T013 [P] Create placeholder screens rendering titles only in `src/screens/EstanteScreen.tsx` and `src/screens/CadastroScreen.tsx` (depends on T006)
- [ ] T014 Wire `LivroProvider` + `NavigationContainer` + `RootNavigator` in `App.tsx` (depends on T011, T012, T013)
- [ ] T015 Run gate `npx tsc --noEmit` clean (depends on T007–T014)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Cadastrar um livro (Priority: P1) 🎯 MVP

**Goal**: Formulário validado que grava livro com status inicial "Quero ler"

**Independent Test**: Preencher formulário válido grava e mostra o novo livro; campo vazio bloqueia com mensagem (`quickstart.md` → US.01)

### Implementation for User Story 1

- [ ] T016 [US1] Implement form state and inputs (título, autor) in `src/screens/CadastroScreen.tsx`
- [ ] T017 [US1] Wire `validarLivroForm` with visible error messages before any save in `src/screens/CadastroScreen.tsx` (depends on T008, T016)
- [ ] T018 [US1] Dispatch `adicionar` on valid submit then `navigation.goBack()` in `src/screens/CadastroScreen.tsx` (depends on T011, T017)
- [ ] T019 [US1] Add "Adicionar livro" button navigating to `Cadastro` (entry point for independent test) in `src/screens/EstanteScreen.tsx` (depends on T013)
- [ ] T020 [US1] Manual acceptance US.01: run script in `specs/001-lista-leituras/quickstart.md` section "US.01 — Cadastrar um livro" (depends on T016–T019)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Visualizar a lista de leituras (Priority: P2)

**Goal**: `FlatList` com título/autor/status, mensagem de vazio e filtros de 4 opções

**Independent Test**: Lista vazia mostra mensagem; com livros, filtros `Todos/Quero ler/Lendo/Lido` atualizam imediatamente (`quickstart.md` → US.02)

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create `LivroItem` component (título, autor, status) with `React.memo` in `src/components/LivroItem.tsx` (depends on T007)
- [ ] T022 [P] [US2] Create `FiltroStatus` chips component (4 opções) in `src/components/FiltroStatus.tsx` (depends on T007)
- [ ] T023 [P] [US2] Implement pure `filtrarLivros(livros, filtro)` in `src/state/filtros.ts` (depends on T007)
- [ ] T024 [US2] Build `EstanteScreen` with `FlatList` (`keyExtractor={id}`), empty states, `useMemo` filter wiring to provider in `src/screens/EstanteScreen.tsx` (depends on T011, T021, T022, T023)
- [ ] T025 [US2] Manual acceptance US.02: run script in `specs/001-lista-leituras/quickstart.md` section "US.02 — Visualizar a lista" (depends on T016, T024)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Alterar o status de leitura (Priority: P3)

**Goal**: Transição entre os 3 status com atualização imediata e persistência

**Independent Test**: Mudar status reflete na lista na hora e sobrevive a restart; "Lido" continua cadastrado (`quickstart.md` → US.03)

### Implementation for User Story 3

- [ ] T026 [P] [US3] Add status change action (menu with exactly 3 options) to `LivroItem` in `src/components/LivroItem.tsx` (depends on T007, T021)
- [ ] T027 [US3] Wire `alterarStatus(id, status)` dispatch from item action in `src/screens/EstanteScreen.tsx` (depends on T011, T026)
- [ ] T028 [US3] Display provider `erro` as visible banner with `limparErro` dismissal (no silent crash) in `src/screens/EstanteScreen.tsx` (depends on T011)
- [ ] T029 [US3] Manual acceptance US.03: run script in `specs/001-lista-leituras/quickstart.md` section "US.03 — Alterar o status" (depends on T027, T028)

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all be independently functional

---

## Phase 6: User Story 4 - Navegar pelo aplicativo (Priority: P4)

**Goal**: Fluxo completo Estante ↔ Cadastro sem erros em ambas as direções

**Independent Test**: Percorrer ida/volta, cadastrar e ver o item na lista ao retornar (`quickstart.md` → US.04)

### Implementation for User Story 4

- [ ] T030 [US4] Add clear back option (header back + botão "Voltar") in `src/screens/CadastroScreen.tsx` (depends on T016)
- [ ] T031 [US4] Verify post-save return renders the new item without manual reload in `src/screens/EstanteScreen.tsx` (depends on T018, T024)
- [ ] T032 [US4] Manual acceptance US.04: run script in `specs/001-lista-leituras/quickstart.md` section "US.04 — Navegação" (depends on T030, T031)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Gates finais e limpeza

- [ ] T033 [P] Full static gate: `npx tsc --noEmit` clean in repository root (constituição III)
- [ ] T034 [P] Lint/format pass: `npx eslint src App.tsx --fix` in repository root
- [ ] T035 Run full manual validation: all sections of `specs/001-lista-leituras/quickstart.md` + SC-001..SC-005 in `specs/001-lista-leituras/spec.md`
- [ ] T036 Code cleanup: remove dead code/placeholders from `src/screens/EstanteScreen.tsx` and `src/screens/CadastroScreen.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - MVP
- **User Story 2 (Phase 4)**: Depends on Foundational; list shows US1 data if present, mas funciona com lista vazia
- **User Story 3 (Phase 5)**: Depende de Foundational + itens da lista (T021/T024 de US2) para UX completa; o reducer já aceita a ação desde T010
- **User Story 4 (Phase 6)**: Depende de US1 (fluxo de cadastro) e US2 (tela principal)
- **Polish (Phase 7)**: Depende de todas as stories desejadas

### User Story Dependencies

- **User Story 1 (P1)**: Foundational only — MVP
- **User Story 2 (P2)**: Foundational only (lista vazia já é testável)
- **User Story 3 (P3)**: Foundational + `LivroItem`/`EstanteScreen` (US2) para o teste visual completo
- **User Story 4 (P4)**: US1 + US2

### Within Each User Story

- Componentes `[P]` antes da tela que os consome
- Validação antes da escrita; escrita antes da navegação de saída
- Tarefa manual de aceite é sempre a última da fase
- Story completa antes de iniciar a próxima prioridade

### Parallel Opportunities

- Fase 1: T002, T003, T004, T005 em paralelo (arquivos distintos)
- Fase 2: T007, T008, T010 em paralelo; T013 em paralelo com T009–T012
- Fase 4: T021, T022, T023 em paralelo
- Fase 5: T026 em paralelo com T028
- Fase 7: T033, T034 em paralelo
- Stories 1 e 2 podem rodar em paralelo após a Fase 2 (arquivos distintos)

---

## Parallel Example: User Story 2

```bash
# Launch all independent components together:
Task: "T021 Create LivroItem in src/components/LivroItem.tsx"
Task: "T022 Create FiltroStatus in src/components/FiltroStatus.tsx"
Task: "T023 Implement filtrarLivros in src/state/filtros.ts"

# Then integrate:
Task: "T024 Build EstanteScreen in src/screens/EstanteScreen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (quickstart US.01)
5. Demo: cadastrar livro e vê-lo persistido

### Incremental Delivery

1. Setup + Foundational → base tipada pronta (`tsc` limpo)
2. US1 → cadastro funcional (MVP) → demo
3. US2 → lista + filtros → demo
4. US3 → transições de status → demo
5. US4 → fluxo de navegação completo → validação final

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (P1)
   - Developer B: US2 (P2)
   - US3/US4 após a integração de A+B
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Constitution-driven task types (see `.specify/memory/constitution.md`):
  required-field validation + visible feedback (V), status-transition
  handling (III/V), status filter on the list (V), local persistence (II),
  strict TypeScript gate (III)
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
