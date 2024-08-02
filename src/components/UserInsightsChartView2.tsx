import { ApexOptions } from "apexcharts";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { IoSettings } from "react-icons/io5";

import { useDarkMode } from "@src/client/hooks/useDarkMode";
import useMLByDate, { chartTypes } from "@src/client/hooks/useMLByDate";
import useTimePeriod, { useTimePeriodListOfDays } from "@src/client/hooks/useTimePeriod";
import { TimePeriod } from "@src/threadsapi/types";

import Toggle from "./Toggle";

const UserInsightsChartView2: FC = () => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);
	const [chartHeight, setChartHeight] = useState<number>(0);

	const [chartType, setChartType] = useState<keyof typeof chartTypes>("user views");

	const [logarithmic, setLogarithmic] = useState<boolean>(true);

	// const [insights] = useUserInsights();
	// const [threads] = useThreadsListSortedByDate();

	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();

	const currentDays = useTimePeriodListOfDays(timePeriod);

	const [labelsOnChart] = useState<boolean>(false);

	const [analysis, insights, chartTypeData] = useMLByDate(chartType, timePeriod);

	const [includeToday, setIncludeToday] = useState<boolean>(false);

	const [dummy, setDummy] = useState<boolean>(false);

	const isdark = useDarkMode();

	const triggerRerender = () => {
		setDummy(true);
		setDummy(false);
	};

	useEffect(() => {
		triggerRerender();
	}, [chartType]);

	const [opts, chartSeries, cw, ch] = useMemo(() => {
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
				borderColor: isdark ? "#1F2937" : "#D1D5DB",
			},
			legend: {
				show: false,
			},
			stroke: {
				curve: "smooth",
				width: 6,
			},
			markers: {
				size: 4,
			},
			fill: {
				type: "solid",
				// type: "gradient",
				// gradient: {
				// 	opacityFrom: 0.95,
				// 	opacityTo: 0.5,
				// 	// gradientToColors: [isdark ? "#1F2937" : "#D1D5DB", isdark ? "#1F2937" : "#D1D5DB"],
				// },
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
				// make it
				color: isdark ? "#10B981" : "#10B981",
				type: "line",
				zIndex: 2,
				group: chartType,
			},
			{
				name: "trend",
				data: analysis.dataWithCorrectedTrend.map((value, index) => ({
					x: currentDays[index],
					y: value,
				})),
				color: "#AFAFAF",
				type: "line",
				zIndex: 1,
				group: chartType,
			},
		];

		return [opts, chartSeries, chartWidth, chartHeight] as const;
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
		analysis,
		isdark,
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

	const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

	return (
		<div className="flex flex-col items-center h-full  pb-20">
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
			<Selector
				timePeriod={timePeriod}
				timePeriods={timePeriods}
				handleTimePeriodChange={handleTimePeriodChange}
				chartType={chartType}
				setChartType={setChartType}
				logarithmic={logarithmic}
				setLogarithmic={setLogarithmic}
				includeToday={includeToday}
				setIncludeToday={setIncludeToday}
				analysis={analysis}
				setIsFlyoutOpen={setIsFlyoutOpen}
				isFlyoutOpen={isFlyoutOpen}
				triggerRerender={triggerRerender}
			/>
			<div
				ref={chartContainerRef}
				className="sm:p-10 p-3 w-full h-full "
				style={{
					maxHeight: "100%",
				}}
			>
				{dummy ? null : <ReactApexChart options={opts} series={chartSeries} width={cw} height={ch} type="area" />}
			</div>
		</div>
	);
};

interface MyComponentProps {
	timePeriod: TimePeriod;
	timePeriods: Record<string, TimePeriod>;
	handleTimePeriodChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	chartType: string;
	setChartType: React.Dispatch<React.SetStateAction<keyof typeof chartTypes>>;
	logarithmic: boolean;
	setLogarithmic: React.Dispatch<React.SetStateAction<boolean>>;
	includeToday: boolean;
	setIncludeToday: React.Dispatch<React.SetStateAction<boolean>>;
	analysis: { slope: number; dataWithCorrectedTrend: number[] };
	setIsFlyoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isFlyoutOpen: boolean;
	triggerRerender: () => void;
}

const Selector: React.FC<MyComponentProps> = ({
	timePeriod,
	timePeriods,
	handleTimePeriodChange,
	chartType,
	setChartType,
	logarithmic,
	setLogarithmic,
	// includeToday,
	// setIncludeToday,
	setIsFlyoutOpen,
	isFlyoutOpen,
	// triggerRerender,
}) => {
	return (
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
					<div className="grid grid-cols-1 gap-4 text-center  p-4 sm:grid-cols-3">
						<div>
							<select
								id="wordSegmentType"
								value={chartType}
								onChange={(e) => {
									setChartType(e.target.value as keyof typeof chartTypes);
								}}
								className="rounded-xl sm:text-sm text-xs truncate"
							>
								{Object.keys(chartTypes).map((key) => (
									<option key={key} value={key}>
										{key}
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

						<Toggle label="logarithmic" enabled={logarithmic} setEnabled={setLogarithmic} />
						{/* <Toggle label="include today" enabled={includeToday} setEnabled={setIncludeToday} /> */}

						{/* <button
							onClick={() => {
								triggerRerender();
							}}
							className="col-span-4 p-4 rounded-xl backdrop-blur-2xl bg-white bg-opacity-50 shadow-md hover:scale-110 transform transition duration-200 ease-in-out"
						>
							rerender chart
						</button> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserInsightsChartView2;
