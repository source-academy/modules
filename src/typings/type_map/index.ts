export const type_map : Record<string, string> = {};

const registerType = (name: string, declaration: string) => {
  if (name == 'prelude') {
    type_map['prelude'] = type_map['prelude'] != undefined ? type_map['prelude'] + '\n' + declaration : declaration;
  } else {
    type_map[name] = declaration;
  }
};

export const classDeclaration = (name: string) => {
  return (_target: any) => {
    registerType('prelude', `class ${name} {}`);
  };
};

export const typeDeclaration = (type: string, declaration = null) => {
  return (_target: any) => {
    const typeAlias = `type ${_target.name} = ${type}`;
    let variableDeclaration = `const ${_target.name} = ${declaration === null ? type : declaration}`;

    switch (type) {
      case 'number':
        variableDeclaration = `const ${_target.name} = 0`;
        break;
      case 'string':
        variableDeclaration = `const ${_target.name} = ''`;
        break;
      case 'boolean':
        variableDeclaration = `const ${_target.name} = false`;
        break;
      case 'void':
        variableDeclaration = '';
        break;
    }

    registerType('prelude', `${typeAlias};\n${variableDeclaration};`);
  };
};

export const functionDeclaration = (paramTypes: string, returnType: string) => {
  return (_target: any, propertyKey: string, _descriptor: PropertyDescriptor) => {
    let returnValue = '';
    switch (returnType) {
      case 'number':
        returnValue = 'return 0';
        break;
      case 'string':
        returnValue = "return ''";
        break;
      case 'boolean':
        returnValue = 'return false';
        break;
      case 'void':
        returnValue = '';
        break;
      default:
        returnValue = `return ${returnType}`;
        break;
    }
    registerType(propertyKey, `function ${propertyKey} (${paramTypes}) : ${returnType} { ${returnValue} }`);
  };
};

export const variableDeclaration = (type: string) => {
  return (_target: any, propertyKey: string) => {
    registerType(propertyKey, `const ${propertyKey}: ${type} = ${type}`);
  };
};
