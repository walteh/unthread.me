import { useCallback, useMemo } from "react";

import { useInMemoryStore } from "@src/threadsapi/store";
import { TimePeriod, TimePeriodLabel } from "@src/threadsapi/types";

// const timePeriods: TimePeriod[] = ["last7days", "last30days", "last90days"];

const GLOBAL_START_DATE = new Date("2024-04-13");

function getFilteredData<T>(values: T[], date_func: (value: T) => string, timePeriod: TimePeriod) {
	return values.filter(
		(value) => new Date(date_func(value)) >= timePeriod.start_date && new Date(date_func(value)) <= timePeriod.end_date,
	);
}

function getCountPerDay<T>(threads: T[], time_func: (value: T) => string, value_func: (value: T) => number, time_period: TimePeriod) {
	const threadCountPerDay: { end_date: string; count: number }[] = [];

	// Initialize an object to hold the counts per day
	const countMap: Record<string, number> = {};

	// Populate the countMap with thread counts
	threads.forEach((thread) => {
		const date = new Date(time_func(thread)).toLocaleDateString();
		if (!countMap[date]) {
			countMap[date] = value_func(thread);
		} else {
			countMap[date] += value_func(thread);
		}
	});

	// Fill in the threadCountPerDay array with all dates in the range
	for (let d = new Date(time_period.start_date); d <= time_period.end_date; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toLocaleDateString();
		threadCountPerDay.push({ end_date: dateStr, count: countMap[dateStr] || 0 });
	}

	return threadCountPerDay;
}

const getCurrentTimePeriods = (): Record<TimePeriodLabel, TimePeriod> => {
	const availableMonths = [];
	const currentMonth = new Date();

	while (currentMonth > GLOBAL_START_DATE) {
		availableMonths.push(currentMonth.toISOString().slice(0, 7));
		currentMonth.setMonth(currentMonth.getMonth() - 1);
	}

	const monthPeriods = availableMonths.map((month) => {
		const date = new Date(month + "-11"); // Use the first day of the month to avoid date parsing issues
		const label = date.toLocaleDateString("default", { year: "numeric", month: "long" }) as TimePeriodLabel;
		const start_date = new Date(date.getFullYear(), date.getMonth(), 1);
		const end_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		return { label, start_date, end_date };
	});

	const today = new Date();
	const last7days = {
		label: "last7days" as TimePeriodLabel,
		start_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
		end_date: today,
	};
	const last30days = {
		label: "last30days" as TimePeriodLabel,
		start_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
		end_date: today,
	};
	const last90days = {
		label: "last90days" as TimePeriodLabel,
		start_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90),
		end_date: today,
	};

	return {
		last7days, // "last7days" as TimePeriodLabel,
		last30days,
		last90days,
		...Object.fromEntries(monthPeriods.map((period) => [period.label, period])),
	};
};

export const useTimePeriodListOfDays = (period: TimePeriod): string[] => {
	return useMemo(() => {
		const days = [];
		for (let d = new Date(period.start_date); d <= period.end_date; d.setDate(d.getDate() + 1)) {
			days.push(new Date(d).toISOString().slice(0, 10));
		}
		return days;
	}, [period]);
};

export const useTimePeriodListOfMonths = (period: TimePeriod): string[] => {
	return useMemo(() => {
		const months = [];
		for (let d = new Date(period.start_date); d <= period.end_date; d.setMonth(d.getMonth() + 1)) {
			months.push(d.toISOString().slice(0, 7));
		}
		return months;
	}, [period]);
};

export const useTimePeriodCountPerDay = <T>(
	threads: T[],
	time_func: (value: T) => string,
	value_func: (value: T) => number,
	time_period: TimePeriod,
) => {
	return useMemo(() => {
		return getCountPerDay(threads, time_func, value_func, time_period);
	}, [threads, time_period, value_func, time_func]);
};

export const useTimePeriodFilteredData = <T>(values: T[], date_func: (value: T) => string, timePeriod: TimePeriod) => {
	return useMemo(() => {
		return getFilteredData(values, date_func, timePeriod);
	}, [values, date_func, timePeriod]);
};

const useTimePeriod = () => {
	const [rawTimePeriod, setRawTimePeriod] = useInMemoryStore((state) => [state.time_period_label, state.updateTimePeriodLabel]);

	// grab all the months from the start date to the current date
	const periods = useMemo(() => {
		return getCurrentTimePeriods();
	}, []);

	const timePeriod = useMemo(() => {
		return periods[rawTimePeriod];
	}, [rawTimePeriod, periods]);

	const handleTimePeriodChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setRawTimePeriod(e.target.value as TimePeriodLabel);
		},
		[setRawTimePeriod],
	);

	return [timePeriod, periods, handleTimePeriodChange] as const;
};

export default useTimePeriod;
