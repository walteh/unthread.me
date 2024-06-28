import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
import useTimePeriod, { useTimePeriodFilteredData } from "@src/hooks/useTimePeriod";
import { useByWord, WordType, wordTypes } from "@src/hooks/useWords";
import { ThreadMedia } from "@src/threadsapi/api";
import { useUserDataStore } from "@src/threadsapi/store";

const WordSegmentLineChart: FC = () => {
	const [threads] = useUserDataStore((state) => [state.user_threads]);

	if (!threads) return null;

	if (threads.is_loading) return <Loader />;
	if (threads.error) return <ErrorMessage message={threads.error} />;

	if (!threads.data) return <ErrorMessage message="No threads data available" />;

	return (
		<div className="container mx-auto p-6">
			<div className="space-y-6">
				<Cloud threads={threads.data.data} />
			</div>
		</div>
	);
};

const Cloud: FC<{ threads: ThreadMedia[] }> = ({ threads }) => {
	const [timePeriod] = useTimePeriod();
	const [wordSegmentType, setWordSegmentType] = useState<WordType>("abbreviations");
	const [metric, setMetric] = useState<"total_likes" | "total_views" | "total_count">("total_likes");

	const threadsByTimePeriod = useTimePeriodFilteredData(threads, (thread) => thread.timestamp, timePeriod);
	const words = useByWord(threadsByTimePeriod);

	const [chartContainerRef, setChartContainerRef] = useState<HTMLDivElement | null>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 10;

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setChartWidth(entry.contentRect.width);
			}
		});

		if (chartContainerRef) {
			resizeObserver.observe(chartContainerRef);
		}

		return () => {
			if (chartContainerRef) {
				resizeObserver.unobserve(chartContainerRef);
			}
		};
	}, [chartContainerRef]);

	const handleWordSegmentTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setWordSegmentType(event.target.value as WordType);
		setCurrentPage(0); // Reset to the first page on type change
	};

	const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setMetric(event.target.value as "total_likes" | "total_views" | "total_count");
	};

	const paginatedWords = useMemo(() => {
		const start = currentPage * itemsPerPage;
		const end = start + itemsPerPage;
		return words
			.filter((x) => x.type === wordSegmentType)
			.sort((a, b) => b[metric] - a[metric])
			.slice(start, end);
	}, [words, wordSegmentType, metric, currentPage]);

	const totalPages = Math.ceil(words.filter((x) => x.type === wordSegmentType).length / itemsPerPage);

	const [chartOptions, chartSeries] = useMemo(() => {
		const opts: ApexOptions = {
			chart: {
				type: "bar",
				fontFamily: "Inter, sans-serif",
				toolbar: {
					show: false,
				},

				stacked: true,
				animations: {
					enabled: true,
					easing: "easeinout",
					speed: 800,
					animateGradually: {
						enabled: true,
						delay: 150,
					},
					dynamicAnimation: {
						enabled: true,
						speed: 350,
					},
				},
				sparkline: {
					enabled: false,
				},
				dropShadow: {
					enabled: true,
				},
				stackOnlyBar: true,

				stackType: "normal",
			},
			plotOptions: {
				bar: {
					horizontal: true,
					borderRadiusApplication: "end",
					hideZeroBarsWhenGrouped: true,
					borderRadius: 50,
					distributed: false,
					// rangeBarGroupRows: true,
					// dataLabels: {
					// 	position: "top",
					// },
				},
			},
			tooltip: {
				shared: true,
				intersect: false,

				x: {
					show: true,
					formatter: (val) => `${val}`,
				},
				y: [
					{
						formatter: (val) => `${val.toLocaleString()} views`,
					},
					{
						formatter: (val) => `${val.toLocaleString()} likes`,
					},
					{
						formatter: (val) => `${val.toLocaleString()} posts`,
					},
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
					labels: {
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", { notation: "compact" });
							return formatter.format(val);
						},
					},
				},
				{
					labels: {
						formatter: (val) => {
							const formatter = Intl.NumberFormat("en", { notation: "compact" });
							return formatter.format(val);
						},
					},
				},
			],
			xaxis: {
				categories: paginatedWords.map((segment) => segment.word),
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
				width: 2,
			},
			markers: {
				size: 4,
			},
			fill: {
				type: "solid",
				colors: ["#1C64F2", "#10B981", "#F39C12"],
			},
			dataLabels: {
				enabled: false,
			},
		};

		const chartSeries: ApexAxisChartSeries = [
			{
				name: "views",
				data: paginatedWords.map((segment) => ({
					x: segment.word,
					y: segment.total_views,
				})),
				color: "#1C64F2",
			},
			{
				name: "likes",
				data: paginatedWords.map((segment) => ({
					x: segment.word,
					y: segment.total_likes,
				})),
				color: "#10B981",
			},
			{
				name: "posts",
				data: paginatedWords.map((segment) => ({
					x: segment.word,
					y: segment.total_count,
				})),
				color: "#F39C12",
			},
		];

		return [opts, chartSeries] as const;
	}, [paginatedWords]);

	return (
		<div ref={setChartContainerRef} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full">
			{/* <div className="mb-4">
				<label htmlFor="timePeriod" className="mr-2">
					Select Time Period:
				</label>
				<select id="timePeriod" value={timePeriod.label} onChange={handleTimePeriodChange} className="p-2 border rounded">
					{Object.entries(timePeriods).map(([, tp]) => (
						<option key={tp.label} value={tp.label}>
							{!tp.label.includes("days") ? tp.label : `Last ${tp.label.replace("days", "").replace("last", "")} Days`}
						</option>
					))}
				</select>
			</div> */}
			<div className="mb-4 flex justify-between w-full">
				<div className="mb-4">
					<label htmlFor="wordSegmentType" className="mr-2">
						group:
					</label>
					<select
						id="wordSegmentType"
						value={wordSegmentType}
						onChange={handleWordSegmentTypeChange}
						className="p-2 border rounded"
					>
						{wordTypes.sort().map((type) => (
							<option key={type} value={type}>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</option>
						))}
					</select>
				</div>
				<div className="mb-4">
					<label htmlFor="metric" className="mr-2">
						sort by:
					</label>
					<select id="metric" value={metric} onChange={handleMetricChange} className="p-2 border rounded">
						<option value="total_likes">most likes</option>
						<option value="total_views">most views</option>
						<option value="total_count">most posts</option>
					</select>
				</div>
			</div>
			<ReactApexChart options={chartOptions} series={chartSeries} width={chartWidth} height={300} type="bar" />
			<div className="mt-4 flex justify-between space-x-2  w-full">
				<button
					onClick={() => {
						setCurrentPage((prev) => Math.max(prev - 1, 0));
					}}
					className="p-2 border rounded"
					disabled={currentPage === 0}
				>
					previous
				</button>
				<button
					onClick={() => {
						setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
					}}
					className="p-2 border rounded"
					disabled={currentPage === totalPages - 1}
				>
					next
				</button>
			</div>
		</div>
	);
};

export default WordSegmentLineChart;
