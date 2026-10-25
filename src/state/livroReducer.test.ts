import { estadoInicial, livroReducer, type LivroState } from './livroReducer';
import type { Livro } from '../types/livro';

function estadoCom(livros: Livro[]): LivroState {
  return { ...estadoInicial, livros, carregando: false };
}

function livro(id: string, status: Livro['status'] = 'Quero ler'): Livro {
  return { id, titulo: `Titulo ${id}`, autor: `Autor ${id}`, status };
}

describe('livroReducer', () => {
  it('estado inicial carrega com lista vazia', () => {
    expect(estadoInicial).toEqual({ livros: [], filtro: 'Todos', carregando: true, erro: null });
  });

  it('carregado define livros e encerra carregando', () => {
    const s = livroReducer(estadoInicial, { tipo: 'carregado', livros: [livro('a')] });
    expect(s.carregando).toBe(false);
    expect(s.livros).toHaveLength(1);
    expect(s.erro).toBeNull();
  });

  it('falhaCarga expoe mensagem visivel', () => {
    const s = livroReducer(estadoInicial, { tipo: 'falhaCarga', mensagem: 'erro de leitura' });
    expect(s.carregando).toBe(false);
    expect(s.erro).toBe('erro de leitura');
  });

  it('adicionar cria livro com status inicial Quero ler e trim', () => {
    const s = livroReducer(estadoInicial, {
      tipo: 'adicionar',
      titulo: '  O Cortico  ',
      autor: '  Aluisio  ',
    });
    expect(s.livros).toHaveLength(1);
    expect(s.livros[0]).toMatchObject({ titulo: 'O Cortico', autor: 'Aluisio', status: 'Quero ler' });
    expect(typeof s.livros[0]?.id).toBe('string');
    expect(s.livros[0]?.id.length).toBeGreaterThan(0);
  });

  it('adicionar com campo vazio nao salva e define erro', () => {
    const s = livroReducer(estadoCom([livro('a')]), {
      tipo: 'adicionar',
      titulo: '   ',
      autor: 'X',
    });
    expect(s.livros).toHaveLength(1);
    expect(s.erro).toBe('Informe título e autor.');
  });

  it('alterarStatus atualiza apenas o livro alvo', () => {
    const inicial = estadoCom([livro('a'), livro('b')]);
    const s = livroReducer(inicial, { tipo: 'alterarStatus', id: 'a', status: 'Lido' });
    expect(s.livros[0]?.status).toBe('Lido');
    expect(s.livros[1]?.status).toBe('Quero ler');
  });

  it('alterarStatus aceita qualquer um dos tres status e nunca remove o livro', () => {
    let s = estadoCom([livro('a')]);
    for (const status of ['Lendo', 'Lido', 'Quero ler'] as const) {
      s = livroReducer(s, { tipo: 'alterarStatus', id: 'a', status });
      expect(s.livros).toHaveLength(1);
      expect(s.livros[0]?.status).toBe(status);
    }
  });

  it('alterarStatus com id inexistente define erro e nao modifica lista', () => {
    const inicial = estadoCom([livro('a')]);
    const s = livroReducer(inicial, { tipo: 'alterarStatus', id: 'nao-existe', status: 'Lido' });
    expect(s.livros).toEqual(inicial.livros);
    expect(s.erro).toBe('Livro não encontrado.');
  });

  it('definirFiltro aceita os quatro valores e limparErro limpa erro', () => {
    let s: LivroState = { ...estadoInicial, erro: 'x', carregando: false };
    for (const filtro of ['Todos', 'Quero ler', 'Lendo', 'Lido'] as const) {
      s = livroReducer(s, { tipo: 'definirFiltro', filtro });
      expect(s.filtro).toBe(filtro);
    }
    s = livroReducer(s, { tipo: 'limparErro' });
    expect(s.erro).toBeNull();
  });

  it('gera ids unicos em adicoes sucessivas', () => {
    let s = livroReducer(estadoInicial, { tipo: 'adicionar', titulo: 'A', autor: 'B' });
    s = livroReducer(s, { tipo: 'adicionar', titulo: 'C', autor: 'D' });
    expect(s.livros).toHaveLength(2);
    expect(s.livros[0]?.id).not.toBe(s.livros[1]?.id);
  });
});
