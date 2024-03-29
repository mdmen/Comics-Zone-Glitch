export class Gamepad {
  private gamepad: globalThis.Gamepad | null = null;
  private readonly gamepadScanTimeout = 500;

  constructor() {
    this.scanForGamepad = this.scanForGamepad.bind(this);
    this.handleConnected = this.handleConnected.bind(this);
    this.handleDisconnected = this.handleDisconnected.bind(this);

    this.detectGamepad();
    this.bindEvents();
  }

  private bindEvents() {
    window.addEventListener('gamepadconnected', this.handleConnected);
    window.addEventListener('gamepaddisconnected', this.handleDisconnected);

    if (this.shouldScanForGamepad()) {
      this.scanForGamepad();
    }
  }

  private detectGamepad() {
    this.gamepad = navigator.getGamepads().find(Boolean) || null;
  }

  private shouldScanForGamepad() {
    return !('ongamepadconnected' in window);
  }

  private scanForGamepad() {
    this.detectGamepad();

    setTimeout(this.scanForGamepad, this.gamepadScanTimeout);
  }

  private handleConnected() {
    this.detectGamepad();
  }

  private handleDisconnected() {
    this.gamepad = null;
  }

  isPressed(code: number) {
    return !!this.gamepad?.buttons[code]?.pressed;
  }
}
