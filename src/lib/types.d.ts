type ApplyToChildren<T> = {
	[_ in string]: {
		[E in keyof T]: T[E];
	};
};

type ApplyFuncToChildren<T> = {
	[E in keyof T]: (fn?: (prev: T[E], cur: T[E]) => boolean) => T[E];
};

type AnyElementOf<T extends unknown[]> = T[number];

type NLStyleSheet = ApplyToChildren<React.CSSProperties>;

type Dictionary<T> = Record<string, T>;

type RecursiveRequired<T> = { [K in keyof T]: Required<T[K]> };

declare module "timeseries-analysis";
