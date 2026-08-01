import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { TestDataHandler, numberValue, stringValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, test } from 'vitest';
import { checkColorStringValidity, processRichDisplayContent, xssStringCheck } from '../rich_display';

async function pairOf(
  evaluator: TestDataHandler,
  head: TypedValue<DataType>,
  tail: TypedValue<DataType>
): Promise<TypedValue<DataType.PAIR>> {
  return evaluator.pair_make(head, tail);
}

describe(xssStringCheck, () => {
  test('reports a string with no forbidden substring as safe', () => {
    expect(xssStringCheck('Hello World')).toBe('safe');
  });

  test.each([
    ['<b>bold</b>', '<'],
    ['a\\b', '\\'],
    ['SCRIPT tag', 'script'],
    // 'javascript' itself contains 'script' as a substring, and 'script' is checked first in the
    // forbidden-word list, so the reported word is 'script', not 'javascript'.
    ['javascript:alert(1)', 'script'],
    ['eval(x)', 'eval'],
    ['document.write', 'document'],
    ['window.location', 'window'],
    ['console.log', 'console'],
    ['location.href', 'location']
  ])('flags %s as unsafe (%s)', (input, expected) => {
    expect(xssStringCheck(input)).toBe(expected);
  });
});

describe(checkColorStringValidity, () => {
  test('accepts a well-formed 6-digit hex colour', () => {
    expect(checkColorStringValidity('#ff9700')).toBe(true);
  });

  test('accepts uppercase hex digits (case-folded before matching)', () => {
    expect(checkColorStringValidity('#FF9700')).toBe(true);
  });

  test('rejects a string with no hex colour at all', () => {
    expect(checkColorStringValidity('not-a-colour')).toBe(false);
  });

  test('rejects a colour missing digits', () => {
    expect(checkColorStringValidity('#fff')).toBe(false);
  });
});

describe(processRichDisplayContent, () => {
  test('a safe string is wrapped as the base span content', async () => {
    const evaluator = new TestDataHandler();
    const result = await processRichDisplayContent(evaluator, stringValue('Hello World'), 'rich_repl_display');
    expect(result).toBe('">Hello World</span>');
  });

  test('an unsafe string throws, naming the forbidden word', async () => {
    const evaluator = new TestDataHandler();
    await expect(processRichDisplayContent(evaluator, stringValue('run eval(x) now'), 'rich_repl_display'))
      .rejects.toThrow(/eval/);
  });

  test('a value that is neither a string nor a pair is rejected', async () => {
    const evaluator = new TestDataHandler();
    await expect(processRichDisplayContent(evaluator, numberValue(5), 'rich_repl_display'))
      .rejects.toThrow(/pair or string/);
  });

  test('a named style pair prepends its CSS and recurses into the head', async () => {
    const evaluator = new TestDataHandler();
    const value = await pairOf(evaluator, stringValue('Hello'), stringValue('bold'));
    const result = await processRichDisplayContent(evaluator, value, 'rich_repl_display');
    expect(result).toBe('font-weight:bold;">Hello</span>');
  });

  test('an unknown named style throws', async () => {
    const evaluator = new TestDataHandler();
    const value = await pairOf(evaluator, stringValue('Hello'), stringValue('not-a-style'));
    await expect(processRichDisplayContent(evaluator, value, 'rich_repl_display')).rejects.toThrow(/not-a-style/);
  });

  test('a pair tail that is not a string throws', async () => {
    const evaluator = new TestDataHandler();
    const value = await pairOf(evaluator, stringValue('Hello'), numberValue(5));
    await expect(processRichDisplayContent(evaluator, value, 'rich_repl_display')).rejects.toThrow(/should always be a string/);
  });

  test('a clrt pair sets the text colour', async () => {
    const evaluator = new TestDataHandler();
    const value = await pairOf(evaluator, stringValue('Hello'), stringValue('clrt#ff0000'));
    const result = await processRichDisplayContent(evaluator, value, 'rich_repl_display');
    expect(result).toBe('color:#ff0000;">Hello</span>');
  });

  test('a clrb pair sets the background colour', async () => {
    const evaluator = new TestDataHandler();
    const value = await pairOf(evaluator, stringValue('Hello'), stringValue('clrb#00ff00'));
    const result = await processRichDisplayContent(evaluator, value, 'rich_repl_display');
    expect(result).toBe('background-color:#00ff00;">Hello</span>');
  });

  test('an unknown colour type (neither t nor b) throws', async () => {
    const evaluator = new TestDataHandler();
    const value = await pairOf(evaluator, stringValue('Hello'), stringValue('clrx#ff0000'));
    await expect(processRichDisplayContent(evaluator, value, 'rich_repl_display')).rejects.toThrow(/Unknown colour type/);
  });

  test('an invalid hex colour throws', async () => {
    const evaluator = new TestDataHandler();
    const value = await pairOf(evaluator, stringValue('Hello'), stringValue('clrt#zzzzzz'));
    await expect(processRichDisplayContent(evaluator, value, 'rich_repl_display')).rejects.toThrow(/Invalid html colour/);
  });

  test('nested style pairs accumulate CSS outermost-first, base text last', async () => {
    const evaluator = new TestDataHandler();
    const inner = await pairOf(evaluator, stringValue('Hello World'), stringValue('underline'));
    const middle = await pairOf(evaluator, inner, stringValue('italic'));
    const outer = await pairOf(evaluator, middle, stringValue('clrt#0000ff'));

    const result = await processRichDisplayContent(evaluator, outer, 'rich_repl_display');
    expect(result).toBe('color:#0000ff;font-style:italic;text-decoration: underline;">Hello World</span>');
  });
});
