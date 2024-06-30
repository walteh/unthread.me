import { animated, config, useSpring, useTransition } from "@react-spring/web";
import React, { CSSProperties, NamedExoticComponent, useEffect, useState } from "react";

import { useDarkMode } from "@src/client/hooks/useDarkMode";
import useDimensions from "@src/client/hooks/useDimensions";
import Text from "@src/components/Text/Text";
import useMeasure from "@src/hooks/useMeasure";
import lib from "@src/lib";

import styles from "./HappyTabber.styles";

export interface HappyTabberItem {
	label: string;
	comp: NamedExoticComponent<unknown> | (() => JSX.Element | null);
	labelStyle?: CSSProperties;
	bodyStyle?: CSSProperties;
}

interface Props {
	items: HappyTabberItem[];
	defaultActiveIndex?: number;
	// containerStyle?: CSSProperties;
	bodyStyle?: CSSProperties;
	wrapperStyle?: CSSProperties;
	headerTextStyle?: CSSProperties;
	selectionIndicatorStyle?: CSSProperties;
	headerContainerStyle?: CSSProperties;
	disableTransition?: boolean;
}

// const WIDTH = 350;

const HappyTabberRaw = ({
	items,
	defaultActiveIndex = 0,
	// containerStyle,
	disableTransition = false,
	bodyStyle,
	wrapperStyle,
	headerTextStyle,
	selectionIndicatorStyle,
	headerContainerStyle,
}: Props) => {
	const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
	useEffect(() => {
		if (activeIndex >= items.length) {
			setActiveIndex(defaultActiveIndex);
		}
		return () => undefined;
	}, [items, activeIndex]);

	const [screenType] = useDimensions();

	const [headerRef, { width: WIDTH }] = useMeasure();

	const selectionIndicatorSpring = useSpring({
		from: { x: 0, opacity: 1, ...styles.selectionIndicator, ...selectionIndicatorStyle },
		to: {
			opacity: 1,
			x: activeIndex * (WIDTH / items.length),
		},
		config: config.default,
	});

	const Item = React.useMemo(() => {
		return items[activeIndex]?.comp;
	}, [items, activeIndex]);

	const tabFadeTransition = useTransition(Item, {
		from: {
			padding: "inherit",
			opacity: 0,
			// position: "absolute",
			height: "100%",
			width: "100%",
			display: "flex",
		},
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: config.default,
	});

	const darkmode = useDarkMode();

	return (
		<div
			style={{
				...styles.wrapperContainer,
				// ...(screenType === 'phone' && { overflow: 'scroll' }),
				minWidth: screenType === "phone" ? "100%" : `${WIDTH}px`,
				...wrapperStyle,
			}}
		>
			{items.length > 1 && (
				<div
					ref={headerRef}
					style={{
						...styles.header,
						...(screenType === "phone" ? { paddingTop: ".5rem" } : { paddingBottom: ".5rem" }),
						width: "100%",
						...headerContainerStyle,
					}}
				>
					<animated.div
						style={{
							width: `${(WIDTH - 8) / items.length}px`,
							boxShadow: lib.layout.boxShadow.medium,
							...selectionIndicatorSpring,
							...(darkmode ? { background: lib.colors.mainBlueTransparent } : {}),
						}}
					/>
					{items.map((item, index) => (
						<div
							key={`item-${item.label}`}
							style={{
								width: `${WIDTH / items.length}px`,
								...styles.headerTextContainer,
							}}
							aria-hidden="true"
							role="button"
							onClick={() => {
								setActiveIndex(index);
							}}
						>
							<Text
								textStyle={{
									...headerTextStyle,
									...(index === activeIndex
										? styles.headerTextBold
										: screenType === "phone"
											? styles.headerTextMobile
											: styles.headerText),
									...item.labelStyle,
								}}
							>
								{item.label}
							</Text>
						</div>
					))}
				</div>
			)}
			<div style={{ ...styles.body, ...items[activeIndex]?.bodyStyle, ...bodyStyle }}>
				{disableTransition ? (
					// @ts-expect-error - this is a hack to get around the fact that the types are not correct
					<Item isActive />
				) : (
					tabFadeTransition((_styles, ItemComp) => (
						// @ts-expect-error - this is a hack to get around the fact that the types are not correct
						<animated.div style={_styles}>{<ItemComp isActive />}</animated.div>
					))
				)}
			</div>
		</div>
	);
};

const HappyTabber = React.memo(HappyTabberRaw);

export default HappyTabber;
