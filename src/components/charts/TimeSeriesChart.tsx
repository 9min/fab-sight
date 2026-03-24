import type { ProcessDataPoint, Recipe, SensorMeta, WaferRun } from "@/types/process";
import type { XAxisMode } from "@/utils/downsample";
import ReactECharts from "echarts-for-react";
import { memo, useMemo } from "react";
import { buildAnomalyOverlay } from "./buildAnomalyOverlay";
import { buildChartOption } from "./buildChartOption";
import { buildGoldenLotOverlay } from "./buildGoldenLotOverlay";
import { buildRecipeStepOverlay } from "./buildRecipeStepOverlay";
import { buildSpecLimitOverlay } from "./buildSpecLimitOverlay";
import { buildWaferCompareOverlay } from "./buildWaferCompareOverlay";

interface TimeSeriesChartProps {
	data: ProcessDataPoint[];
	selectedSensors: string[];
	sensorsMeta: SensorMeta[];
	showAnomalyOverlay?: boolean;
	showSpecLimits?: boolean;
	goldenData?: ProcessDataPoint[];
	isCompareMode?: boolean;
	wafers?: WaferRun[];
	currentWaferId?: string;
	isWaferCompareMode?: boolean;
	recipe?: Recipe;
	xAxisMode?: XAxisMode;
	waferStartTime?: string;
	onTimestampClick?: (timestamp: string) => void;
}

export const TimeSeriesChart = memo(function TimeSeriesChart({
	data,
	selectedSensors,
	sensorsMeta,
	showAnomalyOverlay = false,
	showSpecLimits = false,
	goldenData,
	isCompareMode = false,
	wafers,
	currentWaferId,
	isWaferCompareMode = false,
	recipe,
	xAxisMode = "wallClock",
	waferStartTime,
	onTimestampClick,
}: TimeSeriesChartProps) {
	const option = useMemo(() => {
		const baseOption = buildChartOption(data, selectedSensors, sensorsMeta, xAxisMode);
		const primarySensor = selectedSensors[0] ?? "temperature";
		const overlaySeries = buildAnomalyOverlay(data, showAnomalyOverlay, primarySensor, xAxisMode);
		const goldenSeries = buildGoldenLotOverlay(
			goldenData ?? [],
			selectedSensors,
			sensorsMeta,
			isCompareMode,
			xAxisMode,
		);
		const stepSeries = buildRecipeStepOverlay(recipe, xAxisMode, waferStartTime);
		const specSeries = buildSpecLimitOverlay(selectedSensors, sensorsMeta, showSpecLimits);
		const w2wSeries = buildWaferCompareOverlay(
			wafers ?? [],
			selectedSensors,
			sensorsMeta,
			currentWaferId ?? "",
			isWaferCompareMode,
			xAxisMode,
		);

		const baseSeries = Array.isArray(baseOption.series) ? baseOption.series : [];
		const allSeries = [
			...baseSeries,
			...overlaySeries,
			...goldenSeries,
			...stepSeries,
			...specSeries,
			...w2wSeries,
		];

		return { ...baseOption, series: allSeries };
	}, [
		data,
		selectedSensors,
		sensorsMeta,
		showAnomalyOverlay,
		showSpecLimits,
		goldenData,
		isCompareMode,
		wafers,
		currentWaferId,
		isWaferCompareMode,
		recipe,
		xAxisMode,
		waferStartTime,
	]);

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
