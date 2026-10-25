import type { Filtro, Livro } from '../types/livro';

export function filtrarLivros(livros: Livro[], filtro: Filtro): Livro[] {
  if (filtro === 'Todos') {
    return livros;
  }
  return livros.filter((livro) => livro.status === filtro);
}
