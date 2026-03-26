import { DrilldownPanel } from "@/components/drilldown/DrilldownPanel";
import { GlossaryButton } from "@/components/glossary/GlossaryButton";
import { GlossaryDrawer } from "@/components/glossary/GlossaryDrawer";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { R2RAdjustmentPanel } from "@/components/r2r/R2RAdjustmentPanel";
import { AnomalyToggle } from "@/components/ui/AnomalyToggle";
import { ChamberSelector } from "@/components/ui/ChamberSelector";
import { CompareToggle } from "@/components/ui/CompareToggle";
import { EquipmentSelector } from "@/components/ui/EquipmentSelector";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LotSelector } from "@/components/ui/LotSelector";
import { SensorCheckboxGroup } from "@/components/ui/SensorCheckbox";
import { SpecLimitToggle } from "@/components/ui/SpecLimitToggle";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import { WaferCompareToggle } from "@/components/ui/WaferCompareToggle";
import { WaferSelector } from "@/components/ui/WaferSelector";
import { XAxisModeToggle } from "@/components/ui/XAxisModeToggle";
import { getSensorsForProcess } from "@/constants/sensorConfig";
import { useProcessData } from "@/hooks/useProcessData";
import { queryClient } from "@/lib/queryClient";
import { MOCK_RECIPES } from "@/mocks/recipes";
import { DashboardPage } from "@/pages/DashboardPage";
import { LotTrendPage } from "@/pages/LotTrendPage";
import {
	getLotsByChamber,
	getProcessResults,
	getR2RAdjustments,
} from "@/services/processDataServiceV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { Recipe } from "@/types/fab";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

function AppContent() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const selectedChamberId = useDashboardStore((s) => s.selectedChamberId);
	const activeView = useDashboardStore((s) => s.activeView);
	const trendSensorKey = useDashboardStore((s) => s.trendSensorKey);
	const trendStepId = useDashboardStore((s) => s.trendStepId);
	const setTrendSensorKey = useDashboardStore((s) => s.setTrendSensorKey);
	const setTrendStepId = useDashboardStore((s) => s.setTrendStepId);
	const { data: lotData } = useProcessData(selectedLotId);

	const r2rAdjustments = useMemo(
		() => (selectedChamberId ? getR2RAdjustments(selectedChamberId) : []),
		[selectedChamberId],
	);
	const processResults = useMemo(
		() => (selectedChamberId ? getProcessResults(selectedChamberId) : []),
		[selectedChamberId],
	);

	/** 시계열 뷰: 선택된 Lot 기준 센서 목록 */
	const timeSeriesSensorsMeta = useMemo(() => {
		if (!lotData) return [];
		const recipe = MOCK_RECIPES.find((r) => r.recipeId === lotData.recipeId);
		if (!recipe) return [];
		return getSensorsForProcess(recipe.processType);
	}, [lotData]);

	/** Lot 트렌딩 뷰: 선택된 챔버의 레시피 */
	const trendRecipe: Recipe | undefined = useMemo(() => {
		if (!selectedChamberId) return undefined;
		const chamberLots = getLotsByChamber(selectedChamberId);
		if (chamberLots.length === 0) return undefined;
		return MOCK_RECIPES.find((r) => r.recipeId === chamberLots[0].recipeId);
	}, [selectedChamberId]);

	/** Lot 트렌딩 뷰: 센서 목록 */
	const trendSensorsMeta = useMemo(() => {
		if (!trendRecipe) return [];
		return getSensorsForProcess(trendRecipe.processType);
	}, [trendRecipe]);

	const isTimeSeries = activeView === "timeSeries";
	const sensorsMeta = isTimeSeries ? timeSeriesSensorsMeta : trendSensorsMeta;

	return (
		<>
			<DashboardLayout
				navControls={
					<>
						<EquipmentSelector />
						<ChamberSelector />
						{isTimeSeries && (
							<>
								<LotSelector />
								<WaferSelector />
								<CompareToggle />
							</>
						)}
						<GlossaryButton />
					</>
				}
				sidebarContent={
					isTimeSeries ? (
						<>
							<div className="mb-4 sm:hidden">
								<ViewModeToggle />
							</div>
							<div>
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									센서 선택
								</h2>
								<SensorCheckboxGroup sensorsMeta={sensorsMeta} />
							</div>
							<div className="border-t border-slate-700 pt-4">
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									AI 이상 탐지
								</h2>
								<AnomalyToggle />
							</div>
							<div className="border-t border-slate-700 pt-4">
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									차트 옵션
								</h2>
								<div className="flex flex-col gap-2">
									<SpecLimitToggle />
									<WaferCompareToggle />
									<XAxisModeToggle />
								</div>
							</div>
						</>
					) : (
						<>
							<div className="mb-4 sm:hidden">
								<ViewModeToggle />
							</div>
							<div>
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									분석 센서
								</h2>
								<select
									value={trendSensorKey}
									onChange={(e) => setTrendSensorKey(e.target.value)}
									disabled={trendSensorsMeta.length === 0}
									className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none disabled:opacity-50"
									aria-label="트렌딩 센서 선택"
								>
									{trendSensorsMeta.map((s) => (
										<option key={s.key} value={s.key}>
											{s.label} ({s.unit})
										</option>
									))}
								</select>
							</div>
							<div className="border-t border-slate-700 pt-4">
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									분석 스텝
								</h2>
								<select
									value={trendStepId ?? ""}
									onChange={(e) => setTrendStepId(e.target.value || null)}
									disabled={!trendRecipe}
									className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none disabled:opacity-50"
									aria-label="레시피 스텝 선택"
								>
									<option value="">자동 (메인 스텝)</option>
									{trendRecipe?.steps.map((step) => (
										<option key={step.stepId} value={step.stepId}>
											{step.stepNumber}. {step.name} ({step.durationSec}s)
										</option>
									))}
								</select>
							</div>
						</>
					)
				}
				chartArea={isTimeSeries ? <DashboardPage /> : <LotTrendPage />}
				drilldownArea={
					isTimeSeries ? (
						<DrilldownPanel sensorsMeta={sensorsMeta} />
					) : (
						<R2RAdjustmentPanel
							adjustments={r2rAdjustments}
							processResults={processResults}
							sensorKey={trendSensorKey}
							sensorsMeta={sensorsMeta}
						/>
					)
				}
			/>
			<GlossaryDrawer />
		</>
	);
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary>
				<AppContent />
			</ErrorBoundary>
		</QueryClientProvider>
	);
}
