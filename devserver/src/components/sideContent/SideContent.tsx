import { Card, Icon, Tab, type TabProps, Tabs } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import React from "react";
import type { SideContentTab } from "./types";

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
  dynamicTabs: SideContentTab[]

  selectedTabId: string
  alerts: string[]
  onChange?: (newId: string, oldId: string) => void
};

const renderTab = (
	tab: SideContentTab,
	shouldAlert: boolean,
	_editorWidth?: string,
	_sideContentHeight?: number
) => {
	const iconSize = 20;
	const tabTitle = (
		<Tooltip2 content={tab.label}>
			<div className={!shouldAlert ? "side-content-tooltip" : "side-content-tooltip side-content-tab-alert"}>
				<Icon icon={tab.iconName} iconSize={iconSize} />
			</div>
		</Tooltip2>
	);
	const tabProps: TabProps = {
		id: tab.id,
		title: tabTitle,
		// disabled: tab.disabled,
		className: "side-content-tab"
	};

	if (!tab.body) {
		return <Tab key={tab.id} {...tabProps} />;
	}

	// const tabBody: JSX.Element = workspaceLocation
	//   ? {
	//       ...tab.body,
	//       props: {
	//         ...tab.body.props,
	//         workspaceLocation,
	//         editorWidth,
	//         sideContentHeight
	//       }
	//     }
	//   : tab.body;
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
