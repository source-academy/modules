import type { TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

/**
 * Find the module specifier depending on how it was declared.
 * If the declaration doesn't come from an import/export statement,
 * then return `null`.
 */
export function getModuleSpecifierFromDeclaration(
  decl: ts.Declaration
): string | null {
  let node: ts.Node | undefined = decl;

  while (node) {
    // import { Foo } from "lib"
    if (ts.isImportDeclaration(node)) {
      const spec = node.moduleSpecifier;
      if (ts.isStringLiteral(spec)) {
        return spec.text;
      }
    }

    // export { Foo } from "lib"
    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      const spec = node.moduleSpecifier;
      if (ts.isStringLiteral(spec)) {
        return spec.text;
      }
    }

    node = node.parent;
  }

  return null;
}

/**
 * Account for two possible cases:
 * 1. Typical named import (Checking against identifier)
 * 2. Namespace import (Checking against MemberExpression)
 */
export function getRhsIdentifier(node: TSESTree.Expression): TSESTree.Identifier | null {
  if (node.type === 'Identifier') {
    return node;
  }

  if (node.type === 'MemberExpression' && !node.computed) {
    if (node.property.type === 'Identifier') {
      return node.property;
    }
  }

  return null;
}
