import { useMemo } from "react";

import useCacheStore from "@src/client/hooks/useCacheStore";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function DailyReportView() {
	const viewsToday = useCacheStore(
		(state) =>
			state.user_insights?.data?.views?.values.filter((v) => new Date(v.end_time).toDateString() === new Date().toDateString())[0],
	);
	const viewsYesterday = useCacheStore(
		(state) =>
			state.user_insights?.data?.views?.values.filter(
				(v) => new Date(v.end_time).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
			)[0],
	);
	// const viewsLastWeek = useCacheStore((state) => state.user_insights?.data?.views?.values[6]);

	const mem = useMemo(() => {
		if (!viewsToday || !viewsYesterday) {
			return [];
		}

		const change = Math.round(((viewsToday.value - viewsYesterday.value) / viewsYesterday.value) * 10000) / 100;

		const stats = [
			{ name: "Views", value: viewsToday.value, change: `${change}%`, changeType: change > 0 ? "positive" : "negative" },
			// { name: "Overdue invoices", value: "$12,787.00", change: "+54.02%", changeType: "negative" },
			// { name: "Outstanding invoices", value: "$245,988.00", change: "-1.39%", changeType: "positive" },
			// { name: "Expenses", value: "$30,156.00", change: "+10.18%", changeType: "negative" },
		];

		return stats;
	}, [viewsToday, viewsYesterday]);

	return (
		<dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
			{mem.map((stat) => (
				<div
					key={stat.name}
					className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white dark:bg-gray-900 px-4 py-10 sm:px-6 xl:px-8"
				>
					<dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
					<dd className={classNames(stat.changeType === "negative" ? "text-rose-600" : "text-gray-700", "text-xs font-medium")}>
						{stat.change}
					</dd>
					<dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900 dark:text-white">
						{stat.value}
					</dd>
				</div>
			))}
		</dl>
	);
}
