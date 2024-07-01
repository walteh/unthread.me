import { animated, PickAnimated } from "@react-spring/web";
import React, { FunctionComponent } from "react";

import Text, { TextProps } from "@src/components/Text/Text";
import lib from "@src/lib";

type Props = {
	basic?: boolean;
	text: string;
	containerStyles?: PickAnimated<React.CSSProperties>;
	leftDotColor?: string;
} & Partial<TextProps>;

const LabelRaw: FunctionComponent<Props> = ({ basic = false, text, containerStyles = {}, leftDotColor, textStyle, ...props }) => {
	return (
		<animated.div
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "0.3em 0.5em",
				borderRadius: lib.layout.borderRadius.large,
				background: lib.colors.transparentWhite,
				alignItems: "center",
				...(basic
					? {
							background: "none #ffffff",
							border: "4px solid rgba(34, 36, 38, 0.35)",
							color: "rgba(0, 0, 0, 0.87)",
							boxShadow: "none",
						}
					: {}),
				...containerStyles,
			}}
		>
			{leftDotColor && (
				<div
					style={{
						width: ".4rem",
						height: ".4rem",
						background: leftDotColor,
						marginRight: ".3rem",
						borderRadius: lib.layout.borderRadius.large,
					}}
				/>
			)}
			<Text
				textStyle={{
					...(!props.size && { fontSize: ".7rem" }),
					verticalAlign: "center",
					...textStyle,
				}}
				{...props}
			>
				{text}
			</Text>
		</animated.div>
	);
};

const Label = React.memo(LabelRaw);

export default Label;
