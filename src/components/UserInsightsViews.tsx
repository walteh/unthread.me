import { FC, useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
import { ThreadMedia } from "@src/threadsapi/api";
import { useUserDataStore } from "@src/threadsapi/store";

const UserInsightsViews: FC = () => {
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
			<ObservedChart data={data.data.views.values} threads={threads.data.data} />
		</div>
	);
};

const ObservedChart: FC<{ data: { end_time: string; value: number }[]; threads: ThreadMedia[] }> = ({ data, threads }) => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);
	const [timePeriod, setTimePeriod] = useState<string>("last30days");

	// const likes = useUserLikesByDay();
	// const threadViews = useUserThreadViewsByDay();

	const allValues = data;

	// Helper function to filter data based on the selected time period
	function getFilteredData(values: { end_time: string; value: number }[]) {
		if (timePeriod === "last7days") {
			return values.slice(-7);
		} else if (timePeriod === "last30days") {
			return values.slice(-30);
		} else {
			const month = timePeriod;
			return values.filter((value) => new Date(value.end_time).toISOString().slice(0, 7) === month);
		}
	}

	const availableMonths = Array.from(new Set(allValues.map((value) => new Date(value.end_time).toISOString().slice(0, 7)))).reverse();

	const currentValues = getFilteredData(allValues);

	// Filter threads based on the selected time period
	function getFilteredThreads<T extends { timestamp: string }>(threads: T[]) {
		if (timePeriod === "last7days") {
			const last7Days = new Date();
			last7Days.setDate(last7Days.getDate() - 7);
			return threads.filter((thread) => new Date(thread.timestamp) > last7Days);
		} else if (timePeriod === "last30days") {
			const last30Days = new Date();
			last30Days.setDate(last30Days.getDate() - 30);
			return threads.filter((thread) => new Date(thread.timestamp) > last30Days);
		} else {
			const month = timePeriod;
			return threads.filter((thread) => new Date(thread.timestamp).toISOString().slice(0, 7) === month);
		}
	}

	function getCountPerDay(threads: { timestamp: string }[], startDate: Date, endDate: Date) {
		const threadCountPerDay: { end_date: string; count: number }[] = [];

		// Initialize an object to hold the counts per day
		const countMap: Record<string, number> = {};

		// Populate the countMap with thread counts
		threads.forEach((thread) => {
			const date = new Date(thread.timestamp).toLocaleDateString();
			if (!countMap[date]) {
				countMap[date] = 1;
			} else {
				countMap[date] += 1;
			}
		});

		// Fill in the threadCountPerDay array with all dates in the range
		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toLocaleDateString();
			threadCountPerDay.push({ end_date: dateStr, count: countMap[dateStr] || 0 });
		}

		return threadCountPerDay;
	}

	function getTotalPerDay(threads: { timestamp: string; total_value: number }[], startDate: Date, endDate: Date) {
		const threadCountPerDay: { end_date: string; count: number }[] = [];

		// Initialize an object to hold the counts per day
		const countMap: Record<string, number> = {};

		// Populate the countMap with thread counts
		threads.forEach((thread) => {
			const date = new Date(thread.timestamp).toLocaleDateString();
			if (!countMap[date]) {
				countMap[date] = thread.total_value;
			} else {
				countMap[date] += thread.total_value;
			}
		});

		// Fill in the threadCountPerDay array with all dates in the range
		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toLocaleDateString();
			threadCountPerDay.push({ end_date: dateStr, count: countMap[dateStr] || 0 });
		}

		return threadCountPerDay;
	}

	getTotalPerDay;

	const currentThreads = getCountPerDay(
		getFilteredThreads(threads),
		new Date(currentValues[0].end_time),
		new Date(currentValues[currentValues.length - 1].end_time),
	);

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

	const chartOptions: ApexCharts.ApexOptions = {
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
			categories: currentValues.map((value) => new Date(value.end_time).toLocaleDateString()),
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
			data: currentValues.map((value) => value.value),
			color: "#1C64F2",
		},
		{
			name: "Posts",
			data: currentThreads.map((value) => value.count),
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

	const handleTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTimePeriod(e.target.value);
	};

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
		<div ref={chartContainerRef} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full">
			<div className="mb-4">
				<label htmlFor="timePeriod" className="mr-2">
					Select Time Period:
				</label>
				<select id="timePeriod" value={timePeriod} onChange={handleTimePeriodChange} className="p-2 border rounded">
					<option value="last7days">Last 7 Days</option>
					<option value="last30days">Last 30 Days</option>
					{availableMonths.map((month) => (
						<option key={month} value={month}>
							{new Date(month + "-11").toLocaleDateString("default", { year: "numeric", month: "long" })}
						</option>
					))}
				</select>
			</div>
			<ReactApexChart options={chartOptions} series={chartSeries} width={chartWidth} height={300} type="area" />
		</div>
	);
};

export default UserInsightsViews;
