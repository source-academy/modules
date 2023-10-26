import { Classes, Intent, OverlayToaster, type ToastProps, type Toaster } from "@blueprintjs/core";
import classNames from "classnames";
import { Chapter, Variant } from "js-slang/dist/types";
import { stringify } from "js-slang/dist/utils/stringify";
import React, { useCallback } from "react";
import { HotKeys } from "react-hotkeys";

import Workspace, { type WorkspaceProps } from "./Workspace";
import { ControlBarRunButton } from "./controlBar/ControlBarRunButton";
import { type Context, runInContext, getNames, SourceDocumentation } from "js-slang";

// Importing this straight from js-slang doesn't work for whatever reason
import createContext from "js-slang/dist/createContext";

import { getDynamicTabs } from "./sideContent/utils";
import type { SideContentTab } from "./sideContent/types";
import testTabContent from "./sideContent/TestTab";
import { ControlBarClearButton } from "./controlBar/ControlBarClearButton";
import { ControlBarRefreshButton } from "./controlBar/ControlBarRefreshButton";
import type { InterpreterOutput } from "../types";
import mockModuleContext from "../mockModuleContext";

const refreshSuccessToast: ToastProps = {
	intent: Intent.SUCCESS,
	message: "Refresh Successful!"
};

const errorToast: ToastProps = {
	intent: Intent.DANGER,
	message: "An error occurred!"
};

const evalSuccessToast: ToastProps = {
	intent: Intent.SUCCESS,
	message: "Code evaluated successfully!"
};

const createContextHelper = () => {
	const tempContext = createContext(Chapter.SOURCE_4, Variant.DEFAULT);
	return tempContext;
};

const Playground: React.FC<{}> = () => {
	const [dynamicTabs, setDynamicTabs] = React.useState<SideContentTab[]>([]);
	const [selectedTabId, setSelectedTab] = React.useState(testTabContent.id);
	const [codeContext, setCodeContext] = React.useState<Context>(createContextHelper());
	const [editorValue, setEditorValue] = React.useState(localStorage.getItem("editorValue") ?? "");
	const [replOutput, setReplOutput] = React.useState<InterpreterOutput | null>(null);
	const [alerts, setAlerts] = React.useState<string[]>([]);

	const toaster = React.useRef<Toaster | null>(null);

	const showToast = (props: ToastProps) => {
		if (toaster.current) {
			toaster.current.show({
				...props,
				timeout: 1500
			});
		}
	};

	const getAutoComplete = useCallback((row: number, col: number, callback: any) => {
		getNames(editorValue, row, col, codeContext)
			.then(([editorNames, displaySuggestions]) => {
				if (!displaySuggestions) {
					callback();
					return;
				}

				const editorSuggestions = editorNames.map((editorName: any) => ({
					...editorName,
					caption: editorName.name,
					value: editorName.name,
					score: editorName.score ? editorName.score + 1000 : 1000,
					name: undefined
				}));

				const builtins: Record<string, any> = SourceDocumentation.builtins[Chapter.SOURCE_4];
				const builtinSuggestions = Object.entries(builtins)
					.map(([builtin, thing]) => ({
						...thing,
						caption: builtin,
						value: builtin,
						score: 100,
						name: builtin,
						docHTML: thing.description
					}));

				callback(null, [
					...builtinSuggestions,
					...editorSuggestions
				]);
			});
	}, [editorValue, codeContext]);

	const loadTabs = () => getDynamicTabs(codeContext)
		.then((tabs) => {
			setDynamicTabs(tabs);

			const newIds = tabs.map(({ id }) => id);
			// If the currently selected tab no longer exists,
			// switch to the default test tab
			if (!newIds.includes(selectedTabId)) {
				setSelectedTab(testTabContent.id);
			}
			setAlerts(newIds);
		})
		.catch((error) => {
			showToast(errorToast);
			console.log(error);
		});

	const evalCode = () => {
		codeContext.errors = [];
		// eslint-disable-next-line no-multi-assign
		codeContext.moduleContexts = mockModuleContext.moduleContexts = {};

		runInContext(editorValue, codeContext)
			.then((result) => {
				if (codeContext.errors.length > 0) {
					showToast(errorToast);
				} else {
					loadTabs()
						.then(() => showToast(evalSuccessToast));
				}

				// TODO: Add support for console.log?
				if (result.status === "finished") {
					setReplOutput({
						type: "result",
						// code: editorValue,
						consoleLogs: [],
						value: stringify(result.value)
					});
				} else if (result.status === "error") {
					setReplOutput({
						type: "errors",
						errors: codeContext.errors,
						consoleLogs: []
					});
				}
			});
	};

	const resetEditor = () => {
		setCodeContext(createContextHelper());
		setEditorValue("");
		localStorage.setItem("editorValue", "");
		setDynamicTabs([]);
		setSelectedTab(testTabContent.id);
		setReplOutput(null);
	};

	const onRefresh = () => {
		loadTabs()
			.then(() => showToast(refreshSuccessToast))
			.catch(() => showToast(errorToast));
	};

	const workspaceProps: WorkspaceProps = {
		controlBarProps: {
			editorButtons: [
				<ControlBarRunButton handleEditorEval={evalCode} key="eval" />,
				<ControlBarClearButton onClick={resetEditor}
					key="clear"
				/>,
				<ControlBarRefreshButton
					onClick={onRefresh}
					key="refresh"
				/>
			]
		},
		replProps: {
			output: replOutput
		},
		handlePromptAutocomplete: getAutoComplete,
		handleEditorEval: evalCode,
		handleEditorValueChange(newValue) {
			setEditorValue(newValue);
			localStorage.setItem("editorValue", newValue);
		},
		editorValue,
		sideContentProps: {
			dynamicTabs: [testTabContent, ...dynamicTabs],
			selectedTabId,
			onChange: useCallback((newId: string) => {
				setSelectedTab(newId);
				setAlerts(alerts.filter((id) => id !== newId));
			}, [alerts]),
			alerts
		}
	};

	return (
		<HotKeys
			className={classNames("Playground", Classes.DARK)}
		>
			<OverlayToaster ref={toaster} />
			<Workspace {...workspaceProps} />
		</HotKeys>
	);
};

export default Playground;
