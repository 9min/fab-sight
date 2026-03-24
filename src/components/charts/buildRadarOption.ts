import { SENSOR_META } from "@/types/process";
import type { RadarDataItem } from "@/utils/drilldownUtils";
import type { EChartsOption } from "echarts";

/** 레이더 차트 ECharts 옵션을 생성한다 */
export function buildRadarOption(radarData: RadarDataItem[]): EChartsOption {
	const indicator = radarData.map((item) => ({
		name: `${item.label} (${SENSOR_META[item.sensor].unit})`,
		max: item.max,
	}));

	const values = radarData.map((item) => item.value);

	return {
		tooltip: {
			trigger: "item",
			backgroundColor: "#1E293B",
			borderColor: "#475569",
			textStyle: { color: "#F1F5F9" },
		},
		radar: [
			{
				indicator,
				shape: "polygon",
				splitNumber: 4,
				axisName: {
					color: "#94A3B8",
					fontSize: 11,
				},
				splitLine: {
					lineStyle: { color: "#334155" },
				},
				splitArea: {
					show: true,
					areaStyle: {
						color: ["rgba(51, 65, 85, 0.3)", "rgba(51, 65, 85, 0.1)"],
					},
				},
				axisLine: {
					lineStyle: { color: "#475569" },
				},
			},
		],
		series: [
			{
				type: "radar",
				data: [
					{
						value: values,
						areaStyle: {
							color: "rgba(59, 130, 246, 0.15)",
						},
						lineStyle: {
							color: "#3B82F6",
							width: 2,
						},
						itemStyle: {
							color: "#3B82F6",
						},
					},
				],
			},
		],
		animation: false,
	};
}
