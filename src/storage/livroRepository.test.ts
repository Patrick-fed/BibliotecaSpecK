import AsyncStorage from '@react-native-async-storage/async-storage';

import { livroRepository } from './livroRepository';
import type { Livro } from '../types/livro';

const CHAVE = '@minha-estante/dados';

const livros: Livro[] = [
  { id: '1', titulo: 'Dom Casmurro', autor: 'Machado de Assis', status: 'Lendo' },
  { id: '2', titulo: 'O Cortico', autor: 'Aluisio Azevedo', status: 'Quero ler' },
];

describe('livroRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('carregar retorna [] quando nao ha dados', async () => {
    await expect(livroRepository.carregar()).resolves.toEqual([]);
  });

  it('salvar e carregar preserva livros e status', async () => {
    await livroRepository.salvar(livros);
    await expect(livroRepository.carregar()).resolves.toEqual(livros);
  });

  it('salvar usa a chave versionada com versao 1', async () => {
    await livroRepository.salvar(livros);
    const bruto = await AsyncStorage.getItem(CHAVE);
    expect(bruto).not.toBeNull();
    const doc = JSON.parse(bruto!) as { versao: number };
    expect(doc.versao).toBe(1);
  });

  it('carregar retorna [] para documento corrompido', async () => {
    await AsyncStorage.setItem(CHAVE, 'nao-e-json{');
    await expect(livroRepository.carregar()).resolves.toEqual([]);
  });

  it('carregar retorna [] para documento com versao desconhecida', async () => {
    await AsyncStorage.setItem(CHAVE, JSON.stringify({ versao: 99, livros }));
    await expect(livroRepository.carregar()).resolves.toEqual([]);
  });

  it('carregar descarta itens com formato invalido', async () => {
    await AsyncStorage.setItem(
      CHAVE,
      JSON.stringify({
        versao: 1,
        livros: [livros[0], { id: 'x', titulo: 'Sem autor', status: ' hacker ' }],
      }),
    );
    const resultado = await livroRepository.carregar();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]?.id).toBe('1');
  });

  it('salvar sobrescreve o conteudo anterior', async () => {
    await livroRepository.salvar(livros);
    await livroRepository.salvar([livros[1]!]);
    await expect(livroRepository.carregar()).resolves.toHaveLength(1);
  });
});
