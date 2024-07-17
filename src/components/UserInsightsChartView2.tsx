import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { useInsightsByDateRange } from "@src/client/hooks/useInsightsByDate";
import useTimePeriod, { useTimePeriodListOfDays } from "@src/client/hooks/useTimePeriod";
import { analyzeTrendWithLinearRegression, formatNumber, InsightsByDate, MLData, transormFullDataForML } from "@src/lib/ml";

import Toggle from "./Toggle";

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

	const [logarithmic, setLogarithmic] = useState<boolean>(true);

	// const [insights] = useUserInsights();
	// const [threads] = useThreadsListSortedByDate();

	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();

	const insights = useInsightsByDateRange(timePeriod.start_date, timePeriod.end_date);

	const data = transormFullDataForML(insights);

	const chartTypeData = chartTypes[chartType];

	const currentDays = useTimePeriodListOfDays(timePeriod);

	const [labelsOnChart] = useState<boolean>(false);

	const [dataWithCorrectedTrend, slope] = useMemo(() => {
		const dataWithToday = chartTypeData.mldata(data);
		const dataWithouToday = dataWithToday.slice(0, dataWithToday.length - 1);
		const analysis = analyzeTrendWithLinearRegression(dataWithouToday);
		const dataWithCorrectedTrend = analysis.trend.concat(analysis.nextValue);
		return [dataWithCorrectedTrend, analysis.slope];
	}, [data, chartTypeData]);

	const Chart = useMemo(() => {
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
								minimumFractionDigits: 0,
							});
							return formatter.format(val);
						},
					},
					{
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", {
								notation: "compact",
								minimumFractionDigits: 0,
							});
							return formatter.format(val);
						},
					},
				],
			},

			yaxis: [
				{
					labels: {
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", { notation: "compact", minimumSignificantDigits: 2 });
							return formatter.format(val);
						},
						show: labelsOnChart,
					},
					logarithmic: logarithmic,
					logBase: 2,
					show: labelsOnChart,
				},
			],
			xaxis: {
				categories: currentDays,
				type: "datetime",

				labels: {
					format: "dd MMM yyyy",
					show: labelsOnChart,
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
			forecastDataPoints: {
				count: 1,
			},
		};

		const chartSeries: ApexAxisChartSeries = [
			{
				name: chartType,
				data: Object.entries(insights)
					.map(([k, value]) => ({
						x: k,
						y: chartTypeData.isbd(value),
					}))
					.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()),

				color: "#1C64F2",
				type: "line",
				zIndex: 2,
				group: chartType,
			},
			{
				name: "trend",
				data: dataWithCorrectedTrend.map((value, index) => ({
					x: currentDays[index],
					y: value,
				})),
				color: "#AFAFAF",
				type: "line",
				zIndex: 1,
				group: chartType,
			},
		];

		return <ReactApexChart options={opts} series={chartSeries} width={chartWidth} height={chartHeight} type="area" />;
	}, [
		//
		insights,
		currentDays,
		chartWidth,
		labelsOnChart,
		chartHeight,
		chartTypeData,
		logarithmic,
		chartType,
		dataWithCorrectedTrend,
	]);

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

				<div>
					<span>log</span>
					<Toggle label="log" enabled={logarithmic} setEnabled={setLogarithmic} />
				</div>

				<div>
					{slope && (
						<p>
							{formatNumber(slope)} per day
							{/* {equation} */}
						</p>
					)}
				</div>
			</div>
			<div ref={chartContainerRef} className="sm:p-10 p-3 w-full max-h-full">
				{Chart}
			</div>
		</div>
	);
};

export default UserInsightsChartView2;
