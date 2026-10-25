import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

import { FiltroStatus } from '../components/FiltroStatus';
import { LivroItem } from '../components/LivroItem';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { filtrarLivros } from '../state/filtros';
import { useLivros } from '../state/LivroProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Estante'>;

export function EstanteScreen({ navigation }: Props) {
  const { state, dispatch } = useLivros();
  const filtrados = useMemo(
    () => filtrarLivros(state.livros, state.filtro),
    [state.livros, state.filtro],
  );

  if (state.carregando) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensagem}>Carregando sua estante…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FiltroStatus
        filtroAtual={state.filtro}
        aoSelecionar={(filtro) => dispatch({ tipo: 'definirFiltro', filtro })}
      />

      {state.erro ? (
        <View style={styles.erro}>
          <Text style={styles.erroTexto}>{state.erro}</Text>
          <Button title="Dispensar" onPress={() => dispatch({ tipo: 'limparErro' })} />
        </View>
      ) : null}

      {state.livros.length === 0 ? (
        <Text style={styles.mensagem}>Nenhum livro cadastrado ainda.</Text>
      ) : filtrados.length === 0 ? (
        <Text style={styles.mensagem}>Nenhum livro neste status.</Text>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(livro) => livro.id}
          renderItem={({ item }) => (
            <LivroItem
              livro={item}
              aoAlterarStatus={(id, status) =>
                dispatch({ tipo: 'alterarStatus', id, status })
              }
            />
          )}
        />
      )}

      <Button title="Adicionar livro" onPress={() => navigation.navigate('Cadastro')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  mensagem: {
    fontSize: 15,
    color: '#555',
    paddingVertical: 16,
  },
  erro: {
    backgroundColor: '#fdecea',
    borderRadius: 6,
    padding: 10,
    gap: 6,
  },
  erroTexto: {
    color: '#B00020',
    fontSize: 14,
  },
});
