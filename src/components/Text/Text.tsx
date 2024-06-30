import { animated, PickAnimated } from "@react-spring/web";
import React, { CSSProperties, FunctionComponent, ReactNode } from "react";

import lib from "@src/lib";

import styles from "./Text.styles";

export interface TextProps {
	children: string | string[] | ReactNode | ReactNode[];
	weight?: "light" | "regular" | "bold" | "bolder";
	size?: "smallest" | "smaller" | "small" | "medium" | "large" | "largerish" | "larger" | "largermax" | "largestish" | "largest";
	type?: "title" | "text" | "code";
	textStyle?: PickAnimated<CSSProperties>;
	loading?: boolean;
}

const TextRaw: FunctionComponent<TextProps> = ({
	// className,
	children,
	weight = "regular",
	size = "medium",
	type = "title",
	textStyle,
	loading = false,
}) => {
	const style = {
		userSelect: "none" as const,
		...styles[type],
		...styles[weight],
		...styles[size],
		...textStyle,
		...(loading ? lib.layout.presets.loadingText : {}),
	};
	return (
		<animated.div className={loading ? "loading-text" : undefined} style={style}>
			{children}
		</animated.div>
	);
};

const Text = React.memo(TextRaw);

export default Text;
