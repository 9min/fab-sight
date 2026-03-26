import type { R2RAdjustment } from "@/types/process";
import type { EChartsOption } from "echarts";

/** R2R 조정값 바 차트 옵션을 생성한다 */
export function buildR2RAdjustmentOption(
	adjustments: R2RAdjustment[],
	sensorKey: string,
	sensorLabel: string,
	unit: string,
): EChartsOption {
	const filtered = adjustments
		.filter((a) => a.sensorKey === sensorKey)
		.sort((a, b) => a.runNumber - b.runNumber);

	if (filtered.length === 0) {
		return { xAxis: { data: [] }, yAxis: {}, series: [] };
	}

	const categories = filtered.map((a) => `Run #${a.runNumber}`);
	const adjustmentValues = filtered.map((a) => a.adjustment);

	return {
		tooltip: {
			trigger: "axis",
			backgroundColor: "#1E293B",
			borderColor: "#475569",
			textStyle: { color: "#E2E8F0", fontSize: 12 },
			formatter: (params: unknown) => {
				const items = Array.isArray(params) ? params : [params];
				const first = items[0] as { name: string; value: number };
				const adj = filtered.find((a) => `Run #${a.runNumber}` === first.name);
				if (!adj) return "";
				return [
					`<b>${first.name}</b>`,
					`Target: ${adj.targetSetpoint} ${unit}`,
					`Actual: ${adj.actualMean} ${unit}`,
					`Adjustment: <b>${adj.adjustment > 0 ? "+" : ""}${adj.adjustment}</b> ${unit}`,
				].join("<br/>");
			},
		},
		grid: { top: 30, right: 20, bottom: 30, left: 50 },
		xAxis: {
			type: "category",
			data: categories,
			axisLabel: { color: "#94A3B8", fontSize: 10 },
			axisLine: { lineStyle: { color: "#475569" } },
		},
		yAxis: {
			type: "value",
			name: `${sensorLabel} 조정값 (${unit})`,
			nameTextStyle: { color: "#94A3B8", fontSize: 10 },
			axisLabel: { color: "#94A3B8", fontSize: 10 },
			splitLine: { lineStyle: { color: "#334155" } },
		},
		series: [
			{
				name: "조정값",
				type: "bar",
				data: adjustmentValues.map((v) => ({
					value: v,
					itemStyle: { color: v >= 0 ? "#3B82F6" : "#EF4444" },
				})),
				barWidth: "50%",
			},
		],
		animation: false,
	};
}
