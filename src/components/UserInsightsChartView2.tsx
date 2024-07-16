import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { useInsightsByDateRange } from "@src/client/hooks/useInsightsByDate";
import useTimePeriod, { useTimePeriodListOfDays } from "@src/client/hooks/useTimePeriod";
import { analyzeTrendWithLinearRegression, InsightsByDate, MLData, transormFullDataForML } from "@src/lib/ml";

const chartTypes = {
	"user views": {
		name: "user views",
		color: "#1C64F2",
		mldata: (data: MLData) => data.viewsData,
		isbd: (data: InsightsByDate) => data.totalUserViews,
	},
	"post likes": {
		name: "post likes",
		color: "#EF4444",
		mldata: (data: MLData) => data.likesData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_likes,
	},
	"post replies": {
		name: "post replies",
		color: "#10B981",
		mldata: (data: MLData) => data.repliesData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_replies,
	},
	"post reposts": {
		name: "post reposts",
		color: "#F59E0B",
		mldata: (data: MLData) => data.repostsData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_reposts,
	},

	"post quotes": {
		name: "post quotes",
		color: "#3B82F6",
		mldata: (data: MLData) => data.quotesData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_quotes,
	},
};

const UserInsightsChartView2: FC = () => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);
	const [chartHeight, setChartHeight] = useState<number>(0);

	const [chartType, setChartType] = useState<keyof typeof chartTypes>("user views");

	const [logarithmic, setLogarithmic] = useState<boolean>(false);

	// const [insights] = useUserInsights();
	// const [threads] = useThreadsListSortedByDate();

	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();

	const insights = useInsightsByDateRange(timePeriod.start_date, timePeriod.end_date);

	const data = transormFullDataForML(insights);

	const chartTypeData = chartTypes[chartType];

	const currentDays = useTimePeriodListOfDays(timePeriod);

	const [labelsOnChart] = useState<boolean>(false);

	const Chart = useMemo(() => {
		const analysis = analyzeTrendWithLinearRegression(chartTypeData.mldata(data));

		const opts: ApexOptions = {
			chart: {
				type: "area",
				// fontFamily: "Inter, sans-serif",
				dropShadow: {
					enabled: false,
				},
				toolbar: {
					show: true,
					tools: {
						download: true,
						selection: false,
						pan: false,
						reset: false,
						customIcons: [],
						zoom: false,
						zoomin: false,
						zoomout: false,
						// selection: true,
					},
				},
				selection: {
					enabled: false,
				},
				// sparkline: {
				// 	enabled: true,
				// },
			},
			tooltip: {
				x: {
					format: "ddd, MMM d, yyyy",
				},
				y: [
					{
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", {
								notation: "compact",
								compactDisplay: "short",
								// maximumSignificantDigits: 2,
								useGrouping: true,
							});
							return formatter.format(val);
						},
					},
					{
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", {
								notation: "compact",
								compactDisplay: "short",
								maximumSignificantDigits: 2,
								useGrouping: true,
							});
							return formatter.format(val);
						},
					},
					// {
					// 	formatter: (val) => `${val.toLocaleString()} post replies`,
					// },
					// {
					// 	formatter: (val) => `${val.toLocaleString()} post reposts`,
					// },
					// {
					// 	formatter: (val) => `${val.toLocaleString()} post quotes`,
					// },
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
					opposite: true,
					labels: {
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", { notation: "compact" });
							return formatter.format(val);
						},
						show: labelsOnChart,
					},
					logarithmic: logarithmic,
					logBase: 2,
					show: labelsOnChart,
				},
				// {
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 		show: labelsOnChart,
				// 	},
				// 	logarithmic: true,
				// 	logBase: 2,
				// 	show: labelsOnChart,
				// },
				// {
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 		show: labelsOnChart,
				// 	},
				// 	logarithmic: true,
				// 	logBase: 2,
				// 	show: labelsOnChart,
				// },
				// {
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 		show: labelsOnChart,
				// 	},
				// 	logarithmic: true,
				// 	logBase: 2,
				// 	show: labelsOnChart,
				// },
				// {
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 		show: labelsOnChart,
				// 	},
				// 	logarithmic: true,
				// 	logBase: 2,
				// 	show: labelsOnChart,
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
					// datetimeFormatter: {
					// 	year: "",
					// 	// month: "MMM 'yy",
					// 	day: "MMM dd",
					// 	// hour: "HH:mm",
					// },
					show: labelsOnChart,
					// show: true,
					// rotate: -45,
					// style: {
					// 	fontSize: "12px",
					// 	// fontFamily: "Inter, sans-serif",
					// 	colors: "#9aa0ac",
					// },
				},
				axisBorder: {
					show: labelsOnChart,
				},
				axisTicks: {
					show: labelsOnChart,
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
					opacityTo: 0.5,
					shade: "#EF4444",

					gradientToColors: ["#10B981"],
				},
				// colors: ["#1C64F2", "#EF4444", "#10B981", "#F59E0B"],
			},
			dataLabels: {
				enabled: false,
			},
			forecastDataPoints: {},
		};

		const chartSeries: ApexAxisChartSeries = [
			{
				name: "user views",
				data: Object.entries(insights)
					.map(([k, value]) => ({
						x: k,
						y: chartTypeData.isbd(value),
					}))
					.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()),

				color: "#1C64F2",
				type: "line",
				zIndex: 2,
			},
			{
				name: "user views trend",
				data: analysis.trend.map((value, index) => ({
					x: currentDays[index],
					y: value,
				})),
				color: "#AFAFAF",
				type: "line",
				zIndex: 1,
			},

			// {
			// 	name: "post likes",
			// 	data: insights.map((value) => ({
			// 		x: value.date,
			// 		y: value.cumlativePostInsights.total_likes,
			// 	})),
			// 	color: "#1C64F2",
			// 	type: "line",
			// },
			// {
			// 	name: "post replies",
			// 	data: insights.map((value) => ({
			// 		x: value.date,
			// 		y: value.cumlativePostInsights.total_replies,
			// 	})),
			// 	color: "#1C64F2",
			// 	type: "line",
			// },
			// {
			// 	name: "post reposts",
			// 	data: insights.map((value) => ({
			// 		x: value.date,
			// 		y: value.cumlativePostInsights.total_reposts,
			// 	})),
			// 	color: "#1C64F2",
			// 	type: "line",
			// },
			// {
			// 	name: "post quotes",
			// 	data: insights.map((value) => ({
			// 		x: value.date,
			// 		y: value.cumlativePostInsights.total_quotes,
			// 	})),
			// 	color: "#1C64F2",
			// 	type: "line",
			// },
		];

		return <ReactApexChart options={opts} series={chartSeries} width={chartWidth} height={chartHeight} type="area" />;
	}, [insights, currentDays, chartWidth, labelsOnChart, chartHeight, chartTypeData, data, logarithmic]);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setChartWidth(entry.contentRect.width);
				setChartHeight(entry.contentRect.height);
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
		<div className="flex flex-col items-center h-full  pb-20">
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					// marginTop: "1rem",
				}}
			>
				<select id="timePeriod" value={timePeriod.label} onChange={handleTimePeriodChange} className="p-2 border rounded  pr-10">
					{Object.entries(timePeriods).map(([, tp]) => (
						<option key={tp.label} value={tp.label}>
							{!tp.label.includes("days") ? tp.label : `Last ${tp.label.replace("days", "").replace("last", "")} Days`}
						</option>
					))}
				</select>

				<select
					id="chartType"
					value={chartType}
					onChange={(e) => {
						setChartType(e.target.value as keyof typeof chartTypes);
					}}
					className="p-2 border rounded  pr-10"
				>
					{Object.entries(chartTypes).map(([key, value]) => (
						<option key={key} value={key}>
							{value.name}
						</option>
					))}
				</select>

				<button
					onClick={() => {
						setLogarithmic((l) => !l);
					}}
					className="p-2 border rounded  pr-10"
				>
					{logarithmic ? "Logarithmic" : "Linear"}
				</button>
			</div>
			<div ref={chartContainerRef} className="sm:p-10 p-3 w-full max-h-full">
				{Chart}
			</div>
		</div>
	);
};

export default UserInsightsChartView2;
