import type { ProcessResult, R2RAdjustment, SensorMeta } from "@/types/process";
import ReactECharts from "echarts-for-react";
import { memo, useMemo } from "react";
import { buildR2RAdjustmentOption } from "../charts/buildR2RAdjustmentOption";
import { ProcessResultTable } from "./ProcessResultTable";

interface R2RAdjustmentPanelProps {
	adjustments: R2RAdjustment[];
	processResults: ProcessResult[];
	sensorKey: string;
	sensorsMeta: SensorMeta[];
}

export const R2RAdjustmentPanel = memo(function R2RAdjustmentPanel({
	adjustments,
	processResults,
	sensorKey,
	sensorsMeta,
}: R2RAdjustmentPanelProps) {
	const sensorMeta = sensorsMeta.find((s) => s.key === sensorKey);

	const option = useMemo(
		() =>
			buildR2RAdjustmentOption(
				adjustments,
				sensorKey,
				sensorMeta?.label ?? sensorKey,
				sensorMeta?.unit ?? "",
			),
		[adjustments, sensorKey, sensorMeta],
	);

	if (adjustments.length === 0) {
		return (
			<div className="flex h-full items-center justify-center text-slate-500 text-sm">
				R2R 조정 데이터가 없습니다
			</div>
		);
	}

	return (
		<div className="flex h-full gap-4 p-3">
			<div className="flex-1" role="img" aria-label="R2R 조정값 차트">
				<h3 className="mb-1 text-xs font-semibold text-slate-400">R2R 조정값</h3>
				<ReactECharts
					option={option}
					style={{ height: "calc(100% - 20px)", width: "100%" }}
					opts={{ renderer: "canvas" }}
					notMerge={true}
				/>
			</div>
			<div className="flex-1 overflow-hidden">
				<h3 className="mb-1 text-xs font-semibold text-slate-400">공정 결과</h3>
				<ProcessResultTable results={processResults} />
			</div>
		</div>
	);
});
