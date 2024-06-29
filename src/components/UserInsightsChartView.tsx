import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
import useTimePeriod, { useTimePeriodCountPerDay, useTimePeriodFilteredData, useTimePeriodListOfDays } from "@src/hooks/useTimePeriod";
import { ThreadMedia } from "@src/threadsapi/api";
import { useUserDataStore } from "@src/threadsapi/store";

const UserInsightChartView: FC = () => {
	const data = useUserDataStore((state) => state.user_insights);
	const threads = useUserDataStore((state) => state.user_threads);

	if (!data || !threads) return null;

	if (data.is_loading || threads.is_loading) return <Loader />;
	if (data.error) return <ErrorMessage message={data.error} />;
	if (!data.data || !threads.data) return <ErrorMessage message="No insights data available" />;

	if (!data.data.views) return <ErrorMessage message="No views data available" />;

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold text-center mb-8">Profile Views</h1>
			<ObservedChart views={data.data.views.values} threads={threads.data.data} />
		</div>
	);
};

const ObservedChart: FC<{ views: { end_time: string; value: number }[]; threads: ThreadMedia[] }> = ({ views, threads }) => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);

	// const likes = useUserLikesByDay();
	// const threadViews = useUserThreadViewsByDay();

	const [timePeriod] = useTimePeriod();

	const viewByTimePeriod = useTimePeriodFilteredData(views, (value) => value.end_time, timePeriod);

	const threadsByTimePeriod = useTimePeriodFilteredData(threads, (thread) => thread.timestamp, timePeriod);

	// const currentValues = getFilteredData(allValues);

	// Filter threads based on the selected time period
	// function getFilteredThreads<T extends { timestamp: string }>(threads: T[]) {
	// 	if (timePeriod === "last7days") {
	// 		const last7Days = new Date();
	// 		last7Days.setDate(last7Days.getDate() - 7);
	// 		return threads.filter((thread) => new Date(thread.timestamp) > last7Days);
	// 	} else if (timePeriod === "last30days") {
	// 		const last30Days = new Date();
	// 		last30Days.setDate(last30Days.getDate() - 30);
	// 		return threads.filter((thread) => new Date(thread.timestamp) > last30Days);
	// 	} else {
	// 		const month = timePeriod;
	// 		return threads.filter((thread) => new Date(thread.timestamp).toISOString().slice(0, 7) === month);
	// 	}
	// }

	// function getTotalPerDay(threads: { timestamp: string; total_value: number }[], startDate: Date, endDate: Date) {
	// 	const threadCountPerDay: { end_date: string; count: number }[] = [];

	// 	// Initialize an object to hold the counts per day
	// 	const countMap: Record<string, number> = {};

	// 	// Populate the countMap with thread counts
	// 	threads.forEach((thread) => {
	// 		const date = new Date(thread.timestamp).toLocaleDateString();
	// 		if (!countMap[date]) {
	// 			countMap[date] = thread.total_value;
	// 		} else {
	// 			countMap[date] += thread.total_value;
	// 		}
	// 	});

	// 	// Fill in the threadCountPerDay array with all dates in the range
	// 	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
	// 		const dateStr = d.toLocaleDateString();
	// 		threadCountPerDay.push({ end_date: dateStr, count: countMap[dateStr] || 0 });
	// 	}

	// 	return threadCountPerDay;
	// }

	// getTotalPerDay;

	const viewCountPerDay = useTimePeriodCountPerDay(
		viewByTimePeriod,
		(value) => value.end_time,
		(value) => value.value,
		timePeriod,
	);

	const threadCountPerDay = useTimePeriodCountPerDay(
		threadsByTimePeriod,
		(thread) => thread.timestamp,
		() => 1,
		timePeriod,
	);

	const currentDays = useTimePeriodListOfDays(timePeriod);

	// const currentLikes = getTotalPerDay(
	// 	getFilteredThreads(likes),
	// 	new Date(currentValues[0].end_time),
	// 	new Date(currentValues[currentValues.length - 1].end_time),
	// );

	// const currentThreadViews = getTotalPerDay(
	// 	getFilteredThreads(threadViews),
	// 	new Date(currentValues[0].end_time),
	// 	new Date(currentValues[currentValues.length - 1].end_time),
	// );

	const Chart = useMemo(() => {
		const opts: ApexOptions = {
			chart: {
				type: "area",
				fontFamily: "Inter, sans-serif",
				dropShadow: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
			},
			tooltip: {
				x: {
					format: "dd MMM yyyy",
				},
				y: [
					{
						formatter: (val) => `${val.toLocaleString()} views`,
					},
					{
						formatter: (val) => `${val.toLocaleString()} posts`,
					},
					// {
					// 	formatter: (val) => `${val.toLocaleString()} likes`,
					// },
					// {
					// 	formatter: (val) => `${val.toLocaleString()} thread views`,
					// },
				],
			},
			yaxis: [
				{
					labels: {
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", { notation: "compact" });
							return formatter.format(val);
						},
					},
				},
				{
					opposite: true,
					labels: {
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", { notation: "compact" });
							return formatter.format(val);
						},
					},
				},
				// {
				// 	opposite: true,
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 	},
				// },
				// {
				// 	opposite: true,
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 	},
				// },
			],
			xaxis: {
				categories: currentDays.map((value) => new Date(value).toLocaleDateString()),
				labels: {
					show: true,
					rotate: -45,
					style: {
						fontSize: "12px",
						fontFamily: "Inter, sans-serif",
						colors: "#9aa0ac",
					},
				},
				axisBorder: {
					show: false,
				},
				axisTicks: {
					show: false,
				},
			},
			grid: {
				show: true,
				strokeDashArray: 4,
				padding: {
					left: 2,
					right: 2,
					top: 0,
				},
			},
			stroke: {
				curve: "smooth",
				width: 6,
			},
			markers: {
				size: 4,
			},
			fill: {
				type: "gradient",
				gradient: {
					opacityFrom: 0.55,
					opacityTo: 0,
					shade: "#1C64F2",
					gradientToColors: ["#1C64F2"],
				},
				colors: ["#1C64F2", "#F39C12"],
			},
			dataLabels: {
				enabled: false,
			},
		};

		const chartSeries: ApexAxisChartSeries = [
			{
				name: "Views",
				data: viewCountPerDay.map((value) => ({
					x: value.end_date,
					y: value.count,
				})),
				color: "#1C64F2",
			},
			{
				name: "Posts",
				data: threadCountPerDay.map((value) => ({
					x: value.end_date,
					y: value.count,
				})),
				color: "#10B981",
			},
			// {
			// 	name: "Likes",
			// 	data: currentLikes.map((value) => value.count),
			// 	// green
			// 	color: "#10B981",
			// },
			// {
			// 	name: "Thread Views",
			// 	data: currentThreadViews.map((value) => value.count),
			// 	// red
			// 	color: "#EF4444",
			// },
		];

		return <ReactApexChart options={opts} series={chartSeries} width={chartWidth} height={300} type="area" />;
	}, [viewCountPerDay, threadCountPerDay, currentDays, chartWidth]);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setChartWidth(entry.contentRect.width);
			}
		});

		if (chartContainerRef.current) {
			resizeObserver.observe(chartContainerRef.current);
		}

		const curr = chartContainerRef.current;

		return () => {
			if (curr) {
				resizeObserver.unobserve(curr);
			}
		};
	}, []);

	return (
		<div ref={chartContainerRef} className="flex flex-col items-center w-full">
			{Chart}
		</div>
	);
};

export default UserInsightChartView;
