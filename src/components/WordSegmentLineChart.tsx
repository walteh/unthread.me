import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useRef, useState } from "react";
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
			<div className=" card card-normal flex flex-col items-center">
				<Cloud threads={threads.data.data} />
			</div>
		</div>
	);
};

const Cloud: FC<{
	threads: ThreadMedia[];
}> = ({ threads }) => {
	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();
	const [wordSegmentType, setWordSegmentType] = useState<WordType>("abbreviations");

	const threadsByTimePeriod = useTimePeriodFilteredData(threads, (thread) => thread.timestamp, timePeriod);

	const words = useByWord(threadsByTimePeriod);

	const [metric, setMetric] = useState<"total_likes" | "total_views">("total_likes");

	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);

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

	const [chartOptions, chartSeries] = useMemo(() => {
		const categ = words
			.filter((x) => x.type === wordSegmentType)
			.map((x) => ({ x: x.word, y: metric == "total_likes" ? x.total_likes : x.total_views }))
			.sort((a, b) => b.y - a.y);
		const opts: ApexOptions = {
			chart: {
				type: "bar",
				fontFamily: "Inter, sans-serif",
				toolbar: {
					show: false,
				},
			},
			tooltip: {
				x: {
					show: true,
					formatter: (val) => {
						const str = `${val}`;

						const all = words.filter((x) => x.word === str);

						const output = all[0].threads.map((segment) => {
							return `${segment.username} - ${segment.text}`;
						});

						return output.join("<br/>");
					},
				},
				y: {
					formatter: (val) => `${val.toLocaleString()} occurrences`,
				},
			},
			yaxis: {
				labels: {
					formatter: (val) => {
						const formatter = Intl.NumberFormat("en", { notation: "compact" });
						return formatter.format(val);
					},
				},
			},
			xaxis: {
				categories: categ.map((segment) => segment.x),
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
				colors: ["#1C64F2"],
			},
			dataLabels: {
				enabled: false,
			},
		};

		const chartSeries: ApexAxisChartSeries = [
			{
				name: `${wordSegmentType.charAt(0).toUpperCase() + wordSegmentType.slice(1)} Count`,
				data: categ,
				color: "#1C64F2",
			},
		];

		return [opts, chartSeries] as const;
	}, [words, metric, wordSegmentType]);

	const handleWordSegmentTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setWordSegmentType(event.target.value as WordType);
	};

	return (
		<div ref={chartContainerRef} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full">
			<div className="mb-4">
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
			</div>
			<div className="mb-4">
				<label htmlFor="wordSegmentType" className="mr-2">
					Select Word Segment Type:
				</label>
				<select id="wordSegmentType" value={wordSegmentType} onChange={handleWordSegmentTypeChange} className="p-2 border rounded">
					{wordTypes.map((type) => (
						<option key={type} value={type}>
							{type.charAt(0).toUpperCase() + type.slice(1)}
						</option>
					))}
				</select>
			</div>
			<div className="mb-4">
				<label htmlFor="metric" className="mr-2">
					Select Metric:
				</label>
				<select
					id="metric"
					value={metric}
					onChange={(e) => {
						setMetric(e.target.value as "total_likes" | "total_views");
					}}
					className="p-2 border rounded"
				>
					<option value="total_likes">Likes</option>
					<option value="total_views">Views</option>
				</select>
			</div>
			<ReactApexChart options={chartOptions} series={chartSeries} width={chartWidth} height={300} type="bar" />
		</div>
	);
};

export default WordSegmentLineChart;
