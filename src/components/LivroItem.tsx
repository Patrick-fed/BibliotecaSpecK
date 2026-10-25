import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { STATUS_LEITURA, type Livro, type StatusLeitura } from '../types/livro';

interface Props {
  livro: Livro;
  aoAlterarStatus?: (id: string, status: StatusLeitura) => void;
}

export const LivroItem = memo(function LivroItem({ livro, aoAlterarStatus }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);

  const selecionar = (status: StatusLeitura) => {
    setMenuAberto(false);
    if (status !== livro.status) {
      aoAlterarStatus?.(livro.id, status);
    }
  };

  return (
    <View style={styles.item}>
      <Text style={styles.titulo}>{livro.titulo}</Text>
      <Text style={styles.autor}>{livro.autor}</Text>
      <Text style={styles.status}>{livro.status}</Text>

      {aoAlterarStatus ? (
        <Pressable
          onPress={() => setMenuAberto((aberto) => !aberto)}
          style={styles.botaoStatus}
          accessibilityRole="button"
          accessibilityLabel={`Alterar status de ${livro.titulo}`}
        >
          <Text style={styles.botaoStatusTexto}>Alterar status</Text>
        </Pressable>
      ) : null}

      {menuAberto ? (
        <View style={styles.menu}>
          {STATUS_LEITURA.map((status) => (
            <Pressable
              key={status}
              onPress={() => selecionar(status)}
              style={[styles.opcao, status === livro.status && styles.opcaoAtiva]}
              accessibilityRole="button"
            >
              <Text style={styles.opcaoTexto}>{status}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    gap: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
  },
  autor: {
    fontSize: 14,
    color: '#444',
  },
  status: {
    fontSize: 13,
    color: '#2d6a4f',
    fontWeight: '500',
  },
  botaoStatus: {
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  botaoStatusTexto: {
    fontSize: 13,
    color: '#333',
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  opcao: {
    borderWidth: 1,
    borderColor: '#2d6a4f',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  opcaoAtiva: {
    backgroundColor: '#d8f3dc',
  },
  opcaoTexto: {
    fontSize: 13,
    color: '#2d6a4f',
  },
});
