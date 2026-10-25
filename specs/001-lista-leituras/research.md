# Research: Minha Estante — Lista de Leituras (001-lista-leituras)

**Date**: 2026-10-25 | **Plan**: `plan.md` | **Constituição**: v1.0.0

Todos os `NEEDS CLARIFICATION` do Technical Context foram resolvidos.

## R1 — Navegação entre as duas telas

**Decision**: `@react-navigation/native` + `@react-navigation/native-stack`
com `react-native-screens` e `react-native-safe-area-context`.

**Rationale**: escolha do usuário; explícita e didática (tipagem de rotas em
código), adequada a um projeto acadêmico com exatamente 2 rotas. Dependências
oficiais e maduras do ecossistema RN.

**Alternatives considered**:
- *Expo Router* — padrão atual do Expo (file-based), mas mais "mágico" e
  indireto para 2 telas; descartado a pedido.
- *React Navigation bottom-tabs* — tabs implicam hierarquia paralela; o fluxo
  é empilhado (Estante → Cadastro → voltar).

## R2 — Gerenciamento de estado da lista

**Decision**: React Context (`LivroProvider`) + `useReducer` como fonte única
de verdade de `livros` e `filtro`.

**Rationale**: 2 telas e 1 coleção; reducer torna as transições de status
testáveis e tipadas; sincronização com AsyncStorage acontece em um único
lado do provider. Sem dependência extra.

**Alternatives considered**:
- *Zustand* — API menor, mas é lib nova para um caso trivial de Context.
- *React Query/SWR* — paradigma de rede; proibido pela constituição (II).
- *Estado local por tela* — duplicaria a lista e quebraria a atualização
  imediata exigida por FR-010.

## R3 — Persistência local

**Decision**: `@react-native-async-storage/async-storage` com documento
versionado `@minha-estante/dados` no formato
`{ "versao": 1, "livros": Livro[] }`; leitura assíncrona no mount do
provider, escrita a cada mutação; falhas de I/O viram mensagem visível
(estado de erro no provider).

**Rationale**: é a storage recomendada pelo ecossistema Expo, síncrona o
suficiente para 1 coleção pequena e 100% local (constituição II). Versionar o
payload permite migrações futuras sem quebrar dados.

**Alternatives considered**:
- *SQLite (`expo-sqlite`)* — sobra para ~1.000 itens sem consultas
  complexas; adiciona complexidade de SQL.
- *MMKV* — nativo e rápido, mas lib de terceiros não essencial.
- *`localStorage`* — indisponível no React Native.

## R4 — Geração de `id`

**Decision**: `id` gerado no cliente com
`` `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}` ``.

**Rationale**: sem dependência, suficientemente único para dados locais de um
usuário; funciona offline (constituição II).

**Alternatives considered**:
- *`expo-crypto` `randomUUID()`* — mais robusto, mas exigiria lib extra
  apenas para identidade local.
- *Contador sequencial* — quebra ao remover/reiniciar sessão.

## R5 — Validação do formulário

**Decision**: função pura `validarLivroForm({titulo, autor})` em
`src/validation/livroForm.ts`: aplica `trim()`, exige não-vazio em ambos e
retorna `{ ok, erros }`; a tela exibe as mensagens (FR-002/FR-008).

**Rationale**: regras mínimas (2 campos de texto) não justificam lib de
schema; função pura é testável manualmente e tipada.

**Alternatives considered**:
- *zod/yup* — peso e dependência nova sem benefício em 2 campos.
- *Validação inline na tela* — espalha regra de negócio na UI.

## R6 — FlatList e filtro de status

**Decision**: `keyExtractor` pelo `id`; `useMemo` para derivar a lista
filtrada a partir de `{livros, filtro}`; `initialNumToRender` e
`removeClippedSubviews` mantidos nos defaults; componente de item
`React.memo`.

**Rationale**: filtro derivado (não duplicado no estado) garante consistência
(FR-010); memoização mantém 60 fps com ~1.000 itens; `id` estável evita
re-render desnecessário.

**Alternatives considered**:
- *`SectionList` por status* — muda a semântica do filtro (exibir um vs
  agrupar todos), divergindo do critério de aceite.
- *Buscar com debounce* — não há campo de busca no escopo.

## R7 — TypeScript strict e qualidade estática

**Decision**: `tsconfig.json` com `"strict": true`, `"noUncheckedIndexedAccess": true`,
`"noImplicitAny": true`; gate de entrega `npx tsc --noEmit` limpo; ESLint +
prettier do template Expo. Nenhum `@ts-ignore` permitido (constituição III).

**Rationale**: a constituição torna o strict NON-negotiable; o gate estático
substitui testes automatizados não exigidos pela spec, cobrindo a camada de
tipos em toda a base.

**Alternatives considered**:
- *Strict parcial* — viola a constituição (III).

## R8 — Estratégia de testes

**Decision**: validação manual executável (`quickstart.md`) cobrindo os
critérios de aceite de US.01–US.04, mais gate `tsc --noEmit`. Testes
automatizados ficam opcionais (template/tasks: "Tests are OPTIONAL — only
include them if explicitly requested").

**Rationale**: a spec pede "testes manuais dos critérios de aceite"
(`userStories.txt`, Etapa 2); nenhum requisito de cobertura automatizada
existe; a constituição permite testes opcionais desde que escritos antes da
implementação se existirem.

**Alternatives considered**:
- *Jest + React Native Testing Library* — valor futuro, mas fora do pedido e
  fora do escopo da spec v1 (restrição RNF05: projeto introdutório).

**Amendment (2026-10-25, pós-implementação)**: o usuário solicitou testes
unitários e, em seguida, "adicione e faça os testes". Adicionado Jest +
`jest-expo` + `@testing-library/react-native` (v14, API assíncrona) cobrindo
módulos puros (`livroForm`, `livroReducer`, `filtros`, `livroRepository`),
componentes (`LivroItem`, `FiltroStatus`) e telas (`CadastroScreen`,
`EstanteScreen`) — 44 casos, T037–T046. Como escritos após o código, atuam
como regressão; a validação manual de UI (T020/T025/T029/T032/T035) permanece
necessária para os critérios em dispositivo real. Acessibilidade reforçada
com `accessibilityLabel` em chips de filtro e opções de status.

## R9 — Ícone/nome do app e configuração Expo

**Decision**: `app.json` com `name: "Minha Estante"`, `slug: minha-estante`,
`orientation: "portrait"`; sem permissões especiais (sem rede, sem câmera).

**Rationale**: escopo sem features nativas; mínimo de configuração
reproduzível via `npx expo start`.

**Alternatives considered**:
- *EAS Build / assets customizados* — fora do escopo introdutório.

## Resolução de NEEDS CLARIFICATION

| Item do Technical Context | Resolvido em |
|---|---|
| Language/Version | R7 (TypeScript strict) + Expo SDK estável |
| Primary Dependencies | R1, R2, R3 |
| Storage | R3 |
| Testing | R8 |
| Target Platform | R9 |
| Performance Goals | R6 |
| Constraints | constituição II/III/V (R3, R7) |
| Scale/Scope | R2, R6 |
