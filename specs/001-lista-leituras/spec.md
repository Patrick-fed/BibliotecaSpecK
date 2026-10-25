# Feature Specification: Minha Estante — Lista de Leituras

**Feature Branch**: `001-lista-leituras`
**Created**: 2026-10-25
**Status**: Draft
**Input**: User description: "use userStories.txt para base do plano" (base: `userStories.txt` + `exemplo.txt`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastrar um livro (Priority: P1)

Como leitor, quero cadastrar um livro informando seu título e autor, para
organizar as obras que desejo acompanhar.

**Why this priority**: é a entrada de dados do app — sem cadastro não há
nada para listar, filtrar ou atualizar; entrega valor isoladamente ao gravar
o livro com status inicial "Quero ler".

**Independent Test**: pode ser testada preenchendo o formulário com título e
autor válidos e verificando que o registro é persistido localmente com status
"Quero ler"; e tentando salvar com campo vazio para verificar o bloqueio.

**Acceptance Scenarios**:

1. **Given** a tela de cadastro vazia, **When** o usuário informa título e
   autor válidos e salva, **Then** o livro é salvo com status "Quero ler".
2. **Given** a tela de cadastro com um campo vazio, **When** o usuário tenta
   salvar, **Then** nada é salvo e uma mensagem de validação é exibida.
3. **Given** um texto com espaços sobrando, **When** o usuário salva,
   **Then** os espaços das extremidades são removidos antes de gravar.
4. **Given** um livro já cadastrado, **When** o cadastro é concluído,
   **Then** o novo livro aparece na lista de leituras.

---

### User Story 2 - Visualizar a lista de leituras (Priority: P2)

Como leitor, quero visualizar meus livros cadastrados em uma lista, para
consultar facilmente minhas leituras.

**Why this priority**: é a tela principal e o retorno do investimento do
cadastro; depende de ao menos um livro existir (US.01) para demonstração
completa, mas a lista vazia já é verificável sozinha.

**Independent Test**: pode ser testada abrindo a tela principal com a lista
vazia (mensagem informativa) e depois com livros cadastrados (itens e filtros
visíveis).

**Acceptance Scenarios**:

1. **Given** nenhum livro cadastrado, **When** o usuário abre a lista,
   **Then** uma mensagem informativa de lista vazia é exibida.
2. **Given** livros cadastrados, **When** a lista é exibida, **Then** cada
   item mostra título, autor e status via `FlatList`.
3. **Given** a lista com livros de status distintos, **When** o usuário
   seleciona o filtro "Lendo", **Then** apenas os livros "Lendo" são exibidos.
4. **Given** filtros "Todos", "Quero ler", "Lendo" e "Lido" disponíveis,
   **When** o usuário altera o filtro, **Then** a lista é atualizada
   imediatamente.
5. **Given** um livro recém-cadastrado ou com status alterado, **When** o
   usuário retorna à lista, **Then** ela reflete a alteração.

---

### User Story 3 - Alterar o status de leitura (Priority: P3)

Como leitor, quero alterar o status de um livro, para acompanhar meu
progresso de leitura.

**Why this priority**: só faz sentido sobre livros já cadastrados e visíveis
(US.01 e US.02); é o ciclo de uso contínuo do app.

**Independent Test**: pode ser testada mudando o status de um livro
cadastrado e verificando a atualização imediata na lista e a permanência do
registro.

**Acceptance Scenarios**:

1. **Given** um livro com status "Quero ler", **When** o usuário altera para
   "Lendo", **Then** o novo status aparece imediatamente na lista.
2. **Given** um livro com status "Lido", **When** a lista é consultada,
   **Then** o livro continua cadastrado e visível.
3. **Given** a união de status válidos, **When** uma alteração é processada,
   **Then** apenas "Quero ler", "Lendo" ou "Lido" podem ser atribuídos.
4. **Given** um livro com filtro ativo diferente do novo status, **When** o
   status muda, **Then** o item sai do filtro ativo conforme a regra de
   filtro da lista.

---

### User Story 4 - Navegar pelo aplicativo (Priority: P4)

Como leitor, quero navegar entre a tela da minha estante e a tela de
cadastro, para consultar e adicionar livros com facilidade.

**Why this priority**: a estrutura de navegação é criada como base do plano
(fase Foundational), mas os critérios de retorno pós-cadastro só se
validam de forma completa com as telas funcionais (US.01–US.03).

**Independent Test**: pode ser testada abrindo o app (tela principal),
navegando para cadastro, cadastrando um livro e retornando à lista para ver
o novo item.

**Acceptance Scenarios**:

1. **Given** o app aberto, **When** o usuário aciona "adicionar livro",
   **Then** a tela de cadastro é aberta.
2. **Given** a tela de cadastro, **When** o usuário usa a opção de voltar,
   **Then** ele retorna à tela principal.
3. **Given** um livro recém-cadastrado, **When** o usuário retorna à lista,
   **Then** o novo item é visualizado.
4. **Given** as duas telas, **When** o usuário percorre o fluxo completo,
   **Then** a navegação funciona sem erros em ambas as direções.

---

### Edge Cases

- O que acontece quando o usuário tenta salvar com título ou autor apenas com
  espaços em branco? (campos vazios após `trim` → bloqueio + mensagem)
- O que acontece quando o filtro selecionado não tem livros correspondentes?
  (lista exibe mensagem de resultado vazio, sem crash)
- Como o sistema trata falha de leitura/gravação no armazenamento local?
  (mensagem visível ao usuário; nunca tela em branco)
- O que acontece quando dois livros têm o mesmo título e autor? (permitido —
  identidade é por `id`, não por conteúdo)
- O que acontece ao fechar e reabrir o app? (dados persistidos localmente
  permanecem)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST cadastrar um livro com título e autor.
- **FR-002**: Sistema MUST validar os campos obrigatórios (título e autor)
  antes de salvar, exibindo mensagem de validação em caso de falha.
- **FR-003**: Sistema MUST listar os livros utilizando `FlatList`, exibindo
  título, autor e status de cada item.
- **FR-004**: Sistema MUST filtrar os livros por status com as opções
  "Todos", "Quero ler", "Lendo" e "Lido".
- **FR-005**: Sistema MUST permitir alterar o status de leitura de um livro
  cadastrado, restrito aos três status permitidos.
- **FR-006**: Sistema MUST apresentar mensagem informativa quando a lista
  estiver vazia.
- **FR-007**: Sistema MUST permitir navegar entre a tela principal e a tela
  de cadastro, incluindo retorno à tela principal.
- **FR-008**: Sistema MUST remover espaços desnecessários no início e no fim
  dos textos antes de validar e gravar.
- **FR-009**: Sistema MUST atribuir o status inicial "Quero ler" a todo livro
  recém-cadastrado.
- **FR-010**: Sistema MUST atualizar a lista após cadastro ou alteração de
  status.
- **FR-011**: Sistema MUST persistir os dados localmente no dispositivo,
  mantendo-os disponíveis entre sessões.

### Key Entities

- **Livro**: representa um livro da estante; atributos `id` (identificador
  único), `titulo` (texto obrigatório), `autor` (texto obrigatório), `status`
  (união fechada de três valores).
- **StatusLeitura**: enumeração de estado com exatamente três valores:
  "Quero ler", "Lendo", "Lido".
- **Filtro da lista**: estado de UI com quatro valores possíveis — "Todos",
  "Quero ler", "Lendo", "Lido".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: As quatro user stories são atendidas conforme seus critérios
  de aceite.
- **SC-002**: A navegação entre as duas telas funciona em ambas as direções
  sem erros.
- **SC-003**: O formulário impede o cadastro com campos obrigatórios vazios
  em 100% das tentativas.
- **SC-004**: A lista é atualizada após todas as operações de cadastro e
  alteração de status, sem necessidade de reiniciar o app.
- **SC-005**: O aplicativo executa em ambiente Expo (dispositivo ou emulador)
  sem erros de compilação TypeScript.

## Assumptions

- O app funciona totalmente offline; nenhuma conexão de rede é necessária
  (constituição: persistência somente local).
- Não há autenticação, contas de usuário ou múltiplos perfis.
- Não há API externa, banco de dados remoto ou sincronização em nuvem.
- Duplicatas de título/autor são permitidas (identidade por `id`).
- Dois idiomas de rótulo: a interface segue o padrão PT-BR
  ("Quero ler", "Lendo", "Lido").
- Escopo restrito ao projeto acadêmico introdutório: nenhuma funcionalidade
  além das quatro user stories.
