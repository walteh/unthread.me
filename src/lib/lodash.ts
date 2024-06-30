/* eslint-disable */

const freeGlobal = typeof global === "object" && global !== null && global.Object === Object && global;

const freeGlobalThis = typeof globalThis === "object" && globalThis !== null && globalThis.Object == Object && globalThis;

/** Detect free variable `self`. */
const freeSelf = typeof self === "object" && self !== null && self.Object === Object && self;

/** Used as a reference to the global object. */
const root = freeGlobalThis || freeGlobal || freeSelf || Function("return this")();

interface DebounceSettings {
	/**
	 * @see _.leading
	 */
	leading?: boolean | undefined;
	/**
	 * @see _.maxWait
	 */
	maxWait?: number | undefined;
	/**
	 * @see _.trailing
	 */
	trailing?: boolean | undefined;
}
interface DebouncedFunc<T extends () => void> {
	/**
	 * Call the original function, but applying the debounce rules.
	 *
	 * If the debounced function can be run immediately, this calls it and returns its return
	 * value.
	 *
	 * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
	 * function was not invoked yet.
	 */
	(...args: Parameters<T>): ReturnType<T> | undefined;

	/**
	 * Throw away any pending invocation of the debounced function.
	 */
	cancel(): void;

	/**
	 * If there is a pending invocation of the debounced function, invoke it immediately and return
	 * its return value.
	 *
	 * Otherwise, return the value from the last invocation, or undefined if the debounced function
	 * was never invoked.
	 */
	flush(): ReturnType<T> | undefined;
}

const debounce = <T extends () => void>(func: T, wait: number, options: DebounceSettings): DebouncedFunc<T> => {
	let lastArgs: any[] | undefined;
	let lastThis: undefined;
	let maxWait: number | undefined;
	let result: unknown;
	let timerId: undefined;
	let lastCallTime: number | undefined;

	let lastInvokeTime = 0;
	let leading = false;
	let maxing = false;
	let trailing = true;

	// Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
	const useRAF = !wait && wait !== 0 && typeof root.requestAnimationFrame === "function";

	if (typeof func !== "function") {
		throw new TypeError("Expected a function");
	}
	wait = +wait || 0;
	leading = !!options.leading;
	maxing = "maxWait" in options;
	maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait;
	trailing = "trailing" in options ? !!options.trailing : trailing;

	function invokeFunc(time: number) {
		// const args = lastArgs;
		const thisArg = lastThis;

		lastArgs = lastThis = undefined;
		lastInvokeTime = time;
		result = func.apply(thisArg);
		return result;
	}

	function startTimer(pendingFunc: { (): any; (): any; (): any; (): any; (): void }, wait: number | undefined) {
		if (useRAF) {
			root.cancelAnimationFrame(timerId);
			return root.requestAnimationFrame(pendingFunc);
		}
		return setTimeout(pendingFunc, wait);
	}

	function cancelTimer(id: NodeJS.Timeout) {
		if (useRAF) {
			return root.cancelAnimationFrame(id);
		}
		clearTimeout(id);
	}

	function leadingEdge(time: number) {
		// Reset any `maxWait` timer.
		lastInvokeTime = time;
		// Start the timer for the trailing edge.
		timerId = startTimer(timerExpired, wait);
		// Invoke the leading edge.
		return leading ? invokeFunc(time) : result;
	}

	function remainingWait(time: number) {
		const timeSinceLastCall = time - (lastCallTime ?? 0);
		const timeSinceLastInvoke = time - lastInvokeTime;
		const timeWaiting = wait - timeSinceLastCall;

		return maxing ? Math.min(timeWaiting, (maxWait ?? 0) - timeSinceLastInvoke) : timeWaiting;
	}

	function shouldInvoke(time: number) {
		const timeSinceLastCall = time - (lastCallTime ?? 0);
		const timeSinceLastInvoke = time - lastInvokeTime;

		// Either this is the first call, activity has stopped and we're at the
		// trailing edge, the system time has gone backwards and we're treating
		// it as the trailing edge, or we've hit the `maxWait` limit.
		return (
			lastCallTime === undefined ||
			timeSinceLastCall >= wait ||
			timeSinceLastCall < 0 ||
			(maxing && timeSinceLastInvoke >= (maxWait ?? 0))
		);
	}

	function timerExpired() {
		const time = Date.now();
		if (shouldInvoke(time)) {
			return trailingEdge(time);
		}
		// Restart the timer.
		timerId = startTimer(timerExpired, remainingWait(time));
	}

	function trailingEdge(time: number) {
		timerId = undefined;

		// Only invoke if we have `lastArgs` which means `func` has been
		// debounced at least once.
		if (trailing && lastArgs) {
			return invokeFunc(time);
		}
		lastArgs = lastThis = undefined;
		return result;
	}

	function cancel() {
		if (timerId !== undefined) {
			cancelTimer(timerId);
		}
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = timerId = undefined;
	}

	function flush() {
		return timerId === undefined ? result : trailingEdge(Date.now());
	}

	function pending() {
		return timerId !== undefined;
	}

	function debounced(this: any, ...args: any[]) {
		const time = Date.now();
		const isInvoking = shouldInvoke(time);

		lastArgs = args;
		lastThis = this;
		lastCallTime = time;

		if (isInvoking) {
			if (timerId === undefined) {
				return leadingEdge(lastCallTime);
			}
			if (maxing) {
				// Handle invocations in a tight loop.
				timerId = startTimer(timerExpired, wait);
				return invokeFunc(lastCallTime);
			}
		}
		if (timerId === undefined) {
			timerId = startTimer(timerExpired, wait);
		}
		return result;
	}
	debounced.cancel = cancel;
	debounced.flush = flush;
	debounced.pending = pending;

	// @ts-ignore
	return debounced;
};

const throttle = <T extends () => void>(func: T, wait: number): DebouncedFunc<T> => {
	const leading = true;
	const trailing = true;

	if (typeof func !== "function") {
		throw new TypeError("Expected a function");
	}

	return debounce(func, wait, {
		leading,
		trailing,
		maxWait: wait,
	});
};

export default { throttle };
