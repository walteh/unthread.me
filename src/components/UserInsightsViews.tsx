import { FC, useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
import { MetricTypeMap } from "@src/threadsapi/api";
import { useUserDataStore } from "@src/threadsapi/store";

const UserInsightsViews: FC = () => {
	const data = useUserDataStore((state) => state.user_insights_profile_views);

	if (!data) return null;

	if (data.is_loading) return <Loader />;
	if (data.error) return <ErrorMessage message={data.error} />;

	if (!data.data) return <ErrorMessage message="No insights data available" />;

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold text-center mb-8">Profile Views</h1>
			<ObservedChart data={data.data.data} />
		</div>
	);
};

const ObservedChart: FC<{ data: MetricTypeMap["views"][] }> = ({ data }) => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState<number>(0);
	const [timePeriod, setTimePeriod] = useState<string>("last30days");

	const allValues = data[0].values;

	// Helper function to filter data based on the selected time period
	function getFilteredData(values: MetricTypeMap["views"]["values"]) {
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
			y: {
				formatter: (val) => `${val.toLocaleString()} views`,
			},
		},
		yaxis: {
			labels: {
				formatter: (val) => val.toLocaleString(),
			},
		},
		xaxis: {
			categories: currentValues.map((value) => new Date(value.end_time).getDate()),
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
			colors: ["#1C64F2"],
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
