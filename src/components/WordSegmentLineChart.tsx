import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

import client from "@src/client";
import useTimePeriod, { useTimePeriodFilteredData } from "@src/client/hooks/useTimePeriod";
import { useByWord, WordType, wordTypes } from "@src/client/hooks/useWords";
import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
import { ThreadMedia } from "@src/threadsapi/types";

const WordSegmentLineChart: FC = () => {
	const [threads] = client.cache_store((state) => [state.user_threads]);

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
	const [wordSegmentType, setWordSegmentType] = useState<WordType>("nouns");
	const [metric, setMetric] = useState<"total_likes" | "total_views" | "total_count">("total_likes");

	const threadsByTimePeriod = useTimePeriodFilteredData(threads, (thread) => thread.timestamp, timePeriod);
	const words = useByWord(threadsByTimePeriod);

	const [chartContainerRef, setChartContainerRef] = useState<HTMLDivElement | null>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 1000;

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

	const [threashold, setThreashold] = useState(1);

	const paginatedWords = useMemo(() => {
		const start = currentPage * itemsPerPage;
		const end = start + itemsPerPage;
		return (
			words
				.filter((v) => v.total_count > threashold)
				.filter((x) => x.type === wordSegmentType)
				.sort((a, b) => b[metric] - a[metric])
				// .filter((x) => metric === x.type)
				.slice(start, end)
		);
	}, [words, wordSegmentType, metric, currentPage, threashold]);

	const dats = useMemo(() => {
		return paginatedWords
			.map((segment) => ({
				x: segment.word,
				y: metric === "total_views" ? segment.total_views : metric === "total_likes" ? segment.total_likes : segment.total_count,
			}))
			.filter((x) => x.y > 0);
	}, [paginatedWords, metric]);

	// const totalPages = Math.ceil(words.filter((x) => x.type === wordSegmentType).length / itemsPerPage);

	const Chart = useMemo(() => {
		const opts: ApexOptions = {
			chart: {
				type: "treemap",
				height: 800,
				// fontFamily: "Inter, sans-serif",
				toolbar: {
					show: false,
				},
				dropShadow: {
					enabled: false,
				},

				// stacked: true,
				// animations: {
				// 	enabled: true,
				// 	easing: "easeinout",
				// 	speed: 800,
				// 	animateGradually: {
				// 		enabled: true,
				// 		delay: 150,
				// 	},
				// 	dynamicAnimation: {
				// 		enabled: true,
				// 		speed: 350,
				// 	},
				// group: "word-segment",
				// },
				// sparkline: {
				// 	enabled: false,
				// },
				// dropShadow: {
				// 	enabled: true,
				// },
				// stackOnlyBar: true,

				// stackType: "normal",
			},
			// plotOptions: {
			// 	bar: {
			// 		horizontal: false,
			// 		borderRadiusApplication: "end",
			// 		hideZeroBarsWhenGrouped: true,
			// 		borderRadius: 50,
			// 		distributed: false,
			// 		// rangeBarGroupRows: true,
			// 		// dataLabels: {
			// 		// 	position: "top",
			// 		// },
			// 	},
			// },
			tooltip: {
				// shared: true,
				// intersect: false,
				// theme: "dark",
				// fixed: {
				// 	enabled: false,
				// 	position: "top-right",
				// },
				// x: {
				// 	show: true,
				// 	formatter: (val) => `${val}`,
				// },
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
					show: true,
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
				// labels: {
				// 	show: true,
				// 	rotate: -45,
				// 	style: {
				// 		fontSize: "12px",
				// 		fontFamily: "Inter, sans-serif",
				// 		colors: "#9aa0ac",
				// 	},
				// },
				// axisBorder: {
				// 	show: false,
				// },
				// axisTicks: {
				// 	show: false,
				// },
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
			// responsive: [
			// 	{
			// 		breakpoint: 1000,
			// 		options: {
			// 			chart: {
			// 				height: 350,
			// 			},
			// 		},
			// 	},
			// ],
			stroke: {
				curve: "smooth",
				width: 2,
			},
			markers: {
				size: 4,
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
				name: "views",
				data: dats,
				color: metric === "total_views" ? "#1C64F2" : metric === "total_likes" ? "#F39C12" : "#10B981",
				type: "treemap",
			},
		];

		return <ReactApexChart options={opts} series={chartSeries} width={chartWidth} type="treemap" height={800} />;
	}, [paginatedWords, metric, chartWidth, dats]);

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

	return (
		<div className=" flex flex-col items-center w-full">
			<div className="mb-4 flex justify-between w-full ">
				<div>
					<div className="mb-4">
						<select
							id="wordSegmentType"
							value={wordSegmentType}
							onChange={handleWordSegmentTypeChange}
							className="p-2 border rounded"
						>
							{wordTypez.map((type) => (
								<option key={type.key} value={type.key} disabled={type.value === 0}>
									{type.key}
								</option>
							))}
						</select>
					</div>

					<div className="mb-4">
						<select id="metric" value={metric} onChange={handleMetricChange} className="p-2 border rounded" title="sort by">
							<option value="total_likes">likes</option>
							<option value="total_views">views</option>
							<option value="total_count">posts</option>
						</select>
					</div>
					<div className="mb-4">
						<label htmlFor="threashold" className="mr-2">
							min post threashold:
						</label>
						<select
							id="threashold"
							value={threashold}
							onChange={(e) => {
								setThreashold(parseInt(e.target.value));
							}}
							className="p-2 border rounded"
						>
							{[0, 1, 2, 3, 4, 5, 10, 20, 30, 50, 100].map((value) => (
								<option key={value} value={value}>
									{value}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<div ref={setChartContainerRef} className="flex flex-col items-center w-full justify-center ">
				{dats.length === 0 ? <ErrorMessage message="No data available" /> : Chart}
			</div>
		</div>
	);
};

export default WordSegmentLineChart;
