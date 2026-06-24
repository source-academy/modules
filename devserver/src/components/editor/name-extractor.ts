import type { Comment } from 'acorn';
import type es from 'estree';
import { UNKNOWN_LOCATION } from 'js-slang/dist/constants';
import { findAncestors, findIdentifierNode } from 'js-slang/dist/finder';
import syntaxBlacklist from 'js-slang/dist/parser/source/syntax';
import type { Context, Node } from 'js-slang/dist/types';
import { isDeclaration, isImportDeclaration } from 'js-slang/dist/utils/ast/typeGuards';
import * as monaco from 'monaco-editor';

export interface NameDeclaration {
  label: string;
  kind: monaco.languages.CompletionItemKind;
  detail?: string;
  score?: number;
}

type FunctionType = es.FunctionDeclaration | es.ArrowFunctionExpression | es.FunctionExpression;
function isFunction(node: Node): node is FunctionType {
  return (
    node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  );
}

type LoopNode = es.WhileStatement | es.ForStatement;
function isLoop(node: Node): node is LoopNode {
  return node.type === 'WhileStatement' || node.type === 'ForStatement';
}

// Update this to use exported check from "acorn-loose" package when it is released
function isDummyName(name: string): boolean {
  return name === '✖';
}

const KEYWORD_SCORE = 20000;

// Ensure that keywords are prioritized over names
const keywordsInBlock: { [key: string]: NameDeclaration[] } = {
  FunctionDeclaration: [
    { label: 'function', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE },
  ],
  VariableDeclaration: [
    { label: 'const', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE },
  ],
  AssignmentExpression: [{ label: 'let',kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE }],
  WhileStatement: [{ label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE }],
  IfStatement: [
    { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE },
    { label: 'else', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE },
  ],
  ForStatement: [{ label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE }],
};

const keywordsInLoop: { [key: string]: NameDeclaration[] } = {
  BreakStatement: [{ label: 'break', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE }],
  ContinueStatement: [
    { label: 'continue', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE },
  ],
};

const keywordsInFunction: { [key: string]: NameDeclaration[] } = {
  ReturnStatement: [{ label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, score: KEYWORD_SCORE }],
};

/**
 * Retrieves keyword suggestions based on what node the cursor is currently over.
 * For example, only suggest `let` when the cursor is over the init part of a for
 * statement
 * @param prog Program to parse
 * @param cursorLoc Current location of the cursor
 * @param context Evaluation context
 * @returns A list of keywords as suggestions
 */
function getKeywords(
  prog: Node,
  cursorLoc: es.Position,
  context: Context,
): NameDeclaration[] {
  const identifier = findIdentifierNode(prog, context, cursorLoc);
  if (!identifier) {
    return [];
  }

  const ancestors = findAncestors(prog, identifier);
  if (!ancestors) {
    return [];
  }

  // In the init part of a for statement, `let` is the only valid keyword
  if (ancestors[0].type === 'ForStatement' && identifier === ancestors[0].init) {
    return context.chapter >= syntaxBlacklist.AssignmentExpression
      ? keywordsInBlock.AssignmentExpression
      : [];
  }

  const keywordSuggestions: NameDeclaration[] = [];
  function addAllowedKeywords(keywords: { [key: string]: NameDeclaration[] }) {
    Object.entries(keywords)
      .filter(([nodeType]) => context.chapter >= syntaxBlacklist[nodeType])
      .forEach(([, decl]) => keywordSuggestions.push(...decl));
  }

  // The rest of the keywords are only valid at the beginning of a statement
  if (
    ancestors[0].type === 'ExpressionStatement' &&
    (ancestors[0].loc ?? UNKNOWN_LOCATION).start === (identifier.loc ?? UNKNOWN_LOCATION).start
  ) {
    addAllowedKeywords(keywordsInBlock);
    // Keywords only allowed in functions
    if (ancestors.some(isFunction)) {
      addAllowedKeywords(keywordsInFunction);
    }

    // Keywords only allowed in loops
    if (ancestors.some(isLoop)) {
      addAllowedKeywords(keywordsInLoop);
    }
  }

  return keywordSuggestions;
}

function isNotNull<T>(x: T): x is Exclude<T, null> {
  // This function exists to appease the mighty typescript type checker
  return x !== null;
}

function isNotNullOrUndefined<T>(x: T): x is Exclude<T, null | undefined> {
  // This function also exists to appease the mighty typescript type checker
  return x !== undefined && isNotNull(x);
}

function getNodeChildren(node: Node): es.Node[] {
  switch (node.type) {
    case 'BlockStatement':
    case 'Program':
      return node.body;
    case 'WhileStatement':
      return [node.test, node.body];
    case 'ForStatement':
      return [node.init, node.test, node.update, node.body].filter(isNotNullOrUndefined);
    case 'ExpressionStatement':
      return [node.expression];
    case 'ReturnStatement':
      return node.argument ? [node.argument] : [];
    case 'VariableDeclaration':
      return node.declarations.flatMap(getNodeChildren);
    case 'VariableDeclarator':
      return node.init ? [node.init] : [];
    case 'ArrowFunctionExpression':
    case 'FunctionDeclaration':
    case 'FunctionExpression':
      return [node.body];
    case 'UnaryExpression':
      return [node.argument];
    case 'AssignmentExpression':
    case 'BinaryExpression':
    case 'LogicalExpression':
      return [node.left, node.right];
    case 'IfStatement':
    case 'ConditionalExpression':
      return [node.test, node.alternate, node.consequent].filter(isNotNullOrUndefined);
    // case 'Identifier':
    // case 'DebuggerStatement':
    // case 'BreakStatement':
    // case 'ContinueStatement':
    // case 'MemberPattern':
    case 'ArrayExpression':
      return node.elements.filter(isNotNull);
    case 'MemberExpression':
      return [node.object, node.property];
    case 'Property':
      return [node.key, node.value];
    case 'ObjectExpression':
      return node.properties;
    case 'CallExpression':
    case 'NewExpression':
      return [...node.arguments, node.callee];
    default:
      return [];
  }
}

function cursorInIdentifier(node: Node, locTest: (node: Node) => boolean): boolean {
  switch (node.type) {
    case 'VariableDeclaration':
      for (const decl of node.declarations) {
        if (locTest(decl.id)) {
          return true;
        }
      }
      return false;
    case 'FunctionDeclaration':
      return node.id ? locTest(node.id) : false;
    case 'Identifier':
      return locTest(node);
    default:
      return false;
  }
}

// locTest is a callback that returns whether cursor is in location of node
/**
 * Gets a list of `NameDeclarations` from the given node
 * @param node Node to search for names
 * @param locTest Callback of type `(node: Node) => boolean`. Should return true if the cursor
 * is located within the node, false otherwise
 * @returns List of found names
 */
function getNames(
  node: Node,
  locTest: (node: Node) => boolean,
): NameDeclaration[] {
  switch (node.type) {
    case 'VariableDeclaration': {

      const declarations: NameDeclaration[] = [];
      for (const decl of node.declarations) {
        const id = decl.id;
        const name = (id as es.Identifier).name;
        if (
          !name ||
          isDummyName(name) ||
          (decl.init && !isFunction(decl.init) && locTest(decl.init)) // Avoid suggesting `let foo = foo`, but suggest recursion with arrow functions
        ) {
          continue;
        }

        if (node.kind === 'const' && decl.init && isFunction(decl.init)) {
          // constant initialized with arrow function will always be a function
          declarations.push({
            kind: monaco.languages.CompletionItemKind.Function,
            label: name,
          });
        } else {
          declarations.push({
            label: name,
            kind: node.kind === 'const'
              ? monaco.languages.CompletionItemKind.Constant
              : monaco.languages.CompletionItemKind.Variable,
            detail: `${node.kind} ${name}`
          });
        }
      }
      return declarations;
    }
    case 'FunctionDeclaration':
      return node.id && !isDummyName(node.id.name)
        ? [{ label: node.id.name, kind: monaco.languages.CompletionItemKind.Function }]
        : [];
    case 'Identifier': // Function/Arrow function param
      return !isDummyName(node.name) ? [{ label: node.name, kind: monaco.languages.CompletionItemKind.Variable }] : [];
    default:
      return [];
  }
}

/**
 * Retrieve the list of names present within the program. If the cursor is within a comment,
 * or when the user is declaring a variable or function arguments, suggestions should not be displayed,
 * indicated by the second part of the return value of this function.
 * @param prog Program to parse for names
 * @param comments Comments found within the program
 * @param cursorLoc Current location of the cursor
 * @returns Tuple consisting of the list of suggestions, and a boolean value indicating if
 * suggestions should be displayed, i.e. `[suggestions, shouldPrompt]`
 */
export function getProgramNames(
  prog: Node,
  comments: Comment[],
  cursorLoc: es.Position,
  context: Context,
): [NameDeclaration[], boolean] {
  function before(first: es.Position, second: es.Position) {
    return (
      first.line < second.line || (first.line === second.line && first.column <= second.column)
    );
  }

  function cursorInLoc(nodeLoc: es.SourceLocation | null | undefined) {
    if (nodeLoc === null || nodeLoc === undefined) {
      return false;
    }
    return before(nodeLoc.start, cursorLoc) && before(cursorLoc, nodeLoc.end);
  }

  for (const comment of comments) {
    if (cursorInLoc(comment.loc)) {
      // User is typing comments
      return [[], false];
    }
  }

  // BFS to get names
  const queue: Node[] = [prog];
  const nameQueue: Node[] = [];

  while (queue.length > 0) {
    // Workaround due to minification problem
    const node = queue.shift()!;
    if (isFunction(node)) {
      // This is the only time we want raw identifiers
      nameQueue.push(...node.params);
    }

    const body = getNodeChildren(node);
    for (const child of body) {
      if (isImportDeclaration(child as any)) {
        nameQueue.push(child);
      }

      if (isDeclaration(child)) {
        nameQueue.push(child);
      }

      if (cursorInLoc(child.loc)) {
        queue.push(child);
      }
    }
  }

  // Do not prompt user if he is declaring a variable
  for (const nameNode of nameQueue) {
    if (cursorInIdentifier(nameNode, n => cursorInLoc(n.loc))) {
      return [[], false];
    }
  }

  // This implementation is order dependent, so we can't
  // use something like Promise.all
  const res: Record<string, NameDeclaration> = {};
  let idx = 0;
  for (const node of nameQueue) {
    const names = getNames(node, n => cursorInLoc(n.loc));
    names.forEach(decl => {
      // Deduplicate, ensure deeper declarations overwrite
      res[decl.label] = { ...decl, score: idx };
      idx++;
    });
  }

  return [
    [
      ...Object.values(res),
      ...getKeywords(prog, cursorLoc, context)
    ],
    true
  ];
}
