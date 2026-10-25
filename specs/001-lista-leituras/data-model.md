# Data Model: Minha Estante — Lista de Leituras (001-lista-leituras)

**Date**: 2026-10-25 | **Spec**: `spec.md` | **Plan**: `plan.md`

## Entidades

### Livro

| Campo  | Tipo                                   | Regra                                             |
|--------|----------------------------------------|---------------------------------------------------|
| `id`   | `string`                               | Gerado no cliente (R4), único, imutável           |
| `titulo` | `string`                             | Obrigatório; `trim()` obrigatório; não vazio      |
| `autor`  | `string`                             | Obrigatório; `trim()` obrigatório; não vazio      |
| `status` | `StatusLeitura` (união fechada)      | Inicia sempre em `"Quero ler"` (FR-009)           |

```ts
export type StatusLeitura = 'Quero ler' | 'Lendo' | 'Lido';

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  status: StatusLeitura;
}
```

**Identidade**: por `id`. Duplicatas de `titulo`+`autor` são permitidas
(assumption da spec).

### Filtro (estado de UI, não persistido)

```ts
export type Filtro = 'Todos' | StatusLeitura;
```

Quatro valores; `"Todos"` é o inicial.

### Estado do provider (fonte única)

```ts
interface LivroState {
  livros: Livro[];
  filtro: Filtro;
  carregando: boolean;   // leitura inicial do AsyncStorage
  erro: string | null;   // falha de persistência → mensagem visível (V)
}
```

## Ações do reducer

| Ação                    | Payload            | Efeito                                                     |
|-------------------------|--------------------|------------------------------------------------------------|
| `carregado`             | `Livro[]`          | Substitui `livros`, `carregando=false`                     |
| `falhaCarga`            | `string`           | Define `erro`, `carregando=false`                          |
| `adicionar`             | `{titulo, autor}`  | Gera `id`, `trim`, status `"Quero ler"`, acrescenta ao fim  |
| `alterarStatus`         | `{id, status}`     | Atualiza `status` do livro com `id` (se não achou: erro)   |
| `definirFiltro`         | `Filtro`           | Substitui `filtro`                                         |
| `limparErro`            | —                  | `erro=null`                                                |

Invariantes do reducer (tipadas, não há payload inválido possível):

1. `status` aceito em `alterarStatus` é somente `StatusLeitura` (FR-005).
2. Todo livro inserido tem `status === 'Quero ler'` (FR-009).
3. Remover livro **não existe** como ação (US.03: "Lido" continua
   cadastrado; escopo não prevê exclusão).
4. Nenhum campo é `undefined`/`any` (constituição III).

## Validações (formulário — `livroForm.ts`)

```ts
interface EntradaLivro { titulo: string; autor: string; }
interface ResultadoValidacao {
  ok: boolean;
  dados?: { titulo: string; autor: string }; // já com trim()
  erros: { titulo?: string; autor?: string };
}
```

| Regra | Erro |
|-------|------|
| `titulo.trim() === ''` | "Informe o título." |
| `autor.trim() === ''`  | "Informe o autor." |
| ambos preenchidos      | `ok: true` com valores aparados (FR-008) |

Validação roda **antes** de qualquer escrita: se `ok === false`, nada é
salvo e as mensagens são exibidas (FR-002, SC-003).

## Transições de status

```
        ┌──────────────┐
        │  Quero ler   │  (estado inicial de todo livro novo)
        └──────┬───────┘
     qualquer  │  qualquer
   ┌───────────┼───────────┐
   ▼           ▼           ▼
┌────────┐  ┌────────┐  ┌────────┐
│ Lendo  │  │ Lido   │  │ Quero  │
└────────┘  └────────┘  │  ler   │
   ▲           │        └────────┘
   └───────────┘
```

- Transições permitidas: **qualquer → qualquer** entre os três status
  (US.03: "usuário deve conseguir mudar o status"; ex.: voltar de "Lendo"
  para "Quero ler" é legítimo).
- Transições proibidas: qualquer valor fora da união (impossível em tipo; o
  reducer só aceita `StatusLeitura`).
- Alterar status **não remove** o livro (US.03, critério 3).

## Regras de filtro

`filtrarLivros(livros, filtro)`:

- `'Todos'` → retorna todos.
- senão → retorna apenas `livro.status === filtro`.
- Resultado vazio com filtro ativo → a tela exibe mensagem de "nenhum livro
  neste status" (UX: nunca lista em branco sem explicação).

## Persistência (AsyncStorage)

- Chave: `@minha-estante/dados`
- Formato:

```json
{
  "versao": 1,
  "livros": [
    { "id": "lpx3k2-9f2a1b", "titulo": "Dom Casmurro", "autor": "Machado de Assis", "status": "Lendo" }
  ]
}
```

- **Leitura**: no mount do `LivroProvider` → dispatch `carregado` ou
  `falhaCarga` (erro visível, nunca crash — V).
- **Escrita**: após cada `adicionar`/`alterarStatus`; falha → dispatch
  `falhaCarga` com mensagem amigável.
- `versao` permite migração futura; payload inválido/corrompido → tratar
  como lista vazia + aviso (edge case da spec).

## Relacionamentos

- **Livro ↔ Filtro**: `Filtro` referencia status por valor (sem FK).
- **Estado ↔ Storage**: 1:1 (o estado é o espelho do documento persistido).
- Sem usuários, sem autenticação, sem entidades remotas (constituição II).
