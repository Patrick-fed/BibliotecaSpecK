import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CadastroScreen } from '../screens/CadastroScreen';
import { EstanteScreen } from '../screens/EstanteScreen';

export type RootStackParamList = {
  Estante: undefined;
  Cadastro: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Estante">
      <Stack.Screen
        name="Estante"
        component={EstanteScreen}
        options={{ title: 'Minha Estante' }}
      />
      <Stack.Screen
        name="Cadastro"
        component={CadastroScreen}
        options={{ title: 'Cadastrar Livro' }}
      />
    </Stack.Navigator>
  );
}
