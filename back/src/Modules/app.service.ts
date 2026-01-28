import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private appLocked = false;
  private lockMessage =
    'La aplicación está bloqueada. Por favor, realice el pago para continuar operando.';

  getHello(): string {
    return 'Hello World!';
  }

  getLockStatus() {
    return {
      locked: this.appLocked,
      message: this.lockMessage,
    };
  }

  setLock(locked: boolean, message?: string) {
    this.appLocked = locked;
    if (message) {
      this.lockMessage = message;
    }
    return {
      locked: this.appLocked,
      message: this.lockMessage,
    };
  }
}
