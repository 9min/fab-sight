import { RadarChart } from "@/components/charts/RadarChart";
import { useProcessData } from "@/hooks/useProcessData";
import { useDashboardStore } from "@/stores/useDashboardStore";
import {
	buildParameterTableData,
	buildRadarData,
	findClosestDataPoint,
} from "@/utils/drilldownUtils";
import { useMemo } from "react";
import { ParameterTable } from "./ParameterTable";

export function DrilldownPanel() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const selectedTimestamp = useDashboardStore((s) => s.selectedTimestamp);
	const { data: lotData } = useProcessData(selectedLotId);

	const dataPoint = useMemo(() => {
		if (!lotData?.data || !selectedTimestamp) return null;
		return findClosestDataPoint(lotData.data, selectedTimestamp);
	}, [lotData, selectedTimestamp]);

	const radarData = useMemo(() => {
		if (!dataPoint || !lotData?.data) return [];
		return buildRadarData(dataPoint, lotData.data);
	}, [dataPoint, lotData]);

	const tableData = useMemo(() => {
		if (!dataPoint) return [];
		return buildParameterTableData(dataPoint);
	}, [dataPoint]);

	if (!selectedTimestamp || !selectedLotId || !dataPoint) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-sm text-slate-500">
					차트에서 타임스탬프를 클릭하면 상세 정보를 확인할 수 있습니다
				</p>
			</div>
		);
	}

	const formattedTime = new Date(dataPoint.timestamp).toLocaleString("ko-KR");

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-3 border-b border-slate-700 px-4 py-2">
				<h3 className="text-sm font-medium text-slate-300">드릴다운 분석</h3>
				<span className="text-xs text-slate-500">{formattedTime}</span>
				{dataPoint.isAnomaly && (
					<span className="rounded bg-red-900/50 px-2 py-0.5 text-xs text-red-400">
						이상 감지 (점수: {dataPoint.anomalyScore.toFixed(2)})
					</span>
				)}
			</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 p-2">
					<RadarChart data={radarData} />
				</div>
				<div className="flex-1 overflow-y-auto border-l border-slate-700 p-2">
					<ParameterTable rows={tableData} />
				</div>
			</div>
		</div>
	);
}
