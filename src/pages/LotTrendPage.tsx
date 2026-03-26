import { LotTrendChart } from "@/components/charts/LotTrendChart";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSensorsForProcess } from "@/constants/sensorConfig";
import { MOCK_RECIPES } from "@/mocks/recipes";
import { getLotTrendByChamber, getProcessResults } from "@/services/processDataServiceV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useMemo } from "react";

export function LotTrendPage() {
	const selectedChamberId = useDashboardStore((s) => s.selectedChamberId);
	const trendSensorKey = useDashboardStore((s) => s.trendSensorKey);

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

	if (!selectedChamberId) {
		return <EmptyState message="챔버를 선택해주세요" />;
	}

	if (lots.length === 0) {
		return <EmptyState message="해당 챔버에 Lot 데이터가 없습니다" />;
	}

	if (!mainStepId) {
		return <EmptyState message="레시피 스텝 정보를 찾을 수 없습니다" />;
	}

	return (
		<LotTrendChart
			lots={lots}
			sensorKey={trendSensorKey}
			stepId={mainStepId}
			sensorsMeta={sensorsMeta}
			processResults={processResults}
		/>
	);
}
