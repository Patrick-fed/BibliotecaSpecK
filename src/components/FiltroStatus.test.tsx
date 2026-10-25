import { fireEvent, render } from '@testing-library/react-native';

import { FiltroStatus } from './FiltroStatus';

describe('FiltroStatus', () => {
  it('renderiza os quatro filtros', async () => {
    const { getByText } = await render(
      <FiltroStatus filtroAtual="Todos" aoSelecionar={jest.fn()} />,
    );
    expect(getByText('Todos')).toBeTruthy();
    expect(getByText('Quero ler')).toBeTruthy();
    expect(getByText('Lendo')).toBeTruthy();
    expect(getByText('Lido')).toBeTruthy();
  });

  it('marca o filtro atual como selecionado', async () => {
    const { getByLabelText } = await render(
      <FiltroStatus filtroAtual="Lendo" aoSelecionar={jest.fn()} />,
    );
    expect(getByLabelText('Filtro Lendo').props.accessibilityState?.selected).toBe(true);
    expect(getByLabelText('Filtro Todos').props.accessibilityState?.selected).toBe(false);
  });

  it('notifica a selecao de cada filtro', async () => {
    const aoSelecionar = jest.fn();
    const { getByLabelText } = await render(
      <FiltroStatus filtroAtual="Todos" aoSelecionar={aoSelecionar} />,
    );
    await fireEvent.press(getByLabelText('Filtro Lido'));
    expect(aoSelecionar).toHaveBeenCalledWith('Lido');
  });
});
