import { runInContext } from 'js-slang';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import { render, type RenderResult } from 'vitest-browser-react';
import Playground from '../Playground';
import * as importers from '../sideContent/importers/importers';
import '../../styles/index.scss';

declare module 'vitest/browser' {
  interface BrowserCommands {
    setLocalStorage: (key: string, value: string) => Promise<void>;
  }
}

vi.mock(import('js-slang'), { spy: true });
vi.mock(import('../sideContent/importers/importers'), { spy: true });

describe('Playground tests', () => {
  beforeEach(async () => {
    await commands.setLocalStorage('editorValue', '');
  });

  function clickRunButton(component: RenderResult) {
    const runButton = component.getByRole('button', { name: 'run' });
    return userEvent.click(runButton);
  }

  test('Running js-slang by clicking the run button', async () => {
    const component = await render(<Playground />);
    await clickRunButton(component);
    await expect.poll(() => runInContext).toHaveBeenCalled();
  });

  test('Loading tabs via Vite', async () => {
    await commands.setLocalStorage('editorValue', '0;');

    const component = await render(<Playground />);

    await clickRunButton(component);
    await expect.poll(() => runInContext).toHaveBeenCalled();
    expect(importers.getDynamicTabs).toHaveBeenCalled();
  });

  test('Loading compiled tabs', async () => {
    await commands.setLocalStorage('editorValue', '0;');
    const component = await render(<Playground />);

    const settingsButton = component.getByRole('button').filter({ hasText: /^$/ });
    await userEvent.click(settingsButton);

    const compiledTabsToggle = component.baseElement.getElementsByClassName('bp6-switch').item(0);
    expect(compiledTabsToggle).not.toBeNull();
    await userEvent.click(compiledTabsToggle!);

    await userEvent.click(settingsButton);

    await clickRunButton(component);
    await expect.poll(() => runInContext).toHaveBeenCalled();
    expect(importers.getCompiledTabs).toHaveBeenCalled();
  });
});
