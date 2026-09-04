import { Click, EnterText, Navigate } from '../interactions';
import { LoginScreen } from '../screens';
import type { Actor } from '../screenplay/Actor';
import type { Task } from '../screenplay/types';

/**
 * Entra a la aplicación con unas credenciales.
 *
 * Es el ejemplo canónico de por qué existe el patrón: si mañana el login pasa
 * a tener un segundo factor, se cambia esta task y los veinte tests que
 * empiezan iniciando sesión siguen funcionando sin tocarse.
 */
export class IniciarSesion implements Task {
  private constructor(
    private readonly usuario: string,
    private readonly clave: string,
  ) {}

  static como(usuario: string) {
    return {
      conClave: (clave: string): IniciarSesion => new IniciarSesion(usuario, clave),
    };
  }

  /** El camino feliz, para los tests que solo necesitan estar dentro. */
  static comoUsuarioValido(): IniciarSesion {
    return new IniciarSesion('demo', 'demo123');
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.intenta(
      Navigate.a('/'),
      EnterText.con(this.usuario).en(LoginScreen.usuario),
      EnterText.con(this.clave).en(LoginScreen.clave),
      Click.en(LoginScreen.ingresar),
    );
  }
}
