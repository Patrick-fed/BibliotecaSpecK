import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { EstanteScreen } from './EstanteScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { LivroProvider } from '../state/LivroProvider';
import { livroRepository } from '../storage/livroRepository';
import type { Livro } from '../types/livro';

type Props = NativeStackScreenProps<RootStackParamList, 'Estante'>;

const livros: Livro[] = [
  { id: '1', titulo: 'Dom Casmurro', autor: 'Machado de Assis', status: 'Quero ler' },
  { id: '2', titulo: 'O Cortico', autor: 'Aluisio Azevedo', status: 'Lendo' },
  { id: '3', titulo: 'Memorias Postumas', autor: 'Machado de Assis', status: 'Lido' },
];

async function montar() {
  const navigate = jest.fn();
  const navigation = { navigate, goBack: jest.fn() } as unknown as Props['navigation'];
  const route = { key: 'estante-key', name: 'Estante' } as Props['route'];
  const utils = await render(
    <LivroProvider>
      <EstanteScreen navigation={navigation} route={route} />
    </LivroProvider>,
  );
  return { ...utils, navigate };
}

describe('EstanteScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('mostra mensagem de lista vazia quando nao ha livros', async () => {
    const { findByText } = await montar();
    expect(await findByText('Nenhum livro cadastrado ainda.')).toBeTruthy();
  });

  it('carrega livros persistidos e renderiza cada item', async () => {
    await livroRepository.salvar(livros);
    const { findByText } = await montar();
    expect(await findByText('Dom Casmurro')).toBeTruthy();
    expect(await findByText('O Cortico')).toBeTruthy();
    expect(await findByText('Memorias Postumas')).toBeTruthy();
  });

  it('filtra por status selecionando o chip', async () => {
    await livroRepository.salvar(livros);
    const { findByText, queryByText, getByLabelText } = await montar();
    await findByText('Dom Casmurro');
    await fireEvent.press(getByLabelText('Filtro Lendo'));
    expect(await findByText('O Cortico')).toBeTruthy();
    expect(queryByText('Dom Casmurro')).toBeNull();
    expect(queryByText('Memorias Postumas')).toBeNull();
  });

  it('mostra mensagem de resultado vazio quando o filtro nao tem livros', async () => {
    await livroRepository.salvar([livros[0]!]);
    const { findByText, getByLabelText } = await montar();
    await findByText('Dom Casmurro');
    await fireEvent.press(getByLabelText('Filtro Lido'));
    expect(await findByText('Nenhum livro neste status.')).toBeTruthy();
  });

  it('navega para a tela de cadastro pelo botao Adicionar livro', async () => {
    const { findByText, getByText, navigate } = await montar();
    await findByText('Nenhum livro cadastrado ainda.');
    await fireEvent.press(getByText('Adicionar livro'));
    expect(navigate).toHaveBeenCalledWith('Cadastro');
  });

  it('alterar status de um livro atualiza a lista imediatamente', async () => {
    await livroRepository.salvar(livros);
    const { findByText, getAllByText, getByLabelText } = await montar();
    await findByText('Dom Casmurro');
    await fireEvent.press(getAllByText('Alterar status')[0]!);
    await fireEvent.press(getByLabelText('Definir status Lido'));

    await waitFor(async () => {
      const salvos = await livroRepository.carregar();
      expect(salvos.find((l) => l.id === '1')?.status).toBe('Lido');
    });
    expect(await findByText('Dom Casmurro')).toBeTruthy();
  });
});
