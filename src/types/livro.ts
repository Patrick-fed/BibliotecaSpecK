export type StatusLeitura = 'Quero ler' | 'Lendo' | 'Lido';

export type Filtro = 'Todos' | StatusLeitura;

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  status: StatusLeitura;
}

export const STATUS_LEITURA: readonly StatusLeitura[] = ['Quero ler', 'Lendo', 'Lido'];

export const FILTROS: readonly Filtro[] = ['Todos', 'Quero ler', 'Lendo', 'Lido'];
