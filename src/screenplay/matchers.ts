/**
 * Un matcher evalúa la respuesta de una question y sabe describirse a sí mismo.
 * La descripción es lo que aparece en el error cuando la aserción falla.
 */
export interface Matcher<T> {
  readonly descripcion: string;
  evalua(valor: T): boolean;
}

export const igualA = <T>(esperado: T): Matcher<T> => ({
  descripcion: `sea igual a ${JSON.stringify(esperado)}`,
  evalua: (valor) => JSON.stringify(valor) === JSON.stringify(esperado),
});

export const contiene = (fragmento: string): Matcher<string> => ({
  descripcion: `contenga "${fragmento}"`,
  evalua: (valor) => valor.includes(fragmento),
});

export const contieneElemento = <T>(elemento: T): Matcher<T[]> => ({
  descripcion: `contenga ${JSON.stringify(elemento)}`,
  evalua: (valores) => valores.some((v) => JSON.stringify(v) === JSON.stringify(elemento)),
});

export const esVerdadero: Matcher<boolean> = {
  descripcion: 'sea verdadero',
  evalua: (valor) => valor === true,
};

export const esFalso: Matcher<boolean> = {
  descripcion: 'sea falso',
  evalua: (valor) => valor === false,
};

export const mayorQue = (minimo: number): Matcher<number> => ({
  descripcion: `sea mayor que ${minimo}`,
  evalua: (valor) => valor > minimo,
});

export const tieneLongitud = (esperada: number): Matcher<unknown[]> => ({
  descripcion: `tenga ${esperada} elemento(s)`,
  evalua: (valores) => valores.length === esperada,
});

/** Niega cualquier matcher: `no(contiene('error'))`. */
export const no = <T>(matcher: Matcher<T>): Matcher<T> => ({
  descripcion: `no ${matcher.descripcion}`,
  evalua: (valor) => !matcher.evalua(valor),
});
