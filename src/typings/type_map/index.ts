export const type_map : Record<string, string> = {};

export const registerType = (name: string, declaration: string) => {
  if (name == 'prelude') {
    type_map['prelude'] = type_map['prelude'] != undefined ? type_map['prelude'] + declaration : declaration;
  } else {
    type_map[name] = declaration;
  }
};

export const wrapClass = (type: string) => {
  return (_target: any) => {
    registerType('prelude', `class ${_target.name} {}`);
  };
};

export const wrapMethod = (paramTypes: string, returnTypes: string) => {
  return (_target: any, propertyKey: string, _descriptor: PropertyDescriptor) => {
    registerType(propertyKey, `function ${propertyKey} (${paramTypes}) { return ${returnTypes} }`);
  };
};

export const wrapProperty = (type: string) => {
  return (_target: any, propertyKey: string) => {
    registerType(propertyKey, `const ${propertyKey}: ${type} = ${type}`);
  };
};
