import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGoldenLotData } from "@/hooks/useGoldenLotData";
import { useProcessData } from "@/hooks/useProcessData";
import { MOCK_LOT_SUMMARIES } from "@/mocks/mockLots";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useCallback, useEffect } from "react";

export function DashboardPage() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const selectedSensors = useDashboardStore((s) => s.selectedSensors);
	const showAnomalyOverlay = useDashboardStore((s) => s.showAnomalyOverlay);
	const isCompareMode = useDashboardStore((s) => s.isCompareMode);
	const setSelectedLot = useDashboardStore((s) => s.setSelectedLot);
	const setSelectedTimestamp = useDashboardStore((s) => s.setSelectedTimestamp);

	// 초기 로드 시 Golden Lot이 아닌 첫 번째 Lot 자동 선택
	useEffect(() => {
		if (!selectedLotId && MOCK_LOT_SUMMARIES.length > 1) {
			const first = MOCK_LOT_SUMMARIES[1];
			setSelectedLot(first.lotId, first.waferId);
		}
	}, [selectedLotId, setSelectedLot]);

	const { data: lotData, isLoading } = useProcessData(selectedLotId);
	const { data: goldenLotData } = useGoldenLotData(isCompareMode);

	const handleTimestampClick = useCallback(
		(timestamp: string) => {
			setSelectedTimestamp(timestamp);
		},
		[setSelectedTimestamp],
	);

	if (!selectedLotId) {
		return <EmptyState message="Lot을 선택해주세요" />;
	}

	if (isLoading) {
		return <ChartSkeleton />;
	}

	if (!lotData) {
		return <EmptyState message="데이터를 찾을 수 없습니다" />;
	}

	return (
		<div className="h-full p-4">
			<TimeSeriesChart
				data={lotData.data}
				selectedSensors={selectedSensors}
				showAnomalyOverlay={showAnomalyOverlay}
				goldenData={goldenLotData?.data}
				isCompareMode={isCompareMode}
				onTimestampClick={handleTimestampClick}
			/>
		</div>
	);
}
