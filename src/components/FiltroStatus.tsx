import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FILTROS, type Filtro } from '../types/livro';

interface Props {
  filtroAtual: Filtro;
  aoSelecionar: (filtro: Filtro) => void;
}

export function FiltroStatus({ filtroAtual, aoSelecionar }: Props) {
  return (
    <View style={styles.linha}>
      {FILTROS.map((filtro) => {
        const ativo = filtro === filtroAtual;
        return (
          <Pressable
            key={filtro}
            onPress={() => aoSelecionar(filtro)}
            style={[styles.chip, ativo && styles.chipAtivo]}
            accessibilityRole="button"
            accessibilityLabel={`Filtro ${filtro}`}
            accessibilityState={{ selected: ativo }}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>{filtro}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#2d6a4f',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipAtivo: {
    backgroundColor: '#2d6a4f',
  },
  texto: {
    fontSize: 13,
    color: '#2d6a4f',
  },
  textoAtivo: {
    color: '#fff',
    fontWeight: '600',
  },
});
