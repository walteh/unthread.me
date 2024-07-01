import React, { CSSProperties, FunctionComponent, PropsWithChildren, useMemo } from "react";

import Text, { TextProps } from "@src/components/Text/Text";
import useOnHover from "@src/hooks/useOnHover";
import lib from "@src/lib";

import styles from "./Button.styles";

export type ButtonProps = {
	onClick: React.MouseEventHandler<HTMLDivElement>;
	label?: string;
	buttonStyle?: CSSProperties;
	textStyle?: React.CSSProperties;
	RightIcon?: () => JSX.Element;
	LeftIcon?: () => JSX.Element;
	hoverStyle?: React.CSSProperties;
	hoverText?: string;
	disabled?: boolean;
	className?: string;
	isHovering?: (hover: boolean) => void;
	disableHoverAnimation?: boolean;
	bypassDisableStyle?: boolean;
} & Partial<TextProps>;

const ButtonRaw: FunctionComponent<PropsWithChildren<ButtonProps>> = ({
	onClick,
	label,
	buttonStyle,
	RightIcon,
	LeftIcon,
	disabled = false,
	isHovering,
	hoverText,
	hoverStyle,
	className,
	disableHoverAnimation = false,
	children,
	bypassDisableStyle,
	...textProps
}) => {
	const [ref, hover] = useOnHover(isHovering);

	const style = useMemo(() => {
		return {
			...styles.button,
			...(hover && !disableHoverAnimation && !disabled ? { filter: "brightness(.8)" } : {}),
			...(disabled && !bypassDisableStyle ? { opacity: "0.6" } : {}),
			// opacity: disabled && !bypassDisableStyle ? '0.3': '1',
			cursor: disabled && !bypassDisableStyle ? "not-allowed" : "pointer",
			position: "relative" as const,
			...buttonStyle,
			...(hover && !disableHoverAnimation && hoverStyle),
			transition: `all .3s ${lib.layout.animation}`,
		};
	}, [hover, disabled, buttonStyle, hoverStyle, bypassDisableStyle]);

	// const RightIcon = useCallback(() => rightIcon ?? null, [rightIcon]);

	// const LeftIcon = useCallback(() => leftIcon ?? null, [leftIcon]);

	return (
		<div className={className} aria-hidden="true" role="button" ref={ref} onClick={disabled ? undefined : onClick} style={style}>
			{LeftIcon && <LeftIcon />}
			{label ?? (hover && hoverText) ? <Text {...textProps}>{hover && hoverText ? hoverText : label}</Text> : null}
			{RightIcon && <RightIcon />}
			{children}
		</div>
	);
};

const Button = React.memo(ButtonRaw);

export default Button;
