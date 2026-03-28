import { Card, Icon, Tab, Tabs, Tooltip, type IconName, type TabProps } from '@blueprintjs/core';
import React from 'react';
import type { SideContentTab } from './types';

/**
 * @property onChange A function that is called whenever the
 * active tab is changed by the user.
 *
 * @property tabs An array of SideContentTabs.
 *  The tabs will be rendered in order of the array.
 *  If this array is empty, no tabs will be rendered.
 *
 * @property renderActiveTabPanelOnly Set this property to
 * true to enable unmounting of tab panels whenever tabs are
 * switched. If it is left undefined, the value will default
 * to false, and the tab panels will all be loaded with the
 * mounting of the SideContent component. Switching tabs
 * will merely hide them from view.
 */
export type SideContentProps = {
  renderActiveTabPanelOnly?: boolean;
  editorWidth?: string;
  sideContentHeight?: number;
  dynamicTabs: SideContentTab[];

  selectedTabId: string;
  alerts: string[];
  onChange?: (newId: string, oldId: string) => void;
};

interface TabIconProps {
  iconName: IconName;
  tooltip: string;
  shouldAlert?: boolean;
}

function TabIcon({ iconName, tooltip, shouldAlert }: TabIconProps) {
  return <Tooltip content={tooltip}>
    <div className={!shouldAlert ? 'side-content-tooltip' : 'side-content-tooltip side-content-tab-alert'}>
      <Icon icon={iconName} size={20} />
    </div>
  </Tooltip>;
}

const renderTab = (
  tab: SideContentTab,
  shouldAlert: boolean,
  _editorWidth?: string,
  _sideContentHeight?: number
) => {
  const tabProps: TabProps = {
    id: tab.id,
    title: <TabIcon iconName={tab.iconName} tooltip={tab.label} shouldAlert={shouldAlert} />,
    // disabled: tab.disabled,
    className: 'side-content-tab'
  };

  if (!tab.body) {
    return <Tab key={tab.id} {...tabProps} />;
  }

  const tabPanel: React.JSX.Element = <div className="side-content-text">{tab.body}</div>;

  return <Tab key={tab.id} {...tabProps} panel={tabPanel} />;
};

const SideContent: React.FC<SideContentProps> = ({
  renderActiveTabPanelOnly,
  editorWidth,
  sideContentHeight,
  dynamicTabs,
  selectedTabId,
  onChange,
  alerts
}) => (
  <div className="side-content">
    <Card>
      <div className="side-content-tabs">
        <Tabs
          id="side-content-tabs"
          renderActiveTabPanelOnly={renderActiveTabPanelOnly}
          selectedTabId={selectedTabId}
          onChange={(newId: string, oldId: string) => {
            if (onChange) onChange(newId, oldId);
          }}
        >
          {dynamicTabs.map((tab) => renderTab(tab, alerts.includes(tab.id), editorWidth, sideContentHeight))}
        </Tabs>
      </div>
    </Card>
  </div>
);

export default SideContent;
