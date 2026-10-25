import type { Filtro, Livro, StatusLeitura } from '../types/livro';

export interface LivroState {
  livros: Livro[];
  filtro: Filtro;
  carregando: boolean;
  erro: string | null;
}

export type LivroAction =
  | { tipo: 'carregado'; livros: Livro[] }
  | { tipo: 'falhaCarga'; mensagem: string }
  | { tipo: 'adicionar'; titulo: string; autor: string }
  | { tipo: 'alterarStatus'; id: string; status: StatusLeitura }
  | { tipo: 'definirFiltro'; filtro: Filtro }
  | { tipo: 'limparErro' };

export const estadoInicial: LivroState = {
  livros: [],
  filtro: 'Todos',
  carregando: true,
  erro: null,
};

function gerarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function livroReducer(state: LivroState, action: LivroAction): LivroState {
  switch (action.tipo) {
    case 'carregado':
      return { ...state, livros: action.livros, carregando: false, erro: null };

    case 'falhaCarga':
      return { ...state, carregando: false, erro: action.mensagem };

    case 'adicionar': {
      const titulo = action.titulo.trim();
      const autor = action.autor.trim();
      if (titulo === '' || autor === '') {
        return { ...state, erro: 'Informe título e autor.' };
      }
      const novo: Livro = {
        id: gerarId(),
        titulo,
        autor,
        status: 'Quero ler',
      };
      return { ...state, livros: [...state.livros, novo], erro: null };
    }

    case 'alterarStatus': {
      const existe = state.livros.some((l) => l.id === action.id);
      if (!existe) {
        return { ...state, erro: 'Livro não encontrado.' };
      }
      return {
        ...state,
        livros: state.livros.map((l) =>
          l.id === action.id ? { ...l, status: action.status } : l,
        ),
        erro: null,
      };
    }

    case 'definirFiltro':
      return { ...state, filtro: action.filtro };

    case 'limparErro':
      return { ...state, erro: null };

    default:
      return state;
  }
}
