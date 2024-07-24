import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { IoSettings } from "react-icons/io5";

import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import useTimePeriod, { useTimePeriodFilteredData } from "@src/client/hooks/useTimePeriod";
import { MetricKey, useByWord, WordType, wordTypes } from "@src/client/hooks/useWords";
import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";

const WordSegmentLineChart: FC = () => {
	const [threads] = useThreadsListSortedByDate();

	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();
	const [wordSegmentType, setWordSegmentType] = useState<WordType>("nouns");
	const [metric, setMetric] = useState<MetricKey>("average_views");

	const threadsByTimePeriod = useTimePeriodFilteredData(threads, (thread) => thread.media.timestamp, timePeriod);
	const words = useByWord(threadsByTimePeriod);

	const [chartContainerRef, setChartContainerRef] = useState<HTMLDivElement | null>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);
	const [chartHeight, setChartHeight] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 1000;

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setChartWidth(entry.contentRect.width);
				setChartHeight(entry.contentRect.height);
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
		setMetric(event.target.value as MetricKey);
	};

	const [threashold, setThreashold] = useState(2);

	const paginatedWords = useMemo(() => {
		const start = currentPage * itemsPerPage;
		const end = start + itemsPerPage;
		return (
			words
				.filter((v) => v.stats.total_count >= threashold)
				.filter((x) => x.type === wordSegmentType)
				.sort((a, b) => b.stats[metric] - a.stats[metric])
				// .filter((x) => metric === x.type)
				.slice(start, end)
		);
	}, [words, wordSegmentType, metric, currentPage, threashold]);

	const dats = useMemo(() => {
		return paginatedWords
			.map((segment) => ({
				x: segment.word,
				y: segment.stats[metric],
			}))
			.filter((x) => x.y > 0);
	}, [paginatedWords, metric]);

	// const totalPages = Math.ceil(words.filter((x) => x.type === wordSegmentType).length / itemsPerPage);

	const Chart = useMemo(() => {
		const opts: ApexOptions = {
			chart: {
				type: "treemap",

				// height: chartHeight,
				// height: chartHeight - 15,
				toolbar: {
					show: true,
				},
				dropShadow: {
					enabled: false,
				},
				// selection: {
				// 	enabled: true,
				// 	type: "x",

				// 	fill: {
				// 		color: "#24292e",
				// 		opacity: 0.1,
				// 	},
				// },
			},

			tooltip: {
				// enabled,
				enabled: true,
				y: [
					{
						formatter: (val) => `${val.toLocaleString()} ${metric.replace("_", " ")}`,
					},
				],
				// shared: true,
				// x: {
				// 	formatter: (val) => `${val}`,
				// },
				style: {
					// fontFamily: "Inter, sans-serif",
					// fontSize: "40px",
				},
				// cssClass: "text-md",
			},
			yaxis: [
				{
					// labels: {
					// 	formatter: (val) => {
					// 		const formatter = Intl.NumberFormat("en", { notation: "compact" });
					// 		return formatter.format(val);
					// 	},
					// },
					// tooltip: {
					// 	enabled: true,
					// },
					// show: true,
				},
				// {
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 	},
				// },
				// {
				// 	labels: {
				// 		formatter: (val) => {
				// 			const formatter = Intl.NumberFormat("en", { notation: "compact" });
				// 			return formatter.format(val);
				// 		},
				// 	},
				// },
			],
			xaxis: {
				categories: dats.map((segment) => segment.x),
			},
			grid: {
				show: true,
				strokeDashArray: 4,
				padding: {
					left: 0,
					right: 0,
					top: 0,
				},
			},

			colors: ["#1C64F2", "#10B981", "#F39C12"],
			stroke: {
				curve: "smooth",
				width: 2,
			},
			markers: {
				size: 55,
			},
			fill: {
				type: "solid",
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 100],
				},
				colors: ["#1C64F2", "#10B981", "#F39C12"],
			},
			dataLabels: {
				enabled: true,
				style: {
					fontSize: "40px",

					// fontFamily: "Inter, sans-serif",
					// colors: ["#9aa0ac"],
				},
				// textAnchor: "start",

				// distributed: true,
				// textAnchor: "start",
				// offsetX: 0,
			},
		};

		const chartSeries: ApexAxisChartSeries = [
			{
				name: metric.replace("_", " "),
				data: dats,
				color: metric === "total_views" ? "#1C64F2" : metric === "total_likes" ? "#F39C12" : "#10B981",
				type: "treemap",
			},
		];
		return <ReactApexChart options={opts} series={chartSeries} width={chartWidth} type="treemap" height={chartHeight} />;
	}, [metric, chartWidth, dats, chartHeight]);

	const wordTypez = useMemo(() => {
		// const start = wordTypes.map((type) => ({ key: type, value: 0 }));
		// find all the word types that have more than one word
		return (
			Object.entries(
				words.reduce<Record<string, { key: WordType; value: number }>>(
					(acc, type) => {
						acc[type.type].value += 1;
						return acc;
					},
					wordTypes.reduce<Record<string, { key: WordType; value: number }>>((acc, type) => {
						acc[type] = { key: type, value: 0 };
						return acc;
					}, {}),
				),
			)
				.map(([, value]) => value)
				// sort my key alphabetically
				.sort((a, b) => a.key.localeCompare(b.key))
		);
	}, [words]);

	const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

	return (
		<div className="w-full h-full">
			<div className=" fixed top-4 left-4 z-50">
				<button
					className=" bottom-4 right-4 p-3 rounded-full text-gray-800 z-50 hover:scale-110 transform transition duration-200 ease-in-out backdrop-blur-lg bg-gray-400 bg-opacity-50 shadow-2xl"
					onClick={() => {
						setIsFlyoutOpen(true);
					}}
				>
					<IoSettings size={30} />
				</button>
			</div>

			<div
				className={`fixed inset-0 z-50 transform ${isFlyoutOpen ? "translate-x-300" : "-translate-x-full"} transition-transform duration-300 ease-in-out flex items-start justify-center sm:mt-4`}
			>
				<div
					className="absolute inset-0 "
					onClick={() => {
						setIsFlyoutOpen(false);
					}}
				></div>
				<div
					className="relative  w-auto h-auto backdrop-blur-2xl bg-gray-200 bg-opacity-50 rounded-xl shadow-2xl p-4"
					// onClick={() => {
					// 	setIsFlyoutOpen(false);
					// }}
				>
					<div className="flex flex-col items-center w-full h-full">
						<div className="grid grid-cols-1 gap-4 text-center  p-4 sm:grid-cols-4">
							<div>
								<select
									id="wordSegmentType"
									value={wordSegmentType}
									onChange={handleWordSegmentTypeChange}
									className="rounded-xl sm:text-sm text-xs truncate"
								>
									{wordTypez.map((type) => (
										<option key={type.key} value={type.key} disabled={type.value === 0}>
											{type.key}
										</option>
									))}
								</select>
							</div>
							<div>
								<select
									id="metric"
									value={metric}
									onChange={handleMetricChange}
									className="rounded-xl sm:text-sm text-xs truncate"
									title="sort by"
								>
									<option value="total_views">total views</option>
									<option value="total_likes">total likes</option>
									<option value="total_count">total threads</option>
									<option value="average_views">average views</option>
									<option value="average_likes">average likes</option>
								</select>
							</div>
							<div>
								<select
									id="threashold"
									value={threashold}
									onChange={(e) => {
										setThreashold(parseInt(e.target.value));
									}}
									className="rounded-xl sm:text-sm text-xs truncate"
								>
									{[1, 2, 3, 4, 5, 10, 20, 30, 50, 100].map((value) => (
										<option key={value} value={value}>
											min {value} threads
										</option>
									))}
								</select>
							</div>
							<div>
								<select
									id="timePeriod"
									value={timePeriod.label}
									onChange={handleTimePeriodChange}
									className="rounded-xl sm:text-sm text-xs truncate"
								>
									{Object.entries(timePeriods).map(([, tp]) => (
										<option key={tp.label} value={tp.label}>
											{!tp.label.includes("days")
												? tp.label
												: `last ${tp.label.replace("days", "").replace("last", "")} days`}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <div className="hidden sm:flex flex-col items-center w-full h-full">
				<div className="flex justify-center w-full">
					<div className="grid grid-cols-4 gap-4 text-center sm:text-sm text-xs mt-2">
						<div>
							<select
								id="wordSegmentType"
								value={wordSegmentType}
								onChange={handleWordSegmentTypeChange}
								className="rounded-xl sm:text-sm text-xs truncate"
							>
								{wordTypez.map((type) => (
									<option key={type.key} value={type.key} disabled={type.value === 0}>
										{type.key}
									</option>
								))}
							</select>
						</div>
						<div>
							<select
								id="metric"
								value={metric}
								onChange={handleMetricChange}
								className="rounded-xl sm:text-sm text-xs truncate"
								title="sort by"
							>
								<option value="total_views">total views</option>
								<option value="total_likes">total likes</option>
								<option value="total_count">total threads</option>
								<option value="average_views">average views</option>
								<option value="average_likes">average likes</option>
							</select>
						</div>
						<div>
							<select
								id="threashold"
								value={threashold}
								onChange={(e) => {
									setThreashold(parseInt(e.target.value));
								}}
								className="rounded-xl sm:text-sm text-xs truncate"
							>
								{[1, 2, 3, 4, 5, 10, 20, 30, 50, 100].map((value) => (
									<option key={value} value={value}>
										min {value} threads
									</option>
								))}
							</select>
						</div>
						<div>
							<select
								id="timePeriod"
								value={timePeriod.label}
								onChange={handleTimePeriodChange}
								className="rounded-xl sm:text-sm text-xs truncate"
							>
								{Object.entries(timePeriods).map(([, tp]) => (
									<option key={tp.label} value={tp.label}>
										{!tp.label.includes("days")
											? tp.label
											: `last ${tp.label.replace("days", "").replace("last", "")} days`}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div> */}

			<div
				ref={setChartContainerRef}
				className="flex flex-col items-center w-full justify-center h-full overflow-y-hidden"
				style={{
					maxHeight: "100%",
				}}
			>
				{dats.length === 0 ? threads.length == 0 ? <Loader /> : <ErrorMessage message="no data available" /> : Chart}
			</div>
		</div>
	);
};

export default WordSegmentLineChart;
