import { LotTrendChart } from "@/components/charts/LotTrendChart";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSensorsForProcess } from "@/constants/sensorConfig";
import { MOCK_RECIPES } from "@/mocks/recipes";
import { getLotTrendByChamber, getProcessResults } from "@/services/processDataServiceV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useEffect, useMemo } from "react";

export function LotTrendPage() {
	const selectedChamberId = useDashboardStore((s) => s.selectedChamberId);
	const trendSensorKey = useDashboardStore((s) => s.trendSensorKey);
	const setTrendSensorKey = useDashboardStore((s) => s.setTrendSensorKey);

	const lots = useMemo(
		() => (selectedChamberId ? getLotTrendByChamber(selectedChamberId) : []),
		[selectedChamberId],
	);

	const processResults = useMemo(
		() => (selectedChamberId ? getProcessResults(selectedChamberId) : []),
		[selectedChamberId],
	);

	const sensorsMeta = useMemo(() => {
		if (lots.length === 0) return [];
		const recipe = MOCK_RECIPES.find((r) => r.recipeId === lots[0].recipeId);
		if (!recipe) return [];
		return getSensorsForProcess(recipe.processType);
	}, [lots]);

	const mainStepId = useMemo(() => {
		if (lots.length === 0) return null;
		const recipe = MOCK_RECIPES.find((r) => r.recipeId === lots[0].recipeId);
		if (!recipe) return null;
		const depositionStep = recipe.steps.find(
			(s) => s.name === "Deposition" || s.name === "Etch Phase",
		);
		return depositionStep?.stepId ?? recipe.steps[0]?.stepId ?? null;
	}, [lots]);

	/** 공정 타입 변경 시 센서 키를 자동 보정한다 (CVD→Etch 전환 시 temperature→escTemperature) */
	useEffect(() => {
		if (sensorsMeta.length === 0) return;
		const hasCurrentSensor = sensorsMeta.some((s) => s.key === trendSensorKey);
		if (!hasCurrentSensor) {
			setTrendSensorKey(sensorsMeta[0].key);
		}
	}, [sensorsMeta, trendSensorKey, setTrendSensorKey]);

	if (!selectedChamberId) {
		return <EmptyState message="챔버를 선택해주세요" />;
	}

	if (lots.length === 0) {
		return <EmptyState message="해당 챔버에 Lot 데이터가 없습니다" />;
	}

	if (!mainStepId) {
		return <EmptyState message="레시피 스텝 정보를 찾을 수 없습니다" />;
	}

	/** 센서 보정이 아직 반영되지 않은 경우 첫 번째 센서로 렌더링 */
	const effectiveSensorKey = sensorsMeta.some((s) => s.key === trendSensorKey)
		? trendSensorKey
		: (sensorsMeta[0]?.key ?? trendSensorKey);

	return (
		<LotTrendChart
			lots={lots}
			sensorKey={effectiveSensorKey}
			stepId={mainStepId}
			sensorsMeta={sensorsMeta}
			processResults={processResults}
		/>
	);
}
