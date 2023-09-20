/**
 * Dynamically returns the dimensions (width & height) of an HTML element, updating whenever the
 * element is loaded or resized.
 *
 * @param ref A reference to the underlying HTML element.
 */

import React, { type RefObject } from "react";

export const useDimensions = (ref: RefObject<HTMLElement>): [width: number, height: number] => {
	const [width, setWidth] = React.useState<number>(0);
	const [height, setHeight] = React.useState<number>(0);

	const resizeObserver = React.useMemo(
		() => new ResizeObserver((entries: ResizeObserverEntry[], _observer: ResizeObserver) => {
			if (entries.length !== 1) {
				throw new Error(
					"Expected only a single HTML element to be observed by the ResizeObserver."
				);
			}
			const contentRect = entries[0].contentRect;
			setWidth(contentRect.width);
			setHeight(contentRect.height);
		}),
		[]
	);

	React.useEffect(() => {
		const htmlElement = ref.current;
		if (htmlElement === null) {
			return undefined;
		}
		resizeObserver.observe(htmlElement);
		return () => {
			resizeObserver.disconnect();
		};
	}, [ref, resizeObserver]);

	return [width, height];
};
