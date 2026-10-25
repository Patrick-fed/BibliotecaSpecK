import { fireEvent, render, waitFor } from '@testing-library/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CadastroScreen } from './CadastroScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { LivroProvider } from '../state/LivroProvider';
import { livroRepository } from '../storage/livroRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

async function montar() {
  const goBack = jest.fn();
  const navigation = { goBack, navigate: jest.fn() } as unknown as Props['navigation'];
  const route = { key: 'cadastro-key', name: 'Cadastro' } as Props['route'];
  const utils = await render(
    <LivroProvider>
      <CadastroScreen navigation={navigation} route={route} />
    </LivroProvider>,
  );
  return { ...utils, goBack };
}

describe('CadastroScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('exibe erros de validacao e nao navega ao salvar com campos vazios', async () => {
    const { goBack, getByText } = await montar();
    await fireEvent.press(getByText('Salvar'));
    expect(getByText('Informe o título.')).toBeTruthy();
    expect(getByText('Informe o autor.')).toBeTruthy();
    expect(goBack).not.toHaveBeenCalled();
    await expect(livroRepository.carregar()).resolves.toEqual([]);
  });

  it('aplica trim, persiste o livro e volta apos salvar', async () => {
    const { goBack, getByText, getByLabelText } = await montar();
    await fireEvent.changeText(getByLabelText('Título do livro'), '  O Cortico  ');
    await fireEvent.changeText(getByLabelText('Autor do livro'), '  Aluisio Azevedo  ');
    await fireEvent.press(getByText('Salvar'));

    expect(goBack).toHaveBeenCalledTimes(1);
    await waitFor(async () => {
      const livros = await livroRepository.carregar();
      expect(livros).toHaveLength(1);
      expect(livros[0]).toMatchObject({
        titulo: 'O Cortico',
        autor: 'Aluisio Azevedo',
        status: 'Quero ler',
      });
    });
  });

  it('limpa o erro do campo assim que o usuario digita', async () => {
    const { getByText, getByLabelText, queryByText } = await montar();
    await fireEvent.press(getByText('Salvar'));
    expect(getByText('Informe o título.')).toBeTruthy();
    await fireEvent.changeText(getByLabelText('Título do livro'), 'A');
    expect(queryByText('Informe o título.')).toBeNull();
  });

  it('voltar à estante chama goBack sem salvar nada', async () => {
    const { goBack, getByText, getByLabelText } = await montar();
    await fireEvent.changeText(getByLabelText('Título do livro'), 'Ignorado');
    await fireEvent.press(getByText('Voltar à estante'));
    expect(goBack).toHaveBeenCalledTimes(1);
    await expect(livroRepository.carregar()).resolves.toEqual([]);
  });
});
