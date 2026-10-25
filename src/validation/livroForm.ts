export interface EntradaLivro {
  titulo: string;
  autor: string;
}

export interface ResultadoValidacao {
  ok: boolean;
  dados?: { titulo: string; autor: string };
  erros: { titulo?: string; autor?: string };
}

export function validarLivroForm(entrada: EntradaLivro): ResultadoValidacao {
  const titulo = entrada.titulo.trim();
  const autor = entrada.autor.trim();
  const erros: { titulo?: string; autor?: string } = {};

  if (titulo === '') {
    erros.titulo = 'Informe o título.';
  }
  if (autor === '') {
    erros.autor = 'Informe o autor.';
  }

  if (erros.titulo || erros.autor) {
    return { ok: false, erros };
  }

  return { ok: true, dados: { titulo, autor }, erros };
}
