import { fireEvent, render } from '@testing-library/react-native';

import { LivroItem } from './LivroItem';
import type { Livro } from '../types/livro';

const livro: Livro = {
  id: '1',
  titulo: 'Dom Casmurro',
  autor: 'Machado de Assis',
  status: 'Quero ler',
};

describe('LivroItem', () => {
  it('renderiza titulo, autor e status', async () => {
    const { getByText } = await render(<LivroItem livro={livro} />);
    expect(getByText('Dom Casmurro')).toBeTruthy();
    expect(getByText('Machado de Assis')).toBeTruthy();
    expect(getByText('Quero ler')).toBeTruthy();
  });

  it('sem callback nao mostra o botao de alterar status', async () => {
    const { queryByText } = await render(<LivroItem livro={livro} />);
    expect(queryByText('Alterar status')).toBeNull();
  });

  it('abre o menu com exatamente os tres status ao tocar em Alterar status', async () => {
    const { getByText, getByLabelText, queryByLabelText } = await render(
      <LivroItem livro={livro} aoAlterarStatus={jest.fn()} />,
    );
    expect(queryByLabelText('Definir status Lendo')).toBeNull();
    await fireEvent.press(getByText('Alterar status'));
    expect(getByLabelText('Definir status Quero ler')).toBeTruthy();
    expect(getByLabelText('Definir status Lendo')).toBeTruthy();
    expect(getByLabelText('Definir status Lido')).toBeTruthy();
  });

  it('selecionar um status diferente chama o callback e fecha o menu', async () => {
    const aoAlterarStatus = jest.fn();
    const { getByText, getByLabelText, queryByLabelText } = await render(
      <LivroItem livro={livro} aoAlterarStatus={aoAlterarStatus} />,
    );
    await fireEvent.press(getByText('Alterar status'));
    await fireEvent.press(getByLabelText('Definir status Lendo'));
    expect(aoAlterarStatus).toHaveBeenCalledWith('1', 'Lendo');
    expect(queryByLabelText('Definir status Lido')).toBeNull();
  });

  it('selecionar o status atual nao dispara o callback', async () => {
    const aoAlterarStatus = jest.fn();
    const { getByText, getByLabelText } = await render(
      <LivroItem livro={livro} aoAlterarStatus={aoAlterarStatus} />,
    );
    await fireEvent.press(getByText('Alterar status'));
    await fireEvent.press(getByLabelText('Definir status Quero ler'));
    expect(aoAlterarStatus).not.toHaveBeenCalled();
  });
});
