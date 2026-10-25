import { validarLivroForm } from './livroForm';

describe('validarLivroForm', () => {
  it('aceita titulo e autor preenchidos e aplica trim', () => {
    const r = validarLivroForm({ titulo: '  Dom Casmurro  ', autor: '  Machado  ' });
    expect(r.ok).toBe(true);
    expect(r.dados).toEqual({ titulo: 'Dom Casmurro', autor: 'Machado' });
    expect(r.erros).toEqual({});
  });

  it('rejeita titulo vazio', () => {
    const r = validarLivroForm({ titulo: '', autor: 'Autor' });
    expect(r.ok).toBe(false);
    expect(r.erros.titulo).toBe('Informe o título.');
    expect(r.erros.autor).toBeUndefined();
    expect(r.dados).toBeUndefined();
  });

  it('rejeita autor vazio', () => {
    const r = validarLivroForm({ titulo: 'Titulo', autor: '' });
    expect(r.ok).toBe(false);
    expect(r.erros.autor).toBe('Informe o autor.');
    expect(r.erros.titulo).toBeUndefined();
  });

  it('rejeita campos compostos apenas por espacos', () => {
    const r = validarLivroForm({ titulo: '   ', autor: '   ' });
    expect(r.ok).toBe(false);
    expect(r.erros.titulo).toBe('Informe o título.');
    expect(r.erros.autor).toBe('Informe o autor.');
  });

  it('retorna erros consistentes com ok=false nos dois campos', () => {
    const r = validarLivroForm({ titulo: '', autor: '' });
    expect(r.ok).toBe(false);
    expect(Object.keys(r.erros)).toHaveLength(2);
  });
});
