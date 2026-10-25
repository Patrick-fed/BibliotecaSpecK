import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';

import { livroRepository } from '../storage/livroRepository';
import { estadoInicial, livroReducer, type LivroAction, type LivroState } from './livroReducer';

interface LivroContextValue {
  state: LivroState;
  dispatch: React.Dispatch<LivroAction>;
}

const LivroContext = createContext<LivroContextValue | null>(null);

export function LivroProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(livroReducer, estadoInicial);
  const prontaParaPersistir = useRef(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const livros = await livroRepository.carregar();
        if (ativo) {
          dispatch({ tipo: 'carregado', livros });
        }
      } catch {
        if (ativo) {
          dispatch({ tipo: 'falhaCarga', mensagem: 'Não foi possível carregar seus livros.' });
        }
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (state.carregando) {
      return;
    }
    if (!prontaParaPersistir.current) {
      prontaParaPersistir.current = true;
      return;
    }
    livroRepository.salvar(state.livros).catch(() => {
      dispatch({ tipo: 'falhaCarga', mensagem: 'Não foi possível salvar as alterações.' });
    });
  }, [state.livros, state.carregando]);

  const value: LivroContextValue = { state, dispatch };
  return <LivroContext.Provider value={value}>{children}</LivroContext.Provider>;
}

export function useLivros(): LivroContextValue {
  const ctx = useContext(LivroContext);
  if (ctx === null) {
    throw new Error('useLivros deve ser usado dentro de LivroProvider');
  }
  return ctx;
}
