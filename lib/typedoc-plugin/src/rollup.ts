import fs from 'fs';
import pathlib from 'path';
import * as td from 'typedoc';

function convertToTypedocPath(p: string) {
  return p.split(pathlib.sep).join(pathlib.posix.sep);
}

async function main() {
  const directory = convertToTypedocPath(pathlib.join(import.meta.dirname, '..', '..', '..', 'src', 'bundles', 'curve'));
  const app = await td.Application.bootstrap({
    entryPoints: [pathlib.posix.join(directory, 'src', 'index.ts')],
    tsconfig: pathlib.posix.join(directory, 'tsconfig.json'),
  });

  const project = await app.convert();

  const writeStream = fs.createWriteStream(pathlib.join(import.meta.dirname, 'test.d.ts'), 'utf-8');

  function stringifyTypeParameter(reflection: td.TypeParameterReflection) {
    const defaultStr = reflection.default ? ` = ${reflection.default.stringify(td.TypeContext.none)}` : '';
    const varianceStr = reflection.varianceModifier ? ` ${reflection.varianceModifier}` : '';
    const extendsStr = reflection.type ? ` extends ${reflection.type.stringify(td.TypeContext.none)}` : '';
    return `${reflection.name}${varianceStr}${extendsStr}${defaultStr}`;
  }

  function writeCommentPart(commentPart: td.CommentDisplayPart, indent: string) {
    switch (commentPart.kind) {
      case 'code':
      case 'text': {
        const parts = commentPart.text.split('\n');
        writeStream.write(parts.join(`\n${indent} * `));
        return;
      }
      case 'inline-tag': {
        writeStream.write(`{@${commentPart.target} ${commentPart.text}}`);
        return;
      }
    }
  }

  function writeComment(comment: td.Comment, indent: string) {
    writeStream.write(`${indent}/**\n`);

    if (comment.summary?.length) {
      // Only for comment
      writeStream.write(`${indent} * `);
      comment.summary.forEach(part => writeCommentPart(part, indent));
      writeStream.write(`\n${indent} *\n`);
    }

    for (const tag of comment.blockTags) {
      writeStream.write(`${indent} * ${tag.tag} `);

      if (tag.name) {
        writeStream.write(`${tag.name} `);
      }

      if (tag.content?.length) {
        tag.content.forEach(part => writeCommentPart(part, indent));
        writeStream.write(`\n${indent} *\n`);
      }
    }

    writeStream.write(`${indent} */\n`);
  }

  function writeSignature(
    signature: td.SignatureReflection,
    parent: td.DeclarationReflection,
    indent: string,
    shouldExport: boolean
  ) {
    const paramStr = signature.parameters?.map(({ name, flags, type, defaultValue }) => {
      const typeStr = type!.stringify(td.TypeContext.none);

      if (flags.isRest) {
        return `...${name}: ${typeStr}`;
      }

      const isOptional = flags.isOptional ? '?' : '';
      const defaultStr = defaultValue ? ` = ${defaultValue}` : '';

      return `${name}${isOptional}: ${typeStr}${defaultStr}`;
    }).join(', ') ?? '';

    const typeParameterStr = signature.typeParameters?.map(stringifyTypeParameter).join(', ');

    signature.parameters?.forEach(({ comment, name }) => {
      if (!comment) return;

      // Restore parameter descriptions to the parent
      // comment with param tags
      signature.comment!.blockTags.push({
        tag: '@param',
        content: comment.summary,
        name
      });
    });

    if (signature.comment) {
      writeComment(signature.comment, indent);
    }

    let functionName: string;
    switch (signature.kind) {
      case td.ReflectionKind.ConstructorSignature: {
        functionName = 'constructor';
        break;
      }
      case td.ReflectionKind.GetSignature: {
        functionName = `get ${signature.name}`;
        break;
      }
      case td.ReflectionKind.SetSignature: {
        functionName = `set ${signature.name}`;
        break;
      }
      default: {
        switch (parent.kind) {
          case td.ReflectionKind.Function: {
            // Normal function signature
            functionName = `function ${signature.name}`;
            break;
          }
          case td.ReflectionKind.Method: {
            // Method signature
            const modifiers: string[] = [];
            if (parent.flags.isPrivate) {
              modifiers.push('private');
            } else if (parent.flags.isProtected) {
              modifiers.push('protected');
            } else if (parent.flags.isPublic) {
              modifiers.push('public');
            }

            if (parent.flags.isStatic) {
              modifiers.push('static');
            }

            if (parent.flags.isAbstract) {
              modifiers.push('abstract');
            }

            modifiers.push(signature.name);
            functionName = modifiers.join(' ');
            break;
          }
          default: {
            // Potentially an interface's call signature
            functionName = '';
            break;
          }
        }
        break;
      }
    }

    writeStream.write(`${indent}${shouldExport ? 'export ' : ''}${functionName}`);
    if (typeParameterStr !== undefined) {
      writeStream.write(`<${typeParameterStr}>`);
    }

    const returnTypeStr = signature.type?.stringify(td.TypeContext.none) ?? 'void';
    writeStream.write(`(${paramStr}): ${returnTypeStr};\n`);
  }

  function writeVariable(declaration: td.DeclarationReflection, indent: string, shouldExport: boolean) {
    if (declaration.comment) {
      writeComment(declaration.comment, indent);
    }
    writeStream.write(`${indent}${shouldExport ? 'export ' : ''}const ${declaration.name}: ${declaration.type?.stringify(td.TypeContext.none) ?? 'any'};\n`);
  }

  function writeProperty(declaration: td.DeclarationReflection, indent: string) {
    writeStream.write(indent);

    if (declaration.flags.isPrivate) {
      writeStream.write('private ');
    } else if (declaration.flags.isProtected) {
      writeStream.write('protected ');
    } else if (declaration.flags.isPublic) {
      writeStream.write('public ');
    }

    if (declaration.flags.isStatic) {
      writeStream.write('static ');
    }

    if (declaration.flags.isReadonly) {
      writeStream.write('readonly ');
    }

    writeStream.write(`${declaration.name}: ${declaration.type!.stringify(td.TypeContext.none)};\n`);
  }

  function writeClassOrInterface(declaration: td.DeclarationReflection, indent: string, shouldExport: boolean) {
    if (declaration.comment) {
      writeComment(declaration.comment, indent);
    }

    const exportStr = shouldExport ? 'export ' : '';
    if (declaration.kind === td.ReflectionKind.Class) {
      const abstrStr = declaration.flags.isAbstract ? 'abstract ' : '';
      writeStream.write(`${indent}${exportStr}${abstrStr}class ${declaration.name}`);
    } else {
      writeStream.write(`${indent}${exportStr}interface ${declaration.name}`);
    }

    if (declaration.typeParameters?.length) {
      writeStream.write(`<${declaration.typeParameters.map(stringifyTypeParameter).join(', ')}>`);
    }

    if (declaration.extendedTypes?.length) {
      writeStream.write(` extends ${declaration.extendedTypes.map(type => type.stringify(td.TypeContext.none)).join(', ')}`);
    }

    if (declaration.implementedTypes?.length) {
      writeStream.write(` implements ${declaration.implementedTypes.map(type => type.stringify(td.TypeContext.none)).join(', ')}`);
    }
    writeStream.write(' {\n');

    declaration.signatures?.forEach(signature => {
      writeSignature(signature, declaration, `${indent}  `, false);
    });

    if (declaration.children) {
      writeClassOrInterfaceBody(declaration.children, `${indent}  `);
    }

    writeStream.write(`\n${indent}}\n`);
  }

  function writeClassOrInterfaceBody(decls: td.DeclarationReflection[], indent: string) {
    decls.forEach(child => {
      if (child.name === 'constructor') {
        // Don't write useless constructors
        const notUseless = child.signatures?.some(sig => sig.parameters!.length > 0);
        if (!notUseless) return;
      }

      if (child.implementationOf || child.flags.isInherited) return;

      writeDeclaration(child, indent, false);
    });
  }

  function writeTypeAlias(declaration: td.DeclarationReflection, indent: string, shouldExport: boolean) {
    writeStream.write(indent);

    if (shouldExport) {
      writeStream.write('export ');
    }

    writeStream.write(`type ${declaration.name}`);

    if (declaration.typeParameters?.length) {
      const params = declaration.typeParameters.map(stringifyTypeParameter).join(', ');
      writeStream.write(`<${params}>`);
    }

    writeStream.write(` = ${declaration.type!.stringify(td.TypeContext.none)};`);
  }

  function writeEnum(declaration: td.DeclarationReflection, indent: string, shouldExport: boolean) {
    writeStream.write(indent);
    if (shouldExport) {
      writeStream.write('export ');
    }

    if (declaration.flags.isConst) {
      writeStream.write('const ');
    }

    writeStream.write(`enum ${declaration.name} {\n`);
    declaration.children?.forEach(child => {
      if (child.comment) {
        writeComment(child.comment, indent);
      }

      writeStream.write(`${indent}  ${child.name}`);

      if (child.type) {
        writeStream.write(` = ${child.type.stringify(td.TypeContext.none)}`);
      }

      writeStream.write(',\n');
    });

    writeStream.write(`\n${indent}}`);
  }

  function writeDeclaration(declaration: td.DeclarationReflection, indent: string, shouldExport: boolean) {
    switch (declaration.kind) {
      case td.ReflectionKind.Accessor: {
        if (declaration.getSignature) {
          writeSignature(declaration.getSignature, declaration, indent, false);
        }

        if (declaration.setSignature) {
          writeSignature(declaration.setSignature, declaration, indent, false);
        }
        break;
      }
      case td.ReflectionKind.Enum: {
        writeEnum(declaration, indent, shouldExport);
        break;
      }
      case td.ReflectionKind.Method:
      case td.ReflectionKind.Constructor:
      case td.ReflectionKind.Function: {
        declaration.signatures?.forEach(sig => {
          writeSignature(sig, declaration, indent, shouldExport);
        });
        break;
      }
      case td.ReflectionKind.Variable: {
        writeVariable(declaration, indent, shouldExport);
        break;
      }
      case td.ReflectionKind.Class:
      case td.ReflectionKind.Interface: {
        writeClassOrInterface(declaration, indent, shouldExport);
        break;
      }
      case td.ReflectionKind.Property: {
        writeProperty(declaration, indent);
        break;
      }
      case td.ReflectionKind.TypeAlias: {
        writeTypeAlias(declaration, indent, shouldExport);
        break;
      }
    }
  }

  writeStream.write('declare module \'curve\' {\n');

  for (const declaration of project!.children!) {
    writeDeclaration(declaration, '  ', true);
    writeStream.write('\n');
  }

  writeStream.write('}');
}

await main();
