import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import useTimePeriod, {
	useTimePeriodCountPerDay,
	useTimePeriodFilteredData,
	useTimePeriodListOfDays,
} from "@src/client/hooks/useTimePeriod";
import useUserInsights from "@src/client/hooks/useUserInsights";

const UserInsightsChartView: FC = () => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);

	const [insights] = useUserInsights();
	const [threads] = useThreadsListSortedByDate();

	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();

	const viewByTimePeriod = useTimePeriodFilteredData(insights.views_by_day, (value) => value.label, timePeriod);

	const threadsByTimePeriod = useTimePeriodFilteredData(threads, (thread) => thread.timestamp, timePeriod);

	const viewCountPerDay = useTimePeriodCountPerDay(
		viewByTimePeriod,
		(value) => value.label,
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

	const Chart = useMemo(() => {
		const opts: ApexOptions = {
			chart: {
				type: "area",
				// fontFamily: "Inter, sans-serif",
				dropShadow: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
				sparkline: {
					enabled: true,
				},
			},
			tooltip: {
				x: {
					format: "ddd, MMM d, yyyy",
				},
				y: [
					{
						formatter: (val) => `${val.toLocaleString()} views`,
					},
					// {
					// 	formatter: (val) => `${val.toLocaleString()} posts`,
					// },
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
					logarithmic: true,
					logBase: 2,
					show: false,
				},
				// {
				// 	opposite: true,
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 	},
				// 	logarithmic: true,
				// 	logBase: 2,
				// 	show: false,
				// },
			],
			xaxis: {
				categories: currentDays,
				type: "datetime",
				labels: {
					// formatter(value, timestamp, opts) {
					// 	return new Date(value).toLocaleDateString();
					// },
					// add the day of week
					format: "dd MMM yyyy",
					// datetimeUTC
					datetimeFormatter: {
						year: "",
						// month: "MMM 'yy",
						day: "MMM dd",
						// hour: "HH:mm",
					},
					// show: true,
					// rotate: -45,
					// style: {
					// 	fontSize: "12px",
					// 	// fontFamily: "Inter, sans-serif",
					// 	colors: "#9aa0ac",
					// },
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
					opacityFrom: 0.95,
					opacityTo: 0.25,
					shade: "#EF4444",

					gradientToColors: ["#10B981"],
				},
				// colors: ["#1C64F2", "#EF4444", "#10B981", "#F59E0B"],
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
				type: "line",
			},
			// {
			// 	name: "Posts",
			// 	data: threadCountPerDay.map((value) => ({
			// 		x: value.end_date,
			// 		y: value.count,
			// 	})),
			// 	color: "#10B981",
			// },
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

		return <ReactApexChart options={opts} series={chartSeries} width={chartWidth} type="area" />;
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
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginTop: "1rem",
				}}
			>
				<select id="timePeriod" value={timePeriod.label} onChange={handleTimePeriodChange} className="p-2 border rounded  pr-10">
					{Object.entries(timePeriods).map(([, tp]) => (
						<option key={tp.label} value={tp.label}>
							{!tp.label.includes("days") ? tp.label : `Last ${tp.label.replace("days", "").replace("last", "")} Days`}
						</option>
					))}
				</select>
			</div>
			{Chart}
		</div>
	);
};

export default UserInsightsChartView;
