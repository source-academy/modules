export class Toggle {
  text: string;
  callback: () => void;
  constructor(text: string, callback: () => void) {
    this.text = text;
    this.callback = callback;
  }
}

export class OverlayHelper {
  toggleLeft: Toggle | undefined;
  toggleCenter: Toggle | undefined;
  toggleRight: Toggle | undefined;
}

