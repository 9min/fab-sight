import { DOWNSAMPLE_TARGET, DOWNSAMPLE_THRESHOLD } from "@/constants/chart";
import type { ProcessDataPoint, SensorType } from "@/types/process";
import { SENSOR_META } from "@/types/process";
import { extractSensorSeries, lttbDownsample } from "@/utils/downsample";
import type { EChartsOption } from "echarts";

/** 시계열 차트 ECharts 옵션을 생성한다 */
export function buildChartOption(
	data: ProcessDataPoint[],
	selectedSensors: SensorType[],
): EChartsOption {
	// 축 배치: 좌(temp) / 우(pressure) / 우(rfPower, offset)
	const yAxis = selectedSensors.map((sensor, index) => ({
		type: "value" as const,
		scale: true,
		name: SENSOR_META[sensor].unit,
		position: index === 0 ? ("left" as const) : ("right" as const),
		offset: index <= 1 ? 0 : 50,
		axisLine: {
			show: true,
			lineStyle: { color: SENSOR_META[sensor].color },
		},
		axisLabel: {
			color: SENSOR_META[sensor].color,
		},
		splitLine: {
			show: index === 0,
			lineStyle: { color: "#334155" },
		},
		nameTextStyle: {
			color: SENSOR_META[sensor].color,
			fontSize: 11,
		},
	}));

	const series = selectedSensors.map((sensor, index) => {
		let seriesData = extractSensorSeries(data, sensor);

		if (seriesData.length > DOWNSAMPLE_THRESHOLD) {
			seriesData = lttbDownsample(seriesData, DOWNSAMPLE_TARGET);
		}

		return {
			name: SENSOR_META[sensor].label,
			type: "line" as const,
			yAxisIndex: index,
			showSymbol: false,
			clip: true,
			lineStyle: {
				color: SENSOR_META[sensor].color,
				width: 1.5,
			},
			itemStyle: {
				color: SENSOR_META[sensor].color,
			},
			data: seriesData.map((p) => [p.x, p.y]),
		};
	});

	return {
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "cross" },
			backgroundColor: "#1E293B",
			borderColor: "#475569",
			textStyle: { color: "#F1F5F9" },
		},
		legend: {
			data: selectedSensors.map((s) => SENSOR_META[s].label),
			textStyle: { color: "#94A3B8" },
			top: 8,
		},
		grid: {
			left: 50,
			right: selectedSensors.length > 2 ? 110 : 60,
			top: 50,
			bottom: 80,
			containLabel: false,
		},
		xAxis: {
			type: "time",
			axisLabel: { color: "#94A3B8" },
			axisLine: { lineStyle: { color: "#475569" } },
			splitLine: { show: false },
		},
		yAxis,
		series,
		dataZoom: [
			{
				type: "slider",
				xAxisIndex: 0,
				bottom: 10,
				height: 24,
				borderColor: "#475569",
				backgroundColor: "#1E293B",
				fillerColor: "rgba(59, 130, 246, 0.2)",
				textStyle: { color: "#94A3B8" },
			},
			{
				type: "inside",
				xAxisIndex: 0,
			},
		],
		animation: false,
	};
}
