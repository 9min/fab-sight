import { LotTrendChart } from "@/components/charts/LotTrendChart";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSensorsForProcess } from "@/constants/sensorConfig";
import { MOCK_EQUIPMENT } from "@/mocks/equipment";
import { MOCK_RECIPES } from "@/mocks/recipes";
import { getLotTrendByChamber, getProcessResults } from "@/services/processDataServiceV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useEffect, useMemo } from "react";

export function LotTrendPage() {
	const selectedEquipmentId = useDashboardStore((s) => s.selectedEquipmentId);
	const selectedChamberId = useDashboardStore((s) => s.selectedChamberId);
	const trendSensorKey = useDashboardStore((s) => s.trendSensorKey);
	const trendStepId = useDashboardStore((s) => s.trendStepId);
	const setTrendSensorKey = useDashboardStore((s) => s.setTrendSensorKey);

	const lots = useMemo(
		() => (selectedChamberId ? getLotTrendByChamber(selectedChamberId) : []),
		[selectedChamberId],
	);

	const processResults = useMemo(
		() => (selectedChamberId ? getProcessResults(selectedChamberId) : []),
		[selectedChamberId],
	);

	const recipe = useMemo(() => {
		if (lots.length === 0) return undefined;
		return MOCK_RECIPES.find((r) => r.recipeId === lots[0].recipeId);
	}, [lots]);

	const sensorsMeta = useMemo(() => {
		if (!recipe) return [];
		return getSensorsForProcess(recipe.processType);
	}, [recipe]);

	/** 자동 메인 스텝: Deposition 또는 Etch Phase */
	const autoStepId = useMemo(() => {
		if (!recipe) return null;
		const mainStep = recipe.steps.find((s) => s.name === "Deposition" || s.name === "Etch Phase");
		return mainStep?.stepId ?? recipe.steps[0]?.stepId ?? null;
	}, [recipe]);

	const effectiveStepId = trendStepId ?? autoStepId;

	/** 공정 타입 변경 시 센서 키를 자동 보정한다 */
	useEffect(() => {
		if (sensorsMeta.length === 0) return;
		const hasCurrentSensor = sensorsMeta.some((s) => s.key === trendSensorKey);
		if (!hasCurrentSensor) {
			setTrendSensorKey(sensorsMeta[0].key);
		}
	}, [sensorsMeta, trendSensorKey, setTrendSensorKey]);

	/** 컨텍스트 헤더: 장비/챔버 이름 */
	const contextLabel = useMemo(() => {
		const equip = MOCK_EQUIPMENT.find((e) => e.equipmentId === selectedEquipmentId);
		const chamber = equip?.chambers.find((c) => c.chamberId === selectedChamberId);
		if (!equip || !chamber) return undefined;
		return `${equip.name} / ${chamber.name}`;
	}, [selectedEquipmentId, selectedChamberId]);

	/** 현재 선택된 스텝의 이름 */
	const stepName = useMemo(() => {
		if (!recipe || !effectiveStepId) return undefined;
		return recipe.steps.find((s) => s.stepId === effectiveStepId)?.name;
	}, [recipe, effectiveStepId]);

	if (!selectedChamberId) {
		return <EmptyState message="챔버를 선택해주세요" />;
	}

	if (lots.length === 0) {
		return <EmptyState message="해당 챔버에 Lot 데이터가 없습니다" />;
	}

	if (!effectiveStepId) {
		return <EmptyState message="레시피 스텝 정보를 찾을 수 없습니다" />;
	}

	const effectiveSensorKey = sensorsMeta.some((s) => s.key === trendSensorKey)
		? trendSensorKey
		: (sensorsMeta[0]?.key ?? trendSensorKey);

	return (
		<LotTrendChart
			lots={lots}
			sensorKey={effectiveSensorKey}
			stepId={effectiveStepId}
			sensorsMeta={sensorsMeta}
			processResults={processResults}
			contextLabel={contextLabel}
			stepName={stepName}
		/>
	);
}
