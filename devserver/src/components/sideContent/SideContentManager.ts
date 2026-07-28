import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import type { SideContentTab } from './types';

type Listener = () => void;

type RegisteredTab = {
  tab: SideContentTab;
  visible: boolean;
};

export class TabService implements ITabService {
  private readonly listeners = new Set<Listener>();
  private readonly tabs = new Map<string, RegisteredTab>();
  private visibleTabs: SideContentTab[] = [];
  private previousSelectedTab?: string;

  registerTab(tab: Tab): void {
    const currentTab = this.tabs.get(tab.id);
    this.tabs.set(tab.id, {
      tab,
      visible: currentTab?.visible ?? false,
    });
    this.emit();
  }

  unregisterTab(id: string): void {
    if (!this.tabs.delete(id)) {
      return;
    }
    this.emit();
  }

  showTab(id: string): void {
    this.setTabVisibility(id, true);
    if (this.previousSelectedTab !== undefined && this.previousSelectedTab !== 'introduction') {
      return;
    }
    // store.dispatch(visitSideContent(id, previousSelectedTab, this.workspaceLocation));
  }

  hideTab(id: string): void {
    this.setTabVisibility(id, false);
  }

  clearTabs(): void {
    if (this.tabs.size === 0) {
      return;
    }
    this.tabs.clear();
    this.emit();
  }

  getTabs(): SideContentTab[] {
    return this.visibleTabs;
  }

  setWorkspaceLocation(): void {
    this.emit();
  }

  // An arrow-function property (not a method) so it has a stable `this`-bound identity that can be
  // passed directly to useSyncExternalStore - a plain method would need `.bind()` on every render
  // (a new function reference each time), causing needless unsubscribe/resubscribe churn.
  subscribe = (listener: Listener): () => void => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit(): void {
    this.visibleTabs = Array.from(this.tabs.values())
      .filter(({ visible }) => visible)
      .map(({ tab }) => tab);
    this.listeners.forEach(listener => listener());
  }

  private setTabVisibility(id: string, visible: boolean): void {
    const currentTab = this.tabs.get(id);
    if (!currentTab || currentTab.visible === visible) {
      return;
    }
    this.tabs.set(id, {
      ...currentTab,
      visible,
    });
    this.emit();
  }
}

const sideContentManager = new TabService();

export default sideContentManager;
