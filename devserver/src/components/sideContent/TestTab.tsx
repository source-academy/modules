import { IconNames } from "@blueprintjs/icons";
import type { SideContentTab } from "./types";

const TestTab = () => <div style={{
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	marginBottom: "5px"
}}>
	<h2>Source Academy Tab Development Server</h2>
	<p style={{
	}}>
    Run some code that imports modules in the editor on the left. You should see the corresponding module tab spawn.<br />
    Whenever you make changes to the tab, the server should automatically reload and show the changes that you've made <br />
    If that does not happen, you can click the refresh button to manually reload tabs
	</p>
</div>;

const testTabContent: SideContentTab = {
	id: "test",
	label: "Welcome to the tab development server!",
	iconName: IconNames.LabTest,
	body: <TestTab/ >
};

export default testTabContent;
