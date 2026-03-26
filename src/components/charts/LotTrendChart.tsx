import type { LotDataV3, ProcessResult, SensorMeta } from "@/types/process";
import { buildLotTrendData, buildResultTrendData } from "@/utils/lotTrendUtils";
import ReactECharts from "echarts-for-react";
import { memo, useMemo } from "react";
import { buildLotTrendOption } from "./buildLotTrendOption";

interface LotTrendChartProps {
	lots: LotDataV3[];
	sensorKey: string;
	stepId: string;
	sensorsMeta: SensorMeta[];
	processResults?: ProcessResult[];
}

export const LotTrendChart = memo(function LotTrendChart({
	lots,
	sensorKey,
	stepId,
	sensorsMeta,
	processResults,
}: LotTrendChartProps) {
	const option = useMemo(() => {
		const trendData = buildLotTrendData(lots, stepId, sensorKey);
		const sensorMeta = sensorsMeta.find((s) => s.key === sensorKey);
		const resultData = processResults
			? buildResultTrendData(processResults, "filmThickness")
			: undefined;
		return buildLotTrendOption(trendData, sensorMeta, resultData, "막 두께 (Å)");
	}, [lots, sensorKey, stepId, sensorsMeta, processResults]);

	return (
		<div role="img" aria-label="Lot-to-Lot 트렌딩 차트" style={{ height: "100%", width: "100%" }}>
			<ReactECharts
				option={option}
				style={{ height: "100%", width: "100%" }}
				opts={{ renderer: "canvas" }}
				notMerge={true}
			/>
		</div>
	);
});
