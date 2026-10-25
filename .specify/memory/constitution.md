<!--
Sync Impact Report
==================
- Version change: none (template) → 1.0.0
- Modified principles: template placeholders → 5 concrete principles:
  - [PRINCIPLE_1_NAME] → I. Spec-First (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Disciplina de Escopo (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. TypeScript Estrito
  - [PRINCIPLE_4_NAME] → IV. Independência de User Stories
  - [PRINCIPLE_5_NAME] → V. UX e Validação Simples
- Added sections:
  - Stack Tecnológica e Restrições de Escopo (replaces [SECTION_2_NAME])
  - Fluxo de Desenvolvimento (Spec Kit) (replaces [SECTION_3_NAME])
  - Governance (replaces [GOVERNANCE_RULES])
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates made concrete)
  - ✅ .specify/templates/tasks-template.md (principle-driven task types added)
  - ✅ .specify/templates/spec-template.md (verified: no mandatory section change needed)
  - ✅ .opencode/command/*.md (verified: no agent-specific/obsolete references)
  - ✅ AGENTS.md (verified: no principle references to update)
- Follow-up TODOs: none
-->

# Minha Estante Constitution

## Core Principles

### I. Spec-First (NON-NEGOTIABLE)

Toda funcionalidade começa como especificação em `specs/<branch>/spec.md` antes
de qualquer código.

- A spec DEVE conter user stories priorizadas (P1, P2, P3...), cada uma
  independente e testável, além de requisitos funcionais (FR-xxx) e critérios
  de sucesso mensuráveis (SC-xxx).
- Requisitos ambíguos DEVEM ser marcados com `[NEEDS CLARIFICATION]` e
  resolvidos via `/speckit.clarify` antes do planejamento.
- `/speckit.plan` e `/speckit.tasks` NÃO podem iniciar sem uma spec existente
  e aprovada.
- Nenhum código de feature é escrito antes de `plan.md` e `tasks.md` existirem.

**Rationale**: sem uma spec explícita, o escopo do app de leitura se dilui em
funcionalidades não pedidas; a ordem do Spec Kit garante que cada história seja
verificável antes de consumir esforço de implementação.

### II. Disciplina de Escopo (NON-NEGOTIABLE)

O app implementa exclusivamente o descrito em `exemplo.txt`: cadastro de
livros, acompanhamento de leitura e conclusão de leituras.

- Estritamente proibido, sem emenda formal nesta constituição: login/contas de
  usuário, integração com API externa, banco de dados remoto, sincronização em
  nuvem, redes sociais ou notificações push.
- Os estados de um livro são exatamente três e nada mais:
  `Quero ler`, `Lendo`, `Lido`.
- Toda persistência DEVE ser local ao dispositivo (ex.: AsyncStorage); nenhum
  dado do usuário sai do aparelho.
- Adicionar capacidade fora deste escopo exige: (1) emenda aprovada nesta
  constituição OU (2) spec explícita que o declare e o Constitution Check
  aprove.

**Rationale**: o objetivo declarado é manter a atividade dentro do escopo;
recusas explícitas evitam que "só um endpoint" ou "só um login rápido"
contaminem o projeto.

### III. TypeScript Estrito

Todo código é TypeScript em modo estrito e tipagem de domínio é obrigatória.

- `tsconfig.json` DEVE ter `"strict": true`; `any` explícito e `@ts-ignore`
  NÃO são permitidos sem justificativa registrada no plano.
- A entidade central DEVE ser tipada e única no código:
  `Livro { id: string; titulo: string; autor: string; status: 'quero-ler' | 'lendo' | 'lido' }`.
- Mudanças de status DEVEM ocorrer apenas por transição tipada válida —
  nenhum valor de status fora da união aceita.
- Erros de compilação TypeScript bloqueiam a entrega (gate em revisão).

**Rationale**: o domínio é pequeno e totalmente modelável; tipagem estrita
elimina classes inteiras de bugs de status inválido e campos indefinidos na
lista.

### IV. Independência de User Stories

Cada user story DEVE ser implementável, testável e demonstrável isoladamente.

- `tasks.md` agrupa tarefas por story (US1, US2, US3...) com checkpoints
  individuais; o MVP é a story P1 e nada mais.
- Nenhuma story P2/P3 pode introduzir dependência que impeça testar a P1
  sozinha.
- Estrutura de pastas/tarefas DEVE evitar conflitos de arquivo entre stories
  (tarefas paralelas `[P]` tocam arquivos distintos).
- Se uma história só entregar valor em conjunto com outra, ela DEVE ser
  reescrita ou fundida na spec antes da implementação.

**Rationale**: a entrega incremental só é demonstrável se cada fatia do app
(cadastro, lista, status) funcionar sem as demais.

### V. UX e Validação Simples

A interface é simples, previsível e informa ao usuário tudo o que precisa saber.

- Campos obrigatórios (título, autor) DEVEM ser validados no formulário de
  cadastro, com feedback visível antes de salvar.
- A lista de leituras DEVE exibir título, autor e status de cada livro, com
  filtro por status operando sobre a `FlatList`.
- Erros de operação (falha de persistência local, entrada inválida) DEVEM
  resultar em mensagem visível ao usuário; crash silencioso ou tela em branco
  é defeito bloqueante.
- Textos da interface seguem o padrão PT-BR do projeto.

**Rationale**: sem backend, toda a experiência é a UI; validação e mensagens
claras são a única defesa contra dados corrompidos ou uso confuso.

## Stack Tecnológica e Restrições de Escopo

- **Plataforma**: React Native com Expo (managed), TypeScript.
- **Linguagem**: TypeScript `strict` (Princípio III); JavaScript puro não é
  aceito em código de aplicação.
- **Persistência**: somente local (ex.: `@react-native-async-storage/
  async-storage`); zero rede — ver Princípio II.
- **Navegação/estado**: bibliotecas do ecossistema Expo, escolhidas no
  `plan.md`; nenhuma dependência nova entra sem justificativa no plano.
- **Testes**: opcionais por padrão, mas quando existirem DEVEM ser escritos
  antes da implementação correspondente (TDD invertido verificado no
  checkpoint da story).
- **Estrutura**: app único (`App.tsx` + `src/` com `components/`, `models/`,
  `services/`, `storage/`), ajustável no `plan.md` com justificativa.

## Fluxo de Desenvolvimento (Spec Kit)

Ordem obrigatória dos comandos para qualquer feature:

1. `/speckit.specify` — cria `specs/<branch>/spec.md` com stories e FRs.
2. `/speckit.clarify` — resolve `[NEEDS CLARIFICATION]` e ambiguidades.
3. `/speckit.plan` — preenche o **Constitution Check** com gates concretos e
   só avança se todos PASSAREM.
4. `/speckit.tasks` — gera `tasks.md` agrupado por story com checkpoints.
5. `/speckit.implement` — executa por story, na ordem P1 → P2 → P3.
6. `/speckit.analyze` — qualquer violação de constituição é CRITICAL e bloqueia.

**Quality gates**:

- Gate spec: stories priorizadas, FRs, SCs presentes e sem clarificações
  pendentes.
- Gate plan: Constitution Check sem violações (ou justificativa aprovada na
  Complexity Tracking).
- Gate story: checkpoint da story passa de forma isolada antes de iniciar a
  próxima.
- Gate final: `tsc --noEmit` limpo e app executável no Expo.

## Governance

- Esta constituição é a autoridade máxima do projeto; ela prevalece sobre
  qualquer prática, hábito de agente ou decisão de implementação em conflito.
- **Procedimento de emenda**: alterações são feitas apenas via
  `/speckit.constitution`, que atualiza este arquivo, emite o Sync Impact
  Report e propaga as mudanças aos templates em `.specify/templates/`.
- **Versionamento**: SemVer — MAJOR para remoção/redefinição de princípios ou
  restrições; MINOR para princípio ou seção nova; PATCH para clareza e
  correções de redação.
- **Revisão de conformidade**: `/speckit.plan` (Constitution Check) e
  `/speckit.analyze` verificam conformidade em toda feature; violações de
  princípios marcados NON-NEGOTIABLE não podem ser contornadas por
  Complexity Tracking — exigem emenda.
- **Orientação de runtime**: a orientação de desenvolvimento diária vive em
  `AGENTS.md` e no `plan.md` da feature ativa; divergências da constituição
  DEVEM ser corrigidas, não reinterpretadas.

**Version**: 1.0.0 | **Ratified**: 2026-10-25 | **Last Amended**: 2026-10-25
