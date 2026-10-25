# Quickstart: Minha Estante — Lista de Leituras (001-lista-leituras)

**Date**: 2026-10-25 | **Spec**: `spec.md` | **Plan**: `plan.md`

## Executar o app

```powershell
# 1. Dependências
npm install

# 2. Verificação estática (gate da constituição III)
npx tsc --noEmit

# 3. App no Expo (emulador ou Expo Go no aparelho)
npx expo start
```

Pré-requisitos: Node 20+, Expo Go instalado no aparelho (ou emulador
iOS/Android).

## Script manual de validação (critérios de aceite)

### US.01 — Cadastrar um livro (P1)

1. Abra o app → toque em "Adicionar livro".
2. Deixe **título** vazio, informe autor → `Salvar`.
   - **Esperado**: nada salvo; mensagem "Informe o título."
3. Informe título só com espaços → `Salvar`.
   - **Esperado**: bloqueado (trim → vazio).
4. Informe `  Dom Casmurro ` e `  Machado de Assis ` → `Salvar`.
   - **Esperado**: volta à lista; item aparece sem espaços nas extremidades
     e com status **Quero ler**.

### US.02 — Visualizar a lista (P2)

1. Apague os dados do app (ou instale limpo) e abra.
   - **Esperado**: mensagem de lista vazia.
2. Com 3+ livros cadastrados.
   - **Esperado**: `FlatList` mostra título, autor e status de cada item.
3. Toque em cada filtro: `Todos`, `Quero ler`, `Lendo`, `Lido`.
   - **Esperado**: lista atualiza imediatamente; filtro sem correspondência
     mostra mensagem de resultado vazio (sem crash).
4. Cadastre um livro novo.
   - **Esperado**: ele já aparece na lista, sem reiniciar o app.

### US.03 — Alterar o status (P3)

1. Em um livro "Quero ler", mude para `Lendo`.
   - **Esperado**: status refletido imediatamente na lista.
2. Mude para `Lido`.
   - **Esperado**: livro continua cadastrado e visível em `Todos`/`Lido`.
3. Reinicie o app.
   - **Esperado**: status persistido (AsyncStorage).
4. Não existe opção de status fora dos três.
   - **Esperado**: UI não oferece nenhum quarto valor.

### US.04 — Navegação (P4)

1. `Estante → Adicionar livro` → `Voltar`.
   - **Esperado**: ida e volta funcionam, formulário descartado sem salvar.
2. Cadastre um livro e salve.
   - **Esperado**: retorna à lista e o novo item está visível.
3. Percorra o fluxo 3 vezes seguidas.
   - **Esperado**: sem erros, sem tela em branco.

### Gate final

```powershell
npx tsc --noEmit   # deve sair sem erros (constituição III)
```

## Estrutura gerada

`App.tsx` + `src/` (navigation, screens, components, state, storage, types,
validation) conforme "Project Structure" em `plan.md`.

## Limpar dados (reinício limpo)

- Emulador/dispositivo: desinstalar o app ou limpar dados do Expo Go.
- Isso zera `@minha-estante/dados` e volta ao estado "lista vazia".
