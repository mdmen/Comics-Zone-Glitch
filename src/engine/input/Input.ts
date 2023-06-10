import { Gamepad } from './Gamepad';
import { Keyboard } from './Keyboard';
import { Settings } from '../Settings';

type KeyboardKeyCode = string;
type GamepadButtonIndex = number;
type ControlsSet = [KeyboardKeyCode, GamepadButtonIndex];
type Controls<Names extends string> = Record<Names, ControlsSet>;

export class Input<Names extends string = string> {
  private static instance: Input;
  private readonly keyboard;
  private readonly gamepad;
  private controls;

  private constructor(controls: Controls<Names>) {
    this.controls = controls;
    this.keyboard = Keyboard.getInstance();

    if (Settings.getValue('gamepadAllowed')) {
      this.gamepad = Gamepad.getInstance();
    }
  }

  public isPressed(control: Names): boolean {
    const [keyboardKey, gamepadButtonIndex] = this.controls[control];

    return (
      this.keyboard.isPressed(keyboardKey) ||
      !!this.gamepad?.isPressed(gamepadButtonIndex)
    );
  }

  public setKeyboardControl(control: Names, key: KeyboardKeyCode): void {
    this.controls[control][0] = key;
  }

  public setGamepadControl(control: Names, button: GamepadButtonIndex): void {
    this.controls[control][1] = button;
  }

  public static getInstance<Names extends string>(
    controls: Controls<Names>
  ): Input<Names> {
    if (!Input.instance) {
      Input.instance = new Input(controls);
    }

    return Input.instance;
  }
}