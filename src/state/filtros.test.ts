import { filtrarLivros } from './filtros';
import type { Livro } from '../types/livro';

const livros: Livro[] = [
  { id: '1', titulo: 'A', autor: 'X', status: 'Quero ler' },
  { id: '2', titulo: 'B', autor: 'Y', status: 'Lendo' },
  { id: '3', titulo: 'C', autor: 'Z', status: 'Lido' },
  { id: '4', titulo: 'D', autor: 'W', status: 'Lendo' },
];

describe('filtrarLivros', () => {
  it('Todos retorna a lista completa', () => {
    expect(filtrarLivros(livros, 'Todos')).toHaveLength(4);
  });

  it('filtra por cada status exato', () => {
    expect(filtrarLivros(livros, 'Lendo').map((l) => l.id)).toEqual(['2', '4']);
    expect(filtrarLivros(livros, 'Quero ler').map((l) => l.id)).toEqual(['1']);
    expect(filtrarLivros(livros, 'Lido').map((l) => l.id)).toEqual(['3']);
  });

  it('retorna lista vazia quando nenhum livro tem o status', () => {
    expect(filtrarLivros([livros[0]!], 'Lido')).toEqual([]);
  });

  it('nao altera a lista original', () => {
    filtrarLivros(livros, 'Lendo');
    expect(livros).toHaveLength(4);
  });
});
