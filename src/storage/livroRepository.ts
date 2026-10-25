import AsyncStorage from '@react-native-async-storage/async-storage';

import { STATUS_LEITURA, type Livro } from '../types/livro';

const CHAVE = '@minha-estante/dados';

interface Documento {
  versao: 1;
  livros: Livro[];
}

export interface LivroRepository {
  carregar(): Promise<Livro[]>;
  salvar(livros: Livro[]): Promise<void>;
}

function ehLivroValido(valor: unknown): valor is Livro {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const l = valor as Record<string, unknown>;
  return (
    typeof l.id === 'string' &&
    typeof l.titulo === 'string' &&
    typeof l.autor === 'string' &&
    typeof l.status === 'string' &&
    STATUS_LEITURA.includes(l.status as Livro['status'])
  );
}

export const livroRepository: LivroRepository = {
  async carregar(): Promise<Livro[]> {
    const bruto = await AsyncStorage.getItem(CHAVE);
    if (bruto === null) {
      return [];
    }
    try {
      const doc = JSON.parse(bruto) as Partial<Documento> | null;
      if (!doc || doc.versao !== 1 || !Array.isArray(doc.livros)) {
        return [];
      }
      return doc.livros.filter(ehLivroValido);
    } catch {
      return [];
    }
  },

  async salvar(livros: Livro[]): Promise<void> {
    const doc: Documento = { versao: 1, livros };
    await AsyncStorage.setItem(CHAVE, JSON.stringify(doc));
  },
};
