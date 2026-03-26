import type { SensorMeta, SpecLimits } from "@/types/process";
import type { LotTrendPoint } from "@/utils/lotTrendUtils";
import { calculateTrendStats } from "@/utils/lotTrendUtils";
import type { EChartsOption, SeriesOption } from "echarts";

interface ResultTrendPoint {
	runNumber: number;
	value: number;
}

/** Lot-to-Lot 트렌딩 차트 옵션을 생성한다 */
export function buildLotTrendOption(
	trendData: LotTrendPoint[],
	sensorMeta: SensorMeta | undefined,
	resultData?: ResultTrendPoint[],
	resultLabel?: string,
): EChartsOption {
	if (!sensorMeta || trendData.length === 0) {
		return { xAxis: { data: [] }, yAxis: {}, series: [] };
	}

	const categories = trendData.map((p) => `Run #${p.runNumber}`);
	const { grandMean, sigma } = calculateTrendStats(trendData);
	const specLimits = sensorMeta.specLimits;

	const yAxes: EChartsOption["yAxis"] = [
		{
			type: "value",
			name: `${sensorMeta.label} (${sensorMeta.unit})`,
			nameTextStyle: { color: "#94A3B8", fontSize: 11 },
			axisLine: { show: true, lineStyle: { color: sensorMeta.color } },
			axisLabel: { color: "#94A3B8", fontSize: 10 },
			splitLine: { lineStyle: { color: "#334155" } },
		},
	];

	if (resultData && resultData.length > 0) {
		yAxes.push({
			type: "value",
			name: resultLabel ?? "결과",
			nameTextStyle: { color: "#94A3B8", fontSize: 11 },
			position: "right",
			axisLine: { show: true, lineStyle: { color: "#8B5CF6" } },
			axisLabel: { color: "#94A3B8", fontSize: 10 },
			splitLine: { show: false },
		});
	}

	const series: SeriesOption[] = [
		{
			name: sensorMeta.label,
			type: "line",
			data: trendData.map((p) => p.mean),
			itemStyle: { color: sensorMeta.color },
			lineStyle: { color: sensorMeta.color, width: 2 },
			symbolSize: 8,
			markLine: {
				silent: true,
				symbol: "none",
				label: { show: true, position: "insideEndTop", fontSize: 9, color: "#94A3B8" },
				data: buildMarkLines(grandMean, sigma, specLimits),
			},
		},
		{
			name: "Max",
			type: "line",
			data: trendData.map((p) => p.max),
			lineStyle: { color: sensorMeta.color, width: 1, opacity: 0.2, type: "dashed" },
			itemStyle: { color: sensorMeta.color, opacity: 0.3 },
			symbolSize: 4,
			z: 0,
		},
		{
			name: "Min",
			type: "line",
			data: trendData.map((p) => p.min),
			lineStyle: { color: sensorMeta.color, width: 1, opacity: 0.2, type: "dashed" },
			itemStyle: { color: sensorMeta.color, opacity: 0.3 },
			symbolSize: 4,
			z: 0,
		},
	];

	if (resultData && resultData.length > 0) {
		series.push({
			name: resultLabel ?? "결과",
			type: "bar",
			yAxisIndex: 1,
			data: resultData.map((p) => p.value),
			itemStyle: { color: "#8B5CF6", opacity: 0.4 },
			barWidth: "40%",
		});
	}

	return {
		tooltip: {
			trigger: "axis",
			backgroundColor: "#1E293B",
			borderColor: "#475569",
			textStyle: { color: "#E2E8F0", fontSize: 12 },
		},
		legend: {
			top: 0,
			textStyle: { color: "#94A3B8", fontSize: 11 },
		},
		grid: {
			top: 50,
			right: resultData ? 80 : 30,
			bottom: 40,
			left: 60,
		},
		xAxis: {
			type: "category",
			data: categories,
			axisLabel: { color: "#94A3B8", fontSize: 10 },
			axisLine: { lineStyle: { color: "#475569" } },
		},
		yAxis: yAxes,
		series,
		animation: false,
	};
}

type LineType = "solid" | "dashed" | "dotted";

interface MarkLineItem {
	yAxis: number;
	name: string;
	lineStyle: { color: string; type: LineType };
}

function buildMarkLines(grandMean: number, sigma: number, specLimits?: SpecLimits): MarkLineItem[] {
	const lines: MarkLineItem[] = [
		{ yAxis: grandMean, name: "Mean", lineStyle: { color: "#22C55E", type: "solid" } },
	];

	if (sigma > 0) {
		lines.push(
			{
				yAxis: grandMean + 2 * sigma,
				name: "+2σ",
				lineStyle: { color: "#F59E0B", type: "dashed" },
			},
			{
				yAxis: grandMean - 2 * sigma,
				name: "-2σ",
				lineStyle: { color: "#F59E0B", type: "dashed" },
			},
		);
	}

	if (specLimits) {
		if (specLimits.ucl !== undefined) {
			lines.push({
				yAxis: specLimits.ucl,
				name: "UCL",
				lineStyle: { color: "#DC2626", type: "dashed" },
			});
		}
		if (specLimits.lcl !== undefined) {
			lines.push({
				yAxis: specLimits.lcl,
				name: "LCL",
				lineStyle: { color: "#DC2626", type: "dashed" },
			});
		}
	}

	return lines;
}
