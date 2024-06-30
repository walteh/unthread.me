const DEFAULTS = {
	fontFamily: {
		monospace: '"SF Mono", SFMono-Regular, ui-monospace,"DejaVu Sans Mono", Menlo, Consolas, monospace',
		rounded: 'SFRounded, ui-rounded, "SF Pro Rounded", system-ui, "Helvetica Neue", Arial, Helvetica, sans-serif',
		sansserif: 'SF, ui-sans-serif, "SF Pro", system-ui, "Helvetica Neue", Arial, Helvetica, sans-serif',
	},
	fontWeight: {
		thin: "100",
		light: "300", // !!!
		normal: "400",
		medium: "500", // !!!
		semibold: "600",
		bold: "700",
		thicc: "750", // !!!
		heavy: "900",
		relative: {
			lighter: "lighter",
			bolder: "bolder",
		},
	},
} as const;

declare const window: Window;

const Layout = {
	window: {
		width: window.innerWidth,
		height: window.innerHeight,
	},
	header: {
		height: "5rem",
	},
	sideModal: {
		width: "40rem",
	},
	animation: "cubic-bezier(.34,.55,.06,.99)", // 'cubic-bezier(0.165, 0.84, 0.44, 1)', // 'cubic-bezier(.08,.44,.54,.98)'
	smallDeviceWidth: 820,
	borderRadius: {
		small: ".3rem",
		smallish: ".4rem",
		mediumish: ".85rem",
		mediumishish: "16px",

		medium: "1rem",
		largish: "1.5rem",
		large: "2rem",
	},
	boxShadow: {
		sample1: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
		sample2: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
		basic: "0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01)",
		basicInset:
			"inset 2px 6px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01)",

		medium: "2px 3px 5px rgba(102, 102, 102,0.2)",
		dark: "0 6px 10px rgba(102, 102, 102,0.4)",
		centerDark:
			"0 2px 6px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01)",

		prefix: "0 6px 10px",
		overlay: "2px 3px 5px rgba(0, 0, 0, 0.3)",
	},
	textShadow: {
		heavy: "0px 3px 3px rgba(0,0,0,0.4),0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1)",
		basic: "2px 3px 5px rgba(0,0,0,0.5)",
	},
	presets: {
		fontFamily: {
			rounded: {
				fontFamily: DEFAULTS.fontFamily.rounded,
				WebkitFontSmoothing: "antialiased",
			},
			// https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/
			// https://stackoverflow.com/a/64133415/18967032
			monospace: {
				fontFamily: DEFAULTS.fontFamily.monospace,
				WebkitFontSmoothing: "antialiased",
			},
		},
		font: {
			main: {
				thin: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.thin,
				},
				light: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.light,
				},
				normal: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.normal,
				},
				medium: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.medium,
				},
				regular: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.medium,
				},
				semibold: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.semibold,
				},
				bold: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.bold,
				},
				thicc: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.thicc,
				},
				heavy: {
					fontFamily: DEFAULTS.fontFamily.rounded,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.heavy,
				},
			},
			code: {
				thin: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.thin,
				},
				light: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.light,
				},
				normal: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.normal,
				},
				medium: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.medium,
				},
				regular: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.medium,
				},
				semibold: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.semibold,
				},
				bold: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.bold,
				},
				thicc: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.thicc,
				},
				heavy: {
					fontFamily: DEFAULTS.fontFamily.monospace,
					WebkitFontSmoothing: "antialiased",
					fontWeight: DEFAULTS.fontWeight.heavy,
				},
			},
		},
		weight: {
			thin: DEFAULTS.fontWeight.thin,
			normal: DEFAULTS.fontWeight.medium,
			bold: DEFAULTS.fontWeight.bold,
			heavy: DEFAULTS.fontWeight.heavy,
		},
		loadingText: {
			overflow: "hidden",
			zIndex: "1" /* Necessary for overflow: hidden to work correctly in Safari */,
			backgroundClip: "text",
			backgroundRepeat: "repeat",
			WebkitBackgoundClip: "text",
			WebkitTextFillColorss: "transparent",
			color: "transparent",
			animation: "loading-text 3s ease infinite",
			backgroundImage: `linear-gradient(90deg,#aaaaaa 0%,#d9d9d9 50%,#aaaaaa 100%)`,
			backgroundSize: "500% 100%",
		},
	},
} as const;

const NLStyleSheetCreator = <T extends NLStyleSheet>(arg: T): T => {
	return arg;
};

export type SimpleSizes = "small" | "medium" | "large" | "larger" | "smaller" | "largest";

export default { ...Layout, NLStyleSheetCreator, ...DEFAULTS };
