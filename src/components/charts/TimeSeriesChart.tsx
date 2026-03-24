import type { ProcessDataPoint, SensorType } from "@/types/process";
import ReactECharts from "echarts-for-react";
import { memo, useMemo } from "react";
import { buildAnomalyOverlay } from "./buildAnomalyOverlay";
import { buildChartOption } from "./buildChartOption";
import { buildGoldenLotOverlay } from "./buildGoldenLotOverlay";

interface TimeSeriesChartProps {
	data: ProcessDataPoint[];
	selectedSensors: SensorType[];
	showAnomalyOverlay?: boolean;
	goldenData?: ProcessDataPoint[];
	isCompareMode?: boolean;
	onTimestampClick?: (timestamp: string) => void;
}

export const TimeSeriesChart = memo(function TimeSeriesChart({
	data,
	selectedSensors,
	showAnomalyOverlay = false,
	goldenData,
	isCompareMode = false,
	onTimestampClick,
}: TimeSeriesChartProps) {
	const option = useMemo(() => {
		const baseOption = buildChartOption(data, selectedSensors);
		const overlaySeries = buildAnomalyOverlay(data, showAnomalyOverlay);
		const goldenSeries = buildGoldenLotOverlay(goldenData ?? [], selectedSensors, isCompareMode);

		const baseSeries = Array.isArray(baseOption.series) ? baseOption.series : [];
		const allSeries = [...baseSeries, ...overlaySeries, ...goldenSeries];

		return {
			...baseOption,
			series: allSeries,
		};
	}, [data, selectedSensors, showAnomalyOverlay, goldenData, isCompareMode]);

	const onEvents = useMemo(() => {
		if (!onTimestampClick) return undefined;
		return {
			click: (params: Record<string, unknown>) => {
				if (params.value && Array.isArray(params.value)) {
					const timestamp = new Date(params.value[0] as number).toISOString();
					onTimestampClick(timestamp);
				}
			},
		};
	}, [onTimestampClick]);

	return (
		<ReactECharts
			option={option}
			style={{ height: "100%", width: "100%" }}
			onEvents={onEvents}
			notMerge={true}
			opts={{ renderer: "canvas" }}
		/>
	);
});
