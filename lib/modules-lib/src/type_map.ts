/**
 * Utilites for creating and manipulating Bundle Type Maps
 * @module Type Maps
 */

/** @hidden */
type Decorator = (...args: any[]) => any;

/**
 * Utility function for creating type maps
 *
 * @returns A reference to a type map alongside decorators that are
 * used to populate it
 */
export default function createTypeMap() {
  const type_map : Record<string, string> = {};

  function registerType(name: string, declaration: string) {
    if (name === 'prelude') {
      type_map['prelude'] = type_map['prelude'] != undefined ? type_map['prelude'] + '\n' + declaration : declaration;
    } else {
      type_map[name] = declaration;
    }
  }

  function classDeclaration(name: string): Decorator {
    return (_target: any) => {
      registerType('prelude', `class ${name} {}`);
    };
  }

  function typeDeclaration(type: string, declaration = null): Decorator {
    return (target: any) => {
      const typeAlias = `type ${target.name} = ${type}`;
      let variableDeclaration = `const ${target.name} = ${declaration === null ? type : declaration}`;

      switch (type) {
        case 'number':
          variableDeclaration = `const ${target.name} = 0`;
          break;
        case 'string':
          variableDeclaration = `const ${target.name} = ''`;
          break;
        case 'boolean':
          variableDeclaration = `const ${target.name} = false`;
          break;
        case 'void':
          variableDeclaration = '';
          break;
      }

      registerType('prelude', `${typeAlias};\n${variableDeclaration};`);
    };
  }

  function functionDeclaration(paramTypes: string, returnType: string): Decorator {
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
  }

  function variableDeclaration(type: string): Decorator {
    return (_target: any, propertyKey: string) => {
      registerType(propertyKey, `const ${propertyKey}: ${type} = ${type}`);
    };
  }

  return {
    classDeclaration,
    functionDeclaration,
    variableDeclaration,
    typeDeclaration,
    type_map,
  };
}
