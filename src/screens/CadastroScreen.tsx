import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { useLivros } from '../state/LivroProvider';
import { validarLivroForm } from '../validation/livroForm';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

type ErrosForm = { titulo?: string; autor?: string };

export function CadastroScreen({ navigation }: Props) {
  const { dispatch } = useLivros();
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [erros, setErros] = useState<ErrosForm>({});

  const alterarTitulo = (valor: string) => {
    setTitulo(valor);
    if (erros.titulo) {
      setErros((atual) => ({ ...atual, titulo: undefined }));
    }
  };

  const alterarAutor = (valor: string) => {
    setAutor(valor);
    if (erros.autor) {
      setErros((atual) => ({ ...atual, autor: undefined }));
    }
  };

  const salvar = () => {
    const resultado = validarLivroForm({ titulo, autor });
    if (!resultado.ok || !resultado.dados) {
      setErros(resultado.erros);
      return;
    }
    setErros({});
    dispatch({ tipo: 'adicionar', titulo: resultado.dados.titulo, autor: resultado.dados.autor });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.campo}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={alterarTitulo}
          accessibilityLabel="Título do livro"
        />
        {erros.titulo ? <Text style={styles.erro}>{erros.titulo}</Text> : null}
      </View>

      <View style={styles.campo}>
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={autor}
          onChangeText={alterarAutor}
          accessibilityLabel="Autor do livro"
        />
        {erros.autor ? <Text style={styles.erro}>{erros.autor}</Text> : null}
      </View>

      <Button title="Salvar" onPress={salvar} />
      <Button title="Voltar à estante" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  campo: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  erro: {
    color: '#B00020',
    fontSize: 14,
  },
});
