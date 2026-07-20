type Decorator = (...args: any[]) => any;

const functionDeclaration = (_paramTypes: string, _returnType: string): Decorator => {
  return () => undefined;
};

const variableDeclaration = (_type: string): Decorator => {
  return () => undefined;
};

const classDeclaration = (_name: string): Decorator => {
  return () => undefined;
};

@classDeclaration('Widget')
export class Widget {}

export class WidgetPlugin {
  exportedNames = ['make_widget'] as const;

  @variableDeclaration('Widget')
  sample_widget!: Widget;

  @functionDeclaration('count: number, mapper: (widget: Widget) => Widget', 'Widget')
  async* make_widget(_count: unknown, _mapper: unknown) {
    await Promise.resolve();
    return undefined;
  }
}
