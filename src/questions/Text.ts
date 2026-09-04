import type { Actor } from '../screenplay/Actor';
import type { Target } from '../screenplay/Target';
import type { Question } from '../screenplay/types';

/** El texto visible de un elemento, sin espacios sobrantes. */
export class Text implements Question<string> {
  readonly descripcion: string;

  private constructor(private readonly target: Target) {
    this.descripcion = `el texto de ${target.nombre}`;
  }

  static de(target: Target): Text {
    return new Text(target);
  }

  async answeredBy(actor: Actor): Promise<string> {
    const texto = await this.target.resolverPara(actor).innerText();
    return texto.trim();
  }
}

/** El texto de todas las coincidencias, en orden de aparición en el DOM. */
export class TextList implements Question<string[]> {
  readonly descripcion: string;

  private constructor(private readonly target: Target) {
    this.descripcion = `los textos de ${target.nombre}`;
  }

  static de(target: Target): TextList {
    return new TextList(target);
  }

  async answeredBy(actor: Actor): Promise<string[]> {
    const textos = await this.target.resolverPara(actor).allInnerTexts();
    return textos.map((t) => t.trim());
  }
}
