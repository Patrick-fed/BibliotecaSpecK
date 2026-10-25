# Implementation Plan: Minha Estante — Lista de Leituras

**Branch**: `001-lista-leituras` | **Date**: 2026-10-25 | **Spec**: `specs/001-lista-leituras/spec.md`
**Input**: Feature specification from `/specs/001-lista-leituras/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Aplicativo mobile offline de lista de leituras: cadastrar livros (título +
autor), exibir a estante em `FlatList` com filtro por status, alterar o
status entre "Quero ler"/"Lendo"/"Lido" e navegar entre duas telas
(Estante e Cadastro). Base: `userStories.txt` (US.01–US.04) e `exemplo.txt`;
constituição v1.0.0. Abordagem técnica: Expo + TypeScript strict, estado em
React Context com `useReducer`, persistência local em AsyncStorage,
navegação via React Navigation native-stack — zero rede, zero auth.

## Technical Context

**Language/Version**: TypeScript ~6.0.3 (`strict: true`), React Native 0.88 via Expo SDK 58 (managed, pinado em `package.json`)
**Primary Dependencies**: `expo`, `react`, `react-native`, `@react-navigation/native` + `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-async-storage/async-storage`
**Storage**: AsyncStorage (somente local; nenhum banco remoto — constituição II)
**Testing**: testes manuais dos critérios de aceite (spec US.01–US.04) + testes unitários e de renderização (Jest/`jest-expo` + `@testing-library/react-native`, 44 casos: form, reducer, filtro, repositório, componentes, telas) + gate estático `tsc --noEmit`
**Target Platform**: iOS 15+ e Android 8+ via Expo Go / emulador
**Project Type**: mobile-app (2 telas, 4 user stories)
**Performance Goals**: sem meta instrumentada; verificável manualmente no quickstart — rolagem da lista com ~1.000 livros e troca de filtro sem travamento perceptível durante a validação (T035)
**Constraints**: sem login, sem API externa, sem banco remoto (constituição II); `any`/`@ts-ignore` proibidos (III); crash silencioso é defeito bloqueante (V)
**Scale/Scope**: 1 app único, 2 telas, 11 FRs + 5 RNFs, 1 entidade persistida (`Livro`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates from `.specify/memory/constitution.md` (v1.0.0):

- [x] **Spec-First**: `spec.md` exists with prioritized user stories (P1–P4), FRs, SCs;
      no pending `[NEEDS CLARIFICATION]`
- [x] **Disciplina de Escopo**: no login, no external API, no remote DB, no
      push/notifications; exactly three book statuses (`Quero ler`, `Lendo`,
      `Lido`); local-only persistence — any exception requires a ratified
      amendment (NON-NEGOTIABLE: not justifiable via Complexity Tracking)
- [x] **TypeScript Estrito**: `strict: true`, no `any`/`@ts-ignore` without
      recorded justification; `Livro` entity typed with a closed status union
- [x] **Independência de User Stories**: tasks grouped by story with per-story
      checkpoints; P1 works standalone; parallel `[P]` tasks touch disjoint files
- [x] **UX e Validação Simples**: required-field validation with visible
      feedback; list shows title/author/status with status filter; errors are
      surfaced to the user (silent crash = blocking defect)

**Resultado**: 5/5 gates PASSAM. Sem violações → Complexity Tracking não se
aplica.

**Re-check pós-design (Phase 1)**: dados, contratos e quickstart mantêm os
mesmos 5 gates — reavaliados como PASSAM (ver seção final deste arquivo).

## Project Structure

### Documentation (this feature)

```text
specs/001-lista-leituras/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── ui-contracts.md  # Rotas, telas e repositório de livros
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
App.tsx                    # Providers (Navigation + Estado) e RootNavigator
src/
├── navigation/
│   └── RootNavigator.tsx   # Native stack: Estante | Cadastro
├── screens/
│   ├── EstanteScreen.tsx   # US.02 + filtros + ação de status (US.03)
│   └── CadastroScreen.tsx  # US.01: formulário validado
├── components/
│   ├── LivroItem.tsx       # Item da FlatList (titulo, autor, status)
│   └── FiltroStatus.tsx    # Chips: Todos | Quero ler | Lendo | Lido
├── state/
│   ├── LivroProvider.tsx   # Context + useReducer (fonte da lista)
│   └── livroReducer.ts     # ações: adicionar, alterarStatus, definirFiltro
├── storage/
│   └── livroRepository.ts  # LivroRepository sobre AsyncStorage
├── types/
│   └── livro.ts            # StatusLeitura, Livro, Filtro
└── validation/
    └── livroForm.ts        # trim + validação de campos obrigatórios

app.json                    # Configuração Expo
tsconfig.json               # strict: true
```

**Structure Decision**: estrutura única de app Expo (opção "Single project"),
conforme sugerido em `userStories.txt` (`app/`/`src/`); camada `storage/`
isola o AsyncStorage atrás da interface `LivroRepository` (contrato em
`contracts/ui-contracts.md`), e `state/` concentra o reducer — cada story
toca arquivos distintos, preservando o gate de independência.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Nenhuma violação — tabela não aplicável.

## Constitution Re-Check (pós-design, Phase 1)

- **Spec-First**: data-model, contratos e quickstart rastreiam FR-001..011 e
  US.01..04 da spec — PASSA.
- **Disciplina de Escopo**: contrato de UI prevê apenas 2 rotas locais;
  repositório é 100% AsyncStorage; nenhum endpoint, cliente HTTP ou auth no
  design — PASSA.
- **TypeScript Estrito**: `data-model.md` define união fechada
  `StatusLeitura`; contratos proíbem `any` — PASSA.
- **Independência de User Stories**: contratos de tela permitem testar
  cadastro (validação/persistência), lista (vazia/filtros) e status
  (transição) isoladamente — PASSA.
- **UX e Validação Simples**: quickstart cobre validação de campos, filtros,
  lista vazia e feedback de erro — PASSA.
