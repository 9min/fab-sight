import { DOWNSAMPLE_TARGET, DOWNSAMPLE_THRESHOLD } from "@/constants/chart";
import type { ProcessDataPoint, SensorMeta } from "@/types/process";
import { type XAxisMode, extractSensorSeries, lttbDownsample } from "@/utils/downsample";
import type { EChartsOption } from "echarts";

/** 시계열 차트 ECharts 옵션을 생성한다 */
export function buildChartOption(
	data: ProcessDataPoint[],
	selectedSensors: string[],
	sensorsMeta: SensorMeta[],
	xAxisMode: XAxisMode = "wallClock",
): EChartsOption {
	const sensorMetaMap = new Map(sensorsMeta.map((m) => [m.key, m]));

	/** 단위별 Y축 그룹화: 같은 단위 센서는 같은 축 공유 */
	const unitToAxisIndex = new Map<string, number>();
	const yAxis: EChartsOption["yAxis"] = [];

	for (const sensorKey of selectedSensors) {
		const meta = sensorMetaMap.get(sensorKey);
		if (!meta) continue;
		if (!unitToAxisIndex.has(meta.unit)) {
			const axisIndex = unitToAxisIndex.size;
			unitToAxisIndex.set(meta.unit, axisIndex);
			yAxis.push({
				type: "value" as const,
				scale: true,
				name: meta.unit,
				position: axisIndex === 0 ? ("left" as const) : ("right" as const),
				offset: axisIndex <= 1 ? 0 : (axisIndex - 1) * 60,
				axisLine: { show: true, lineStyle: { color: meta.color } },
				axisLabel: { color: meta.color },
				splitLine: { show: axisIndex === 0, lineStyle: { color: "#334155" } },
				nameTextStyle: { color: meta.color, fontSize: 11 },
			});
		}
	}

	const series = selectedSensors
		.map((sensorKey) => {
			const meta = sensorMetaMap.get(sensorKey);
			if (!meta) return null;

			let seriesData = extractSensorSeries(data, sensorKey, xAxisMode);
			if (seriesData.length > DOWNSAMPLE_THRESHOLD) {
				seriesData = lttbDownsample(seriesData, DOWNSAMPLE_TARGET);
			}

			const axisIndex = unitToAxisIndex.get(meta.unit) ?? 0;

			return {
				name: meta.label,
				type: "line" as const,
				yAxisIndex: axisIndex,
				showSymbol: false,
				clip: true,
				lineStyle: { color: meta.color, width: 1.5 },
				itemStyle: { color: meta.color },
				data: seriesData.map((p) => [p.x, p.y]),
			};
		})
		.filter((s): s is NonNullable<typeof s> => s !== null);

	const xAxisConfig =
		xAxisMode === "elapsed"
			? {
					type: "value" as const,
					name: "경과 시간 (초)",
					axisLabel: {
						color: "#94A3B8",
						formatter: (v: number) => {
							const min = Math.floor(v / 60);
							const sec = Math.floor(v % 60);
							return `${min}:${String(sec).padStart(2, "0")}`;
						},
					},
					axisLine: { lineStyle: { color: "#475569" } },
					splitLine: { show: false },
				}
			: {
					type: "time" as const,
					axisLabel: { color: "#94A3B8" },
					axisLine: { lineStyle: { color: "#475569" } },
					splitLine: { show: false },
				};

	return {
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "cross" },
			backgroundColor: "#1E293B",
			borderColor: "#475569",
			textStyle: { color: "#F1F5F9" },
		},
		legend: {
			data: selectedSensors.map((key) => sensorMetaMap.get(key)?.label).filter(Boolean) as string[],
			textStyle: { color: "#94A3B8" },
			top: 8,
		},
		grid: {
			left: 50,
			right: Math.max(60, ((yAxis as unknown[]).length - 1) * 60 + 20),
			top: 50,
			bottom: 80,
			containLabel: false,
		},
		xAxis: xAxisConfig,
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
			{ type: "inside", xAxisIndex: 0 },
		],
		animation: false,
	};
}
