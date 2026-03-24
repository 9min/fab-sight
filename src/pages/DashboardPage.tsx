import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSensorsForProcess } from "@/constants/sensorConfig";
import { useGoldenLotData } from "@/hooks/useGoldenLotData";
import { useProcessData } from "@/hooks/useProcessData";
import { MOCK_LOT_SUMMARIES_V3 } from "@/mocks/mockLotsV3";
import { MOCK_RECIPES } from "@/mocks/recipes";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useCallback, useEffect, useMemo } from "react";

export function DashboardPage() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const selectedWaferId = useDashboardStore((s) => s.selectedWaferId);
	const selectedSensors = useDashboardStore((s) => s.selectedSensors);
	const showAnomalyOverlay = useDashboardStore((s) => s.showAnomalyOverlay);
	const showSpecLimits = useDashboardStore((s) => s.showSpecLimits);
	const isCompareMode = useDashboardStore((s) => s.isCompareMode);
	const isWaferCompareMode = useDashboardStore((s) => s.isWaferCompareMode);
	const xAxisMode = useDashboardStore((s) => s.xAxisMode);
	const setSelectedLot = useDashboardStore((s) => s.setSelectedLot);
	const setSelectedWafer = useDashboardStore((s) => s.setSelectedWafer);
	const setSelectedSensors = useDashboardStore((s) => s.setSelectedSensors);
	const setSelectedTimestamp = useDashboardStore((s) => s.setSelectedTimestamp);

	useEffect(() => {
		if (!selectedLotId && MOCK_LOT_SUMMARIES_V3.length > 1) {
			const first = MOCK_LOT_SUMMARIES_V3.find((s) => !s.isGoldenLot);
			if (first) {
				setSelectedLot(first.lotId);
			}
		}
	}, [selectedLotId, setSelectedLot]);

	const { data: lotData, isLoading } = useProcessData(selectedLotId);
	const { data: goldenLotData } = useGoldenLotData(isCompareMode);

	// Lot 선택 시 첫 번째 Wafer 자동 선택 + 센서 목록 업데이트
	useEffect(() => {
		if (lotData && lotData.wafers.length > 0 && !selectedWaferId) {
			setSelectedWafer(lotData.wafers[0].waferId);
		}
	}, [lotData, selectedWaferId, setSelectedWafer]);

	// 레시피에 맞는 센서 목록으로 업데이트
	useEffect(() => {
		if (lotData) {
			const recipe = MOCK_RECIPES.find((r) => r.recipeId === lotData.recipeId);
			if (recipe) {
				const sensors = getSensorsForProcess(recipe.processType);
				setSelectedSensors(sensors.map((s) => s.key));
			}
		}
	}, [lotData?.recipeId, setSelectedSensors, lotData]);

	const waferData = useMemo(() => {
		if (!lotData?.wafers || !selectedWaferId) return undefined;
		return lotData.wafers.find((w) => w.waferId === selectedWaferId);
	}, [lotData, selectedWaferId]);

	const recipe = useMemo(() => {
		if (!lotData) return undefined;
		return MOCK_RECIPES.find((r) => r.recipeId === lotData.recipeId);
	}, [lotData]);

	const sensorsMeta = useMemo(() => {
		if (!recipe) return [];
		return getSensorsForProcess(recipe.processType);
	}, [recipe]);

	const goldenWaferData = useMemo(() => {
		if (!goldenLotData?.wafers) return undefined;
		return goldenLotData.wafers[0]?.data;
	}, [goldenLotData]);

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

	if (!lotData || !waferData) {
		return <EmptyState message="데이터를 찾을 수 없습니다" />;
	}

	return (
		<div className="h-full p-4">
			<TimeSeriesChart
				data={waferData.data}
				selectedSensors={selectedSensors}
				sensorsMeta={sensorsMeta}
				showAnomalyOverlay={showAnomalyOverlay}
				showSpecLimits={showSpecLimits}
				goldenData={goldenWaferData}
				isCompareMode={isCompareMode}
				wafers={lotData.wafers}
				currentWaferId={selectedWaferId ?? undefined}
				isWaferCompareMode={isWaferCompareMode}
				recipe={recipe}
				xAxisMode={xAxisMode}
				waferStartTime={waferData.startTime}
				onTimestampClick={handleTimestampClick}
			/>
		</div>
	);
}
