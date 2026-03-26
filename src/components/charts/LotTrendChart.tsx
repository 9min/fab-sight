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
	/** 컨텍스트 헤더 표시용 (예: "CVD-01 / Chamber A") */
	contextLabel?: string;
	/** 스텝 이름 (예: "Deposition") */
	stepName?: string;
}

export const LotTrendChart = memo(function LotTrendChart({
	lots,
	sensorKey,
	stepId,
	sensorsMeta,
	processResults,
	contextLabel,
	stepName,
}: LotTrendChartProps) {
	const sensorMeta = sensorsMeta.find((s) => s.key === sensorKey);

	const option = useMemo(() => {
		const trendData = buildLotTrendData(lots, stepId, sensorKey);
		const resultData = processResults
			? buildResultTrendData(processResults, "filmThickness")
			: undefined;
		return buildLotTrendOption(trendData, sensorMeta, resultData, "막 두께 (Å)");
	}, [lots, sensorKey, stepId, sensorMeta, processResults]);

	const headerParts = [
		contextLabel,
		sensorMeta ? `${sensorMeta.label} (${sensorMeta.unit})` : sensorKey,
		stepName ? `@ ${stepName}` : null,
	].filter(Boolean);

	return (
		<div
			role="img"
			aria-label="Lot-to-Lot 트렌딩 차트"
			style={{ height: "100%", width: "100%" }}
			className="flex flex-col"
		>
			{headerParts.length > 0 && (
				<div className="flex items-center gap-2 px-3 pt-2 pb-1">
					<span className="text-xs font-medium text-slate-300">{headerParts.join(" / ")}</span>
					<span className="text-xs text-slate-500">({lots.length} Runs)</span>
				</div>
			)}
			<div className="flex-1 min-h-0">
				<ReactECharts
					option={option}
					style={{ height: "100%", width: "100%" }}
					opts={{ renderer: "canvas" }}
					notMerge={true}
				/>
			</div>
		</div>
	);
});
