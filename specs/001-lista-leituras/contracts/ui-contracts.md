# UI Contracts: Minha Estante — Lista de Leituras (001-lista-leituras)

**Date**: 2026-10-25 | **Spec**: `spec.md` | **Data Model**: `data-model.md`

App é UI-only (sem endpoints). Os contratos cobrem: rotas de navegação,
superfície de cada tela, interface do repositório de dados e do formulário.

## 1. Contrato de navegação (React Navigation native-stack)

```ts
export type RootStackParamList = {
  Estante: undefined;
  Cadastro: undefined;
};
```

| Rota        | Tela                | Acesso                                   | Retorno                     |
|-------------|---------------------|------------------------------------------|-----------------------------|
| `Estante`   | `EstanteScreen`     | Inicial (startDestination)               | —                           |
| `Cadastro`  | `CadastroScreen`    | Botão "Adicionar livro" em `Estante`     | volta via `goBack()`        |

Garantias (FR-007, US.04):

- Sem rotas fora das duas acima; sem autenticação de rota.
- `Cadastro` sempre oferece caminho de retorno (header `goBack` + botão
  "Voltar").
- Após salvar com sucesso: `navigation.goBack()` e a lista em `Estante`
  reflete o novo item sem reload manual (FR-010).

## 2. Tela `EstanteScreen` (US.02 + US.03)

**Depende de**: `LivroProvider` (context obrigatório no escopo do app).

**Entrada (estado)**: `livros: Livro[]`, `filtro: Filtro`,
`carregando: boolean`, `erro: string | null`.

**Comportamentos**:

| Elemento            | Contrato                                                        |
|---------------------|-----------------------------------------------------------------|
| `FlatList`          | `keyExtractor={l => l.id}`; item renderiza título, autor, status |
| Lista vazia         | `livros.length === 0` → mensagem "Nenhum livro cadastrado ainda."|
| Lista filtrada vazia| `filtrar(...).length === 0` (com livros) → "Nenhum livro neste status." |
| `FiltroStatus`      | 4 opções: Todos \| Quero ler \| Lendo \| Lido; alterna `definirFiltro` |
| Item de livro       | ação (menu/botão) chama `alterarStatus(id, novoStatus)` apenas com valores da união |
| Erro de persistência| `erro != null` → banner/mensagem visível + ação para limpar      |
| Botão "adicionar"   | `navigation.navigate('Cadastro')`                               |

**Invariantes**: nenhum `console.error` silencioso; a tela nunca fica em
branco sem mensagem; status exibido é exatamente um dos três literais.

## 3. Tela `CadastroScreen` (US.01)

**Estado local**: `titulo: string`, `autor: string`,
`erros: { titulo?: string; autor?: string }`.

| Elemento        | Contrato                                                          |
|-----------------|-------------------------------------------------------------------|
| Input `titulo`  | obrigatório; ao perder foco/salvar aplica `trim()`                |
| Input `autor`   | obrigatório; idem                                                 |
| Botão `Salvar`  | roda `validarLivroForm`; se `ok=false` → exibe erros e **não** navega; se `ok=true` → dispatch `adicionar`, `goBack()` |
| Botão `Voltar`  | `goBack()` sem salvar                                             |
| Mensagens       | "Informe o título." / "Informe o autor." — sempre visíveis ao usuário |

**Garantias**: nada é persistido com campo vazio (FR-002, SC-003); textos
aparados antes da gravação (FR-008); novo livro nasce `"Quero ler"`
(FR-009).

## 4. Contrato `LivroRepository` (camada de storage)

```ts
export interface LivroRepository {
  carregar(): Promise<Livro[]>;
  salvar(livros: Livro[]): Promise<void>;
}
```

| Método   | Contrato                                                                 |
|----------|--------------------------------------------------------------------------|
| `carregar` | Resolve com `[]` se não houver dados ou documento corrompido (com aviso); rejeita → provider emite `falhaCarga` |
| `salvar`   | Grava `{versao: 1, livros}` na chave `@minha-estante/dados`; rejeição propaga para mensagem visível |

**Proibido**: qualquer `fetch`, URL, token ou endpoint (constituição II).

## 5. Contrato `validarLivroForm`

```ts
validarLivroForm(entrada: { titulo: string; autor: string }): ResultadoValidacao
```

- Puro, sem efeitos colaterais; sempre retorna `erros` consistentes com
  `ok`.
- Chamado **antes** de `adicionar`; `ok=false` ⇒ nenhuma escrita.

## 6. Formato do documento persistido

Ver `data-model.md` → "Persistência". Mudanças neste formato exigem bump de
`versao` e migração — contrato estável entre app e storage.
