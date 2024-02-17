/* eslint-disable new-cap */
import { HighlightRulesSelector, ModeSelector } from "js-slang/dist/editors/ace/modes/source";
import { Chapter, Variant } from "js-slang/dist/types";
import ace from "react-ace";

export const getModeString = () => `source${Chapter.SOURCE_4}${Variant.DEFAULT}${""}`;

/**
 * This _modifies global state_ and defines a new Ace mode globally, if it does not already exist.
 *
 * You can call this directly in render functions.
 */
export const selectMode = () => {
	const chapter = Chapter.SOURCE_4;
	const variant = Variant.DEFAULT;
	const library = "";

	if (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
		typeof ace.define.modules[`ace/mode/${getModeString(chapter, variant, library)}`]?.Mode
    === "function"
	) {
		return;
	}

	HighlightRulesSelector(chapter, variant, library);
	ModeSelector(chapter, variant, library);
};
