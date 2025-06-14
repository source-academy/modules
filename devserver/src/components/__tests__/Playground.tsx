import { userEvent, commands } from '@vitest/browser/context';
import { runInContext } from 'js-slang';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import Playground from '../Playground';
import * as importers from '../sideContent/importers/importers';
import '../../styles/index.scss';

declare module '@vitest/browser/context' {
  interface BrowserCommands {
    setLocalStorage: (key: string, value: string) => Promise<void>
  }
}

vi.mock(import('js-slang'), { spy: true });
vi.mock(import('../sideContent/importers/importers'), { spy: true });

describe('Playground tests', () => {
  beforeEach(async () => {
    await commands.setLocalStorage('editorValue', '');
  });

  const clickRunButton = (component: RenderResult) => {
    const runButton = component.getByRole('button', { name: 'run' });
    return userEvent.click(runButton);
  };

  test('Running js-slang by clicking the run button', async () => {
    const component = render(<Playground />);
    await clickRunButton(component);
    expect(runInContext).toHaveBeenCalled();
  });

  test('Loading tabs via Vite', async () => {
    await commands.setLocalStorage('editorValue', '0;');

    const component = render(<Playground />);

    await clickRunButton(component);
    expect(runInContext).toHaveBeenCalled();
    expect(importers.getDynamicTabs).toHaveBeenCalled();
  });

  test('Loading compiled tabs', async () => {
    await commands.setLocalStorage('editorValue', '0;');
    const component = render(<Playground />);

    const settingsButton = component.getByRole('button').filter({ hasText: /^$/ });
    await userEvent.click(settingsButton);

    const compiledTabsToggle = component.baseElement.getElementsByClassName('bp5-switch').item(0);
    await userEvent.click(compiledTabsToggle!);

    await userEvent.click(settingsButton);

    await clickRunButton(component);
    expect(runInContext).toHaveBeenCalled();
    expect(importers.getCompiledTabs).toHaveBeenCalled();
  });

  test('Multiple evaluations', async () => {
    const component = render(<Playground />);

    await commands.setLocalStorage('editorValue', 'delete this');
    await clickRunButton(component);

    const crossIcon = component.baseElement.getElementsByClassName('bp5-icon bp5-icon-cross').item(0);
    console.log(crossIcon);
    await userEvent.click(crossIcon!);

    const replCard = component.baseElement.getElementsByTagName('pre');
    console.log(replCard);

    await commands.setLocalStorage('editorValue', '0;');
    await clickRunButton(component);

    expect(runInContext).toHaveBeenCalledTimes(2);
  });
});
